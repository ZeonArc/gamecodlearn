import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Skill Decay Cron API (replacement for n8n scheduled workflow)
 * 
 * This can be triggered by:
 * - Vercel Cron Jobs (vercel.json)
 * - External cron service hitting this endpoint
 * - Manual trigger from admin panel
 * 
 * What it does:
 * 1. Scans all user_skills for entries not verified in 30+ days
 * 2. Reduces proficiency by 10% per decay cycle
 * 3. Marks DAG nodes as "decayed" if skill drops below threshold
 * 4. Returns a summary of affected users
 */
export async function GET(req: Request) {
  try {
    // Verify cron secret to prevent unauthorized triggers
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use admin client (no cookies needed for cron)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const DECAY_THRESHOLD_DAYS = 30
    const DECAY_AMOUNT = 10
    const MIN_PROFICIENCY = 20

    // 1. Get all skills that haven't been verified recently
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - DECAY_THRESHOLD_DAYS)

    const { data: decayedSkills, error } = await supabase
      .from('user_skills')
      .select('*')
      .lt('last_verified', cutoffDate.toISOString())
      .gt('proficiency', MIN_PROFICIENCY)

    if (error) {
      console.error("Skill decay query error:", error)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    if (!decayedSkills || decayedSkills.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No skills need decay adjustment",
        affected: 0 
      })
    }

    // 2. Apply decay to each skill
    let affectedUsers = new Set<string>()
    let totalDecayed = 0

    for (const skill of decayedSkills) {
      const newProficiency = Math.max(MIN_PROFICIENCY, skill.proficiency - DECAY_AMOUNT)
      
      await supabase
        .from('user_skills')
        .update({ 
          proficiency: newProficiency,
          is_decayed: newProficiency <= MIN_PROFICIENCY + DECAY_AMOUNT
        })
        .eq('id', skill.id)

      affectedUsers.add(skill.user_id)
      totalDecayed++
    }

    // Native pipeline: log decay results locally
    if (totalDecayed > 0) {
      console.log(`[AI Pipeline] Skill decay complete: ${totalDecayed} skills decayed across ${affectedUsers.size} users`)
    }

    return NextResponse.json({
      success: true,
      message: `Decay cycle complete`,
      totalDecayed,
      affectedUsers: affectedUsers.size,
      cutoffDate: cutoffDate.toISOString()
    })

  } catch (error) {
    console.error("Skill Decay Cron Error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
