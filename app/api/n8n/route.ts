import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, payload } = body

    // URL to your n8n workflow webhook
    // In a real app, you might have different webhooks for different actions
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

    if (!N8N_WEBHOOK_URL) {
      // For demo purposes, we'll return a mock response if no URL is configured
      console.warn("N8N_WEBHOOK_URL is not set. Returning mock response.")
      return NextResponse.json({ 
        success: true, 
        message: "Mock response from Next.js API (n8n not connected)",
        data: {
            result: "Passed",
            output: "Hello World" 
        }
      })
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error: unknown) {
    console.error("Error calling n8n:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
