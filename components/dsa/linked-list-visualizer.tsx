"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Link as LinkIcon, Plus, X } from "lucide-react"

type Node = {
    id: string
    value: number
}

export function LinkedListVisualizer() {
    const [list, setList] = useState<Node[]>([
        { id: "1", value: 10 },
        { id: "2", value: 20 },
        { id: "3", value: 30 }
    ])

    const append = () => {
        const newNode = { id: Math.random().toString(), value: Math.floor(Math.random() * 100) }
        setList([...list, newNode])
    }

    const prepend = () => {
        const newNode = { id: Math.random().toString(), value: Math.floor(Math.random() * 100) }
        setList([newNode, ...list])
    }

    const removeFirst = () => {
        if (list.length === 0) return
        setList(list.slice(1))
    }

    const removeLast = () => {
        if (list.length === 0) return
        setList(list.slice(0, -1))
    }

    return (
        <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-green-500" /> Linked List
                </h3>
                <div className="flex gap-2">
                    <Button onClick={prepend} size="sm" variant="outline">Prepend</Button>
                    <Button onClick={append} size="sm">Append</Button>
                    <Button onClick={removeFirst} size="sm" variant="destructive" className="opacity-80">Pop Front</Button>
                    <Button onClick={removeLast} size="sm" variant="destructive" className="opacity-80">Pop Back</Button>
                </div>
            </div>

            <div className="min-h-[150px] flex items-center overflow-x-auto p-4 gap-2">
                <AnimatePresence mode="popLayout">
                    {list.map((node, index) => (
                        <motion.div
                            key={node.id}
                            layout
                            initial={{ opacity: 0, scale: 0.5, x: -50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                            className="flex items-center"
                        >
                            {/* Node */}
                            <div className="min-w-[80px] h-14 bg-card border border-primary/30 rounded-lg flex items-center justify-between px-3 shadow-sm relative group">
                                <span className="font-mono font-bold text-lg">{node.value}</span>
                                <div className="w-3 h-3 bg-green-500 rounded-full ml-2 animate-pulse" title="Next Pointer" />
                                
                                <div className="absolute -top-6 left-0 text-[10px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                    0x{Math.floor(parseInt(node.id) * 1234).toString(16).substring(0,4)}...
                                </div>
                            </div>

                            {/* Pointer Arrow */}
                            {index < list.length - 1 ? (
                                <ArrowRight className="h-6 w-6 text-muted-foreground mx-1" />
                            ) : (
                                <div className="ml-2 flex items-center gap-1 text-muted-foreground/50 text-xs font-mono">
                                    <ArrowRight className="h-4 w-4" /> NULL
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {list.length === 0 && (
                    <div className="text-muted-foreground italic">List is empty (Head -&gt; NULL)</div>
                )}
            </div>
            
             <div className="mt-4 text-sm text-muted-foreground">
                <p>Nodes are scattered in memory, connected via pointers.</p>
            </div>
        </div>
    )
}
