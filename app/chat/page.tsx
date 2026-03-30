"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm Codely AI. I can help you with algorithms, system design, or debugging code. What's on your mind?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      
      if (data.error) throw new Error(data.error)

      setMessages(prev => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
       console.error(error)
       setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to the server. Please check your API key." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Sidebar (Hidden on mobile for now) */}
      <div className="hidden md:flex w-64 flex-col border-r border-border/40 bg-muted/10 p-4">
         <Button variant="outline" className="w-full justify-start gap-2 mb-4">
            <Plus className="h-4 w-4" /> New Chat
         </Button>
         <div className="flex-1 overflow-y-auto">
             <div className="text-xs font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">History</div>
             <Button variant="ghost" className="w-full justify-start gap-2 text-sm text-muted-foreground font-normal">
                <MessageSquare className="h-4 w-4" /> Two Sum Help
             </Button>
         </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
         <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4 md:p-8">
               <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={cn(
                            "flex gap-4 p-4 rounded-xl",
                            msg.role === "assistant" ? "bg-muted/30" : "bg-primary/5"
                        )}
                    >
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === "assistant" ? "bg-gradient-to-br from-primary to-accent" : "bg-muted"
                        )}>
                            {msg.role === "assistant" ? <Sparkles className="h-4 w-4 text-white" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="font-bold text-sm">
                                {msg.role === "assistant" ? "Codely AI" : "You"}
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                            </div>
                        </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                     <div className="flex gap-4 p-4 rounded-xl bg-muted/30">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                             <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                        </div>
                     </div>
                  )}
                  <div ref={scrollRef} />
               </div>
            </ScrollArea>
         </div>

         <div className="p-4 bg-background/80 backdrop-blur border-t border-border/40">
             <div className="max-w-3xl mx-auto relative">
                 <form 
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="relative"
                 >
                     <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about code, algorithms, or system design..."
                        className="pr-12 py-6 text-base shadow-lg border-primary/20 focus-visible:ring-primary/30"
                        disabled={isLoading}
                     />
                     <Button 
                        type="submit" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9"
                        disabled={!input.trim() || isLoading}
                     >
                         <Send className="h-4 w-4" />
                     </Button>
                 </form>
                 <div className="text-center mt-2 text-xs text-muted-foreground">
                     Codely AI can make mistakes. Consider checking important information.
                 </div>
             </div>
         </div>
      </div>
    </div>
  )
}
