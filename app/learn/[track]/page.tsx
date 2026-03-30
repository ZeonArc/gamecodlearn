"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Star, Trophy, Lock } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Mock Data (will be replaced by Supabase fetch)
const TRACK_DATA = {
  school: {
    title: "School Zone 🚀",
    description: "Start your adventure! Build games and learn how computers think.",
    courses: [
      { id: "scratch-basics", title: "Code with Blocks", desc: "Drag, drop, and play!", icon: "🧩", locked: false },
      { id: "python-kids", title: "Python for Kids", desc: "Write real code.", icon: "🐍", locked: false },
      { id: "web-fun", title: "Make a Website", desc: "HTML & CSS fun.", icon: "🌐", locked: true },
    ],
    theme: "from-yellow-400 to-orange-500",
  },
  college: {
    title: "College & CS 🎓",
    description: "Ace your exams and master the fundamentals of Computer Science.",
    courses: [
      { id: "dsa", title: "Data Structures", desc: "Arrays, Trees, Graphs.", icon: "🌳", locked: false },
      { id: "web-dev", title: "Full Stack Web", desc: "React, Node, DBs.", icon: "💻", locked: false },
      { id: "os", title: "Operating Systems", desc: "Processes & Threads.", icon: "⚙️", locked: true },
    ],
    theme: "from-blue-400 to-cyan-500",
  },
  pro: {
    title: "Professional 💼",
    description: "Advance your career with high-level architectural patterns.",
    courses: [
      { id: "system-design", title: "System Design", desc: "Scale to millions.", icon: "🏗️", locked: false },
      { id: "microservices", title: "Microservices", desc: "Event-driven arch.", icon: "🔌", locked: true },
      { id: "devops", title: "DevOps Mastery", desc: "CI/CD & Kubernetes.", icon: "🚢", locked: true },
    ],
    theme: "from-purple-400 to-pink-500",
  },
}

export default function TrackPage() {
  const params = useParams()
  const trackId = params.track as keyof typeof TRACK_DATA
  const data = TRACK_DATA[trackId]

  if (!data) return <div className="p-20 text-center">Track not found</div>

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
       {/* Ambient Backlight */}
       <div className={cn("absolute top-0 left-0 w-full h-96 bg-gradient-to-b opacity-20 pointer-events-none", data.theme)} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link href="/learn" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
        </Link>

        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {data.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400"
          >
            {data.description}
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Link href={course.locked ? "#" : `/learn/course/${course.id}`} className={cn("block group h-full", course.locked && "cursor-not-allowed opacity-60")}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                  {course.locked && (
                    <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  
                  <div className="text-4xl mb-4">{course.icon}</div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 flex-1">
                    {course.desc}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center text-xs text-slate-500">
                      <BookOpen className="w-3 h-3 mr-1" /> Core Platform
                    </div>
                    {course.locked ? (
                      <span className="text-xs font-mono uppercase text-slate-600">Locked</span>
                    ) : (
                      <span className="text-xs font-mono uppercase text-green-400 group-hover:underline">Start &rarr;</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* AI recommended Coursera Section */}
        <div className="mt-20 border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              AI Recommended External Courses
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20 font-mono">COURSERA INTEGRATION</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CourseraRecommendations trackId={trackId} />
            </div>
        </div>
      </div>
    </div>
  )
}

function CourseraRecommendations({ trackId }: { trackId: string }) {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = "programming"
    if (trackId === "school") query = "html css javascript basic"
    if (trackId === "college") query = "data structures algorithms"
    if (trackId === "pro") query = "system design architecture"

    fetch(`/api/coursera?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.courses) setCourses(data.courses)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [trackId])

  if (loading) {
     return [1,2,3].map(i => (
        <div key={i} className="animate-pulse bg-white/5 border border-white/10 rounded-2xl h-48"></div>
     ))
  }

  if (courses.length === 0) {
      return <div className="text-slate-500 col-span-full">No external recommendations found at this time.</div>
  }

  return courses.map((c, i) => (
       <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
       >
            <a href={`https://www.coursera.org/learn/${c.slug}`} target="_blank" rel="noreferrer" className="block group h-full">
                <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl p-6 h-full flex flex-col hover:border-blue-500/50 transition-all duration-300">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 line-clamp-2">{c.name}</h3>
                    <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{c.description || "Learn from top universities and companies on Coursera."}</p>
                    <div className="mt-auto pt-4 border-t border-blue-500/20 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>External Link</span>
                        <span className="text-blue-400 group-hover:underline">View on Coursera &rarr;</span>
                    </div>
                </div>
            </a>
       </motion.div>
  ))
}
