import { NextResponse } from "next/server"
import { model } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 })
    }

    const systemPrompt = `You are OmniEngineer AI, a Principal Engineering Mentor and interdisciplinary technical advisor.
You specialize across all domains of engineering: Mechanical, Electrical, BioTech, Game Engines, Systems Architecture, and Computer Science.
Depending on the user's current track or context, seamlessly shift your persona to be the expert they need (e.g., a Lead Mechanical Engineer, a Chief Biologist, or a Senior Dev).
Provide precise, industry-standard guidance (e.g., refer to GD&T for mechanical, OSI models for networking, CAD/FEA best practices).
Keep responses well-formatted with markdown.
${context ? `\n\nCURRENT LAB CONTEXT: ${context}` : ""}
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
