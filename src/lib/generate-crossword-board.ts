/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function generateCrosswordBoard(answers: string[]) {
  answers.sort((a, b) => b.length - a.length)

  // Place the longest word in the middle of the board.
  const longestAnswer = answers[0]
  // Create a 15x15 board.
  const board = new Array(longestAnswer.length)
    .fill(null)
    .map(() =>
      new Array(longestAnswer.length).fill({ letter: "", isPartOfWord: false }),
    )

  // Sort the answers by length in descending order.
  const startRow = Math.floor((board.length - longestAnswer.length) / 2)
  const startCol = Math.floor(board.length / 2)

  console.log(longestAnswer)

  for (let i = 0; i < longestAnswer.length; i++) {
    board[startRow + i][startCol] = {
      letter: longestAnswer[i],
      isPartOfWord: true,
    }
  }

  // Place the remaining words.
  for (let k = 1; k < answers.length; k++) {
    const answer = answers[k]

    // Find all possible positions where the word could fit.
    const possiblePositions = []
    for (let i = 0; i <= board.length - answer.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (canPlaceWord(board, answer, i, j)) {
          possiblePositions.push([i, j])
        }
      }
    }

    // If there are no possible positions, skip this word.
    if (possiblePositions.length === 0) continue

    // Choose a position at random and place the word.
    const [startRow, startCol] =
      possiblePositions[Math.floor(Math.random() * possiblePositions.length)]
    for (let i = 0; i < answer.length; i++) {
      board[startRow + i][startCol] = {
        letter: answer[i],
        isPartOfWord: true,
      }
    }
  }

  return board
}

function canPlaceWord(
  board: any[][],
  word: string | any[],
  startRow: number,
  startCol: number,
) {
  for (let i = 0; i < word.length; i++) {
    if (board[startRow + i][startCol].isPartOfWord) {
      return false
    }
  }
  return true
}
