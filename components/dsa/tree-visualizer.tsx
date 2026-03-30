"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCcw, Plus } from "lucide-react"

type TreeNode = {
    value: number
    id: string
    left?: TreeNode
    right?: TreeNode
    x: number
    y: number
}

export function TreeVisualizer() {
    const [root, setRoot] = useState<TreeNode | null>(null)
    const [inputValue, setInputValue] = useState("")

    const insert = (value: number, node: TreeNode | null, x: number, y: number, offset: number): TreeNode => {
        if (!node) {
            return { value, id: Math.random().toString(), x, y }
        }
        if (value < node.value) {
            node.left = insert(value, node.left || null, x - offset, y + 60, offset / 1.5)
        } else {
            node.right = insert(value, node.right || null, x + offset, y + 60, offset / 1.5)
        }
        return { ...node } // Return copy to trigger re-render
    }

    const handleInsert = () => {
        const val = parseInt(inputValue)
        if (isNaN(val)) return
        
        // Start from center of canvas (roughly)
        const newRoot = insert(val, root, 300, 40, 150)
        setRoot(newRoot)
        setInputValue("")
    }

    const resetTree = () => {
        setRoot(null)
    }

    // Recursive render helper
    const renderNode = (node: TreeNode | null | undefined) => {
        if (!node) return null

        return (
            <g key={node.id}>
                 {/* Edges */}
                {node.left && (
                    <motion.line 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} 
                        stroke="var(--border)" strokeWidth="2" 
                    />
                )}
                {node.right && (
                    <motion.line 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} 
                        stroke="var(--border)" strokeWidth="2" 
                    />
                )}
                
                {/* Node Circle */}
                <motion.circle 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    cx={node.x} cy={node.y} r="20" 
                    fill="var(--card)" stroke="var(--primary)" strokeWidth="2" 
                />
                <motion.text 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x={node.x} y={node.y} dy=".3em" textAnchor="middle" 
                    fill="var(--foreground)" fontSize="12" fontWeight="bold"
                >
                    {node.value}
                </motion.text>

                {/* Recursive Children */}
                {renderNode(node.left)}
                {renderNode(node.right)}
            </g>
        )
    }

    return (
        <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm flex flex-col h-[500px]">
             <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-lg">Binary Search Tree Visualizer</h3>
                <div className="flex gap-2">
                    <Input 
                        type="number" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Val"
                        className="w-20"
                    />
                    <Button onClick={handleInsert} size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Insert
                    </Button>
                     <Button onClick={resetTree} variant="outline" size="icon">
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 bg-muted/10 rounded-lg border border-border/50 overflow-hidden relative">
                <svg className="w-full h-full" viewBox="0 0 600 400">
                    <AnimatePresence>
                        {root && renderNode(root)}
                    </AnimatePresence>
                    {!root && (
                        <text x="50%" y="50%" textAnchor="middle" fill="var(--muted-foreground)" opacity="0.5">
                            Empty Tree
                        </text>
                    )}
                </svg>
            </div>
             <div className="mt-4 text-sm text-muted-foreground text-center">
                Left child &lt; Parent &lt; Right child
            </div>
        </div>
    )
}
