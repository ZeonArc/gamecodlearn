"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import {
  ArrowLeft, Loader2, Brain, CheckCircle, XCircle,
  ChevronRight, Timer, Send, Code2, Network, Mic, RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { dispatchAIPipelineEvent } from "@/components/ui/ai-activity-toast"

export default function AssessmentTypePage() {
  const { type } = useParams<{ type: string }>()
  const { user } = useAuth()

  const [questions, setQuestions] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState("")

  // MCQ state
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  // Viva state
  const [vivaIndex, setVivaIndex] = useState(0)
  const [vivaAnswer, setVivaAnswer] = useState("")
  const [vivaEval, setVivaEval] = useState<string | null>(null)
  const [evaluating, setEvaluating] = useState(false)

  const generate = async () => {
    setLoading(true)
    setQuestions(null)
    setShowResults(false)
    setAnswers({})
    setCurrentQ(0)
    setVivaIndex(0)
    setVivaEval(null)
    try {
      const res = await fetch("/api/mentor/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, action: "generate", type, topic: topic || undefined }),
      })
      const data = await res.json()
      if (data.success) {
        setQuestions(data.questions)
        dispatchAIPipelineEvent("course-enrichment")
      }
    } catch {}
    setLoading(false)
  }

  const evaluateViva = async () => {
    if (!vivaAnswer.trim()) return
    setEvaluating(true)
    try {
      const q = Array.isArray(questions) ? questions[vivaIndex] : null
      const res = await fetch("/api/mentor/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, action: "evaluate", answer: vivaAnswer, questionContext: q }),
      })
      const data = await res.json()
      if (data.success) {
        setVivaEval(data.evaluation)
        dispatchAIPipelineEvent("skill-decay-monitor")
      }
    } catch {}
    setEvaluating(false)
  }

  const mcqScore = () => {
    if (!Array.isArray(questions)) return 0
    return questions.filter((q: any) => answers[q.id] === q.correct).length
  }

  const icons: Record<string, any> = { mcq: Brain, coding: Code2, conceptmap: Network, viva: Mic }
  const titles: Record<string, string> = { mcq: "MCQ Quiz", coding: "Coding Challenge", conceptmap: "Concept Map", viva: "AI Viva" }
  const Icon = icons[type] || Brain

  // Pre-generation screen
  if (!questions) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 max-w-2xl">
          <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
            <Link href="/mentor/assessment"><ArrowLeft className="h-4 w-4 mr-2" /> All Assessments</Link>
          </Button>
          <Card className="bg-card/50 backdrop-blur border-border/40">
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-black mb-2">{titles[type] || "Assessment"}</h1>
              <p className="text-muted-foreground mb-8">
                AI will generate questions tailored to your skills and career goal
              </p>
              <div className="max-w-sm mx-auto space-y-4">
                <Input
                  placeholder="Custom topic (optional, e.g. React Hooks)"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="bg-background/50 text-center"
                />
                <Button onClick={generate} disabled={loading} className="w-full h-12 bg-gradient-to-r from-primary to-accent">
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <>Generate {titles[type]} <ChevronRight className="h-4 w-4 ml-1" /></>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // MCQ Quiz
  if (type === "mcq" && Array.isArray(questions)) {
    if (showResults) {
      const score = mcqScore()
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-10 max-w-2xl">
            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardContent className="p-8 text-center">
                <div className={`text-6xl font-black mb-4 ${score >= 7 ? "text-green-400" : score >= 4 ? "text-amber-400" : "text-red-400"}`}>
                  {score}/{questions.length}
                </div>
                <p className="text-lg font-semibold mb-6">
                  {score >= 7 ? "Excellent! 🎉" : score >= 4 ? "Good effort! 💪" : "Keep practicing! 📚"}
                </p>
                <div className="space-y-3 text-left max-h-[60vh] overflow-auto">
                  {questions.map((q: any) => (
                    <div key={q.id} className={`p-4 rounded-xl border ${answers[q.id] === q.correct ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                      <div className="flex items-start gap-2">
                        {answers[q.id] === q.correct ? <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-sm font-medium">{q.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">Correct: {q.correct}</p>
                          {q.explanation && <p className="text-xs text-muted-foreground mt-0.5">{q.explanation}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => { setQuestions(null); setShowResults(false) }} className="mt-6">
                  <RotateCcw className="h-4 w-4 mr-2" /> Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    const q = questions[currentQ]
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-primary">{Object.keys(answers).length} answered</span>
          </div>
          <Progress value={(currentQ + 1) / questions.length * 100} className="h-2 mb-8" />

          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="bg-card/50 backdrop-blur border-border/40">
                <CardContent className="p-8">
                  <h2 className="text-lg font-bold mb-6">{q.question}</h2>
                  <div className="space-y-3">
                    {(q.options || []).map((opt: string) => {
                      const letter = opt.charAt(0)
                      const isSelected = answers[q.id] === letter
                      return (
                        <button
                          key={opt}
                          onClick={() => setAnswers({ ...answers, [q.id]: letter })}
                          className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border/40 hover:border-primary/30 hover:bg-card"
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="ghost" disabled={currentQ === 0} onClick={() => setCurrentQ(c => c - 1)}>
                      Previous
                    </Button>
                    {currentQ < questions.length - 1 ? (
                      <Button onClick={() => setCurrentQ(c => c + 1)}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={() => setShowResults(true)} className="bg-gradient-to-r from-primary to-accent">
                        Submit Quiz
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Viva
  if (type === "viva" && Array.isArray(questions)) {
    const q = questions[vivaIndex]
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link href="/mentor/assessment"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
            </Button>
            <span className="text-sm text-muted-foreground">Question {vivaIndex + 1} / {questions.length}</span>
          </div>
          <Progress value={(vivaIndex + 1) / questions.length * 100} className="h-2 mb-8" />

          <Card className="bg-card/50 backdrop-blur border-border/40">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Mic className="h-3 w-3" /> {q?.difficulty}
              </div>
              <h2 className="text-lg font-bold mb-6">{q?.question}</h2>

              <Textarea
                placeholder="Type your answer..."
                value={vivaAnswer}
                onChange={e => { setVivaAnswer(e.target.value); setVivaEval(null) }}
                rows={5}
                className="bg-background/50 mb-4"
              />

              {!vivaEval ? (
                <Button onClick={evaluateViva} disabled={evaluating || !vivaAnswer.trim()} className="w-full">
                  {evaluating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Evaluating...</> : <><Send className="h-4 w-4 mr-2" /> Submit Answer</>}
                </Button>
              ) : (
                <>
                  <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/30 prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{vivaEval}</ReactMarkdown>
                  </div>
                  {vivaIndex < questions.length - 1 && (
                    <Button onClick={() => { setVivaIndex(i => i + 1); setVivaAnswer(""); setVivaEval(null) }} className="w-full mt-4">
                      Next Question <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Concept Map / Coding — show the raw generated data nicely
  if (type === "conceptmap" && questions) {
    const concepts = questions.concepts || []
    const connections = questions.connections || []
    const missing = questions.missingConnections || []

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
            <Link href="/mentor/assessment"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
          </Button>
          <h1 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Network className="h-6 w-6 text-purple-400" /> Concept Map
          </h1>

          <Card className="bg-card/50 backdrop-blur border-border/40 mb-6">
            <CardHeader><CardTitle className="text-base">Known Connections</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {connections.map((c: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-green-500/5 border border-green-500/20">
                    <span className="font-medium text-green-400">{concepts.find((x: any) => x.id === c.from)?.label}</span>
                    <span className="text-muted-foreground">—{c.label}→</span>
                    <span className="font-medium text-green-400">{concepts.find((x: any) => x.id === c.to)?.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-purple-500/20">
            <CardHeader><CardTitle className="text-base">🧩 Find the Missing Connections</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {missing.map((c: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                    <span className="font-medium">{concepts.find((x: any) => x.id === c.from)?.label}</span>
                    <span className="text-purple-400 font-bold">— ? →</span>
                    <span className="font-medium">{concepts.find((x: any) => x.id === c.to)?.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Think about how these concepts relate to each other. What is the relationship?
              </p>
            </CardContent>
          </Card>

          <Button onClick={() => setQuestions(null)} className="mt-6">
            <RotateCcw className="h-4 w-4 mr-2" /> Generate New
          </Button>
        </div>
      </div>
    )
  }

  // Coding Challenges
  if (type === "coding" && Array.isArray(questions)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
            <Link href="/mentor/assessment"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
          </Button>
          <h1 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-emerald-400" /> Coding Challenges
          </h1>
          <div className="space-y-6">
            {questions.map((q: any) => (
              <Card key={q.id} className="bg-card/50 backdrop-blur border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">{q.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      q.difficulty === "easy" ? "bg-green-500/10 text-green-400" :
                      q.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                    }`}>{q.difficulty}</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{q.description}</p>
                  {q.examples && (
                    <div className="space-y-2 mb-4">
                      {q.examples.map((ex: any, i: number) => (
                        <div key={i} className="rounded-lg bg-muted/30 p-3 font-mono text-xs border border-border/30">
                          <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                          <div><span className="text-muted-foreground">Output:</span> {ex.output}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {q.starterCode && (
                    <pre className="bg-[#1e1e1e] text-green-400 p-4 rounded-xl text-xs font-mono overflow-auto border border-white/5">
                      {q.starterCode}
                    </pre>
                  )}
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href={`/problems/ai-challenge-${q.id}`}>Open in Editor</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={() => setQuestions(null)} className="mt-6">
            <RotateCcw className="h-4 w-4 mr-2" /> Generate New
          </Button>
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      <p>Unknown assessment type</p>
    </div>
  )
}
