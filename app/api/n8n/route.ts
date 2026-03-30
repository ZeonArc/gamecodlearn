import { NextResponse } from "next/server"
import { triggerN8NWorkflow, triggerN8NAsync, N8N_WORKFLOWS } from "@/lib/n8n/client"

/**
 * Central n8n API gateway — replaces the old single-webhook proxy.
 *
 * POST /api/n8n — Trigger any registered n8n workflow by name.
 * Body: { workflow: "onboarding-pipeline", payload: { ... } }
 *
 * Also receives incoming webhooks FROM n8n via query param:
 * POST /api/n8n?from=n8n&event=task-completed
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fromN8N = searchParams.get("from") === "n8n"
    const body = await request.json()

    // ── Incoming webhook FROM n8n (n8n calls us back) ──
    if (fromN8N) {
      const event = searchParams.get("event")
      console.log(`[n8n → App] Received event: "${event}"`, body)

      switch (event) {
        case "skill-decay-complete":
          return NextResponse.json({
            received: true,
            message: `Skill decay results logged: ${body.totalDecayed} skills affected`,
          })

        case "onboarding-complete":
          return NextResponse.json({
            received: true,
            message: `Onboarding pipeline finished for user ${body.userId}`,
          })

        case "report-generated":
          return NextResponse.json({
            received: true,
            message: `Weekly report generated for teacher ${body.teacherId}`,
          })

        case "task-notification-sent":
          return NextResponse.json({
            received: true,
            message: `Notifications sent for task ${body.taskId}`,
          })

        default:
          return NextResponse.json({
            received: true,
            message: `Unhandled event "${event}" — logged.`,
          })
      }
    }

    // ── Outgoing trigger TO n8n ──
    const { workflow, payload, async: fireAndForget } = body

    if (!workflow) {
      // Legacy support: if "action" is sent, proxy to N8N_WEBHOOK_URL
      const { action, ...rest } = body
      if (action) {
        const result = await triggerN8NWorkflow(
          action as any,
          rest
        )
        return NextResponse.json(result)
      }
      return NextResponse.json({ error: "Missing 'workflow' field" }, { status: 400 })
    }

    // Validate workflow name
    const validWorkflows = Object.values(N8N_WORKFLOWS)
    if (!validWorkflows.includes(workflow)) {
      return NextResponse.json(
        { error: `Invalid workflow. Valid: ${validWorkflows.join(", ")}` },
        { status: 400 }
      )
    }

    if (fireAndForget) {
      triggerN8NAsync(workflow, payload || {})
      return NextResponse.json({
        success: true,
        message: `Workflow "${workflow}" triggered asynchronously`,
      })
    }

    const result = await triggerN8NWorkflow(workflow, payload || {})
    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error("n8n API Error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/n8n — Health check / list available workflows
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    n8nBaseUrl: process.env.N8N_BASE_URL || "not configured",
    availableWorkflows: N8N_WORKFLOWS,
    instructions: {
      trigger: "POST /api/n8n with { workflow: 'workflow-id', payload: { ... } }",
      async: "Add { async: true } to fire-and-forget",
      fromN8N: "POST /api/n8n?from=n8n&event=event-name",
    },
  })
}
