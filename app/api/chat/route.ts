
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()

    // 1. Check if N8N_EXPLAIN_WEBHOOK is set
    const n8nUrl = process.env.N8N_EXPLAIN_WEBHOOK

    if (!n8nUrl) {
      // Return a mock response if no backend is connected
      return NextResponse.json({ 
        response: `[MOCK AI] I see you're asking about "${message}". To get real answers, connect me to n8n! 🚀` 
      })
    }

    // 2. Forward to n8n
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "chat",
        message, 
        context 
      })
    })

    const data = await response.json()
    // Assuming n8n returns { content: "answer" } or similar from Gemini node
    const aiText = data.content || data.response || data.text || JSON.stringify(data)

    return NextResponse.json({ response: aiText })

  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 })
  }
}
