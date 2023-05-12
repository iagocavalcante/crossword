/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import axios from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import { useState } from "react"

const Home: NextPage = () => {
  const [themes, setThemes] = useState([])
  const [openAIKey, setOpenAIKey] = useState("")
  const [error, setError] = useState("")

  const generateCrosswordThemesChoice = async (token: string) => {
    const prompt = "Generate 5 random themes for a wordcross game"
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.2,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const themes = data.choices[0].text.split("\n").slice(2, 7)

      setThemes(themes)
    } catch (error) {
      throw new Error(error as string)
    }
  }

  // save token in session storage
  const saveToken = (token: string) => {
    window.sessionStorage.setItem("openai-key", token)
  }

  async function handleSubmit(e: { preventDefault: () => void; target: any }) {
    setError("")
    // Prevent the browser from reloading the page
    e.preventDefault()

    // Read the form data
    const form = e.target
    const formData = new FormData(form)

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries())

    saveToken(formJson.openaiApiKey as string)
    setOpenAIKey(formJson.openaiApiKey as string)

    try {
      void (await generateCrosswordThemesChoice(formJson.openaiApiKey as string))
    } catch (error) {
      console.log(error)
      setError("Something went wrong, try again later. Or verify your API key.")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold text-sky-900">Crossword Generator</h1>

        {!openAIKey && (
          <form
            onSubmit={handleSubmit}
            method="post"
            className="flex flex-col space-y-2 mt-24 text-sky-800"
          >
            <label className="text-3xl mb-4 font-semibold">
              Insert your Open AI API key
            </label>
            <input
              className="border-sky-700 bg-sky-100 w-full p-2 rounded-md"
              type="text"
              name="openaiApiKey"
            />
            {error && <p className="text-red-500">{error}</p>}

            <button
              className="border-sky-900 bg-sky-300 p-4 text-sky-900 hover:bg-sky-400 hover:text-sky-800 rounded-md"
              type="submit"
            >
              Register API key
            </button>

            <small className="text-gray-500">
              We not store your API key, we only use it to generate the crossword game.
            </small>
          </form>
        )}

        {openAIKey && (
          <>
            {themes?.length > 0 && (
              <h2 className="text-3xl font-bold mt-4 text-sky-800">Choose a theme</h2>
            )}
            <div className="text-2xl flex space-x-2 mt-4">
              {themes?.length === 0 && (
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-sky-800">Generating themes...</p>
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-900"></div>
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
          </>
        )}
      </main>
    </div>
  )
}

export default Home
