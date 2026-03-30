"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function HeapVisualizer() {
    const [heap, setHeap] = useState<number[]>([10, 5, 20, 2])
    const [isHeapifying, setIsHeapifying] = useState(false)

    // Simplified mock heapify for demonstration
    const heapify = async () => {
        setIsHeapifying(true)
        const newHeap = [...heap]
        
        // Mock sorting visualization step-by-step
        // In reality this would be complex frame-by-frame state management
        newHeap.sort((a, b) => b - a) // Max Heap for demo

        // Delay to simulate animation
        setTimeout(() => {
            setHeap(newHeap)
            setIsHeapifying(false)
        }, 1000)
    }

    const randomize = () => {
        const arr = Array.from({length: 7}, () => Math.floor(Math.random() * 50))
        setHeap(arr)
    }

    return (
        <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
             <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-lg">Max Heap Visualizer</h3>
                <div className="flex gap-2">
                    <Button onClick={randomize} variant="outline" size="sm" disabled={isHeapifying}>Randomize</Button>
                    <Button onClick={heapify} size="sm" disabled={isHeapifying} className="bg-orange-500 hover:bg-orange-600">
                        {isHeapifying ? "Heapifying..." : "Build Max Heap"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-8 py-8">
                 {/* Tree Representation (Simplified as Pyramid) */}
                 <div className="flex flex-wrap justify-center gap-4 max-w-md">
                     <AnimatePresence mode="popLayout">
                         {heap.map((val, i) => (
                             <motion.div
                                key={`${i}-${val}`}
                                layout
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="w-12 h-12 rounded-full border-2 border-orange-500/50 flex items-center justify-center font-bold bg-background shadow-lg shadow-orange-500/10"
                             >
                                 {val}
                             </motion.div>
                         ))}
                     </AnimatePresence>
                 </div>
                 
                 {/* Array Representation */}
                 <div className="w-full border-t border-border/50 pt-8">
                     <div className="text-xs text-muted-foreground mb-2 font-mono uppercase">Array Storage</div>
                     <div className="flex border border-border rounded-lg overflow-hidden">
                         {heap.map((val, i) => (
                             <div key={i} className="flex-1 p-2 text-center border-r last:border-r-0 border-border bg-muted/20">
                                 <div className="font-mono font-bold text-sm">{val}</div>
                                 <div className="text-[10px] text-muted-foreground mt-1">{i}</div>
                             </div>
                         ))}
                     </div>
                 </div>
            </div>
        </div>
    )
}
