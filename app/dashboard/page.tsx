"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Flame, Trophy, Target, Zap, BookOpen, ArrowRight, Activity, Code, Cpu, Layers, UserCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getMockUserStats } from "@/lib/gamification"
import { createClient } from "@/lib/supabase/client"
import { RoadmapDAG, RoadmapNode } from "@/components/mentor/roadmap-dag"

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

      // 1. Check if user completed onboarding
      const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()
      
      setHasProfile(!!profile)

      if (profile) {
          // 2. Fetch Roadmap
          const { data: roadmap } = await supabase
              .from('career_roadmaps')
              .select('dag_data')
              .eq('user_id', user.id)
              .single()
          
          if (roadmap && Array.isArray(roadmap.dag_data)) {
              setRoadmapData(roadmap.dag_data as RoadmapNode[])
          }
      }
      setIsRoadmapLoading(false)
  }

  const handleNodeComplete = async (nodeId: string) => {
      // 1. Optimistic UI update
      const updatedNodes = roadmapData.map(node => {
          if (node.id === nodeId) return { ...node, status: 'completed' as const }
          return node
      })
      setRoadmapData(updatedNodes)

      // 2. The Dynamic Feedback Loop:
      // In a real app, unlocking nodes based on dependencies happens here.
      // Additionally, we might trigger a re-generation if a major milestone is hit.
      
      const newNodes = updatedNodes.map(node => {
          if (node.status === 'locked') {
              // Check if all dependencies are now completed
              const canUnlock = node.depends_on.every(depId => {
                  const dep = updatedNodes.find(n => n.id === depId)
                  return dep?.status === 'completed'
              })
              if (canUnlock) return { ...node, status: 'available' as const }
          }
          return node
      })

      setRoadmapData(newNodes)

      // 3. Save to DB
      if (user) {
          await supabase
            .from('career_roadmaps')
            .update({ dag_data: newNodes })
            .eq('user_id', user.id)
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
           <h1 className="text-4xl font-black tracking-tighter uppercase glitch-text">
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
            { label: "Global Rank", value: `#${stats.rank}`, icon: Trophy, color: "text-blue-500", border: "border-blue-500/50" },
            { label: "Problems Solved", value: stats.problemsSolved, icon: Target, color: "text-green-500", border: "border-green-500/50" },
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

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-12 lg:grid-rows-2">
         
         {/* Activity Map (Large) */}
         <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-8 lg:row-span-2"
         >
             <Card className="h-full bg-card/20 backdrop-blur border-border/50">
                 <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                         <Activity className="h-5 w-5 text-primary" />
                         Activity Log
                     </CardTitle>
                 </CardHeader>
                 <CardContent>
                     {/* Mock Contribution Graph */}
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

         {/* Active Quest */}
         <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-4"
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

         {/* AI Career Mentor Roadmap */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="md:col-span-12"
         >
             <Card className="bg-card/20 backdrop-blur border-border/50 overflow-hidden">
                 <CardHeader className="flex flex-row justify-between items-center">
                     <div>
                        <CardTitle className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-accent" />
                            AI Career Roadmap
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Personalized DAG generating from your background.</p>
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
                             You haven't setup your AI Mentor profile yet.
                         </div>
                     )}
                 </CardContent>
             </Card>
         </motion.div>
      </div>

       <div className="grid md:grid-cols-3 gap-6">
            {/* System Metrics (Decorative) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="col-span-3 p-4 rounded-lg border border-border/30 bg-black/40 font-mono text-xs text-muted-foreground flex justify-between items-center"
            >
                <div className="flex gap-8">
                    <span>CPU: <span className="text-green-500">12%</span></span>
                    <span>MEM: <span className="text-green-500">432MB</span></span>
                    <span>NET: <span className="text-green-500">1.2GB/s</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    SYSTEM OPTIMAL
                </div>
            </motion.div>
       </div>
    </div>
  )
}
