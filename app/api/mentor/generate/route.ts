import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    // 1. Fetch user profile from Supabase
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet: any[]) { /* not needed for read */ }
        }
      }
    )

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
        console.error("Profile fetch error:", profileError)
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // 2. Call Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
       console.error("GEMINI_API_KEY is missing from environment variables.")
       return NextResponse.json({ error: "AI backend not fully configured." }, { status: 503 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } })

    const prompt = `You are an expert Career Mentor and Education Planner.
Analyze the following user profile and generate a highly personalized career roadmap as a Directed Acyclic Graph (DAG).

User Profile:
- Academic Background: ${profile.academic_background}
- Skills: ${profile.skills?.join(", ") || "None specified"}
- Interests: ${profile.interests?.join(", ") || "None specified"}
- Career Goal: ${profile.career_goal || "Software Engineer"}

Generate a DAG with 8-12 nodes that forms a realistic learning path from their current level to their career goal.

Return ONLY a JSON array of objects with this exact schema:
[
  {
    "id": "node_1",
    "label": "Short title (e.g. Learn React)",
    "title": "Same as label",
    "description": "2-3 sentence description of what this milestone involves and why it matters",
    "type": "course|certification|project|internship|goal",
    "status": "available|locked",
    "xp_reward": number (50-500 based on difficulty),
    "depends_on": [],
    "dependencies": [],
    "column": number (0 for starting nodes, 1 for next phase, 2 for intermediate, 3 for advanced),
    "courseraQuery": "optimal search query for Coursera"
  }
]

Rules:
- First 2-3 nodes MUST have status "available" and empty dependencies arrays and column 0
- All other nodes MUST have status "locked" and list their prerequisite node IDs in both depends_on AND dependencies arrays
- Columns should progress from 0 (beginner) to 3+ (advanced/goal)
- The final node should be type "goal" representing their career achievement
- Include at least 1 project node and 1 certification node
- Make the path branching where logical (not purely linear)`

    const aiResult = await model.generateContent(prompt)
    const aiText = aiResult.response.text()
    
    let aiData
    try {
        aiData = JSON.parse(aiText)
    } catch (e) {
        console.error("Failed to parse Gemini output as JSON:", aiText)
        return NextResponse.json({ error: "AI produced invalid roadmap format." }, { status: 500 })
    }

    // 3. Save generated DAG Roadmap back to Supabase
    const totalNodes = aiData.length
    const availableNodes = aiData.filter((n: any) => n.status === 'available').length

    const { error: saveError } = await supabase
        .from('career_roadmaps')
        .upsert({
            user_id: userId,
            dag_data: aiData,
            progress_percent: 0,
            predictive_score: Math.round(15 + Math.random() * 10), // initial baseline
            last_activity: new Date().toISOString()
        }, { onConflict: 'user_id' })

    if (saveError) {
        console.error("Failed to save roadmap to DB:", saveError)
    }

    // 4. Seed initial user_skills from profile
    if (profile.skills && profile.skills.length > 0) {
      const skillEntries = profile.skills.map((skill: string) => ({
        user_id: userId,
        skill_name: skill,
        proficiency: 50, // baseline self-reported
        last_verified: new Date().toISOString(),
        is_decayed: false
      }))

      await supabase
        .from('user_skills')
        .upsert(skillEntries, { onConflict: 'user_id,skill_name' })
    }

    return NextResponse.json({ success: true, message: "Roadmap generated successfully.", data: aiData })

  } catch (error) {
    console.error("Mentor API Error:", error)
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
  }
}
