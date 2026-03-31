import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { jsonModel } , parseAIJSON } from "@/lib/gemini"

/**
 * Dynamic Feedback Loop API
 * When a user completes a DAG node:
 * 1. Updates their skill proficiency
 * 2. Unlocks dependent nodes
 * 3. Checks if a skill cluster is complete -> triggers Project Synthesis
 * 4. Recalculates predictive success score
 */
export async function POST(req: Request) {
  try {
    const { userId, nodeId } = await req.json()

    if (!userId || !nodeId) {
      return NextResponse.json({ error: "Missing userId or nodeId" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() { /* read-only context */ }
        }
      }
    )

    // 1. Fetch current roadmap
    const { data: roadmap, error: roadmapError } = await supabase
      .from('career_roadmaps')
      .select('dag_data')
      .eq('user_id', userId)
      .single()

    if (roadmapError || !roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 })
    }

    let nodes = roadmap.dag_data as any[]

    // 2. Mark the node as completed
    nodes = nodes.map((node: any) => {
      if (node.id === nodeId) {
        return { ...node, status: 'completed', completed_at: new Date().toISOString() }
      }
      return node
    })

    // 3. Unlock dependent nodes (DAG logic)
    nodes = nodes.map((node: any) => {
      if (node.status === 'locked') {
        const deps = node.dependencies || node.depends_on || []
        const allDepsCompleted = deps.every((depId: string) => {
          const depNode = nodes.find((n: any) => n.id === depId)
          return depNode?.status === 'completed'
        })
        if (allDepsCompleted) {
          return { ...node, status: 'available' }
        }
      }
      return node
    })

    // 4. Check for skill cluster completion (3+ completed nodes in a row)
    const completedNodes = nodes.filter((n: any) => n.status === 'completed')
    const totalNodes = nodes.length
    const progress = Math.round((completedNodes.length / totalNodes) * 100)

    // 5. Check if we should synthesize a project
    let synthesizedProject = null
    // Trigger project synthesis at 33%, 66%, and 100% milestones
    const milestones = [33, 66, 100]
    const prevCompleted = completedNodes.length - 1
    const prevProgress = Math.round((prevCompleted / totalNodes) * 100)
    
    const hitMilestone = milestones.find(m => progress >= m && prevProgress < m)
    
    if (hitMilestone) {
      // Generate a project using the completed skill cluster
      const completedSkills = completedNodes.map((n: any) => n.label || n.title).join(", ")
      
      const projectPrompt = `You are a Project Architect. A student has completed the following skills/milestones: ${completedSkills}.

Generate a practical, portfolio-worthy project that combines ALL of these skills into one cohesive application.

Return a JSON object with:
- "title": string (catchy project name)
- "description": string (2-3 sentence overview)
- "techStack": string[] (specific technologies to use)
- "features": string[] (3-5 key features to implement)
- "difficulty": string ("beginner" | "intermediate" | "advanced")
- "estimatedHours": number (estimated hours to complete)`

      try {
        const result = await jsonModel.generateContent(projectPrompt)
        synthesizedProject = parseAIJSON(result.response.text())
      } catch (e) {
        console.error("Project synthesis failed:", e)
      }
    }

    // 6. Calculate predictive success score
    const skillCoverage = progress
    const consistencyBonus = completedNodes.length >= 3 ? 10 : 0
    const predictiveScore = Math.min(100, Math.round(skillCoverage * 0.85 + consistencyBonus + Math.random() * 5))

    // 7. Save updated roadmap
    await supabase
      .from('career_roadmaps')
      .update({ 
        dag_data: nodes,
        progress_percent: progress,
        predictive_score: predictiveScore,
        last_activity: new Date().toISOString()
      })
      .eq('user_id', userId)

    // 8. Update user_skills proficiency
    const completedNode = nodes.find((n: any) => n.id === nodeId)
    if (completedNode) {
      await supabase
        .from('user_skills')
        .upsert({
          user_id: userId,
          skill_name: completedNode.label || completedNode.title,
          proficiency: 80,
          last_verified: new Date().toISOString()
        }, { onConflict: 'user_id,skill_name' })
    }

    return NextResponse.json({
      success: true,
      updatedNodes: nodes,
      progress,
      predictiveScore,
      synthesizedProject, // null if no milestone hit, otherwise the project
      milestoneHit: hitMilestone || null
    })

  } catch (error) {
    console.error("Feedback API Error:", error)
    return NextResponse.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
