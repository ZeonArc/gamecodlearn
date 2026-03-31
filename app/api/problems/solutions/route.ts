import { NextResponse } from "next/server"
import { jsonModel } , parseAIJSON } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { problemTitle, problemDescription } = await req.json()
    if (!problemDescription) {
      return NextResponse.json({ error: "Missing problem description" }, { status: 400 })
    }

    const prompt = `You are an expert algorithm instructor. Generate multiple solution approaches for this coding problem.

Problem: ${problemTitle || "Untitled"}
Description: ${problemDescription}

Return JSON:
{
  "solutions": [
    {
      "approach": "Approach name (e.g. Brute Force, Two Pointer, Hash Map)",
      "explanation": "Clear explanation of the approach in markdown",
      "complexity": { "time": "O(n²)", "space": "O(1)" },
      "code": "Complete JavaScript solution code",
      "difficulty": "beginner|intermediate|advanced"
    }
  ],
  "conceptsUsed": ["Hash Map", "Two Pointer"],
  "commonMistakes": ["Mistake 1 students often make", "Mistake 2"],
  "relatedProblems": ["Similar Problem 1", "Similar Problem 2"]
}`

    const result = await jsonModel.generateContent(prompt)
    const data = parseAIJSON(result.response.text())

    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error("Solutions API error:", error)
    return NextResponse.json({ error: "Failed to generate solutions" }, { status: 500 })
  }
}
