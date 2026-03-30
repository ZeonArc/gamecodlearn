"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Loader2, ArrowLeft, Download, Briefcase, Star, Lightbulb, Code, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

type ResumeData = {
  summary: string
  skills: {
    technical: string[]
    tools: string[]
    soft: string[]
  }
  projects: {
    title: string
    description: string
    bullets: string[]
    techUsed: string[]
  }[]
  certificationSuggestions: string[]
  tips: string[]
}

export default function ResumePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [targetRole, setTargetRole] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateResume = async () => {
    if (!user) return router.push("/auth")
    setIsGenerating(true)
    try {
      const res = await fetch("/api/mentor/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, targetRole: targetRole || undefined })
      })
      const data = await res.json()
      if (data.success) {
        setResume(data.resume)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Smart Resume Builder</h1>
              <p className="text-muted-foreground">AI-powered resume content tailored to your skills and career goal</p>
            </div>
          </div>
        </motion.div>

        {/* Generate Section */}
        {!resume && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-card/30 backdrop-blur border-border/50">
              <CardContent className="p-8 space-y-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold">Generate Your Resume Content</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    AI will analyze your completed skills and generate professional resume content
                  </p>
                </div>
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Role (optional)</label>
                    <Input
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Frontend Developer, ML Engineer..."
                      className="bg-background/50"
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90"
                    onClick={generateResume}
                    disabled={isGenerating}
                    size="lg"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Resume...</>
                    ) : (
                      <><FileText className="w-4 h-4 mr-2" /> Generate Resume Content</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Resume Display */}
        {resume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setResume(null)}>
                ← Generate New
              </Button>
              <Button variant="outline" onClick={() => {
                const text = JSON.stringify(resume, null, 2)
                const blob = new Blob([text], { type: "application/json" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "resume-content.json"
                a.click()
              }}>
                <Download className="w-4 h-4 mr-2" /> Export JSON
              </Button>
            </div>

            {/* Professional Summary */}
            <Card className="bg-card/30 backdrop-blur border-border/50 border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <Briefcase className="w-5 h-5" /> Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{resume.summary}</p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-card/30 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" /> Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Technical</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.technical.map((s, i) => (
                      <span key={i} className="px-3 py-1 text-sm rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Tools & Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.tools.map((s, i) => (
                      <span key={i} className="px-3 py-1 text-sm rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.soft.map((s, i) => (
                      <span key={i} className="px-3 py-1 text-sm rounded-full bg-green-500/10 border border-green-500/30 text-green-400">{s}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-card/30 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" /> Suggested Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resume.projects.map((proj, i) => (
                  <div key={i} className="bg-background/30 rounded-lg p-4 border border-border/30">
                    <h3 className="font-bold text-lg mb-1">{proj.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{proj.description}</p>
                    <ul className="space-y-1 mb-3">
                      {proj.bullets.map((b, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1">
                      {proj.techUsed.map((t, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-card/30 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" /> Recommended Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {resume.certificationSuggestions.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">{i + 1}</div>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-card/30 backdrop-blur border-border/50 border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Lightbulb className="w-5 h-5" /> Resume Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resume.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="w-3 h-3 mt-1 text-yellow-500 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
