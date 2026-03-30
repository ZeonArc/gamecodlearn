import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel, model } from "@/lib/gemini"

/**
 * AI Mock Interview API
 * Generates technical or behavioral interview questions based on user's
 * current DAG progress and career goal, then evaluates their answers.
 */
export async function POST(req: Request) {
  try {
    const { userId, action, answer, questionContext } = await req.json()

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing userId or action" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() { /* read-only */ }
        }
      }
    )

    // Fetch user profile and roadmap for context
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: roadmap } = await supabase
      .from('career_roadmaps')
      .select('dag_data')
      .eq('user_id', userId)
      .single()

    const completedSkills = (roadmap?.dag_data as any[] || [])
      .filter((n: any) => n.status === 'completed')
      .map((n: any) => n.label || n.title)
      .join(", ")

    const careerGoal = profile?.career_goal || "Software Engineer"
    const background = profile?.academic_background || "CS Student"

    if (action === "generate") {
      // Generate interview questions
      const prompt = `You are a senior technical interviewer at a top tech company.
The candidate is a ${background} targeting a ${careerGoal} role.
They have demonstrated skills in: ${completedSkills || "basic programming"}.

Generate a mock interview round with exactly 3 questions:
- 1 behavioral question
- 1 technical/conceptual question related to their skills
- 1 coding/problem-solving question

Return a JSON array of objects:
[
  { "id": 1, "type": "behavioral", "question": "...", "hints": ["hint1", "hint2"] },
  { "id": 2, "type": "technical", "question": "...", "hints": ["hint1", "hint2"] },
  { "id": 3, "type": "coding", "question": "...", "hints": ["hint1", "hint2"], "starterCode": "// optional starter code" }
]`

      const result = await jsonModel.generateContent(prompt)
      const questions = JSON.parse(result.response.text())

      return NextResponse.json({ success: true, questions })
    }

    if (action === "evaluate") {
      // Evaluate the user's answer
      if (!answer || !questionContext) {
        return NextResponse.json({ error: "Missing answer or questionContext" }, { status: 400 })
      }

      const evalPrompt = `You are a senior interviewer evaluating a candidate's answer.

Question: ${questionContext.question}
Question Type: ${questionContext.type}
Candidate's Answer: ${answer}
Candidate's Background: ${background}, targeting ${careerGoal}

Provide a detailed evaluation. Be encouraging but honest.
Include:
1. A score out of 10
2. What they did well
3. What could be improved
4. A model answer or key points they missed

Format your response in clear markdown with headers.`

      const result = await model.generateContent(evalPrompt)
      const evaluation = result.response.text()

      // Save interview transcript
      await supabase
        .from('ai_interviews')
        .insert({
          user_id: userId,
          question: questionContext.question,
          question_type: questionContext.type,
          user_answer: answer,
          ai_evaluation: evaluation,
          created_at: new Date().toISOString()
        })

      return NextResponse.json({ success: true, evaluation })
    }

    return NextResponse.json({ error: "Invalid action. Use 'generate' or 'evaluate'." }, { status: 400 })

  } catch (error) {
    console.error("Interview API Error:", error)
    return NextResponse.json({ error: "Failed to process interview request" }, { status: 500 })
  }
}
