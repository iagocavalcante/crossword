export function parseCluesAndAnswers(text: string) {
  // Split the text into lines.
  const lines = text.split("\n").filter((line) => line.trim() !== "")

  return lines.map((line) => {
    // Remove the leading number and dot.
    const lineWithoutNumber = line.split(".").slice(1).join(".").trim()

    const [word, clue] = lineWithoutNumber.split("Clue:")
    const [rest, answer] = word.split("Word:")

    if (!answer || !clue) {
      return
    }

    console.log(" answer =========>", answer)
    console.log(" rest =========>", rest)
    console.log(" clue =========>", clue)

    return {
      answer: answer.trim(),
      clue: clue.trim(),
      length: answer.length,
    }
  })
}
