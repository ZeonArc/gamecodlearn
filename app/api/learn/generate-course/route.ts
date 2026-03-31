import { NextResponse } from "next/server"
import { MOCK_AI_COURSE } from "@/lib/mock-data"

/**
 * AI Course Generator API
 *
 * POST /api/learn/generate-course
 * Body: { topic, difficulty, moduleCount }
 *
 * Generates a full course with modules, lessons, and content using Gemini.
 * Falls back to rich mock data for demo resilience.
 */
export async function POST(req: Request) {
  try {
    const { topic, difficulty, moduleCount } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 })
    }

    const numModules = moduleCount || 3
    const level = difficulty || "intermediate"

    try {
      const { jsonModel , parseAIJSON } = await import("@/lib/gemini")

      const prompt = `You are an expert course creator. Generate a complete educational course on "${topic}" at ${level} difficulty.

Create ${numModules} modules, each with 2-3 lessons.

Return a JSON object with this exact structure:
{
  "id": "ai-${topic.toLowerCase().replace(/\\s+/g, '-')}",
  "title": "Course Title with emoji",
  "description": "2-sentence course description",
  "difficulty": "${level}",
  "estimatedHours": number,
  "modules": [
    {
      "id": "m1",
      "title": "Module 1: Module Title",
      "lessons": [
        {
          "id": "l1",
          "title": "Lesson Title",
          "type": "text",
          "content": "Full markdown lesson content with headers, code blocks, examples, and explanations. Make it comprehensive (300+ words). Use \\n for newlines."
        },
        {
          "id": "l2",
          "title": "Practice Exercise",
          "type": "text",
          "content": "A hands-on exercise with step-by-step instructions in markdown."
        }
      ]
    }
  ],
  "prerequisites": ["Prerequisite 1"],
  "learningOutcomes": ["Outcome 1", "Outcome 2"]
}

Rules:
- Make lesson content rich, educational, and well-formatted with markdown
- Include code examples where relevant (use proper markdown code blocks)
- Each module should build on the previous one
- Include at least one lesson of type "text" per module with detailed explanations
- Make the content genuinely educational, not placeholder text`

      const result = await jsonModel.generateContent(prompt)
      const course = parseAIJSON(result.response.text())

      return NextResponse.json({ success: true, course })
    } catch (aiError) {
      console.warn("AI course generation failed, using mock:", aiError)

      // Generate a contextual mock course based on the topic
      const mockCourse = {
        ...MOCK_AI_COURSE,
        id: `ai-${topic.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${topic} Mastery 🚀`,
        description: `A comprehensive AI-generated course on ${topic} covering fundamentals to advanced concepts.`,
      }

      return NextResponse.json({ success: true, course: mockCourse, fallback: true })
    }
  } catch (error) {
    console.error("Course generation error:", error)
    return NextResponse.json({ error: "Failed to generate course" }, { status: 500 })
  }
}
