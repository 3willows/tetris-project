import { moveDown, moveLeft, moveRight } from "./moves.js"
import { rotateClockwise, rotateAnticlockwise } from "./rotate.js"
import { renderPiece, removePiece } from "./renderItems.js"
import {
  gameStatus,
  dropPiece,
  pauseGame,
  gameStart,
  resumeGame,
} from "./main.js"

// ! Controls
export function controls(event) {
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
