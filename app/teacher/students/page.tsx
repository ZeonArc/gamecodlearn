"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, ArrowLeft, TrendingUp, Search, Brain } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeacherStudentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [students, setStudents] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth")
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetch(`/api/teacher/students?classCode=`)
        .then(r => r.json())
        .then(d => d.success && setStudents(d.students || []))
        .catch(() => {})
    }
  }, [user])

  const filtered = students.filter(s =>
    (s.career_goal || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.academic_background || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.skills || []).join(",").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
          <Link href="/teacher"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" /> Student Monitor
            </h1>
            <p className="text-muted-foreground mt-1">{students.length} students enrolled</p>
          </div>
          <div className="relative w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-card/50"
            />
          </div>
        </div>

        {/* Student Table */}
        <Card className="bg-card/30 backdrop-blur border-border/40">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Goal</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                    <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Score</th>
                    <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-12 text-muted-foreground">
                        {students.length === 0 ? "No students enrolled yet. Students will appear here after they complete onboarding." : "No students match your search."}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s: any) => (
                      <tr key={s.user_id} className="border-b border-border/20 hover:bg-card/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {(s.academic_background || "S")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{s.academic_background || "Student"}</p>
                              <p className="text-xs text-muted-foreground">{s.github_username ? `@${s.github_username}` : "No GitHub"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {(s.skills || []).slice(0, 3).map((skill: string) => (
                              <span key={skill} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{skill}</span>
                            ))}
                            {(s.skills || []).length > 3 && (
                              <span className="text-xs text-muted-foreground">+{s.skills.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm">{s.career_goal || "—"}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                                style={{ width: `${s.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono">{s.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-sm font-bold ${
                            (s.predictiveScore || 0) >= 70 ? "text-green-400" :
                            (s.predictiveScore || 0) >= 40 ? "text-amber-400" : "text-red-400"
                          }`}>
                            <Brain className="h-3 w-3" /> {s.predictiveScore || 0}%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button asChild variant="ghost" size="sm" className="text-xs">
                            <Link href={`/teacher/students/${s.user_id}`}>View Details</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
