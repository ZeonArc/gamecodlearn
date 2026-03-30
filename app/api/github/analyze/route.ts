import { NextResponse } from "next/server"
import { buildRepoSummary } from "@/lib/github/client"
import { jsonModel } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { owner, repo } = await req.json()
    if (!owner || !repo) {
      return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 })
    }

    const repoSummary = await buildRepoSummary(owner, repo)

    const prompt = `You are a Senior Code Reviewer and Software Architect.
Analyze this GitHub repository and provide a comprehensive code review.

${repoSummary}

Return a JSON object:
{
  "overallScore": number (0-100),
  "techStack": ["Technology 1", "Technology 2"],
  "codeQuality": {
    "score": number (0-100),
    "highlights": ["Good practice found"],
    "issues": ["Issue found"]
  },
  "architecture": {
    "score": number (0-100),
    "pattern": "Architecture pattern detected",
    "feedback": "Assessment of project structure"
  },
  "bestPractices": {
    "score": number (0-100),
    "met": ["Practice followed"],
    "missing": ["Practice not followed"]
  },
  "improvements": [
    { "priority": "high|medium|low", "suggestion": "What to improve", "reason": "Why" }
  ],
  "summary": "2-3 sentence executive summary of the repo quality"
}`

    const result = await jsonModel.generateContent(prompt)
    const analysis = JSON.parse(result.response.text())

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    console.error("GitHub analyze error:", error)
    return NextResponse.json({ error: "Failed to analyze repo" }, { status: 500 })
  }
}
