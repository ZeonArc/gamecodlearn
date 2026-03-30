"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ModuleSidebar } from "@/components/learn/module-sidebar"
import { CoursePlayer } from "@/components/learn/course-player"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { ALL_COURSES } from "@/lib/course-data"

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<any>(null)
  const [currentLessonId, setCurrentLessonId] = useState("")

  useEffect(() => {
    // 1. AI-generated course from sessionStorage
    if (courseId === "ai-generated") {
      const stored = sessionStorage.getItem("ai-generated-course")
      if (stored) {
        const parsed = JSON.parse(stored)
        setCourse(parsed)
        setCurrentLessonId(parsed.modules[0]?.lessons[0]?.id || "")
        return
      }
    }

    // 2. Built-in course from centralized data
    const found = ALL_COURSES.find(c => c.id === courseId)
    if (found) {
      setCourse(found)
      setCurrentLessonId(found.modules[0].lessons[0].id)
      return
    }

    // 3. Try sessionStorage fallback (custom course-xxx key)
    const stored = sessionStorage.getItem(`course-${courseId}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      setCourse(parsed)
      setCurrentLessonId(parsed.modules[0]?.lessons[0]?.id || "")
      return
    }

    // 4. Default fallback
    const fallback = ALL_COURSES[1] // Python for Kids
    setCourse(fallback)
    setCurrentLessonId(fallback.modules[0].lessons[0].id)
  }, [courseId])

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const currentLesson = course.modules
    .flatMap((m: any) => m.lessons)
    .find((l: any) => l.id === currentLessonId)

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground bg-black">
        <p>Lesson not found. <Link href="/learn" className="text-primary hover:underline">Go back</Link></p>
      </div>
    )
  }

  const handleNext = () => {
    const allLessons = course.modules.flatMap((m: any) => m.lessons)
    const idx = allLessons.findIndex((l: any) => l.id === currentLessonId)
    if (idx < allLessons.length - 1) setCurrentLessonId(allLessons[idx + 1].id)
  }

  const handlePrev = () => {
    const allLessons = course.modules.flatMap((m: any) => m.lessons)
    const idx = allLessons.findIndex((l: any) => l.id === currentLessonId)
    if (idx > 0) setCurrentLessonId(allLessons[idx - 1].id)
  }

  const isAiGenerated = courseId === "ai-generated" || course.id?.startsWith("ai-")

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <div className="flex-shrink-0 relative z-20">
        <div className="h-16 flex items-center px-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <Link href="/learn" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="ml-4 font-bold truncate w-48 flex items-center gap-2">
            {isAiGenerated && <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />}
            {course.title}
          </span>
        </div>
        <ModuleSidebar 
          modules={course.modules as any} 
          currentLessonId={currentLessonId}
          onSelectLesson={setCurrentLessonId}
        />
      </div>
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
