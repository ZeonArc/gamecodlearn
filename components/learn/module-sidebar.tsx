"use client"

import { ChevronDown, ChevronRight, PlayCircle, CheckCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Lesson {
  id: string
  title: string
  type: "text" | "video" | "quiz" | "visualizer"
  completed?: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface ModuleSidebarProps {
  modules: Module[]
  currentLessonId: string
  onSelectLesson: (lessonId: string) => void
}

export function ModuleSidebar({ modules, currentLessonId, onSelectLesson }: ModuleSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(modules.map(m => m.id))

  const toggleModule = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    )
  }

  return (
    <div className="w-80 border-r border-white/10 bg-black/50 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-white tracking-wide text-sm uppercase">Course Syllabus</h2>
      </div>

      <div className="flex-1 py-4">
        {modules.map((module, idx) => (
          <div key={module.id} className="mb-2">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center text-sm font-medium text-slate-300 group-hover:text-white">
                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs mr-3 text-slate-500 font-mono">
                  {idx + 1}
                </span>
                {module.title}
              </div>
              {expandedModules.includes(module.id) ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <AnimatePresence>
              {expandedModules.includes(module.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/20"
                >
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 pl-14 text-sm transition-all border-l-2",
                        currentLessonId === lesson.id 
                          ? "border-blue-500 bg-blue-500/10 text-blue-400 font-medium" 
                          : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {lesson.type === "video" && <PlayCircle className="w-3 h-3" />}
                        {lesson.title}
                      </div>
                      {lesson.completed && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
