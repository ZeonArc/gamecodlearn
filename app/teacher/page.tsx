"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Users, ClipboardList, TrendingUp, Brain, Plus,
  ArrowRight, Activity, GraduationCap, BarChart3
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentPerformanceChart } from "@/components/charts/dashboard-charts"

export default function TeacherDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth")
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetch(`/api/teacher/students?classCode=`)
        .then(r => r.json())
        .then(d => d.success && setStudents(d.students || []))
        .catch(() => {})
      fetch(`/api/teacher/tasks?teacherId=${user.id}`)
        .then(r => r.json())
        .then(d => d.success && setTasks(d.tasks || []))
        .catch(() => {})
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const todoTasks = tasks.filter(t => t.status === "todo")
  const inProgressTasks = tasks.filter(t => t.status === "in-progress")
  const doneTasks = tasks.filter(t => t.status === "done")
  const avgProgress = students.length
    ? Math.round(students.reduce((a, s) => a + (s.progress || 0), 0) / students.length)
    : 0

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Active Tasks", value: tasks.length, icon: ClipboardList, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { label: "Avg Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-green-400 bg-green-500/10 border-green-500/20" },
    { label: "Assessments", value: "4 Types", icon: Brain, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-emerald-400 mb-2">
            <GraduationCap className="h-4 w-4" />
            TEACHER PANEL
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black tracking-tight">Faculty Dashboard</h1>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="border-primary/30">
                <Link href="/teacher/students">
                  <Users className="h-4 w-4 mr-2" /> View Students
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">
                <Link href="/teacher/tasks">
                  <ClipboardList className="h-4 w-4 mr-2" /> Task Board
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border ${stat.color.split(" ").slice(2).join(" ")} bg-card/50 backdrop-blur`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color.split(" ").slice(1, 3).join(" ")}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color.split(" ")[0]}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-black">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link href="/teacher/tasks" className="group">
            <Card className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Create Task</h3>
                  <p className="text-sm text-muted-foreground">Assign work to students</p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-emerald-400 transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/mentor/assessment" className="group">
            <Card className="bg-gradient-to-br from-purple-950/50 to-violet-950/50 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Assessments</h3>
                  <p className="text-sm text-muted-foreground">Generate MCQ, Coding, Viva</p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-purple-400 transition-colors" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/mentor/github" className="group">
            <Card className="bg-gradient-to-br from-slate-950/50 to-zinc-950/50 border-slate-500/20 hover:border-slate-500/40 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-500/20 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Code Analysis</h3>
                  <p className="text-sm text-muted-foreground">Review student GitHub repos</p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-slate-300 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Task Board Preview */}
        <Card className="border-border/40 bg-card/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Task Board Overview
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/teacher/tasks">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "To Do", items: todoTasks, color: "border-amber-500/30 bg-amber-500/5" },
                { title: "In Progress", items: inProgressTasks, color: "border-blue-500/30 bg-blue-500/5" },
                { title: "Done", items: doneTasks, color: "border-green-500/30 bg-green-500/5" },
              ].map(col => (
                <div key={col.title} className={`rounded-xl border p-4 min-h-[200px] ${col.color}`}>
                  <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-muted-foreground">
                    {col.title} ({col.items.length})
                  </h4>
                  {col.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground/50 text-center mt-8">No tasks</p>
                  ) : (
                    <div className="space-y-2">
                      {col.items.slice(0, 3).map((task: any) => (
                        <div key={task.id} className="bg-card/80 rounded-lg p-3 border border-border/30">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{task.task_type}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" /> Student Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StudentPerformanceChart />
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-card/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" /> n8n Orchestration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { workflow: "Task Assignment Notifier", status: "active", color: "bg-green-500" },
                { workflow: "Weekly Progress Report", status: "scheduled", color: "bg-blue-500" },
                { workflow: "Skill Decay Monitor", status: "active", color: "bg-green-500" },
                { workflow: "Course Enrichment Pipeline", status: "idle", color: "bg-amber-500" },
              ].map((w) => (
                <div key={w.workflow} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/30">
                  <span className="text-sm font-medium">{w.workflow}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${w.color} ${w.status === 'active' ? 'animate-pulse' : ''}`} />
                    <span className="text-xs text-muted-foreground capitalize">{w.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Students */}
        {students.length > 0 && (
          <Card className="border-border/40 bg-card/30 backdrop-blur mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" /> Recent Students
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/teacher/students">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.slice(0, 6).map((s: any) => (
                  <div key={s.user_id} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-card/50 hover:border-primary/30 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {(s.academic_background || "S")?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.career_goal || "Student"}</p>
                      <p className="text-xs text-muted-foreground">{s.progress || 0}% progress</p>
                    </div>
                    <div className="text-xs font-bold text-primary">{s.predictiveScore || 0}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
