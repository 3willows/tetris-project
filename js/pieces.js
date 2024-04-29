// Piece classes

import {width, npg2x2Cells, npg3x3Cells, npg4x4Cells} from "./main.js"

export class Tpiece {
  constructor() {
      this.relativePosArr = [24, 23, 25, 34]
      this.actualPosArr = []
      this.cssClass = 't'
      this.rotationIdx = 0
      this.rotationOffsets = [
          [0, 1, width, -1],
          [0, width, -1, -width],
          [0, -1, -width, 1],
          [0, -width, 1, width]
      ]
      this.nextPieceGrid = npg3x3Cells
      this.nextPiecePos = [0, 1, 2, 4]
  }
}

export class Spiece {
  constructor() {
      this.relativePosArr = [34, 24, 25, 33]
      this.actualPosArr = []
      this.cssClass = 's'
      this.rotationIdx = 0
      this.rotationOffsets = [
          [0, -width, -(width - 1), -1],
          [0, 1, (width + 1), -width],
          [0, width, (width - 1), 1],
          [0, -1, -(width + 1), width]
      ]
      this.nextPieceGrid = npg3x3Cells
      this.nextPiecePos = [1, 2, 3, 4]
  }
}

export class Zpiece {
  constructor() {
      this.relativePosArr = [34, 24, 23, 35]
      this.actualPosArr = []
      this.cssClass = 'z'
      this.rotationIdx = 0
      this.rotationOffsets = [
          [0, -width, -(width + 1), 1],
          [0, 1, -(width - 1), width],
          [0, width, -1, (width + 1)],
          [0, -1, -width, (width -1)]
      ]
      this.nextPieceGrid = npg3x3Cells
      this.nextPiecePos = [0, 1, 4, 5]
  }
}

export class Lpiece {
  constructor() {
      this.relativePosArr = [24, 14, 35, 34]
      this.actualPosArr = []
      this.cssClass = 'l'
      this.rotationIdx = 0
      this.rotationOffsets = [
          [0, -width, (width + 1), width],
          [0, 1, (width - 1), -1],
          [0, width, -(width + 1), -width],
          [0, -1, -(width - 1), 1]
      ]
      this.nextPieceGrid = npg3x3Cells
      this.nextPiecePos = [2, 3, 4, 5]
  }
}

export class Jpiece {
  constructor() {
      this.relativePosArr = [24, 14, 34, 33]
      this.actualPosArr = []
      this.cssClass = 'j'
      this.rotationIdx = 0
      this.rotationOffsets = [
          [0, -width, width, (width - 1)],
          [0, 1, -1, -(width + 1)],
          [0, width, -width, -(width - 1)],
          [0, -1, 1, (width + 1)]
      ]
      this.nextPieceGrid = npg3x3Cells
      this.nextPiecePos = [0, 1, 2, 5]
  }
}

export class Opiece {
  constructor() {
      this.relativePosArr = [34, 24, 25, 35]
      this.actualPosArr = []
      this.cssClass = 'o'
      this.rotationIdx = 0
      this.rotationOffsets = [
          [0, -width, -(width - 1), 1],
          [0, -width, -(width - 1), 1],
          [0, -width, -(width - 1), 1],
          [0, -width, -(width - 1), 1]
      ]
      this.nextPieceGrid = npg2x2Cells
      this.nextPiecePos = [0, 1, 2, 3]
  }
}

export class Ipiece {
  constructor() {
      this.relativePosArr = [35, 36, 33, 34]
      this.actualPosArr = []
      this.cssClass = 'i'
      this.rotationIdx = 0
      this.rotationOffsets = [
          [0, 1, -2, -1],
          [0, width, -(width * 2), -width],
          [0, -1, 2, 1],
          [0, -width, (width * 2), width]
      ]
      this.nextPieceGrid = npg4x4Cells
      this.nextPiecePos = [4, 5, 6, 7]
  }
}

