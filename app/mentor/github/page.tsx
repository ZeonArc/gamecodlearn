"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Github, Search, Star, GitFork, ArrowLeft, ExternalLink,
  Loader2, Code2, BarChart3, CheckCircle, AlertTriangle, Lightbulb
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { dispatchAIPipelineEvent } from "@/components/ui/ai-activity-toast"

export default function GitHubPage() {
  const [username, setUsername] = useState("")
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  const fetchRepos = async () => {
    if (!username.trim()) return
    setLoading(true)
    setRepos([])
    setAnalysis(null)
    try {
      const res = await fetch(`/api/github/repos?username=${encodeURIComponent(username)}`)
      const data = await res.json()
      if (data.success) setRepos(data.repos)
    } catch {}
    setLoading(false)
  }

  const analyzeRepo = async (fullName: string) => {
    const [owner, repo] = fullName.split("/")
    setAnalyzing(fullName)
    setAnalysis(null)
    try {
      const res = await fetch("/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo }),
      })
      const data = await res.json()
      if (data.success) {
        setAnalysis(data.analysis)
        dispatchAIPipelineEvent("github-analysis")
      }
    } catch {}
    setAnalyzing(null)
  }

  const scoreColor = (score: number) =>
    score >= 80 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-400"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center">
            <Github className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black">GitHub Code Analyzer</h1>
            <p className="text-muted-foreground">AI-powered code review for any public repository</p>
          </div>
        </div>

        {/* Search */}
        <Card className="mt-8 bg-card/50 backdrop-blur border-border/40">
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); fetchRepos() }} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter GitHub username..."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch Repos"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Repos List */}
          <div className="space-y-3">
            {repos.map(repo => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card
                  className={`bg-card/50 border-border/40 hover:border-primary/30 transition-all cursor-pointer ${analyzing === repo.full_name ? "border-primary/50 ring-1 ring-primary/20" : ""}`}
                  onClick={() => analyzeRepo(repo.full_name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate">{repo.name}</span>
                        </h3>
                        {repo.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {repo.language && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {repo.language}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3" /> {repo.stars}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <GitFork className="h-3 w-3" /> {repo.forks}
                          </span>
                        </div>
                      </div>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </a>
                    </div>
                    {analyzing === repo.full_name && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                        <Loader2 className="h-3 w-3 animate-spin" /> Analyzing with AI...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {repos.length === 0 && !loading && (
              <div className="text-center py-20 text-muted-foreground">
                <Github className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Enter a GitHub username to fetch repositories</p>
              </div>
            )}
          </div>

          {/* Analysis Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="bg-card/50 backdrop-blur border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" /> AI Code Review
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className={`text-5xl font-black ${scoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {(analysis.techStack || []).map((t: string) => (
                            <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{t}</span>
                          ))}
                        </div>
                      </div>

                      {/* Category Scores */}
                      {[
                        { label: "Code Quality", data: analysis.codeQuality },
                        { label: "Architecture", data: analysis.architecture },
                        { label: "Best Practices", data: analysis.bestPractices },
                      ].map(cat => cat.data && (
                        <div key={cat.label}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{cat.label}</span>
                            <span className={`text-sm font-bold ${scoreColor(cat.data.score)}`}>{cat.data.score}%</span>
                          </div>
                          <Progress value={cat.data.score} className="h-2 bg-muted" />
                        </div>
                      ))}

                      {/* Improvements */}
                      {analysis.improvements && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                            <Lightbulb className="h-4 w-4 text-amber-400" /> Improvements
                          </h4>
                          <div className="space-y-2">
                            {analysis.improvements.map((imp: any, i: number) => (
                              <div key={i} className="text-xs p-2.5 rounded-lg bg-muted/30 border border-border/30">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    imp.priority === "high" ? "bg-red-500/20 text-red-400" :
                                    imp.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                                  }`}>{imp.priority}</span>
                                </div>
                                <p className="font-medium">{imp.suggestion}</p>
                                <p className="text-muted-foreground mt-0.5">{imp.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <p className="text-sm text-muted-foreground italic border-t border-border/30 pt-4">
                        {analysis.summary}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-muted-foreground"
                >
                  <BarChart3 className="h-12 w-12 mb-4 opacity-20" />
                  <p>Click a repo to analyze it with AI</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
