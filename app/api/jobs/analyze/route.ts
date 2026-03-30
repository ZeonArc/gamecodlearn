import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { searchCourseraCourses } from "@/lib/coursera/client"

export async function POST(req: Request) {
  try {
    const { jobData } = await req.json()

    if (!jobData || !jobData.description) {
        return NextResponse.json({ error: "Missing job data." }, { status: 400 })
    }

    // 1. Google Gemini AI Analysis
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
       console.error("GEMINI_API_KEY is missing")
       return NextResponse.json({ error: "AI Mentor is not configured." }, { status: 503 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    const systemPrompt = `You are an expert Career Mentor and Technical Recruiter.
Analyze the following Job Posting and provide a structured plan for a candidate wanting to apply for this role.

Job Posting:
Title: ${jobData.title}
Company: ${jobData.company}
Description: ${jobData.description}

You MUST return ONLY a JSON object with the following schema:
{
  "summary": "A 2-3 sentence summary of what this role entails and the core focus.",
  "requiredSkills": ["Skill 1", "Skill 2"], // Extract max 5 core technical skills or tools mentioned.
  "platformExercises": ["Algorithm X", "Concept Y"], // Suggest 2-3 topics they should practice on a Leetcode-style coding platform based on these requirements.
  "courseraSearchTerm": "Primary concept" // A 2-4 word general topic to query Coursera for courses relevant to the main skill (e.g., "React Frontend", "Python Backend", "Machine Learning").
}
`

    const modelJsonConfig = genAI.getGenerativeModel({ 
        model: "gemini-1.5-pro", 
        generationConfig: { responseMimeType: "application/json" } 
    })

    const aiResult = await modelJsonConfig.generateContent(systemPrompt)
    const aiText = aiResult.response.text()
    
    let aiData
    try {
        aiData = JSON.parse(aiText)
    } catch (e) {
        console.error("Failed to parse Gemini output as JSON:", aiText)
        return NextResponse.json({ error: "AI produced invalid analysis format." }, { status: 500 })
    }

    // 2. Fetch Coursera recommendations based on the AI's extracted search term
    const courseraSearchTerm = aiData.courseraSearchTerm || "software engineering"
    const courseraCourses = await searchCourseraCourses(courseraSearchTerm, 3)

    return NextResponse.json({ 
        success: true, 
        analysis: {
            ...aiData,
            recommendedCourses: courseraCourses
        }
    })

  } catch (error) {
    console.error("Job Analysis API Error:", error)
    return NextResponse.json({ error: "Failed to analyze job." }, { status: 500 })
  }
}
