import {
  npGridEl,
  scoreEl,
  levelEl,
  highScoreEl,
  overlay,
} from "./selectors.js"
import {
  activePiece,
  cells,
  ghostPosition,
  npgArr,
  nextPiece,
  npg4x4Cells,
  npg2x2Cells,
  npg3x3Cells,
  score,
  level,
  highScore,
  highScoreBeaten,
} from "./main.js"

// ! Render functions
// ? Render piece
export function renderPiece() {
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
export function removePiece() {
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
export function renderNextPiece() {
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
export function renderScoreboard() {
  scoreEl.innerHTML = score
  levelEl.innerHTML = level
  highScoreEl.innerHTML = highScore
  if (highScoreBeaten) highScoreEl.innerHTML = `${highScore}*`
}
export function resetBoard() {
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
export function overlayOn() {
  overlay.style.display = "block"
}
export function overlayOff() {
  overlay.style.display = "none"
}
