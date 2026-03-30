"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ClipboardList, Plus, ArrowLeft, Calendar, Tag,
  X, Loader2, GripVertical
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLUMNS = [
  { key: "todo", label: "To Do", color: "border-amber-500/30 bg-amber-500/5", dot: "bg-amber-500" },
  { key: "in-progress", label: "In Progress", color: "border-blue-500/30 bg-blue-500/5", dot: "bg-blue-500" },
  { key: "done", label: "Done", color: "border-green-500/30 bg-green-500/5", dot: "bg-green-500" },
]

export default function TaskBoardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", description: "", taskType: "coding", dueDate: "" })

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth")
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) loadTasks()
  }, [user])

  const loadTasks = () => {
    if (!user) return
    fetch(`/api/teacher/tasks?teacherId=${user.id}`)
      .then(r => r.json())
      .then(d => d.success && setTasks(d.tasks || []))
      .catch(() => {})
  }

  const createTask = async () => {
    if (!newTask.title.trim() || !user) return
    setCreating(true)
    try {
      await fetch("/api/teacher/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: user.id, ...newTask }),
      })
      setNewTask({ title: "", description: "", taskType: "coding", dueDate: "" })
      setShowCreate(false)
      loadTasks()
    } catch (e) {}
    setCreating(false)
  }

  const moveTask = async (taskId: string, newStatus: string) => {
    await fetch("/api/teacher/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, updates: { status: newStatus } }),
    })
    loadTasks()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
          <Link href="/teacher"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-emerald-400" /> Task Board
          </h1>
          <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-emerald-600 to-teal-600">
            <Plus className="h-4 w-4 mr-2" /> Create Task
          </Button>
        </div>

        {/* Create Task Modal */}
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-lg mx-4 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>New Task</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCreate(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input
                    placeholder="e.g. Implement Binary Search"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Textarea
                    placeholder="Task details..."
                    value={newTask.description}
                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <select
                      value={newTask.taskType}
                      onChange={e => setNewTask({ ...newTask, taskType: e.target.value })}
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                    >
                      <option value="coding">Coding</option>
                      <option value="reading">Reading</option>
                      <option value="project">Project</option>
                      <option value="quiz">Quiz</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Due Date</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={createTask} disabled={creating} className="w-full">
                  {creating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : "Create Task"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.key)
            return (
              <div key={col.key} className={`rounded-2xl border p-4 min-h-[400px] ${col.color}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {col.label} ({colTasks.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {colTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-xl border border-border/30 p-4 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              <Tag className="h-2.5 w-2.5" /> {task.task_type}
                            </span>
                            {task.due_date && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-2.5 w-2.5" /> {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {/* Move buttons */}
                          <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {COLUMNS.filter(c => c.key !== col.key).map(dest => (
                              <button
                                key={dest.key}
                                onClick={() => moveTask(task.id, dest.key)}
                                className="text-[10px] px-2 py-0.5 rounded bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
                              >
                                → {dest.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
