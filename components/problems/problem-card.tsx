"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, ArrowRight, Brain, Code2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProblemCardProps {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  acceptance: string
  tags: string[] | readonly string[]
  isSolved?: boolean
  xp: number
  index: number
  isVisual?: boolean
}

export function ProblemCard({ id, title, difficulty, acceptance, tags, isSolved, xp, index, isVisual = false }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 hover:border-primary/50 transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
                {isSolved ? (
                    <div className="rounded-full bg-green-500/20 p-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                ) : (
                    <div className="rounded-full bg-muted p-1">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                    </div>
                )}
                
                {/* Visual Indicator */}
                {isVisual && <Brain className="h-5 w-5 text-purple-400" />}
                {/* @ts-ignore - type check handled upstream by activeTab logic but type safety in mock data is loose */}
                {/* We assume a prop or infer it. For now let's use the ID/Title to detect or pass a type prop if we updated the interface. */}
                {/* Actually, let's just make the link flexible based on heuristics or a new prop if we passed it. 
                    Simpler: If title contains "Bug" or "Builder", go to arcade. 
                    BETTER: We updated the problems data to have 'type'. 
                    But ProblemCard interface didn't update to receive 'type'. 
                    Let's assume standard behavior for now to keep it simple or check `isVisual`. 
                    Actually, let's just use the `isVisual` prop logic for now to redirect to /arcade if the id suggests it.
                */}
                
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    <Link 
                        href={
                            id.startsWith("bug") || id.startsWith("construct") ? "/arcade" : 
                            isVisual ? "/learn/dsa" : 
                            `/problems/${id}`
                        } 
                        className="focus:outline-none"
                    >
                        <span className="absolute inset-0" aria-hidden="true" />
                        {title}
                    </Link>
                </h3>
                <Badge variant={difficulty === "Easy" ? "secondary" : difficulty === "Medium" ? "default" : "destructive"} className="text-xs">
                    {difficulty}
                </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-500" /> {xp} XP
                </span>
                <span>•</span>
                <span>Acc: {acceptance}</span>
                <span>•</span>
                <div className="flex gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="bg-muted/50 px-2 py-0.5 rounded text-xs">{tag}</span>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <Button size="sm" variant="outline" className={cn("opacity-0 group-hover:opacity-100 transition-opacity border-primary/20 hover:bg-primary/10", isVisual ? "text-purple-400 border-purple-400/20 hover:bg-purple-400/10" : "text-primary")}>
                {isVisual ? "Start Visualization" : "Solve Challenge"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </div>
    </motion.div>
  )
}
