"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"

export function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [sorting, setSorting] = useState(false)
  const [currentIndex, setCurrentIndex] = useState<number[] | null>(null)
  const [sortedIndices, setSortedIndices] = useState<number[]>([])

  useEffect(() => {
    resetArray()
  }, [])

  const resetArray = () => {
    const newArr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 10)
    setArray(newArr)
    setSorting(false)
    setCurrentIndex(null)
    setSortedIndices([])
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const bubbleSort = async () => {
    setSorting(true)
    const arr = [...array]
    const n = arr.length
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndex([j, j + 1])
        await sleep(300)

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          setArray([...arr])
          await sleep(300)
        }
      }
      setSortedIndices(prev => [...prev, n - 1 - i])
    }
    setSortedIndices(prev => [...prev, 0])
    setSorting(false)
    setCurrentIndex(null)
  }

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">Bubble Sort</h3>
        <div className="flex gap-2">
          <Button onClick={resetArray} variant="outline" size="sm" disabled={sorting}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button onClick={bubbleSort} disabled={sorting || sortedIndices.length === array.length}>
            <Play className="w-4 h-4 mr-2" /> Sort
          </Button>
        </div>
      </div>

      <div className="h-64 flex items-end justify-center gap-2 px-8">
        {array.map((value, idx) => {
           let color = "bg-blue-500/50 border-blue-400/30"
           if (currentIndex?.includes(idx)) color = "bg-yellow-500 border-yellow-400"
           if (sortedIndices.includes(idx)) color = "bg-green-500 border-green-400"
           
           return (
             <motion.div
               key={idx}
               layout
               initial={{ height: 0 }}
               animate={{ height: `${value * 4}px` }}
               className={`w-12 rounded-t-md border flex items-end justify-center pb-2 text-xs font-bold text-white/50 relative overflow-hidden transition-colors duration-300 ${color}`}
             >
               <span className="relative z-10">{value}</span>
             </motion.div>
           )
        })}
      </div>
      
      <div className="mt-8 text-sm text-slate-400 bg-black/20 p-4 rounded-lg">
        <p><strong>Algorithm:</strong> Compare adjacent elements. If the first is greater than the second, swap them.</p>
        <p><strong>Complexity:</strong> O(n²)</p>
      </div>
    </div>
  )
}
