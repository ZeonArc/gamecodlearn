import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { triggerN8NAsync, N8N_WORKFLOWS } from "@/lib/n8n/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const teacherId = searchParams.get("teacherId")
    if (!teacherId) return NextResponse.json({ error: "Missing teacherId" }, { status: 400 })

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data: tasks, error } = await supabase
      .from("teacher_tasks")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, tasks: tasks || [] })
  } catch (error) {
    console.error("Teacher tasks GET error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { teacherId, title, description, taskType, dueDate, assignedStudents } = body

    if (!teacherId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { data, error } = await supabase
      .from("teacher_tasks")
      .insert({
        teacher_id: teacherId,
        title,
        description: description || "",
        task_type: taskType || "coding",
        due_date: dueDate || null,
        status: "todo",
        assigned_students: assignedStudents || [],
      })
      .select()
      .single()

    if (error) throw error

    // Trigger n8n async pipeline for task notifications
    if (assignedStudents && assignedStudents.length > 0) {
      triggerN8NAsync(N8N_WORKFLOWS.TASK_ASSIGNMENT, {
        taskId: data.id,
        teacherId,
        title,
        taskType,
        studentCount: assignedStudents.length
      })
    }

    return NextResponse.json({ success: true, task: data })
  } catch (error) {
    console.error("Teacher tasks POST error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { taskId, updates } = await req.json()
    if (!taskId) return NextResponse.json({ error: "Missing taskId" }, { status: 400 })

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const { error } = await supabase.from("teacher_tasks").update(updates).eq("id", taskId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Teacher tasks PATCH error:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}
