/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import axios from "axios"

import { parseCluesAndAnswers } from "./parse-response"

export const templateResponse =
  "1. Word: ___ Clue: ___\n2. Word: ___ Clue: ___\n3. Word: ___ Clue: ___\n4. Word: ___ Clue: ___\n5. Word: ___ Clue: ___\n6. Word: ___ Clue: ___\n7. Word: ___ Clue: ___\n8. Word: ___ Clue: ___\n9. Word: ___ Clue: ___\n10. Word: ___ Clue: ___\n11. Word: ___ Clue: ___\n12. Word: ___ Clue: ___\n13. Word: ___ Clue: ___\n14. Word: ___ Clue: ___\n15. Word: ___ Clue: ___"

export const generateCrosswordCluesAndAnswer = async (theme: string, token: string) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const prompt = `Generate a list of 15 words and their respective clues for a crossword puzzle. The theme is ${theme}.\n\n${templateResponse}`

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

    return parseCluesAndAnswers(data.choices[0].text.trim())
  } catch (error) {
    console.log(error)
    throw new Error("Error in generating clues and answers")
  }
}
