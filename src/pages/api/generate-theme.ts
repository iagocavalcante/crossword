/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// api to generate wordcross theme
// POST /api/generate-theme

import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const prompt = "Generate 5 random themes for a wordcross game"

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
        Authorization: `Bearer seutoken`,
      },
    },
  )

  const themes = response.data.choices[0].text.split("\n").slice(2, 7)

  res.status(200).json(themes)
}

export default handler
