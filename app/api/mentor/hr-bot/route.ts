import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel, model } from "@/lib/gemini"
import { fetchMockJobs } from "@/lib/linkedin/client"

export async function POST(req: Request) {
  try {
    const { userId, action, jobId } = await req.json()
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()
    const skills = profile?.skills?.join(", ") || "programming"
    const goal = profile?.career_goal || "Software Engineer"
    const background = profile?.academic_background || "CS Student"

    if (action === "match" || !action) {
      const jobs = await fetchMockJobs()

      const prompt = `You are an HR Analytics AI. Score how well this candidate matches each job.

Candidate:
- Background: ${background}
- Skills: ${skills}
- Career Goal: ${goal}

Jobs:
${jobs.map((j, i) => `${i + 1}. "${j.title}" at ${j.company} — Tags: ${j.tags.join(", ")}`).join("\n")}

Return JSON array (same order as jobs):
[{ "jobIndex": 0, "matchPercent": number (0-100), "matchedSkills": ["skill"], "missingSkills": ["skill"], "recommendation": "Brief actionable advice" }]`

      const result = await jsonModel.generateContent(prompt)
      const matches = JSON.parse(result.response.text())

      const rankedJobs = jobs.map((job, i) => ({
        ...job,
        match: matches.find((m: any) => m.jobIndex === i) || matches[i] || { matchPercent: 0 },
      })).sort((a, b) => (b.match.matchPercent || 0) - (a.match.matchPercent || 0))

      return NextResponse.json({ success: true, jobs: rankedJobs })
    }

    if (action === "cover-letter") {
      if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
      const jobs = await fetchMockJobs()
      const job = jobs.find((j) => j.id === jobId)
      if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

      const prompt = `Write a professional cover letter for this candidate applying to this job.

Candidate: ${background}, skills: ${skills}, goal: ${goal}
Job: ${job.title} at ${job.company}
Description: ${job.description}

Write a compelling, professional cover letter in markdown format. Keep it concise (3-4 paragraphs).`

      const result = await model.generateContent(prompt)
      return NextResponse.json({ success: true, coverLetter: result.response.text() })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("HR bot error:", error)
    return NextResponse.json({ error: "HR Bot failed" }, { status: 500 })
  }
}
