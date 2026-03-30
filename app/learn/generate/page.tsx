"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Loader2, BookOpen, Clock, ArrowLeft, GraduationCap,
  ChevronRight, Layers, CheckCircle, Brain
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dispatchN8NEvent } from "@/components/ui/n8n-activity-toast"

const SUGGESTED_TOPICS = [
  "React Hooks Deep Dive",
  "Python Data Science",
  "Docker & Kubernetes",
  "GraphQL API Design",
  "Machine Learning Basics",
  "TypeScript Advanced Patterns",
  "Blockchain Development",
  "Cloud Architecture (AWS)",
  "Cybersecurity Fundamentals",
  "Mobile App Dev with Flutter",
]

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner", icon: "🌱", color: "border-green-500/30 bg-green-500/5 hover:border-green-500/60" },
  { value: "intermediate", label: "Intermediate", icon: "⚡", color: "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60" },
  { value: "advanced", label: "Advanced", icon: "🔥", color: "border-red-500/30 bg-red-500/5 hover:border-red-500/60" },
]

export default function GenerateCoursePage() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [generating, setGenerating] = useState(false)
  const [generatedCourse, setGeneratedCourse] = useState<any>(null)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    setError("")
    setGeneratedCourse(null)

    try {
      const res = await fetch("/api/learn/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, moduleCount: 3 }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedCourse(data.course)
        dispatchN8NEvent("course-enrichment")
      } else {
        setError(data.error || "Failed to generate course")
      }
    } catch {
      setError("Network error. Please try again.")
    }
    setGenerating(false)
  }

  const openCourse = () => {
    if (generatedCourse) {
      // Store in sessionStorage so the course player can pick it up
      sessionStorage.setItem("ai-generated-course", JSON.stringify(generatedCourse))
      router.push(`/learn/course/ai-generated`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 text-muted-foreground">
          <Link href="/learn"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Learning Hub</Link>
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-4xl font-black mb-3">AI Course Generator</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enter any topic and our AI will create a complete, structured course with modules, lessons, and code examples.
          </p>
        </motion.div>

        {/* Generation Form */}
        {!generatedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardContent className="p-8 space-y-8">
                {/* Topic Input */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">What do you want to learn?</label>
                  <Input
                    placeholder="e.g. React Hooks Deep Dive, Machine Learning, Docker..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="h-14 text-lg bg-background/50"
                    onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  />
                </div>

                {/* Quick Topics */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">Or pick a suggested topic:</label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TOPICS.map(t => (
                      <button
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          topic === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {DIFFICULTY_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDifficulty(opt.value)}
                        className={`p-4 rounded-xl border text-center transition-all ${opt.color} ${
                          difficulty === opt.value ? "ring-2 ring-primary/50 scale-[1.02]" : ""
                        }`}
                      >
                        <div className="text-2xl mb-1">{opt.icon}</div>
                        <div className="text-sm font-medium">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={generating || !topic.trim()}
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating Course with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Generate Course
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Generated Course Preview */}
        <AnimatePresence>
          {generatedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Course Header */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                        <Sparkles className="h-3 w-3" /> AI GENERATED
                      </div>
                      <h2 className="text-2xl font-black">{generatedCourse.title}</h2>
                      <p className="text-muted-foreground mt-1">{generatedCourse.description}</p>
                    </div>
                    <Button onClick={openCourse} className="bg-gradient-to-r from-purple-600 to-pink-600 shrink-0">
                      Start Learning <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4 border-t border-border/30 pt-4">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4" /> {generatedCourse.modules?.length || 0} Modules
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" /> {generatedCourse.modules?.reduce((a: number, m: any) => a + m.lessons.length, 0) || 0} Lessons
                    </span>
                    {generatedCourse.estimatedHours && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> ~{generatedCourse.estimatedHours}h
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" /> {generatedCourse.difficulty}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Outcomes */}
              {generatedCourse.learningOutcomes && (
                <Card className="bg-card/50 backdrop-blur border-border/40">
                  <CardHeader>
                    <CardTitle className="text-base">What You&apos;ll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {generatedCourse.learningOutcomes.map((outcome: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Module List */}
              <div className="space-y-3">
                {generatedCourse.modules?.map((mod: any, i: number) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-card/50 border-border/40 hover:border-primary/30 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">{mod.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {mod.lessons.length} lessons
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {mod.lessons.map((_: any, j: number) => (
                              <div key={j} className="w-2 h-2 rounded-full bg-muted/30" />
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          {mod.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="text-xs text-muted-foreground flex items-center gap-2 py-1">
                              <BookOpen className="h-3 w-3 shrink-0" />
                              {lesson.title}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={() => setGeneratedCourse(null)}>
                  Generate Different Course
                </Button>
                <Button onClick={openCourse} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <BookOpen className="h-4 w-4 mr-2" /> Open Course Player
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
