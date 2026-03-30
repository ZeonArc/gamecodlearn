"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Flame, Trophy, Target, Zap, Activity, UserCircle, ArrowRight, Brain, FileText, Sparkles, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getMockUserStats } from "@/lib/gamification"
import { createClient } from "@/lib/supabase/client"
import { RoadmapDAG, RoadmapNode } from "@/components/mentor/roadmap-dag"
import { PredictiveScore } from "@/components/mentor/predictive-score"
import { ProjectSynthesis } from "@/components/mentor/project-synthesis"
import { ProgressOverTimeChart, SkillRadarChart } from "@/components/charts/dashboard-charts"
import { dispatchAIPipelineEvent } from "@/components/ui/ai-activity-toast"

const supabase = createClient()

/* Mock Heatmap Data */
const activityData = Array.from({ length: 52 * 7 }, (_, i) => ({
  date: i,
  level: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
}))

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const stats = getMockUserStats()

  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [roadmapData, setRoadmapData] = useState<RoadmapNode[]>([])
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(true)
  const [predictiveScore, setPredictiveScore] = useState(0)
  const [roadmapProgress, setRoadmapProgress] = useState(0)
  const [synthesizedProject, setSynthesizedProject] = useState<any>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/auth")
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (user) {
      checkProfileAndRoadmap()
    }
  }, [user])

  const checkProfileAndRoadmap = async () => {
    if (!user) return
    setIsRoadmapLoading(true)

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    setHasProfile(!!profile)

    if (profile) {
      const { data: roadmap } = await supabase
        .from('career_roadmaps')
        .select('dag_data, predictive_score, progress_percent')
        .eq('user_id', user.id)
        .single()

      if (roadmap && Array.isArray(roadmap.dag_data)) {
        setRoadmapData(roadmap.dag_data as RoadmapNode[])
        setPredictiveScore(roadmap.predictive_score || 0)
        setRoadmapProgress(roadmap.progress_percent || 0)
      }
    }
    setIsRoadmapLoading(false)
  }

  const handleNodeComplete = async (nodeId: string) => {
    if (!user) return

    // Call the dynamic feedback loop API
    try {
      const res = await fetch("/api/roadmap/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, nodeId })
      })
      const data = await res.json()

      if (data.success) {
        setRoadmapData(data.updatedNodes)
        setRoadmapProgress(data.progress)
        setPredictiveScore(data.predictiveScore)
        dispatchAIPipelineEvent("onboarding-pipeline")

        // If a project was synthesized at a milestone, show it
        if (data.synthesizedProject) {
          setSynthesizedProject(data.synthesizedProject)
        }
      }
    } catch (e) {
      console.error("Feedback loop error:", e)
      // Fallback: local-only update
      const updatedNodes = roadmapData.map(node => {
        if (node.id === nodeId) return { ...node, status: 'completed' as const }
        return node
      })
      const newNodes = updatedNodes.map(node => {
        if (node.status === 'locked') {
          const canUnlock = node.depends_on.every(depId => {
            const dep = updatedNodes.find(n => n.id === depId)
            return dep?.status === 'completed'
          })
          if (canUnlock) return { ...node, status: 'available' as const }
        }
        return node
      })
      setRoadmapData(newNodes)
    }
  }

  if (isAuthLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center font-mono text-primary animate-pulse">Initializing Dashboard...</div>
  }

  return (
    <div className="container py-10 space-y-8 relative min-h-screen">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/40 pb-6"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ONLINE // {user.email}
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Command Center
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Activity className="mr-2 h-4 w-4" /> System Status
          </Button>
          <Button className="bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <Zap className="mr-2 h-4 w-4" /> Quick Play
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Daily Streak", value: `${stats.streak} Days`, icon: Flame, color: "text-orange-500", border: "border-orange-500/50" },
          { label: "Total XP", value: stats.xp.toLocaleString(), icon: Zap, color: "text-yellow-500", border: "border-yellow-500/50" },
          { label: "Roadmap Progress", value: `${roadmapProgress}%`, icon: TrendingUp, color: "text-blue-500", border: "border-blue-500/50" },
          { label: "Lab Simulations", value: stats.problemsSolved, icon: Target, color: "text-green-500", border: "border-green-500/50" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`bg-card/30 backdrop-blur border-l-4 ${stat.border}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Features Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/mentor/interview">
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold">Mock Interview</h3>
                  <p className="text-xs text-muted-foreground">AI-powered practice questions</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-purple-400 transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/mentor/resume">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold">Smart Resume</h3>
                  <p className="text-xs text-muted-foreground">Auto-generate resume content</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-emerald-400 transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/mentor/assessment">
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold">AI Assessments</h3>
                  <p className="text-xs text-muted-foreground">MCQ, Coding, Viva, Concepts</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-blue-400 transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/mentor/github">
            <Card className="bg-gradient-to-br from-slate-500/10 to-zinc-500/10 border-slate-500/20 hover:border-slate-500/40 transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-bold">Project Analyzer</h3>
                  <p className="text-xs text-muted-foreground">AI review for CAD & Code</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-slate-300 transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/mentor/hr-bot">
            <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold">Career Match</h3>
                  <p className="text-xs text-muted-foreground">AI job matching & cover letters</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-rose-400 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* Activity Map + AI Roadmap (Large) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Activity Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/20 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 content-start h-[200px] md:h-auto overflow-hidden">
                  {activityData.map((d, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm transition-all hover:scale-125 hover:z-10 cursor-alias ${
                        d.level === 0 ? 'bg-muted/20' :
                        d.level === 1 ? 'bg-primary/30' :
                        d.level === 2 ? 'bg-primary/60' :
                        'bg-primary shadow-[0_0_5px_var(--primary)]'
                      }`}
                      title={`Activity Level: ${d.level}`}
                    />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm bg-muted/20"></div>
                      <div className="w-3 h-3 rounded-sm bg-primary/30"></div>
                      <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
                      <div className="w-3 h-3 rounded-sm bg-primary"></div>
                    </div>
                    <span>More</span>
                  </div>
                  <div>Last Sync: Just now</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Over Time Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card className="bg-card/20 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressOverTimeChart />
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Career Mentor Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/20 backdrop-blur border-border/50 overflow-hidden">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-accent" />
                    AI Career Roadmap (DAG)
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Personalized DAG with dynamic feedback loop. Completing nodes unlocks new paths.
                  </p>
                </div>
                {hasProfile === false && !isRoadmapLoading && (
                  <Button onClick={() => router.push('/onboarding')} className="bg-primary text-primary-foreground">
                    Build My Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {hasProfile ? (
                  <RoadmapDAG
                    nodes={roadmapData}
                    onNodeComplete={handleNodeComplete}
                    isLoading={isRoadmapLoading}
                  />
                ) : (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                    <Target className="w-12 h-12 mb-4 opacity-50" />
                    You haven&apos;t setup your AI Mentor profile yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Synthesized Project (Shows when generated) */}
          {synthesizedProject && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProjectSynthesis
                userId={user.id}
                trigger={true}
                initialProject={synthesizedProject}
                onClose={() => setSynthesizedProject(null)}
              />
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">

          {/* Predictive Score */}
          {hasProfile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PredictiveScore userId={user.id} initialScore={predictiveScore} />
            </motion.div>
          )}

          {/* Daily Quests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Target className="h-5 w-5" />
                  Daily Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🚀 School: Fix the Bug</span>
                    <span className="text-purple-400">50 XP</span>
                  </div>
                  <Progress value={0} className="h-2 bg-purple-950" indicatorColor="bg-purple-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>🎓 College: Bubble Sort Viz</span>
                    <span className="text-purple-400">100 XP</span>
                  </div>
                  <Progress value={0} className="h-2 bg-purple-950" indicatorColor="bg-blue-500" />
                </div>
                <Button className="w-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/50">
                  Claim Rewards
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skill Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Card className="bg-card/20 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Brain className="w-4 h-4 text-accent" />
                  Skill Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SkillRadarChart />
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Health */}
          {hasProfile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-card/20 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Skill Decay Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Skills decay if not practiced within 30 days. Complete challenges to refresh.
                  </p>
                  <div className="space-y-2">
                    {roadmapData
                      .filter(n => n.status === 'completed')
                      .slice(0, 4)
                      .map((node, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-xs truncate max-w-[140px]">{node.title || node.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                              <div className="h-full rounded-full bg-green-500" style={{ width: '80%' }} />
                            </div>
                            <span className="text-[10px] text-green-400 font-mono">Fresh</span>
                          </div>
                        </div>
                      ))}
                    {roadmapData.filter(n => n.status === 'completed').length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">Complete roadmap nodes to track skills</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* System Metrics Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-lg border border-border/30 bg-black/40 font-mono text-xs text-muted-foreground flex justify-between items-center"
      >
        <div className="flex gap-8">
          <span>CPU: <span className="text-green-500">12%</span></span>
          <span>MEM: <span className="text-green-500">432MB</span></span>
          <span>AI: <span className="text-green-500">Gemini 2.0</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          SYSTEM OPTIMAL // n8n CONNECTED
        </div>
      </motion.div>
    </div>
  )
}
