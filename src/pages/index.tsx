/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"

const Home: NextPage = () => {
  const [themes, setThemes] = useState([])

  const generateCrossword = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const response = await axios.get("http://localhost:3000/api/generate-theme")
    console.log(response.data)
    setThemes(response.data)
  }

  useEffect(() => {
    void generateCrossword()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Crossword Generator</h1>

        {/* create card link to redirect to gameboard passing theme as parameter */}
        <div className="text-2xl flex space-x-2 mt-4">
          {themes?.length === 0 && (
            <div className="flex flex-col items-center space-y-2">
              <p>Generating themes...</p>
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          )}
          {themes?.map((theme: any) => (
            <Link
              key={theme}
              className="text-zinc-600 hover:text-zinc-800 text-2xl flex p-12 border-sky-700 rounded-md bg-sky-100 hover:bg-sky-200"
              href={`/gameboard/${theme}`}
            >
              {theme}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
