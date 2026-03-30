"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Layers } from "lucide-react"

type StackFrame = {
    id: string
    name: string
    variables: { name: string, value: string, ref?: string }[]
}

type HeapObject = {
    id: string
    type: string
    value: string
    color: string
}

export function MemoryLab() {
    const [stack, setStack] = useState<StackFrame[]>([])
    const [heap, setHeap] = useState<HeapObject[]>([])
    
    const addFunctionCall = () => {
        const frameId = Math.random().toString()
        const newFrame: StackFrame = {
            id: frameId,
            name: `func_${Math.floor(Math.random() * 100)}()`,
            variables: [
                { name: "x", value: Math.floor(Math.random() * 10).toString() },
                { name: "obj", value: "0x" + Math.floor(Math.random() * 10000).toString(16), ref: frameId } // Mock ref
            ]
        }
        setStack([newFrame, ...stack]) // Push to stack (LIFO visual)

        // allocate heap object
        const heapObj: HeapObject = {
            id: frameId, // linking for demo
            type: "Object",
            value: `{ data: ${Math.random().toFixed(2)} }`,
            color: "bg-blue-500"
        }
        setHeap([...heap, heapObj])
    }

    const popFunction = () => {
        if (stack.length === 0) return
        const removedFrame = stack[0]
        setStack(stack.slice(1))
        
        // Simulating Garbage Collection eventually
        setTimeout(() => {
            setHeap(prev => prev.filter(h => h.id !== removedFrame.id))
        }, 1000)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
            
            {/* STACK */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Layers className="h-5 w-5 text-yellow-500" /> Stack Memory
                    </h3>
                    <div className="flex gap-2">
                        <Button onClick={addFunctionCall} size="sm">Call Func</Button>
                        <Button onClick={popFunction} size="sm" variant="outline">Return</Button>
                    </div>
                </div>
                
                <div className="min-h-[300px] bg-muted/10 rounded-lg p-4 flex flex-col gap-2 relative border-t-4 border-yellow-500/20">
                     <p className="text-xs text-muted-foreground absolute -top-3 left-2 bg-background px-2">High Address</p>
                    <AnimatePresence>
                        {stack.map((frame, i) => (
                            <motion.div
                                key={frame.id}
                                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-card border border-border rounded-md p-3 shadow-md"
                            >
                                <div className="text-xs font-mono text-yellow-500 font-bold mb-1">{frame.name}</div>
                                <div className="space-y-1">
                                    {frame.variables.map(v => (
                                        <div key={v.name} className="flex justify-between text-xs font-mono">
                                            <span className="text-muted-foreground">{v.name}:</span>
                                            <span className={v.ref ? "text-blue-400 font-bold" : "text-foreground"}>
                                                {v.value}
                                                {v.ref && <ArrowRight className="inline h-3 w-3 ml-1" />}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                     {stack.length === 0 && (
                         <div className="flex-1 flex items-center justify-center text-muted-foreground/30 text-sm">
                             Empty Stack
                         </div>
                     )}
                     <p className="text-xs text-muted-foreground absolute -bottom-3 left-2 bg-background px-2">Low Address</p>
                </div>
                <div className="text-xs text-muted-foreground">
                    * Stores local variables and function calls. Fast access, auto-managed.
                </div>
            </div>

            {/* HEAP */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                         <Database className="h-5 w-5 text-blue-500" /> Heap Memory
                    </h3>
                </div>

                <div className="min-h-[300px] bg-muted/10 rounded-lg p-4 relative border-dashed border-2 border-border/30 flex flex-wrap content-start gap-4">
                     <AnimatePresence>
                        {heap.map((obj) => (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className={`w-24 h-24 rounded-full ${obj.color}/20 border border-${obj.color}/50 flex flex-col items-center justify-center text-xs p-2 shadow-lg backdrop-blur-md`}
                            >
                                <div className="font-bold text-blue-400">{obj.type}</div>
                                <div className="text-center opacity-70 mt-1 break-all">{obj.value}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {heap.length === 0 && (
                         <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-sm">
                             Empty Heap
                         </div>
                     )}
                </div>
                 <div className="text-xs text-muted-foreground">
                    * Stores objects and dynamic data. Slower access, manually managed (or GC).
                </div>
            </div>

        </div>
    )
}
