export function parseCluesAndAnswers(text: string) {
  // Split the text into lines.
  const lines = text.split("\n").filter((line) => line.trim() !== "")

  return lines.map((line) => {
    // Remove the leading number and dot.
    const lineWithoutNumber = line.split(".").slice(1).join(".").trim()

    // Split the remaining line into the language name and the clue.
    const [clue, answer] = lineWithoutNumber.split("-").map((part) => part.trim())

    if (!answer) {
      return
    }

    console.log(" answer =========>", answer)
    console.log(" clue =========>", clue)

    return {
      answer,
      clue,
      length: answer.length,
    }
  })
}
