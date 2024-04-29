import { activePiece, cellCount, cells, width } from "./main.js"

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
