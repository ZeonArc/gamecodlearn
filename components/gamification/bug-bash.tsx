"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Bug, RefreshCcw } from "lucide-react"

type Level = {
    id: number
    title: string
    code: string[]
    errorLine: number // 0-indexed
    hint: string
    explanation: string
}

const levels: Level[] = [
    {
        id: 1,
        title: "Infinite Loop",
        code: [
            "function countToTen() {",
            "  let i = 0;",
            "  while (i < 10) {",
            "    console.log(i);",
            "    // Missing increment",
            "  }",
            "}"
        ],
        errorLine: 3, // pointing to the while loop body generally, or maybe line 2 if we want to be pedantic. Let's say line 2 (condition) or the missing line. Let's pick the loop structure.
        hint: "The loop condition 'i < 10' will always be true if 'i' never changes.",
        explanation: "The variable 'i' is never incremented, causing an infinite loop. You need 'i++' inside the block."
    },
    {
        id: 2,
        title: "Assignment vs Equality",
        code: [
            "function checkAuth(user) {",
            "  if (user.isAdmin = true) {",
            "    return 'Access Granted';",
            "  }",
            "  return 'Access Denied';",
            "}"
        ],
        errorLine: 1,
        hint: "A single equals sign '=' assigns a value, it doesn't compare them.",
        explanation: "Using 'user.isAdmin = true' assigns true to the property and returns true, effectively bypassing the check. Use '==='."
    },
    {
        id: 3,
        title: "Off-by-One Error",
        code: [
            "const arr = [1, 2, 3];",
            "for (let i = 0; i <= arr.length; i++) {",
            "  console.log(arr[i]);",
            "}",
            "// Returns undefined at the end"
        ],
        errorLine: 1,
        hint: "Arrays are 0-indexed. The last index is length - 1.",
        explanation: "The condition 'i <= arr.length' executes one extra time when i equals length, which is out of bounds."
    }
]

export function BugBash() {
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
    const [selectedLine, setSelectedLine] = useState<number | null>(null)
    const [gameState, setGameState] = useState<"playing" | "success" | "fail">("playing")

    const currentLevel = levels[currentLevelIdx]

    const handleLineClick = (idx: number) => {
        if (gameState !== "playing") return
        setSelectedLine(idx)
        
        if (idx === currentLevel.errorLine) {
            setGameState("success")
        } else {
            setGameState("fail")
        }
    }

    const nextLevel = () => {
        if (currentLevelIdx < levels.length - 1) {
            setCurrentLevelIdx(prev => prev + 1)
            setGameState("playing")
            setSelectedLine(null)
        }
    }

    const retry = () => {
        setGameState("playing")
        setSelectedLine(null)
    }

    return (
        <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                     <h3 className="text-xl font-bold flex items-center gap-2">
                        <Bug className="h-6 w-6 text-red-500" /> Bug Bash
                     </h3>
                     <p className="text-sm text-muted-foreground">Level {currentLevelIdx + 1}: {currentLevel.title}</p>
                </div>
                <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    Score: {currentLevelIdx * 100}
                </div>
            </div>

            {/* Code Area */}
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-hidden relative border border-slate-800 shadow-inner">
                {currentLevel.code.map((line, idx) => (
                    <motion.div
                        key={idx}
                        onClick={() => handleLineClick(idx)}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                        className={`px-2 py-1 cursor-pointer flex gap-4 transition-colors ${
                            selectedLine === idx 
                                ? gameState === "success" 
                                    ? "bg-green-500/20 text-green-400" 
                                    : "bg-red-500/20 text-red-400"
                                : ""
                        }`}
                    >
                         <span className="text-slate-600 select-none w-6 text-right">{idx + 1}</span>
                         <span className={selectedLine === idx ? "" : "text-slate-300"}>{line}</span>
                    </motion.div>
                ))}
            </div>

            {/* Feedback / Controls */}
            <AnimatePresence mode="wait">
                {gameState === "success" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
                    >
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <CheckCircle2 className="h-5 w-5" /> Bug Squashed!
                        </div>
                        <p className="text-sm text-green-400/80 mb-3">{currentLevel.explanation}</p>
                        <Button onClick={nextLevel} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            Next Level
                        </Button>
                    </motion.div>
                )}

                {gameState === "fail" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
                    >
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <XCircle className="h-5 w-5" /> Incorrect Line
                        </div>
                        <p className="text-sm text-red-400/80 mb-3">That line seems okay. Hint: {currentLevel.hint}</p>
                        <Button onClick={retry} size="sm" variant="outline" className="border-red-500/30 hover:bg-red-500/10 text-red-400">
                            <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
