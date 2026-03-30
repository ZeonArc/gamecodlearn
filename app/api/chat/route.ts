import { NextResponse } from "next/server"
import { model } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    const systemPrompt = `You are Codely AI, an expert programming tutor and career mentor.
You specialize in algorithms, data structures, system design, debugging, and career guidance.
You give concise, helpful answers. When a user asks about code, provide clear explanations with examples.
When helping with career advice, be specific and actionable.
If the user provides context about what they're working on, tailor your answer to that context.
Keep responses well-formatted with markdown when appropriate.
${context ? `\nAdditional context: ${context}` : ""}
`

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 2048 },
    })

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`)
    const aiText = result.response.text()

    return NextResponse.json({ response: aiText })

  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 })
  }
}
