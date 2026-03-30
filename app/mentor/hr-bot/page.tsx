"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Briefcase, Loader2, TrendingUp, AlertTriangle,
  CheckCircle, FileText, X, MapPin, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"

export default function HRBotPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [generatingCL, setGeneratingCL] = useState<string | null>(null)

  const fetchMatches = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch("/api/mentor/hr-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "match" }),
      })
      const data = await res.json()
      if (data.success) setJobs(data.jobs)
    } catch {}
    setLoading(false)
  }

  const generateCoverLetter = async (jobId: string) => {
    if (!user) return
    setGeneratingCL(jobId)
    setCoverLetter(null)
    try {
      const res = await fetch("/api/mentor/hr-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "cover-letter", jobId }),
      })
      const data = await res.json()
      if (data.success) setCoverLetter(data.coverLetter)
    } catch {}
    setGeneratingCL(null)
  }

  useEffect(() => {
    if (user) fetchMatches()
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black">AI Career Match</h1>
            <p className="text-muted-foreground">AI-powered job matching based on your skills & goals</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Analyzing job matches with AI...</span>
          </div>
        ) : (
          <div className="space-y-4 mt-8">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/40 hover:border-primary/20 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Match Score */}
                      <div className="lg:w-24 flex lg:flex-col items-center lg:items-center gap-2">
                        <div className={`text-3xl font-black ${
                          (job.match?.matchPercent || 0) >= 70 ? "text-green-400" :
                          (job.match?.matchPercent || 0) >= 40 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {job.match?.matchPercent || 0}%
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Match</span>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="font-medium text-foreground">{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.postedAt}</span>
                        </div>

                        {/* Skills Analysis */}
                        <div className="flex flex-wrap gap-3 mb-3">
                          {job.match?.matchedSkills?.map((s: string) => (
                            <span key={s} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                              <CheckCircle className="h-2.5 w-2.5" /> {s}
                            </span>
                          ))}
                          {job.match?.missingSkills?.map((s: string) => (
                            <span key={s} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                              <AlertTriangle className="h-2.5 w-2.5" /> {s}
                            </span>
                          ))}
                        </div>

                        {job.match?.recommendation && (
                          <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/30">
                            <TrendingUp className="h-3 w-3 inline mr-1 text-primary" />
                            {job.match.recommendation}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateCoverLetter(job.id)}
                            disabled={generatingCL === job.id}
                          >
                            {generatingCL === job.id ? (
                              <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Generating...</>
                            ) : (
                              <><FileText className="h-3 w-3 mr-1.5" /> Generate Cover Letter</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cover Letter Modal */}
        <AnimatePresence>
          {coverLetter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> AI Cover Letter
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setCoverLetter(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{coverLetter}</ReactMarkdown>
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
