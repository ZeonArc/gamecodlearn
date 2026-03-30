"use client"

import { useState, useEffect } from "react"
import { Reorder, useDragControls, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GripVertical, Play, CheckCircle2 } from "lucide-react"

type Item = {
    id: string
    content: string
}

const challenge = {
    id: 1,
    title: "Reverse a String",
    instruction: "Drag the blocks to the correct order to implement string reversal.",
    correctOrder: ["function reverse(str) {", "  let reversed = '';", "  for (let char of str) {", "    reversed = char + reversed;", "  }", "  return reversed;", "}"],
    scrambled: [
        { id: "a", content: "  for (let char of str) {" },
        { id: "b", content: "function reverse(str) {" },
        { id: "c", content: "  return reversed;" },
        { id: "d", content: "    reversed = char + reversed;" },
        { id: "e", content: "  let reversed = '';" },
        { id: "f", content: "  }" },
        { id: "g", content: "}" }
    ]
}

export function CodeConstructor() {
    const [items, setItems] = useState<Item[]>(challenge.scrambled)
    const [status, setStatus] = useState<"idle" | "success" | "wrong">("idle")

    const checkOrder = () => {
        const currentOrder = items.map(i => i.content)
        const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(challenge.correctOrder)
        setStatus(isCorrect ? "success" : "wrong")
    }

    return (
        <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                    <div className="p-1 bg-primary/20 rounded">
                        <Play className="h-4 w-4 text-primary" />
                    </div>
                    Code Constructor
                </h3>
                <p className="text-sm text-muted-foreground">{challenge.instruction}</p>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-border/50">
                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
                        {items.map((item) => (
                            <Reorder.Item key={item.id} value={item}>
                                <div className={`flex items-center gap-3 p-3 rounded-md border cursor-grab active:cursor-grabbing font-mono text-sm shadow-sm transition-colors ${
                                    status === "success" 
                                        ? "bg-green-500/10 border-green-500/30 text-green-300" 
                                        : "bg-card border-border hover:border-primary/50"
                                }`}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span>{item.content}</span>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-sm">
                        {status === "success" && (
                            <span className="text-green-400 font-bold flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Correct Logic!
                            </span>
                        )}
                        {status === "wrong" && (
                            <span className="text-red-400">Order is incorrect. Try tracing the logic.</span>
                        )}
                    </div>
                    <Button onClick={checkOrder} disabled={status === "success"}>
                        Run Routine
                    </Button>
                </div>
            </div>
        </div>
    )
}
