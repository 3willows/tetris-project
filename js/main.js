import {
  board,
  npGridEl,
  lockSound,
  lineSound,
  levelUpSound,
  containerEl,
  messagingEl,
  gameOverSound,
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
import { moveDown, translate } from "./moves.js"
import { testTranslation } from "./tests.js"
import {
  renderPiece,
  renderNextPiece,
  renderScoreboard,
  removePiece,
  resetBoard,
  overlayOn,
  overlayOff,
} from "./renderItems.js"
import { controls } from "./controls.js"
import { audioOn, audioOff } from "./audio.js"

// ? Variables
// Board config
export const width = 10
export const height = 24
const hiddenRows = 4
export const cellCount = width * height
export let cells = []

// Next piece grid config
export let npg3x3Cells = nextPieceGrid(3, 3)
export let npg2x2Cells = nextPieceGrid(2, 2)
export let npg4x4Cells = nextPieceGrid(4, 4)
export const npgArr = [npg3x3Cells, npg2x2Cells, npg4x4Cells]

// Piece classes

const pieceClasses = [Tpiece, Spiece, Zpiece, Lpiece, Jpiece, Opiece, Ipiece]

// Game status - inactive, active or paused
export let gameStatus = "inactive"

// Game speed
let speed = 600
const startSpeed = 600
const speedDecrement = 50

// Scoring
export let score = 0
export let highScore = 100
export let highScoreBeaten = false
let highScoreMsgDisplayed = false
const singleScore = 100
const points = [singleScore, singleScore * 3, singleScore * 5, singleScore * 8]

// Levels
export let level = 1
const levelThresholds = [
  500, 1000, 2500, 5000, 8000, 12000, 17000, 20000, 25000,
]

// First active piece
export let activePiece
export let nextPiece = addPiece(randomClass())
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
export function ghostPosition() {
  return activePiece.rotationOffsets[activePiece.rotationIdx].map(
    (offset) => findLowest() + offset
  )
}

// ? Drop piece
export function dropPiece() {
  translate(findLowest())
  renderPiece()
  lockPiece()
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
export function gameStart() {
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
export function pauseGame() {
  gameStatus = "paused"
  stopFall()
  showMessage("PAUSED<p>press space to restart</p>", "persistent")
}

// ? Resume
export function resumeGame() {
  gameStatus = "active"
  // Render first piece
  renderPiece()
  startFall()
  showMessage("RESUME", "alert")
}

// ! Events
document.addEventListener("keydown", controls)
menuIconEl.addEventListener("click", overlayOn)
overlayClose.addEventListener("click", overlayOff)
audioOnEl.addEventListener("click", audioOn)
audioOffEl.addEventListener("click", audioOff)

// ! Page load
init()
