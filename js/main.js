import {
  board,
  npGridEl,
  moveSound,
  bumpSound,
  rotateSound,
  lockSound,
  lineSound,
  levelUpSound,
  containerEl,
  messagingEl,
  gameOverSound,
  scoreEl,
  levelEl,
  highScoreEl,
  overlay,
  audioOnEl,
  audioOffEl,
  menuIconEl,
  overlayClose,
} from "./selectors.js"
import {
  Tpiece,
  Spiece,
  Zpiece,
  Lpiece,
  Jpiece,
  Opiece,
  Ipiece,
} from "./pieces.js"
import { moveDown, moveLeft, moveRight, translate } from "./moves.js"
import { rotateClockwise, rotateAnticlockwise } from "./rotate.js"

// ? Variables
// Board config
export const width = 10
export const height = 24
const hiddenRows = 4
const cellCount = width * height
let cells = []

// Next piece grid config
export let npg3x3Cells = nextPieceGrid(3, 3)
export let npg2x2Cells = nextPieceGrid(2, 2)
export let npg4x4Cells = nextPieceGrid(4, 4)
const npgArr = [npg3x3Cells, npg2x2Cells, npg4x4Cells]

// Piece classes

const pieceClasses = [Tpiece, Spiece, Zpiece, Lpiece, Jpiece, Opiece, Ipiece]

// Game status - inactive, active or paused
let gameStatus = "inactive"

// Game speed
let speed = 600
const startSpeed = 600
const speedDecrement = 50

// Scoring
let score = 0
let highScore = 100
let highScoreBeaten = false
let highScoreMsgDisplayed = false
const singleScore = 100
const points = [singleScore, singleScore * 3, singleScore * 5, singleScore * 8]

// Levels
let level = 1
const levelThresholds = [
  500, 1000, 2500, 5000, 8000, 12000, 17000, 20000, 25000,
]

// First active piece
export let activePiece
let nextPiece = addPiece(randomClass())
let fallingPiece

// ! Functions
// ? Create board cells
function buildBoard() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div")
    // Add index to div element
    // cell.innerText = i
    // Add index as an attribute
    cell.dataset.index = i
    // Add height & width to each grid cell dynamically
    cell.style.height = `${100 / (height - hiddenRows)}%`
    cell.style.width = `${100 / width}%`

    // Add cell to grid
    board.appendChild(cell)
    // Add newly created div cell to cells array
    cells.push(cell)
  }
  const hiddenCells = cells.filter((cell, idx) => idx < hiddenRows * width)
  hiddenCells.map((cell) => (cell.style.display = "none"))
}

// ? Create next piece cells
function nextPieceGrid(width, height) {
  let npCells = []
  for (let i = 0; i < height * width; i++) {
    const cell = document.createElement("div")
    cell.dataset.index = i
    // cell.innerText = i
    cell.style.height = `${100 / height}%`
    cell.style.width = `${100 / width}%`
    cell.style.display = "none"
    npGridEl.appendChild(cell)
    npCells.push(cell)
  }
  return npCells
}

// ? Create new piece
function addPiece(pieceClass) {
  return new pieceClass()
}

// ? Rotate piece
// Changes the rotation index clockwise or antiClockwise by 1, then runs translate
export function rotate(direction) {
  if (direction === "clockwise")
    activePiece.rotationIdx !== 3
      ? activePiece.rotationIdx++
      : (activePiece.rotationIdx = 0)
  if (direction === "anticlockwise")
    activePiece.rotationIdx !== 0
      ? activePiece.rotationIdx--
      : (activePiece.rotationIdx = 3)
  translate(activePiece.relativePosArr[0])
}

// ? Ghost piece position
function ghostPosition() {
  return activePiece.rotationOffsets[activePiece.rotationIdx].map(
    (offset) => findLowest() + offset
  )
}

// ? Drop piece
function dropPiece() {
  translate(findLowest())
  renderPiece()
  lockPiece()
}

// ? Test whether movement is possible
// Direction params - left, right, down, rotateClockwise, rotateAnticlockwise
export function testTranslation(direction, anchorPos, rotationIdx) {
  // Get new potential position
  let potentialPosition = activePiece.rotationOffsets[rotationIdx].map(
    (offset) => anchorPos + offset
  )

  // Check none of the positions exceed the cell count
  if (potentialPosition.some((pos) => pos > cellCount - 1)) return true

  // Get an array of the potential cells
  let potentialCells = potentialPosition.map((pos) => cells[pos])

  // Check that none of them are locked
  for (let cell of potentialCells) {
    if (cell.classList.contains("locked")) return cell
  }

  // Check left bounds
  if (direction === "left") {
    let modulusArray = potentialPosition.map(
      (relativePos) => relativePos % width
    )
    console.log(modulusArray)
    return modulusArray.includes(9)
  }
  // Check right bounds
  if (direction === "right") {
    let modulusArray = potentialPosition.map(
      (relativePos) => relativePos % width
    )
    return modulusArray.includes(0)
  }
  if (direction === "down") {
    return potentialPosition.some((pos) => pos > cellCount - 1)
  }
}

// Rotations
export function testRotation(anchorPos, rotationIdx) {
  let potentialPosition = activePiece.rotationOffsets[rotationIdx].map(
    (offset) => anchorPos + offset
  )

  if (activePiece.relativePosArr[0] % 10 < 6) {
    return testTranslation("left", potentialPosition[0], rotationIdx)
  }

  if (activePiece.relativePosArr[0] % 10 > 5) {
    return testTranslation("right", potentialPosition[0], rotationIdx)
  }
}

// ? Find lowest possible position
function findLowest() {
  let anchorPos = activePiece.relativePosArr[0] + width
  let test = false
  while (test === false) {
    test = testTranslation("down", anchorPos, activePiece.rotationIdx)
    anchorPos += width
  }
  return anchorPos - 2 * width
}

// ? Lock piece and generate a new one
export function lockPiece() {
  for (let cell of activePiece.actualPosArr) {
    cell.classList.add("locked")
    renderPiece()
    cell.classList.remove("active")
  }
  if (gameOverCheck()) {
    gameOver()
    return
  }
  lockSound.currentTime = 0
  lockSound.play()
  let completedRowsNum = completedLineCheck().length
  let completeRows = completedLineCheck()
  if (completedRowsNum > 0) {
    increaseScore(completedRowsNum)
    removeComplete(completeRows)
  }
  activePiece = nextPiece
  nextPiece = addPiece(randomClass())
  renderNextPiece()
}

// ? Check whether game is over
function gameOverCheck() {
  return !activePiece.relativePosArr.every(
    (pos) => pos > cellCount - (cellCount - hiddenRows * width)
  )
}

// ? Check for completed lines
function completedLineCheck() {
  // Get rows to check
  let rowPositions = activePiece.relativePosArr.map(
    (relativePos) => relativePos % 10
  )
  let rows = activePiece.relativePosArr.map(
    (relativePos, idx) => relativePos - rowPositions[idx]
  )
  // Remove duplicates
  let uniqueRows = [...new Set(rows)]
  // Check whether each cell in each row is locked
  let completeRows = []
  for (let num of uniqueRows) {
    let lockedCount = 0
    for (let i = 0; i < width; i++) {
      if (cells[num + i].classList.contains("locked")) lockedCount++
    }
    if (lockedCount === 10) completeRows.push(num)
  }
  // Put them in numerical order
  completeRows.sort((a, b) => a - b)
  return completeRows
}

// ? Remove completed lines and shift remaining locked pieces down
function removeComplete(rows) {
  for (let rowNum of rows) {
    // Remove piece and locked classes from row
    for (let i = 0; i < width; i++) {
      cells[rowNum + i].className = ""
    }
    // Find rows with locked cells above the row
    let currentRow = rowNum - width
    let lockedRows = []
    while (currentRow >= 0) {
      for (let i = 0; i < width; i++) {
        if (cells[currentRow + i].classList.contains("locked")) {
          lockedRows.push(currentRow)
          break
        }
      }
      currentRow -= width
    }

    // Remove locked and piece classes from each cell in the row, and add them to the cell below
    for (let rowNum of lockedRows) {
      for (let i = 0; i < width; i++) {
        let classList = [...cells[rowNum + i].classList]
        // Remove classes from current element
        cells[rowNum + i].className = ""
        // Remove classes from target element
        cells[rowNum + i + width].className = ""
        // Add classes to target element
        classList.forEach((element) =>
          cells[rowNum + i + width].classList.add(element)
        )
      }
    }
  }
}

// ? Increase Score/Level
function increaseScore(numRows) {
  let messages = ["SINGLE", "DOUBLE", "TRIPLE", "TETRIS!"]
  if (numRows > 0) score += points[numRows - 1]
  lineSound.currentTime = 0
  lineSound.play()
  showMessage(messages[numRows - 1], "alert")
  if (score >= levelThresholds[level - 1]) increaseLevel()
  if (score > highScore) newHighScore()
  renderScoreboard()
}

function increaseLevel() {
  level++
  stopFall()
  console.log(fallingPiece)
  speed -= speedDecrement
  startFall()
  renderScoreboard()
  levelUpSound.currentTime = 0
  levelUpSound.play()
  containerEl.classList.replace(`level${level - 1}`, `level${level}`)
  showMessage("LEVEL UP!", "alert")
}

function newHighScore() {
  highScore = score
  if (!highScoreMsgDisplayed) {
    showMessage("NEW HIGH SCORE!", "alert")
    highScoreMsgDisplayed = true
  }
  highScoreBeaten = true
}

// ? Select random piece class
function randomClass() {
  return pieceClasses[Math.floor(Math.random() * 7)]
}

// ? Falling
function fall() {
  removePiece()
  moveDown()
  renderPiece()
}

function startFall() {
  fallingPiece = setInterval(fall, speed)
}

function stopFall() {
  clearInterval(fallingPiece)
}

// ! Player Messages
// ? Show message - persistent(stays on screen until removed) or alert(stays on screen for set period)
function showMessage(text, type) {
  // Remove current persistent message if there is one
  let currentMessage = messagingEl.querySelector(".persistent")
  if (currentMessage) messagingEl.removeChild(currentMessage)

  // Create message
  const message = document.createElement("div")
  message.innerHTML = text
  message.classList.add(type, "message")

  // Styling for specific messages
  if (text === "SINGLE") message.classList.add("single")
  if (text === "DOUBLE") message.classList.add("double")
  if (text === "TRIPLE") message.classList.add("triple")
  if (text === "TETRIS!") message.classList.add("tetris")

  // Add message to messaging area
  messagingEl.appendChild(message)

  // If message is an alert, set time out
  if (type === "alert") setTimeout(() => messagingEl.removeChild(message), 3000)
}

// ! Init function
function init() {
  buildBoard()
  nextPieceGrid()
  renderScoreboard()
  showMessage("PRESS SPACE<p>to start game</p>", "persistent")
}

// ! Game state functions
// ? Game Start
function gameStart() {
  gameStatus = "active"
  containerEl.classList.remove(
    "level1",
    "level2",
    "level3",
    "level4",
    "level5",
    "level6",
    "level7",
    "level8",
    "level9",
    "level10"
  )
  containerEl.classList.add("level1")
  resetBoard()
  activePiece = addPiece(randomClass())
  renderPiece()
  showMessage("GO!", "alert")
  level = 1
  score = 0
  speed = startSpeed
  startFall()
  renderScoreboard()
  renderNextPiece()
}

// ? Game Over
function gameOver() {
  gameStatus = "inactive"
  stopFall()
  highScoreBeaten
    ? showMessage(
        "GAME OVER<p>you beat the highest score!</p><p>press space to play again</p>",
        "persistent"
      )
    : showMessage("GAME OVER<p>press space to play again</p>", "persistent")
  // resetBoard()
  gameOverSound.currentTime = 0
  gameOverSound.play()
  const reversedCells = cells.toReversed()
  reversedCells.forEach((cell, idx) => {
    setTimeout(() => {
      cell.classList.remove(
        "t",
        "s",
        "l",
        "z",
        "i",
        "j",
        "o",
        "active",
        "locked",
        "ghost"
      )
      cell.classList.add("gameover")
    }, idx * 8)
  })
}

// ? Pause
function pauseGame() {
  gameStatus = "paused"
  stopFall()
  showMessage("PAUSED<p>press space to restart</p>", "persistent")
}

// ? Resume
function resumeGame() {
  gameStatus = "active"
  // Render first piece
  renderPiece()
  startFall()
  showMessage("RESUME", "alert")
}

// ! Render functions
// ? Render piece
function renderPiece() {
  // Target cells with indices that match relativePosArr
  activePiece.actualPosArr = activePiece.relativePosArr.map(
    (relativePos) => cells[relativePos]
  )
  // Add the relevant CSS class to each cell
  for (let element of activePiece.actualPosArr) {
    element.classList.add(activePiece.cssClass, "active")
  }
  renderGhost()
}

// ? Remove piece
function removePiece() {
  // Remove the relevant CSS class from each cell
  for (let cell of activePiece.actualPosArr) {
    cell.classList.remove(activePiece.cssClass, "active")
  }
  removeGhost()
}

// ? Render ghost piece
function renderGhost() {
  let ghostCells = ghostPosition().map((pos) => cells[pos])
  for (let cell of ghostCells) {
    if (!cell.classList.contains("active"))
      cell.classList.add(activePiece.cssClass, "ghost")
  }
}

function removeGhost() {
  let ghostCells = ghostPosition().map((pos) => cells[pos])
  for (let cell of ghostCells) {
    cell.classList.remove(activePiece.cssClass, "ghost")
  }
}

// ? Render next piece
function renderNextPiece() {
  // Hide all grids & remove classes
  for (let arr of npgArr) {
    for (let cell of arr) {
      cell.style.display = "none"
      cell.className = ""
    }
  }
  // Show grid that correlates with the next piece
  let grid = nextPiece.nextPieceGrid
  for (let cell of grid) {
    cell.style.display = "block"
  }
  // Resize the grid
  if (grid === npg4x4Cells) {
    npGridEl.style.width = "16vmin"
    npGridEl.style.height = "16vmin"
  }
  if (grid === npg2x2Cells) {
    npGridEl.style.width = "8vmin"
    npGridEl.style.height = "8vmin"
  }
  if (grid === npg3x3Cells) {
    npGridEl.style.width = "12vmin"
    npGridEl.style.height = "12vmin"
  }

  // Color the cells of the next piece
  let positions = nextPiece.nextPiecePos
  let colorCells = positions.map((pos) => grid[pos])
  for (let cell of colorCells) {
    cell.classList.add(nextPiece.cssClass)
  }
}

function renderScoreboard() {
  scoreEl.innerHTML = score
  levelEl.innerHTML = level
  highScoreEl.innerHTML = highScore
  if (highScoreBeaten) highScoreEl.innerHTML = `${highScore}*`
}

function resetBoard() {
  cells.forEach((cell) =>
    cell.classList.remove(
      "t",
      "s",
      "l",
      "z",
      "i",
      "j",
      "o",
      "active",
      "locked",
      "ghost",
      "gameover"
    )
  )
}

function overlayOn() {
  overlay.style.display = "block"
}

function overlayOff() {
  overlay.style.display = "none"
}

// ! Controls
function controls(event) {
  const key = event.keyCode

  const up = 38
  const down = 40
  const left = 37
  const right = 39
  const space = 32
  const z = 90
  const x = 88
  const p = 80

  if (gameStatus === "active") {
    // Remove piece from current position, before moving to new position
    removePiece()

    if (key === down) moveDown()
    if (key === left) moveLeft()
    if (key === right) moveRight()
    if (key === x || key === up) rotateClockwise()
    if (key === z) rotateAnticlockwise()
    if (key === space) dropPiece()
    if (key === p) pauseGame()

    // Render piece in new position
    renderPiece()
  }
  if (gameStatus === "inactive") {
    if (key === space) gameStart()
  }
  if (gameStatus === "paused") {
    if (key === space) resumeGame()
  }
}

function audioOn() {
  moveSound.muted = false
  bumpSound.muted = false
  gameOverSound.muted = false
  levelUpSound.muted = false
  lineSound.muted = false
  lockSound.muted = false
  rotateSound.muted = false
  audioOnEl.style.textDecoration = "underline"
  audioOffEl.style.textDecoration = "none"
}

function audioOff() {
  moveSound.muted = true
  bumpSound.muted = true
  gameOverSound.muted = true
  levelUpSound.muted = true
  lineSound.muted = true
  lockSound.muted = true
  rotateSound.muted = true
  audioOffEl.style.textDecoration = "underline"
  audioOnEl.style.textDecoration = "none"
}

// ! Events
document.addEventListener("keydown", controls)
menuIconEl.addEventListener("click", overlayOn)
overlayClose.addEventListener("click", overlayOff)
audioOnEl.addEventListener("click", audioOn)
audioOffEl.addEventListener("click", audioOff)

// ! Page load
init()