import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel, model } from "@/lib/gemini"

/**
 * AI Assessment Engine — supports 4 assessment types:
 * mcq, coding, conceptmap, viva
 */
export async function POST(req: Request) {
  try {
    const { userId, action, type, topic, answer, questionContext } = await req.json()

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    // Fetch user profile for context
    let profile: any = null
    if (userId) {
      const { data } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()
      profile = data
    }
    const skills = profile?.skills?.join(", ") || "general programming"
    const goal = profile?.career_goal || "Software Engineer"

    if (action === "generate") {
      if (!type) return NextResponse.json({ error: "Missing type" }, { status: 400 })
      const subjectTopic = topic || skills

      const prompts: Record<string, string> = {
        mcq: `Generate a quiz of exactly 10 multiple-choice questions on "${subjectTopic}" for a ${goal} candidate.
Return JSON array:
[{ "id": 1, "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "Why A is correct" }]`,

        coding: `Generate exactly 3 coding challenges on "${subjectTopic}" for a ${goal} candidate. Vary difficulty.
Return JSON array:
[{ "id": 1, "title": "Problem Name", "difficulty": "easy|medium|hard", "description": "Full problem statement", "examples": [{ "input": "...", "output": "..." }], "starterCode": "function solve() {\\n  // your code\\n}", "testCases": [{ "input": "...", "expected": "..." }] }]`,

        conceptmap: `Generate a concept mapping exercise on "${subjectTopic}". Create 8 concepts and their relationships.
Return JSON:
{ "concepts": [{ "id": "c1", "label": "Concept Name" }], "connections": [{ "from": "c1", "to": "c2", "label": "relationship type" }], "missingConnections": [{ "from": "c1", "to": "c3", "label": "?" }] }
The missingConnections are the ones the student needs to figure out.`,

        viva: `Generate 5 oral/viva interview questions on "${subjectTopic}" for a ${goal} candidate.
Questions should test deep understanding, not just recall. Mix conceptual and scenario-based.
Return JSON array:
[{ "id": 1, "question": "...", "difficulty": "easy|medium|hard", "keyPoints": ["Point student should mention", "Another key point"], "followUp": "Follow-up question if they answer well" }]`
      }

      const prompt = prompts[type]
      if (!prompt) return NextResponse.json({ error: "Invalid type" }, { status: 400 })

      const result = await jsonModel.generateContent(prompt)
      const questions = JSON.parse(result.response.text())

      return NextResponse.json({ success: true, type, questions })
    }

    if (action === "evaluate") {
      if (!answer || !questionContext) {
        return NextResponse.json({ error: "Missing answer or questionContext" }, { status: 400 })
      }

      const evalPrompt = `Evaluate this assessment answer:

Question: ${JSON.stringify(questionContext)}
Student Answer: ${answer}

Provide detailed feedback in markdown. Include score out of 10, what was good, what to improve, and the ideal answer.`

      const result = await model.generateContent(evalPrompt)
      const evaluation = result.response.text()

      return NextResponse.json({ success: true, evaluation })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Assessment API error:", error)
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 })
  }
}
