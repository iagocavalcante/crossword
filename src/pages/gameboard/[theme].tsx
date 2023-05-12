/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { invoke } from "@tauri-apps/api/tauri"
import type { NextPage } from "next"
import Link from "next/link"
import router from "next/router"
import { ChangeEvent, useEffect, useState } from "react"

import { generateCrosswordBoard } from "@/lib/generate-crossword-board"
import { generateCrosswordCluesAndAnswer } from "@/lib/handle-generate-crossword"

type Board = {
  letter: string
  row: number
  col: number
}

const Gameboard: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [board, setBoard] = useState<Board[][]>([])
  const [clues, setClues] = useState<string[]>([])
  const [openAIKey, setOpenAiKey] = useState("")
  const [error, setError] = useState("")
  const [gameStarted, setGameStarted] = useState(false)
  const [theme, setTheme] = useState("")

  const loadFromStorage = () => {
    const openAIKey = window.sessionStorage.getItem("openai-key")
    if (openAIKey) {
      setOpenAiKey(openAIKey)
    }
  }

  const setThemeStorage = (theme: string) => {
    window.sessionStorage.setItem("theme", theme)
  }

  async function startGame() {
    setLoading(true)

    try {
      const data = await generateCrosswordCluesAndAnswer(theme, openAIKey)
      const answers = data.map((element) => element?.answer)
      const clues = data.map((element) => element?.clue)
      console.log(clues)
      const newBoard = generateCrosswordBoard(answers as string[]) as unknown
      setBoard(newBoard as [][])
      setClues(clues as string[])
      setGameStarted(true)
    } catch (error) {
      setError(error as string)
      setGameStarted(false)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    rowIndex: number,
    colIndex: string | number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const letter = event.target.value.toUpperCase()
    const correctLetter = board[rowIndex][colIndex as number].letter
    const cellElement = event.target

    if (letter === correctLetter) {
      cellElement.classList.remove("border-red-500")
      cellElement.classList.add("border-green-500")
    } else {
      cellElement.classList.remove("border-green-500")
      cellElement.classList.add("border-red-500")
    }
  }

  useEffect(() => {
    loadFromStorage()
    if (!router.query.theme) {
      const loadTheme = window.sessionStorage.getItem("theme")
      if (loadTheme) {
        setTheme(loadTheme)
      }
    } else {
      setTheme(router.query.theme as string)
      setThemeStorage(theme)
    }
  }, [theme])

  return (
    <div className="flex flex-col space-y-4 min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-2 mt-10">
        <h1 className="text-3xl text-sky-800">Crossword Game</h1>
        <h2 className="text-2xl text-sky-800">Theme: {theme}</h2>
        {gameStarted && (
          <button
            className="border-sky-900 bg-sky-300 p-4 text-sky-900 hover:bg-sky-400 hover:text-sky-800 rounded-md"
            onClick={startGame}
          >
            Reload
          </button>
        )}
      </div>

      {!openAIKey && <h3 className="text-xl text-sky-800">API Key not found</h3>}

      {openAIKey && (
        <div className="flex flex-col items-center justify-center space-y-2">
          {!gameStarted && (
            <button
              className="border-sky-900 bg-sky-300 p-4 text-sky-900 hover:bg-sky-400 hover:text-sky-800 rounded-md"
              onClick={startGame}
            >
              Start Game
            </button>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Link className="text-sky-800" href="/">
            Back to Home
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col h-screen justify-center items-center space-y-2">
          <h1 className="text-3xl text-sky-800">Generating crossword game...</h1>
          <div className="animate-spin rounded-full mt-3 h-32 w-32 border-b-2 border-sky-900"></div>
        </div>
      ) : (
        <div className="flex space-x-2 w-full justify-center mt-16">
          <div id="gameBoard" className="grid grid-flow-row auto-rows-max">
            {board.map((row: any, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {row.map((cell: { isPartOfWord: any }, colIndex: any) => (
                  <input
                    key={colIndex}
                    type="text"
                    maxLength={1}
                    className={`w-8 h-8 border-2 border-gray-200 text-center text-lg uppercase ${
                      !cell.isPartOfWord ? "bg-black" : ""
                    }`}
                    onChange={(e) => handleInputChange(rowIndex, colIndex, e)}
                    disabled={!cell.isPartOfWord}
                  />
                ))}
              </div>
            ))}
          </div>
          <div id="clues" className="ml-24">
            <ol>
              {clues.map((element: string, index) => (
                <li key={index}>{element}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gameboard
