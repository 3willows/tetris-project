import { moveSound, bumpSound } from "./selectors.js"
import { activePiece, lockPiece } from "./main.js"
import { testTranslation } from "./tests.js"

export function translate(anchorPos) {
  activePiece.relativePosArr = activePiece.rotationOffsets[
    activePiece.rotationIdx
  ].map((offset) => anchorPos + offset)
}

// ? Move left
export function moveLeft() {
  if (
    !testTranslation(
      "left",
      activePiece.relativePosArr[0] - 1,
      activePiece.rotationIdx
    )
  ) {
    translate((activePiece.relativePosArr[0] -= 1))
    moveSound.currentTime = 0
    moveSound.play()
  } else {
    bumpSound.currentTime = 0
    bumpSound.play()
  }
}
// ? Move right
export function moveRight() {
  if (
    !testTranslation(
      "right",
      activePiece.relativePosArr[0] + 1,
      activePiece.rotationIdx
    )
  ) {
    translate((activePiece.relativePosArr[0] += 1))
    moveSound.currentTime = 0
    moveSound.play()
  } else {
    bumpSound.currentTime = 0
    bumpSound.play()
  }
}
// ? Move down
export function moveDown() {
  if (
    !testTranslation(
      "down",
      activePiece.relativePosArr[0] + 10,
      activePiece.rotationIdx
    )
  ) {
    translate((activePiece.relativePosArr[0] += 10))
  } else {
    lockPiece()
  }
}
