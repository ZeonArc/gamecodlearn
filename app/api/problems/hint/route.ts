import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { searchCourseraCourses } from "@/lib/coursera/client"

export async function POST(req: Request) {
  try {
    const { problemText, currentCode, promptMsg } = await req.json()

    // 1. Google Gemini AI Hint Generation
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
       console.error("GEMINI_API_KEY is missing")
       return NextResponse.json({ error: "AI Mentor is not configured." }, { status: 503 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    // We can use a standard text model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const systemPrompt = `You are an expert Programming Tutor. Your goal is to help a student unstuck without giving them the final code answer.
You MUST follow these rules strictly:
1. DO NOT WRITE THE FINAL SOLUTION CODE.
2. Provide a brief explanation of the concepts needed.
3. Suggest 1 or 2 small steps the student can take.
4. Output a JSON object containing two fields:
    - "hintText": Your markdown formatted strict tutor response.
    - "courseraSearchTerm": A 1-4 word query identifying the core computer science concept being tested here, to be used to search coursera for lectures (e.g. "hash map arrays", "dynamic programming").

Context:
Problem Description:
${problemText}

Student's Current Code:
${currentCode}

Student's Message:
${promptMsg || "I am stuck. Please give me a hint."}
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
        return NextResponse.json({ error: "AI produced invalid hint format." }, { status: 500 })
    }

    // 2. Fetch Coursera content using the extracted concept term
    const courseraSearchTerm = aiData.courseraSearchTerm || "programming concepts"
    const courseraCourses = await searchCourseraCourses(courseraSearchTerm, 3)

    return NextResponse.json({ 
        success: true, 
        hintText: aiData.hintText,
        recommendedCourses: courseraCourses
    })

  } catch (error) {
    console.error("Hint API Error:", error)
    return NextResponse.json({ error: "Failed to generate hint" }, { status: 500 })
  }
}
