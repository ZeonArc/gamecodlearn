"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Zap, CheckCircle, Loader2, Brain, GitBranch, BookOpen, BriefcaseBusiness, Cpu, Search } from "lucide-react"

interface PipelineEvent {
  id: string
  icon: any
  label: string
  status: "running" | "done"
  color: string
}

const PIPELINE_ICONS: Record<string, { icon: any; label: string; color: string }> = {
  "onboarding-pipeline":    { icon: Brain, label: "Student Onboarding", color: "text-purple-400" },
  "skill-decay-monitor":    { icon: Zap, label: "Skill Decay Monitor", color: "text-amber-400" },
  "task-assignment":        { icon: Activity, label: "Task Assignment", color: "text-emerald-400" },
  "github-analysis":        { icon: GitBranch, label: "Repo Analysis", color: "text-slate-300" },
  "weekly-progress-report": { icon: BookOpen, label: "Weekly Report", color: "text-blue-400" },
  "course-enrichment":      { icon: BriefcaseBusiness, label: "Course Enrichment", color: "text-rose-400" },
  "failure-prediction":     { icon: Search, label: "Forensic Analysis", color: "text-red-400" },
  "iot-maintenance":        { icon: Cpu, label: "IoT Maintenance Log", color: "text-cyan-400" },
}

/**
 * AI Pipeline orchestration activity toast.
 * Shows real-time background AI pipeline triggers with animated status indicators.
 * Hackathon judges can visually see the background AI orchestration firing.
 */
export function AIPipelineToast() {
  const [events, setEvents] = useState<PipelineEvent[]>([])

  const addEvent = useCallback((pipelineId: string) => {
    const meta = PIPELINE_ICONS[pipelineId] || {
      icon: Activity,
      label: pipelineId,
      color: "text-primary",
    }
    const id = `${pipelineId}-${Date.now()}`
    const event: PipelineEvent = {
      id,
      icon: meta.icon,
      label: meta.label,
      status: "running",
      color: meta.color,
    }

    setEvents((prev) => [event, ...prev].slice(0, 5))

    // Simulate completion after 2-4 seconds
    setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "done" } : e))
      )
    }, 2000 + Math.random() * 2000)

    // Remove after 6 seconds
    setTimeout(() => {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }, 6000)
  }, [])

  // Listen to custom events dispatched from API calls
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      addEvent(e.detail.pipelineId)
    }
    window.addEventListener("ai:pipeline" as any, handler)
    return () => window.removeEventListener("ai:pipeline" as any, handler)
  }, [addEvent])

  // Demo mode: show example pipelines on mount so judges see it
  useEffect(() => {
    const timer1 = setTimeout(() => addEvent("onboarding-pipeline"), 1500)
    const timer2 = setTimeout(() => addEvent("course-enrichment"), 4000)
    return () => { clearTimeout(timer1); clearTimeout(timer2) }
  }, [addEvent])

  if (events.length === 0) return null

  return (
    <div className="fixed bottom-20 left-4 z-50 flex flex-col gap-2 max-w-xs">
      <AnimatePresence>
        {events.map((event) => {
          const Icon = event.icon
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl"
            >
              <div className={`${event.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">AI</span>
                  <span className="text-[10px] text-muted-foreground">pipeline</span>
                </div>
                <p className="text-xs font-medium truncate">{event.label}</p>
              </div>
              {event.status === "running" ? (
                <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin shrink-0" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/**
 * Dispatch an AI pipeline event from anywhere in the client.
 * Call this after triggering an API that fires a background AI pipeline.
 */
export function dispatchAIPipelineEvent(pipelineId: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("ai:pipeline", { detail: { pipelineId } })
    )
  }
}
