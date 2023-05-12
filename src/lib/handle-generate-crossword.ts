/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import axios from "axios"

import { parseCluesAndAnswers } from "./parse-response"

export const generateCrosswordCluesAndAnswer = async (theme: string, token: string) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const prompt = `Imagine you are a crossword engine, now you will generate 15 words with the maxlength 15 related to ${theme}, generate answer and clues as output like clue - answer`

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const { data } = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    // const test = [
    //   ({ clue: "1. Tide", answer: "Ebb and Flow ", length: 13 },
    //   { clue: "2. Shore", answer: "Water's Edge ", length: 13 },
    //   { clue: "3. Shells", answer: "Seashells ", length: 10 },
    //   { clue: "4. Fish", answer: "Gilled Creature ", length: 16 },
    //   { clue: "5. Submarine", answer: "Underwater Vessel ", length: 18 },
    //   { clue: "6. Coral", answer: "Marine Organism", length: 15 }),
    // ]

    return parseCluesAndAnswers(data.choices[0].text.trim())
  } catch (error) {
    console.log(error)
    throw new Error("Error in generating clues and answers")
  }
}
