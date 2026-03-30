"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, MessageSquare, Send, Lightbulb, CheckCircle2, Loader2, ChevronRight, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"

type InterviewQuestion = {
  id: number
  type: string
  question: string
  hints: string[]
  starterCode?: string
}

export default function InterviewPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer] = useState("")
  const [evaluation, setEvaluation] = useState<string | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [phase, setPhase] = useState<"idle" | "interview" | "result">("idle")

  const generateQuestions = async () => {
    if (!user) return router.push("/auth")
    setIsGenerating(true)
    try {
      const res = await fetch("/api/mentor/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "generate" })
      })
      const data = await res.json()
      if (data.success) {
        setQuestions(data.questions)
        setPhase("interview")
        setCurrentQ(0)
        setAnswer("")
        setEvaluation(null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  const submitAnswer = async () => {
    if (!user || !answer.trim()) return
    setIsEvaluating(true)
    try {
      const res = await fetch("/api/mentor/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          action: "evaluate",
          answer,
          questionContext: questions[currentQ]
        })
      })
      const data = await res.json()
      if (data.success) {
        setEvaluation(data.evaluation)
        setPhase("result")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsEvaluating(false)
    }
  }

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setAnswer("")
      setEvaluation(null)
      setShowHints(false)
      setPhase("interview")
    } else {
      setPhase("idle")
      setQuestions([])
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "behavioral": return "text-blue-400 bg-blue-500/10 border-blue-500/30"
      case "technical": return "text-purple-400 bg-purple-500/10 border-purple-500/30"
      case "coding": return "text-green-400 bg-green-500/10 border-green-500/30"
      default: return "text-primary bg-primary/10 border-primary/30"
    }
  }

  return (
    <div className="container py-10 min-h-screen">
      <div className="max-w-3xl mx-auto">
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">AI Mock Interview</h1>
              <p className="text-muted-foreground">Practice with AI-generated questions tailored to your skill level</p>
            </div>
          </div>
        </motion.div>

        {/* Idle State */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-card/30 backdrop-blur border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Ready for Your Mock Interview?</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    AI will generate 3 interview questions based on your completed skills
                    and career goal. You&apos;ll get detailed feedback on each answer.
                  </p>
                  <Button
                    size="lg"
                    onClick={generateQuestions}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 px-8"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Questions...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Start Interview</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Interview State */}
          {phase === "interview" && questions.length > 0 && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      i < currentQ ? "bg-green-500" :
                      i === currentQ ? "bg-primary shadow-[0_0_8px_var(--primary)]" :
                      "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Card className="bg-card/30 backdrop-blur border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getTypeColor(questions[currentQ].type)}`}>
                      {questions[currentQ].type}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Question {currentQ + 1} of {questions.length}
                    </span>
                  </div>
                  <CardTitle className="text-xl mt-4 leading-relaxed">
                    {questions[currentQ].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions[currentQ].starterCode && (
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-green-400 border border-green-500/20">
                      <pre className="whitespace-pre-wrap">{questions[currentQ].starterCode}</pre>
                    </div>
                  )}

                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-[180px] bg-background/50 text-base"
                    disabled={isEvaluating}
                  />

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={() => setShowHints(!showHints)}
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showHints ? "Hide Hints" : "Show Hints"}
                    </Button>
                    <Button
                      onClick={submitAnswer}
                      disabled={!answer.trim() || isEvaluating}
                    >
                      {isEvaluating ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" /> Submit Answer</>
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showHints && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                          {questions[currentQ].hints.map((hint, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-yellow-300/80">
                              <Lightbulb className="w-3 h-3 mt-1 shrink-0" />
                              <span>{hint}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Result State */}
          {phase === "result" && evaluation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="bg-card/30 backdrop-blur border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <CardTitle>AI Evaluation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{evaluation}</ReactMarkdown>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={nextQuestion}>
                      {currentQ < questions.length - 1 ? (
                        <>Next Question <ChevronRight className="w-4 h-4 ml-2" /></>
                      ) : (
                        <>Finish Interview <CheckCircle2 className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
