"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowRight } from "lucide-react"

export function StackQueueVisualizer() {
    const [stack, setStack] = useState<number[]>([1, 2, 3])
    const [queue, setQueue] = useState<number[]>([1, 2, 3])

    // STACK Operations
    const pushStack = () => setStack([...stack, Math.floor(Math.random() * 99)])
    const popStack = () => setStack(stack.slice(0, -1))

    // QUEUE Operations
    const enqueue = () => setQueue([...queue, Math.floor(Math.random() * 99)])
    const dequeue = () => setQueue(queue.slice(1))

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
            
            {/* STACK (LIFO) */}
            <div className="flex flex-col items-center">
                 <h3 className="font-bold text-lg mb-4 text-purple-400">Stack (LIFO)</h3>
                 <div className="flex gap-2 mb-4">
                     <Button onClick={pushStack} size="sm" variant="outline" className="border-purple-500/50 text-purple-400">Push</Button>
                     <Button onClick={popStack} size="sm" variant="outline" className="border-purple-500/50 text-purple-400">Pop</Button>
                 </div>
                 
                 {/* Stack Container */}
                 <div className="w-32 min-h-[200px] border-b-4 border-l-4 border-r-4 border-purple-500/30 rounded-b-lg flex flex-col-reverse p-2 gap-1 items-center bg-purple-500/5">
                     <AnimatePresence>
                         {stack.map((val, i) => (
                             <motion.div
                                key={`${i}-${val}`} // Using Index key for stack behavior intent
                                layout
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="w-full h-10 bg-purple-500/20 border border-purple-500/50 rounded flex items-center justify-center font-bold text-purple-300"
                             >
                                 {val}
                             </motion.div>
                         ))}
                     </AnimatePresence>
                 </div>
                 <div className="mt-2 text-xs text-muted-foreground">Last In, First Out</div>
            </div>

            {/* QUEUE (FIFO) */}
            <div className="flex flex-col items-center">
                 <h3 className="font-bold text-lg mb-4 text-cyan-400">Queue (FIFO)</h3>
                 <div className="flex gap-2 mb-4">
                     <Button onClick={enqueue} size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400">Enqueue</Button>
                     <Button onClick={dequeue} size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400">Dequeue</Button>
                 </div>
                 
                 {/* Queue Container */}
                 <div className="h-24 w-full flex items-center justify-start overflow-hidden border-t-2 border-b-2 border-cyan-500/30 bg-cyan-500/5 p-2 gap-2 relative">
                     <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
                     <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
                     
                     <AnimatePresence mode="popLayout">
                         {queue.map((val, i) => (
                             <motion.div
                                key={`${val}-${i}`} // Include index to ensure unique keys for duplicates
                                layout
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50, scale: 0.8 }}
                                className="min-w-[3rem] h-12 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center font-bold text-cyan-300 shrink-0"
                             >
                                 {val}
                             </motion.div>
                         ))}
                     </AnimatePresence>
                 </div>
                 <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
                     <span>Out <ArrowRight className="inline h-3 w-3" /></span>
                     <span>First In, First Out</span>
                     <span><ArrowRight className="inline h-3 w-3" /> In</span>
                 </div>
            </div>

        </div>
    )
}
