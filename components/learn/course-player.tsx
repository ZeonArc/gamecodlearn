"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, RefreshCw, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { CodeConstructor } from "@/components/gamification/code-constructor"
import { SortingVisualizer } from "@/components/dsa/sorting-visualizer"
import { ArrayVisualizer } from "@/components/dsa/array-visualizer"
import { ArchitectureCanvas } from "@/components/pro/architecture-canvas"

interface Lesson {
  id: string
  title: string
  type: "text" | "video" | "quiz" | "visualizer"
  content: string // JSON or Markdown
}

interface CoursePlayerProps {
  lesson: Lesson
  onComplete: () => void
  onNext: () => void
  onPrev: () => void
}

export function CoursePlayer({ lesson, onComplete, onNext, onPrev }: CoursePlayerProps) {
  const [showAiTutor, setShowAiTutor] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete()
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-black/90 relative">
        {/* Content Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onPrev}><ChevronLeft className="w-4 h-4 mr-1" /> Prev</Button>
            <Button variant="ghost" size="sm" onClick={onNext}>Next <ChevronRight className="w-4 h-4 ml-1" /></Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn("ml-4", showAiTutor && "bg-purple-500/20 text-purple-400 border-purple-500/50")}
              onClick={() => setShowAiTutor(!showAiTutor)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Tutor
            </Button>
          </div>
        </div>

        {/* Lesson Content Render */}
        <ScrollArea className="flex-1 p-8 md:p-12 max-w-4xl mx-auto w-full">
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            {lesson.type === "text" && (
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            )}
            
            {lesson.type === "video" && (
              <div className="aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center text-slate-500">
                [Video Player Placeholder for {lesson.content}]
              </div>
            )}

            {lesson.type === "visualizer" && (
              <div className="bg-slate-900/50 rounded-xl border border-white/10 p-4">
                 {lesson.content === "reverse-string-challenge" && <CodeConstructor />}
                 {lesson.content === "bubble-sort" && <SortingVisualizer />}
                 {lesson.content === "array-viz" && <ArrayVisualizer />}
                 {lesson.content === "system-design-canvas" && <ArchitectureCanvas />}
                 {/* Fallback for other visualizers */}
                 {lesson.content !== "reverse-string-challenge" && 
                  lesson.content !== "bubble-sort" && 
                  lesson.content !== "array-viz" && 
                  lesson.content !== "system-design-canvas" && (
                   <p className="text-center text-slate-500 py-10">Visualizer not found: {lesson.content}</p>
                 )}
              </div>
            )}
          </motion.div>

          {/* Completion Action */}
          <div className="mt-16 py-8 border-t border-white/5 flex justify-center">
            <Button 
              size="lg" 
              onClick={handleComplete}
              className={cn(
                "font-bold transition-all duration-300 transform hover:scale-105",
                isCompleted ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" /> Lesson Completed
                </>
              ) : (
                 "Mark as Complete"
              )}
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* AI Tutor Sidebar (Overlay) */}
      <AnimatePresence>
        {showAiTutor && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-96 border-l border-white/10 bg-black/95 backdrop-blur-xl absolute right-0 top-0 bottom-0 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-white/10 bg-purple-500/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="font-bold text-purple-400">AI Tutor</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowAiTutor(false)} className="h-6 w-6">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1 p-4 text-sm text-slate-400 flex items-center justify-center flex-col text-center">
                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                <p>Ask me anything about this lesson!</p>
                <p className="mt-2 text-xs opacity-50">I can explain concepts, quiz you, or give analogies.</p>
              </div>

              <div className="p-4 border-t border-white/10 bg-black/50">
                <input 
                  type="text" 
                  placeholder="Ask a question..." 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
