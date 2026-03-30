/**
 * n8n Workflow Integration Client
 *
 * Central hub for triggering n8n workflows from Next.js.
 * Each workflow has its own webhook URL configured via environment variables.
 * Falls back to local API execution when n8n is not connected.
 */

const N8N_BASE = process.env.N8N_BASE_URL || "http://localhost:5678"

export interface N8NWorkflowResult {
  success: boolean
  message: string
  data?: any
  fallback?: boolean
}

/**
 * All available n8n workflow webhook IDs.
 * Each maps to a dedicated n8n webhook trigger node.
 */
export const N8N_WORKFLOWS = {
  ONBOARDING_PIPELINE:    "onboarding-pipeline",
  SKILL_DECAY:            "skill-decay-monitor",
  TASK_ASSIGNMENT:        "task-assignment",
  GITHUB_ANALYSIS:        "github-analysis",
  WEEKLY_REPORT:          "weekly-progress-report",
  COURSE_ENRICHMENT:      "course-enrichment",
} as const

type WorkflowId = (typeof N8N_WORKFLOWS)[keyof typeof N8N_WORKFLOWS]

/**
 * Trigger an n8n workflow via webhook.
 *
 * Uses per-workflow webhook URLs:
 *   N8N_WEBHOOK_ONBOARDING_PIPELINE
 *   N8N_WEBHOOK_SKILL_DECAY_MONITOR
 *   etc.
 *
 * If no specific URL is set, it falls back to the generic N8N_WEBHOOK_URL.
 * If that's also missing, returns a mock/fallback response.
 */
export async function triggerN8NWorkflow(
  workflowId: WorkflowId,
  payload: Record<string, any>,
  options: { waitForCompletion?: boolean } = {}
): Promise<N8NWorkflowResult> {
  // Build the env var name: N8N_WEBHOOK_ONBOARDING_PIPELINE
  const envKey = `N8N_WEBHOOK_${workflowId.toUpperCase().replace(/-/g, "_")}`
  const webhookUrl =
    process.env[envKey] ||
    process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    console.log(`[n8n] No webhook for "${workflowId}" (${envKey}). Using local fallback.`)
    return {
      success: true,
      message: `n8n not connected — "${workflowId}" handled locally`,
      fallback: true,
    }
  }

  try {
    console.log(`[n8n] Triggering workflow "${workflowId}" → ${webhookUrl}`)

    const controller = new AbortController()
    // 30s timeout for webhook; async workflows return immediately
    const timeout = setTimeout(() => controller.abort(), 30_000)

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflowId,
        ...payload,
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`n8n responded ${res.status}: ${res.statusText}`)
    }

    const data = await res.json().catch(() => ({}))

    return {
      success: true,
      message: `Workflow "${workflowId}" triggered successfully`,
      data,
    }
  } catch (error) {
    console.error(`[n8n] Workflow "${workflowId}" failed:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown n8n error",
      fallback: true,
    }
  }
}

/**
 * Fire-and-forget: trigger an n8n workflow without waiting.
 * Useful for background pipelines like notifications.
 */
export function triggerN8NAsync(
  workflowId: WorkflowId,
  payload: Record<string, any>
): void {
  // Intentionally not awaited — runs in background
  triggerN8NWorkflow(workflowId, payload).catch((err) =>
    console.error(`[n8n async] "${workflowId}" background error:`, err)
  )
}
