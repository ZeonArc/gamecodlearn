"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ModuleSidebar } from "@/components/learn/module-sidebar"
import { CoursePlayer } from "@/components/learn/course-player"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// MOCK DATA - Will be replaced by Supabase
const MOCK_COURSES = [
  {
    id: "scratch-basics",
    title: "Code with Blocks 🧩",
    modules: [
      {
        id: "m1",
        title: "Module 1: Intro",
        lessons: [
          { id: "l1", title: "Drag & Drop", type: "visualizer", content: "reverse-string-challenge" }
        ]
      }
    ]
  },
  {
    id: "python-kids",
    title: "Python for Kids 🐍",
    modules: [
      {
        id: "m1",
        title: "Module 1: Getting Started",
        lessons: [
          { id: "l1", title: "What is Python?", type: "video", content: "intro-video-id" },
          { id: "l2", title: "Your First Program", type: "text", content: "# Hello World\n\nLet's write your first Python code!\n\n```python\nprint('Hello, World!')\n```\n\nClick run to see the magic happen." },
          { id: "l3", title: "Challenge: Fix the Bug", type: "visualizer", content: "reverse-string-challenge" },
        ]
      },
      {
        id: "m2",
        title: "Module 2: Loops & Logic",
        lessons: [
          { id: "l4", title: "If This Then That", type: "text", content: "## Conditionals\n\nComputers make decisions using `if` statements..." },
          { id: "l5", title: "Looping Around", type: "quiz", content: "quiz-loop-id" },
        ]
      }
    ]
  },
  {
    id: "dsa",
    title: "Data Structures & Algo 🌳",
    modules: [
      {
        id: "m1",
        title: "Module 1: Sorting Algorithms",
        lessons: [
          { id: "l1", title: "Bubble Sort Visualization", type: "visualizer", content: "bubble-sort" },
          { id: "l2", title: "Time Complexity", type: "text", content: "# Big O Notation\n\nBubble sort is O(n^2)..." },
        ]
      },
      {
        id: "m2",
        title: "Module 2: Arrays",
        lessons: [
          { id: "l3", title: "Array Operations", type: "visualizer", content: "array-viz" }
        ]
      }
    ]
  },
  {
    id: "system-design",
    title: "System Design 🏗️",
    modules: [
      {
        id: "m1",
        title: "Module 1: Scalability",
        lessons: [
          { id: "l1", title: "Load Balancers & Caches", type: "visualizer", content: "system-design-canvas" },
          { id: "l2", title: "CAP Theorem", type: "text", content: "# CAP Theorem\n\nConsistency, Availability, Partition Tolerance." }
        ]
      }
    ]
  }
]

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  // const courseId = params.courseId 
  
  // In a real app, useQuery(courseId) here.
  const course = MOCK_COURSES.find(c => c.id === params.courseId) || MOCK_COURSES[1] // Fallback to Python if not found 

  const [currentLessonId, setCurrentLessonId] = useState(course.modules[0].lessons[0].id)

  const currentLesson = course.modules
    .flatMap(m => m.lessons)
    .find(l => l.id === currentLessonId)

  if (!currentLesson) return <div>Lesson not found</div>

  const handleNext = () => {
    const allLessons = course.modules.flatMap(m => m.lessons)
    const idx = allLessons.findIndex(l => l.id === currentLessonId)
    if (idx < allLessons.length - 1) {
      setCurrentLessonId(allLessons[idx + 1].id)
    }
  }

  const handlePrev = () => {
    const allLessons = course.modules.flatMap(m => m.lessons)
    const idx = allLessons.findIndex(l => l.id === currentLessonId)
    if (idx > 0) {
      setCurrentLessonId(allLessons[idx - 1].id)
    }
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Navigation Sidebar */}
      <div className="flex-shrink-0 relative z-20">
        <div className="h-16 flex items-center px-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <Link href="/learn" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="ml-4 font-bold truncate w-48">{course.title}</span>
        </div>
        <ModuleSidebar 
          modules={course.modules as any} 
          currentLessonId={currentLessonId}
          onSelectLesson={setCurrentLessonId}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <CoursePlayer 
          lesson={currentLesson as any} 
          onComplete={handleNext} 
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  )
}
