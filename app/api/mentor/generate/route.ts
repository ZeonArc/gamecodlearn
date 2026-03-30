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

    // 2. Call Native Google Gemini SDK instead of n8n
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
       console.error("GEMINI_API_KEY is missing from environment variables.")
       return NextResponse.json({ error: "AI backend not fully configured." }, { status: 503 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", generationConfig: { responseMimeType: "application/json" } })

    const prompt = `You are an expert Career Mentor and Education Planner.
Analyze the following user profile and generate a highly personalized career roadmap.
User Profile:
- Academic Background: ${profile.academic_background}
- Skills: ${profile.skills?.join(", ") || "None specified"}
- Interests: ${profile.interests?.join(", ") || "None specified"}

Your goal is to output a Directed Acyclic Graph (DAG) structure that outlines an optimal learning and project path.
Return ONLY a JSON array of objects, where each object represents a node in the roadmap.
Each node object must have the following schema:
- "id": string (unique identifier, e.g., "node_1")
- "label": string (short title of the milestone, e.g., "Learn React")
- "type": string (must be one of: "course", "certification", "project", "internship", "goal")
- "status": string (must be exactly "available", or "locked" if it has dependencies)
- "dependencies": string[] (array of node ids that must be completed before this node. Use empty array [] if none)
- "courseraQuery": string (an optimal search query to find this topic on Coursera. Keep it concise)

Ensure the graph spans from immediate next steps to a major outcome. Make at least 5-8 nodes. The first 1-2 nodes should have no dependencies and status "available". Subsequent nodes should have dependencies and status "locked".`

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
    const { error: saveError } = await supabase
        .from('career_roadmaps')
        .upsert({
            user_id: userId,
            dag_data: aiData // Ensure this is valid JSON array of nodes
        }, { onConflict: 'user_id' })

    if (saveError) {
        console.error("Failed to save roadmap to DB:", saveError)
        // Still return success of generation, but log error
    }

    return NextResponse.json({ success: true, message: "Roadmap generated successfully.", data: aiData })

  } catch (error) {
    console.error("Mentor API Error:", error)
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
  }
}
