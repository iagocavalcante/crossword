import { Board } from "@/pages/gameboard/[theme]"

export default class Crossword {
  private size: number
  private board: Board[]
  private words: string[]
  constructor(size = 15) {
    this.size = size
    this.board = Array.from({ length: size }, () => Array(size).fill(null)) as Board[]
    this.words = []
  }

  addWord(word: string) {
    if (!this.words.length) {
      this.addFirstWord(word)
    } else {
      this.addNextWord(word)
    }

    this.words.push(word)
  }

  addFirstWord(word: string) {
    // place the first word in the middle of the board
    const start = Math.floor(this.size / 2) - Math.floor(word.length / 2)
    for (let i = 0; i < word.length; i++) {
      this.board[start + i][Math.floor(this.size / 2)] = word[i]
    }
  }

  addNextWord(word) {
    // try to add the word horizontally or vertically
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === word[0]) {
          if (this.canPlaceHorizontally(word, i, j)) {
            this.placeHorizontally(word, i, j)
            return
          } else if (this.canPlaceVertically(word, i, j)) {
            this.placeVertically(word, i, j)
            return
          }
        }
      }
    }

    throw new Error(`Cannot place word: ${word}`)
  }

  canPlaceHorizontally(word, i, j) {
    // check if the word can be placed horizontally at position (i, j)
    if (j + word.length > this.size) return false

    for (let k = 0; k < word.length; k++) {
      if (this.board[i][j + k] !== null && this.board[i][j + k] !== word[k]) {
        return false
      }
    }

    return true
  }

  canPlaceVertically(word, i, j) {
    // check if the word can be placed vertically at position (i, j)
    if (i + word.length > this.size) return false

    for (let k = 0; k < word.length; k++) {
      if (this.board[i + k][j] !== null && this.board[i + k][j] !== word[k]) {
        return false
      }
    }

    return true
  }

  placeHorizontally(word, i, j) {
    for (let k = 0; k < word.length; k++) {
      this.board[i][j + k] = word[k]
    }
  }

  placeVertically(word, i, j) {
    for (let k = 0; k < word.length; k++) {
      this.board[i + k][j] = word[k]
    }
  }

  printBoard() {
    for (let i = 0; i < this.size; i++) {
      let row = ""
      for (let j = 0; j < this.size; j++) {
        row += this.board[i][j] || "_"
        row += " "
      }
      console.log(row)
    }
  }
}
