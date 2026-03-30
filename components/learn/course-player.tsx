"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, RefreshCw, CheckCircle, ChevronLeft, ChevronRight, Send, Loader2, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { CodeConstructor } from "@/components/gamification/code-constructor"
import { SortingVisualizer } from "@/components/dsa/sorting-visualizer"
import { ArrayVisualizer } from "@/components/dsa/array-visualizer"
import { ArchitectureCanvas } from "@/components/pro/architecture-canvas"
import { CircuitLab } from "@/components/labs/circuit-lab"
import { MechLab } from "@/components/labs/mech-lab"
import { BioLab } from "@/components/labs/bio-lab"
import { GamePhysicsLab } from "@/components/labs/game-physics-lab"
import { FeaSimulator } from "@/components/labs/fea-simulator"
import { GdtLab } from "@/components/labs/gdt-lab"

interface Lesson {
  id: string
  title: string
  type: "text" | "video" | "quiz" | "visualizer"
  content: string
}

interface ChatMessage {
  role: "user" | "ai"
  content: string
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

  // AI Tutor Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMsg, setInputMsg] = useState("")
  const [isSending, setIsSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Reset chat when lesson changes
  useEffect(() => {
    setMessages([])
    setIsCompleted(false)
  }, [lesson.id])

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete()
  }

  const sendMessage = async () => {
    if (!inputMsg.trim() || isSending) return
    const userMsg = inputMsg.trim()
    setInputMsg("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setIsSending(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          context: `The student is currently studying the lesson "${lesson.title}". Lesson content: ${lesson.content?.substring(0, 500)}. Help them understand this topic. Be concise and educational.`,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "ai", content: data.response || "Sorry, I couldn't process that. Try again!" }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Connection error. Make sure the AI backend is running." }])
    }
    setIsSending(false)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-black/90 relative">
        {/* Content Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white truncate max-w-[50%]">{lesson.title}</h1>
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
                 
                 {/* New Engineering Labs */}
                 {lesson.content === "circuit-lab" && <CircuitLab />}
                 {lesson.content === "mech-lab" && <MechLab />}
                 {lesson.content === "bio-lab" && <BioLab />}
                 {lesson.content === "game-physics-lab" && <GamePhysicsLab />}
                 {lesson.content === "fea-simulator" && <FeaSimulator />}
                 {lesson.content === "gdt-lab" && <GdtLab />}
                 
                 {lesson.content !== "reverse-string-challenge" && 
                  lesson.content !== "bubble-sort" && 
                  lesson.content !== "array-viz" && 
                  lesson.content !== "system-design-canvas" &&
                  lesson.content !== "circuit-lab" &&
                  lesson.content !== "mech-lab" &&
                  lesson.content !== "bio-lab" &&
                  lesson.content !== "game-physics-lab" &&
                  lesson.content !== "fea-simulator" &&
                  lesson.content !== "gdt-lab" && (
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

      {/* AI Tutor Sidebar */}
      <AnimatePresence>
        {showAiTutor && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-96 border-l border-white/10 bg-black/95 backdrop-blur-xl absolute right-0 top-0 bottom-0 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-purple-500/5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="font-bold text-purple-400">AI Tutor</span>
                <span className="text-[10px] text-muted-foreground">context: {lesson.title}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAiTutor(false)} className="h-6 w-6">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-slate-500">
                  <Bot className="w-10 h-10 mb-3 opacity-30" />
                  <p className="font-medium">Ask me anything about this lesson!</p>
                  <p className="text-xs mt-1 opacity-60">I can explain concepts, give examples, quiz you, or provide analogies.</p>
                  <div className="mt-4 space-y-1.5 w-full">
                    {[
                      `Explain "${lesson.title}" simply`,
                      "Give me a real-world analogy",
                      "Quiz me on this topic",
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => { setInputMsg(q); }}
                        className="w-full text-left text-xs p-2 rounded-lg border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-colors text-slate-400"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("mb-3 flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-purple-400" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-blue-600/20 border border-blue-500/20 text-blue-100"
                      : "bg-white/5 border border-white/10 prose prose-invert prose-sm max-w-none"
                  )}>
                    {msg.role === "ai" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-blue-400" />
                    </div>
                  )}
                </div>
              ))}

              {isSending && (
                <div className="flex items-center gap-2 text-xs text-purple-400 mb-3">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/50 shrink-0">
              <form
                onSubmit={e => { e.preventDefault(); sendMessage() }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  placeholder="Ask about this lesson..." 
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <Button type="submit" size="icon" disabled={isSending || !inputMsg.trim()} className="bg-purple-600 hover:bg-purple-500 shrink-0 h-9 w-9">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
