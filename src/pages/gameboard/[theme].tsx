/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { invoke } from "@tauri-apps/api/tauri"
import axios from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import router from "next/router"
import { useEffect, useState } from "react"

import { generateCrosswordBoard } from "@/lib/generate-crossword-board"

const Gameboard: NextPage = () => {
  const { theme } = router.query

  const [loading, setLoading] = useState(false)

  async function startGame() {
    setLoading(true)
    const { data } = await axios.post(
      "http://localhost:3000/api/generate-clues-answer",
      {
        theme,
      },
    )

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
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    void startGame()
  }, [])

  return (
    <>
      {loading && (
        <div className="flex flex-col h-screen justify-center items-center space-y-2">
          <h1 className="text-3xl">Generating crossword game...</h1>
          <div className="animate-spin rounded-full mt-3 h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}
      <div className="flex space-y-2 h-screen w-full items-center justify-center">
        <div id="gameBoard" className="grid grid-flow-row auto-rows-max"></div>
        <div id="clues" className="ml-4"></div>
      </div>
    </>
  )
}

export default Gameboard
