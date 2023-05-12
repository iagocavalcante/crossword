/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { invoke } from "@tauri-apps/api/tauri"
import axios from "axios"
import type { NextPage } from "next"
import { useEffect } from "react"
// import Head from "next/head"
// import Image from "next/image"
// import { useState } from "react"

// import { Card } from "@/components/Card"
// import { CardButton } from "@/components/CardButton"
// import { useGlobalShortcut } from "@/hooks/tauri/shortcuts"

const Home: NextPage = () => {
  function parseCluesAndAnswers(text: string) {
    // Split the text into lines.
    const lines = text.split("\n").filter((line) => line.trim() !== "")

    console.log(lines)

    return lines.map((line) => {
      // Remove the leading number and dot.
      const lineWithoutNumber = line.split(".").slice(1).join(".").trim()

      // Split the remaining line into the language name and the clue.
      const [answer, clue] = lineWithoutNumber.split("-").map((part) => part.trim())

      return {
        answer,
        clue,
        length: answer.length,
      }
    })
  }
  async function getCrosswordClueAndAnswer(theme: any, wordLength: any) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const prompt = `Imagine you are a crossword engine, now you will generate 15 words with the maxlength ${wordLength} related to ${theme}, generate answer and clues as output, mantain always a concise format.`

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer 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`,
        },
      },
    )

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const data = response.data

    return parseCluesAndAnswers(data.choices[0].text.trim())
    // const test = [
    //   ({ clue: "1. Tide", answer: "Ebb and Flow ", length: 13 },
    //   { clue: "2. Shore", answer: "Water's Edge ", length: 13 },
    //   { clue: "3. Shells", answer: "Seashells ", length: 10 },
    //   { clue: "4. Fish", answer: "Gilled Creature ", length: 16 },
    //   { clue: "5. Submarine", answer: "Underwater Vessel ", length: 18 },
    //   { clue: "6. Coral", answer: "Marine Organism", length: 15 }),
    // ]
  }

  function generateCrosswordBoard(answers: string[]) {
    // Create a 15x15 board.
    const board = new Array(15)
      .fill(null)
      .map(() => new Array(15).fill({ letter: "", isPartOfWord: false }))

    // Sort the answers by length in descending order.
    answers.sort((a, b) => b.length - a.length)

    // Place the longest word in the middle of the board.
    const longestAnswer = answers[0]
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

  const themes = [
    { theme: "space exploration", wordLengths: [5, 6, 7] },
    { theme: "computer science", wordLengths: [4, 7, 8] },
    { theme: "wildlife", wordLengths: [3, 5, 6] },
    { theme: "the ocean", wordLengths: [4, 5, 6] },
    { theme: "the human body", wordLengths: [4, 5, 6] },
    { theme: "programming languages", wordLengths: [4, 5, 6] },
    { theme: "the internet", wordLengths: [4, 5, 6] },
    // Add more themes and word lengths here...
  ]

  function selectRandomTheme() {
    const randomIndex = Math.floor(Math.random() * themes.length)
    return themes[randomIndex]
  }

  function selectRandomWordLength(theme: { theme?: string; wordLengths: any }) {
    const randomIndex = Math.floor(Math.random() * theme.wordLengths.length)
    return theme.wordLengths[randomIndex]
  }

  function startGame() {
    const theme = selectRandomTheme()
    const wordLength = selectRandomWordLength(theme)

    void getCrosswordClueAndAnswer(theme.theme, wordLength).then((data) => {
      console.log(data)
      const gameBoardElement = document.getElementById("gameBoard")

      const cluesElement = document.getElementById("clues")
      gameBoardElement.innerHTML = "" // Clear any existing cells.
      cluesElement.innerHTML = "" // Clear any existing clues.
      const answers = data.map((element: any) => element.answer)
      const board = generateCrosswordBoard(answers)

      board.forEach((row, rowIndex) => {
        const rowElement = document.createElement("div")
        rowElement.className = "grid-row"

        row.forEach((cell, colIndex) => {
          const cellElement = document.createElement("input")
          cellElement.type = "text"
          cellElement.maxLength = 1
          cellElement.className =
            "w-14 h-14 border-2 border-gray-200 text-center text-lg uppercase"

          // Add an event listener to check the user's input.
          cellElement.addEventListener("input", () => {
            const letter = cellElement.value.toUpperCase()
            const correctLetter = board[rowIndex][colIndex].letter

            if (letter === correctLetter) {
              cellElement.classList.remove("border-red-500")
              cellElement.classList.add("border-green-500")
            } else {
              cellElement.classList.remove("border-green-500")
              cellElement.classList.add("border-red-500")
            }
          })

          // If the cell isn't part of the crossword, disable it and make it black.
          if (!cell.isPartOfWord) {
            cellElement.className += " bg-black"
            cellElement.disabled = true
          }

          rowElement.appendChild(cellElement)
        })

        gameBoardElement?.appendChild(rowElement)
      })

      data.forEach((element: any) => {
        // Add the clue to the clues div.
        const clueElement = document.createElement("p")
        clueElement.textContent = element.clue
        cluesElement?.appendChild(clueElement)
      })
    })
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    startGame()
  }, [])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div id="gameBoard" className="grid grid-flow-row auto-rows-max"></div>
      <div id="clues" className="ml-4"></div>
    </div>
  )
}

export default Home
