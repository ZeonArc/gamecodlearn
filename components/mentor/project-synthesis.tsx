"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, X, Clock, Code2, Lightbulb, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SynthesizedProject = {
  title: string
  tagline: string
  description: string
  techStack: string[]
  features: { name: string; description: string; skillUsed: string }[]
  milestones: { phase: string; task: string; estimatedHours: number }[]
  difficulty: string
  totalEstimatedHours: number
  interviewTalkingPoints: string[]
}

interface ProjectSynthesisProps {
  userId: string
  trigger?: boolean
  initialProject?: SynthesizedProject | null
  onClose?: () => void
}

export function ProjectSynthesis({ userId, trigger = false, initialProject, onClose }: ProjectSynthesisProps) {
  const [project, setProject] = useState<SynthesizedProject | null>(initialProject || null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(trigger || !!initialProject)

  const generateProject = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/mentor/project-synthesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.success) {
        setProject(data.project)
        setIsOpen(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (d: string) => {
    switch (d?.toLowerCase()) {
      case "beginner": return "text-green-400 bg-green-500/10 border-green-500/30"
      case "intermediate": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      case "advanced": return "text-red-400 bg-red-500/10 border-red-500/30"
      default: return "text-primary bg-primary/10 border-primary/30"
    }
  }

  if (!isOpen && !project) {
    return (
      <Button
        variant="outline"
        onClick={generateProject}
        disabled={isLoading}
        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Synthesizing...</>
        ) : (
          <><Sparkles className="w-4 h-4 mr-2" /> Synthesize Project</>
        )}
      </Button>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Synthesized Project</span>
                </div>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">{project.tagline}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setIsOpen(false)
                  onClose?.()
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-5">
              <p className="text-sm leading-relaxed">{project.description}</p>

              {/* Meta */}
              <div className="flex flex-wrap gap-3">
                <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <span className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ~{project.totalEstimatedHours}h
                </span>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((t, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-md bg-primary/10 border border-primary/20 font-mono">{t}</span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Code2 className="w-3 h-3" /> Features
                </h4>
                <div className="space-y-2">
                  {project.features.map((f, i) => (
                    <div key={i} className="bg-background/30 rounded-lg p-3 border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{f.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{f.skillUsed}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Build Phases</h4>
                <div className="space-y-2">
                  {project.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm">{m.task}</span>
                        <span className="text-xs text-muted-foreground ml-2">~{m.estimatedHours}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Points */}
              {project.interviewTalkingPoints && project.interviewTalkingPoints.length > 0 && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Interview Talking Points
                  </h4>
                  <ul className="space-y-1">
                    {project.interviewTalkingPoints.map((p, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <Lightbulb className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
