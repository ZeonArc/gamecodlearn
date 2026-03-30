"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Building2, MapPin, Briefcase, Clock, Sparkles, BookOpen, ExternalLink, Code2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string

  const [job, setJob] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  // Fetch local mock job data
  useEffect(() => {
     import("@/lib/linkedin/client").then(module => {
         module.getMockJobById(jobId).then(data => {
             setJob(data)
             setLoadingJob(false)
         })
     })
  }, [jobId])

  const handleAnalyze = async () => {
      if (!job) return
      setLoadingAnalysis(true)
      
      try {
          const res = await fetch('/api/jobs/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ jobData: job })
          })
          const data = await res.json()
          if (data.success) {
              setAnalysis(data.analysis)
          }
      } catch (e) {
          console.error("Failed to analyze", e)
      } finally {
          setLoadingAnalysis(false)
      }
  }

  if (loadingJob) return <div className="min-h-screen pt-20 text-center animate-pulse">Loading job posting...</div>
  if (!job) return <div className="min-h-screen pt-20 text-center text-red-500">Job not found.</div>

  return (
      <div className="min-h-screen bg-background text-foreground pb-32">
          {/* Header */}
          <div className="border-b border-border/40 bg-card/10 backdrop-blur-sm sticky top-16 z-30">
              <div className="container mx-auto px-4 py-4">
                  <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
                  </Link>
              </div>
          </div>

          <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Job Details Panel */}
              <div className="lg:col-span-2 space-y-6">
                  <div className="bg-card border border-border/50 rounded-3xl p-8 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                      
                      <div className="relative z-10">
                          <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground mb-8">
                              <span className="flex items-center gap-2 font-medium text-foreground"><Building2 className="h-4 w-4 text-primary" /> {job.company}</span>
                              <span className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" /> {job.location}</span>
                              <span className="flex items-center gap-2 text-sm"><Briefcase className="h-4 w-4" /> {job.type}</span>
                              <span className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4" /> {job.postedAt}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border/50">
                              {job.tags.map((tag: string) => (
                                  <span key={tag} className="px-3 py-1.5 bg-secondary/50 text-secondary-foreground rounded-lg text-xs font-semibold uppercase tracking-wider border border-border/50">
                                      {tag}
                                  </span>
                              ))}
                          </div>

                          <div className="prose prose-sm dark:prose-invert max-w-none">
                              <div className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                                  {job.description}
                              </div>
                          </div>
                          
                          <div className="mt-12 flex items-center gap-4">
                              <Button className="w-full sm:w-auto min-w-[150px]" size="lg" disabled>Apply Now</Button>
                              <Button variant="outline" size="lg" className="w-full sm:w-auto" disabled>Save</Button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* AI Analyzer Panel */}
              <div className="lg:col-span-1">
                  <div className="sticky top-32 space-y-6">
                      <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                              <Sparkles className="h-24 w-24 text-indigo-500" />
                          </div>

                          <div className="relative z-10 flex flex-col h-full">
                              <div className="flex flex-col mb-6">
                                  <div className="h-12 w-12 bg-indigo-500/20 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/30">
                                      <Sparkles className="h-6 w-6" />
                                  </div>
                                  <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                      AI Skill Matcher
                                  </h2>
                                  <p className="text-xs text-muted-foreground mt-1">
                                      Run our career mentor AI to extract requirements and get personalized learning paths.
                                  </p>
                              </div>

                              {!analysis && !loadingAnalysis && (
                                  <Button onClick={handleAnalyze} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20">
                                      <Sparkles className="h-4 w-4 mr-2" /> Analyze Role Requirements
                                  </Button>
                              )}

                              {loadingAnalysis && (
                                  <div className="space-y-4">
                                      <div className="flex items-center gap-3 text-sm text-indigo-400 font-medium">
                                          <div className="h-4 w-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                          Extracting core concepts...
                                      </div>
                                      <div className="space-y-2">
                                          <div className="h-2 w-full bg-indigo-500/10 rounded-full animate-pulse" />
                                          <div className="h-2 w-4/5 bg-indigo-500/10 rounded-full animate-pulse" />
                                      </div>
                                  </div>
                              )}

                              {analysis && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                  >
                                      <div>
                                          <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">Analysis</h3>
                                          <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                                      </div>

                                      <div>
                                          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">Required Skills</h3>
                                          <div className="flex flex-wrap gap-2">
                                              {analysis.requiredSkills.map((req:string, i:number) => (
                                                  <span key={i} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 rounded-md">
                                                      {req}
                                                  </span>
                                              ))}
                                          </div>
                                      </div>

                                      <div className="pt-4 border-t border-indigo-500/20">
                                          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                              <Code2 className="h-4 w-4 text-green-500" /> Platform Practice
                                          </h3>
                                          <ul className="space-y-2">
                                              {analysis.platformExercises.map((ex:string, i:number) => (
                                                  <li key={i} className="text-sm text-muted-foreground flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors border border-transparent hover:border-white/10">
                                                      <span>{ex}</span>
                                                      <ArrowLeft className="h-3 w-3 rotate-180 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  </motion.div>
                              )}
                          </div>
                      </div>

                      {/* Coursera Recommendations block below Analysis if it exists */}
                      <AnimatePresence>
                          {analysis && (
                              <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="border border-blue-500/20 bg-blue-500/5 rounded-3xl overflow-hidden"
                              >
                                  <div className="bg-blue-500/10 px-5 py-4 border-b border-blue-500/20 flex items-center gap-2">
                                      <BookOpen className="h-5 w-5 text-blue-400" />
                                      <span className="text-sm font-bold text-blue-400">Bridge the Gap on Coursera</span>
                                  </div>
                                  <div className="p-5 space-y-4">
                                      <p className="text-xs text-muted-foreground mb-2">Based on the skills required, here are curated courses to get you ready:</p>
                                      {analysis.recommendedCourses && analysis.recommendedCourses.length > 0 ? (
                                          analysis.recommendedCourses.map((c: any, i: number) => (
                                              <a key={i} href={`https://www.coursera.org/learn/${c.slug}`} target="_blank" rel="noreferrer" className="block group">
                                                  <div className="p-3 bg-background/50 rounded-xl hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all">
                                                      <h4 className="text-sm font-bold text-foreground group-hover:text-blue-400 transition-colors line-clamp-2">{c.name}</h4>
                                                      <span className="text-xs text-blue-400 mt-2 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                          Go to Course <ExternalLink className="h-3 w-3" />
                                                      </span>
                                                  </div>
                                              </a>
                                          ))
                                      ) : (
                                          <div className="text-xs text-muted-foreground">No specific courses found for this role at the moment.</div>
                                      )}
                                  </div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </div>
              </div>
          </div>
      </div>
  )
}
