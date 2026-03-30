import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: any[]) { }
        }
      }
    )

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI backend not configured." }, { status: 503 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `You are an expert Career Mentor and Education Planner.
Analyze the following user profile and generate a highly personalized career roadmap as a Directed Acyclic Graph (DAG).

User Profile:
- Academic Background: ${profile.academic_background}
- Skills: ${profile.skills?.join(", ") || "None specified"}
- Interests: ${profile.interests?.join(", ") || "None specified"}
- Career Goal: ${profile.career_goal || "Software Engineer"}

Generate a DAG with 8-12 nodes forming a realistic learning path from current level to career goal.

Return ONLY a JSON array of objects with this exact schema:
[
  {
    "id": "node_1",
    "label": "Short title",
    "title": "Same as label",
    "description": "2-3 sentence description of what this milestone involves",
    "type": "course|certification|project|internship|goal",
    "status": "available|locked",
    "xp_reward": number (50-500),
    "depends_on": [],
    "dependencies": [],
    "column": number (0-3),
    "courseraQuery": "search query for Coursera"
  }
]

Rules:
- First 2-3 nodes: status "available", empty depends_on, column 0
- Other nodes: status "locked", list prerequisite IDs in both depends_on AND dependencies
- Columns progress 0 (beginner) to 3+ (advanced/goal)
- Final node should be type "goal"
- Include at least 1 project and 1 certification node
- Make the path branching where logical (not purely linear)`

    const aiResult = await model.generateContent(prompt)
    const aiText = aiResult.response.text()

    let aiData
    try {
      aiData = JSON.parse(aiText)
    } catch (e) {
      return NextResponse.json({ error: "AI produced invalid roadmap format." }, { status: 500 })
    }

    // Save DAG to Supabase
    await supabase
      .from('career_roadmaps')
      .upsert({
        user_id: userId,
        dag_data: aiData,
        progress_percent: 0,
        predictive_score: Math.round(15 + Math.random() * 10),
        last_activity: new Date().toISOString()
      }, { onConflict: 'user_id' })

    // Seed initial user_skills from profile
    if (profile.skills && profile.skills.length > 0) {
      const skillEntries = profile.skills.map((skill: string) => ({
        user_id: userId,
        skill_name: skill,
        proficiency: 50,
        last_verified: new Date().toISOString(),
        is_decayed: false
      }))
      await supabase
        .from('user_skills')
        .upsert(skillEntries, { onConflict: 'user_id,skill_name' })
    }

    return NextResponse.json({ success: true, data: aiData })
  } catch (error) {
    console.error("Mentor API Error:", error)
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
  }
}
