"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Trophy, Target } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProblemCard } from "@/components/problems/problem-card"

// Mock Data
const problems = [
  { id: "two-sum", title: "Two Sum", difficulty: "Easy", acceptance: "48.2%", tags: ["Array", "Hash Table"], xp: 50, isSolved: true, type: "code" },
  { id: "add-two-numbers", title: "Add Two Numbers", difficulty: "Medium", acceptance: "39.1%", tags: ["Linked List", "Math"], xp: 100, isSolved: false, type: "code" },
  { id: "visualize-heap", title: "Visualize Max Heap Construction", difficulty: "Easy", acceptance: "90%", tags: ["Heap", "Visual"], xp: 30, isSolved: false, type: "visual" },
  { id: "bug-hunt-loops", title: "Bug Hunt: Infinite Loops", difficulty: "Easy", acceptance: "85%", tags: ["Debugging", "Loops"], xp: 20, isSolved: false, type: "arcade" },
  { id: "construct-reverse", title: "Logic Builder: String Reverse", difficulty: "Easy", acceptance: "95%", tags: ["Logic", "Strings"], xp: 25, isSolved: false, type: "arcade" },
  { id: "longest-palindromic-substring", title: "Longest Palindromic Substring", difficulty: "Medium", acceptance: "31.5%", tags: ["String", "DP"], xp: 120, isSolved: false, type: "code" },
  { id: "memory-stack-trace", title: "Trace the Stack Memory", difficulty: "Medium", acceptance: "75%", tags: ["Memory", "Visual"], xp: 80, isSolved: false, type: "visual" },
] as const

export default function ProblemsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "code" | "visual" | "arcade">("all")
  
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchesTab = activeTab === "all" || p.type === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="container py-10 space-y-8 min-h-screen relative overflow-hidden">
       {/* Ambient Background */}
       {/* (Managed by Global Layout LiveBackground) */}

       {/* Header */}
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
              <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">Problem Set</h1>
              <p className="text-muted-foreground flex items-center gap-4 text-sm md:text-base">
                  <span className="flex items-center gap-1"><Trophy className="h-4 w-4 text-yellow-500" /> Rank: #14,203</span>
              </p>
          </motion.div>
          
          <div className="flex bg-muted/50 p-1 rounded-lg">
             <button onClick={() => setActiveTab("all")} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "all" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>All</button>
             <button onClick={() => setActiveTab("code")} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "code" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Coding</button>
             <button onClick={() => setActiveTab("visual")} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "visual" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Visual</button>
             <button onClick={() => setActiveTab("arcade")} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "arcade" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Arcade</button>
          </div>
       </div>

       {/* Search Bar */}
       <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search challenges..." 
                className="pl-9 bg-background/50 backdrop-blur border-primary/20 focus:border-primary/50 h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
       </div>

       {/* Problem List */}
       <div className="grid gap-4">
          {filteredProblems.map((problem, i) => (
             // @ts-ignore - Valid prop usage, TS might complain about 'type' if interface not updated yet
             <ProblemCard key={problem.id} {...problem} index={i} isVisual={problem.type === "visual"} />
          ))}
       </div>
    </div>
  )
}
