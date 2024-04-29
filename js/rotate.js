import { bumpSound, rotateSound } from "./selectors.js"
import { translate } from "./moves.js"
import { activePiece, rotate, width } from "./main.js"
import { testRotation } from "./tests.js"

// ? Rotate Clockwise
export function rotateClockwise() {
  let testRotationIdx =
    activePiece.rotationIdx !== 3 ? activePiece.rotationIdx + 1 : 0
  // Test 1
  if (!testRotation(activePiece.relativePosArr[0], testRotationIdx)) {
    rotateSound.currentTime = 0
    rotateSound.play()
    rotate("clockwise")
    return
  }
  // Wall kicks
  // J, L, S, Z & T pieces
  if (
    activePiece.cssClass === "j" ||
    activePiece.cssClass === "l" ||
    activePiece.cssClass === "s" ||
    activePiece.cssClass === "z" ||
    activePiece.cssClass === "t"
  ) {
    // Test 2
    if (!testRotation(activePiece.relativePosArr[0] + 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += 1))
      rotate("clockwise")
      return
    }
    // Test 3
    if (!testRotation(activePiece.relativePosArr[0] - 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= 1))
      rotate("clockwise")
      return
    }
    // Test 4
    if (
      !testRotation(
        activePiece.relativePosArr[0] + (width + 1),
        testRotationIdx
      )
    ) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += width + 1))
      rotate("clockwise")
      return
    }
    // Test 5
    if (
      !testRotation(
        activePiece.relativePosArr[0] - (width - 1),
        testRotationIdx
      )
    ) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= width - 1))
      rotate("clockwise")
      return
    }
  }
  // I pieces
  if (activePiece.cssClass === "i") {
    // Test 2
    if (!testRotation(activePiece.relativePosArr[0] + 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += 1))
      rotate("clockwise")
      return
    }
    // Test 3
    if (!testRotation(activePiece.relativePosArr[0] - 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= 1))
      rotate("clockwise")
      return
    }
    // Test 4
    if (!testRotation(activePiece.relativePosArr[0] + 2, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += 2))
      rotate("clockwise")
      return
    }
    // Test 5
    if (!testRotation(activePiece.relativePosArr[0] - 2, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= 2))
      rotate("clockwise")
      return
    }
  }
  // If no moves possible, play bump sound
  bumpSound.currentTime = 0
  bumpSound.play()
}
// ? Rotate Anticlockwise
export function rotateAnticlockwise() {
  let testRotationIdx =
    activePiece.rotationIdx !== 0 ? activePiece.rotationIdx - 1 : 3
  if (!testRotation(activePiece.relativePosArr[0], testRotationIdx)) {
    rotateSound.currentTime = 0
    rotateSound.play()
    rotate("anticlockwise")
    return
  }
  // Wall kicks
  // J, L, S, Z & T pieces
  if (
    activePiece.cssClass === "j" ||
    activePiece.cssClass === "l" ||
    activePiece.cssClass === "s" ||
    activePiece.cssClass === "z" ||
    activePiece.cssClass === "t"
  ) {
    // Test 2
    if (!testRotation(activePiece.relativePosArr[0] + 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += 1))
      rotate("anticlockwise")
      return
    }
    // Test 3
    if (!testRotation(activePiece.relativePosArr[0] - 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= 1))
      rotate("anticlockwise")
      return
    }
    // Test 4
    if (
      !testRotation(
        activePiece.relativePosArr[0] + (width + 1),
        testRotationIdx
      )
    ) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += width + 1))
      rotate("anticlockwise")
      return
    }
    // Test 5
    if (
      !testRotation(
        activePiece.relativePosArr[0] - (width - 1),
        testRotationIdx
      )
    ) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= width - 1))
      rotate("anticlockwise")
      return
    }
  }
  // I pieces
  if (activePiece.cssClass === "i") {
    // Test 2
    if (!testRotation(activePiece.relativePosArr[0] + 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += 1))
      rotate("anticlockwise")
      return
    }
    // Test 3
    if (!testRotation(activePiece.relativePosArr[0] - 1, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= 1))
      rotate("anticlockwise")
      return
    }
    // Test 4
    if (!testRotation(activePiece.relativePosArr[0] + 2, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] += 2))
      rotate("anticlockwise")
      return
    }
    // Test 5
    if (!testRotation(activePiece.relativePosArr[0] - 2, testRotationIdx)) {
      rotateSound.currentTime = 0
      rotateSound.play()
      translate((activePiece.relativePosArr[0] -= 2))
      rotate("anticlockwise")
      return
    }
  }
  // If no moves possible, play bump sound
  bumpSound.currentTime = 0
  bumpSound.play()
}
