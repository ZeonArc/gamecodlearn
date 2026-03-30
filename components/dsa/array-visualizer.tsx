"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Trash2, Plus } from "lucide-react"

export function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50])
  const [inputValue, setInputValue] = useState("")
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [memoryAddress, setMemoryAddress] = useState(1000)

  const insertElement = () => {
     if (!inputValue) return
     const num = parseInt(inputValue)
     if (isNaN(num)) return
     
     if (array.length >= 8) {
         alert("Array is full!")
         return
     }

     setArray([...array, num])
     setInputValue("")
     setHighlightIndex(array.length) // Highlight the new index
     setTimeout(() => setHighlightIndex(null), 1000)
  }

  const removeElement = (index: number) => {
      setHighlightIndex(index)
      setTimeout(() => {
          setArray(array.filter((_, i) => i !== index))
          setHighlightIndex(null)
      }, 500)
  }

  return (
    <div className="p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
       <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold text-lg">Contiguous Memory Visualization</h3>
            <div className="flex gap-2">
                <Input 
                    type="number" 
                    placeholder="Value" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-24"
                />
                <Button onClick={insertElement} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            </div>
       </div>

       {/* Memory Block Container */}
       <div className="relative h-48 flex items-center justify-center bg-muted/20 rounded-lg overflow-x-auto p-8 border border-dashed border-border/50">
            <div className="flex gap-1">
                <AnimatePresence>
                    {array.map((val, i) => (
                        <motion.div
                            key={`${i}-${val}`}
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0,
                                backgroundColor: highlightIndex === i ? "var(--primary)" : "var(--background)",
                                color: highlightIndex === i ? "var(--primary-foreground)" : "var(--foreground)"
                            }}
                            exit={{ opacity: 0, scale: 0, y: -20 }}
                            className="relative w-16 h-24 flex flex-col items-center justify-center border border-border rounded-md shadow-sm group cursor-pointer hover:border-primary transition-colors bg-card"
                            onClick={() => removeElement(i)}
                        >
                            <span className="text-xl font-mono font-bold">{val}</span>
                            
                            {/* Index Label */}
                            <div className="absolute -top-6 text-xs text-muted-foreground font-mono">
                                [{i}]
                            </div>

                            {/* Memory Address Label */}
                            <div className="absolute -bottom-6 text-[10px] text-muted-foreground font-mono">
                                0x{memoryAddress + (i * 4)}
                            </div>
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {/* Empty Slots */}
                {Array.from({ length: 8 - array.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-16 h-24 border border-dashed border-border/30 rounded-md bg-muted/5 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground/30">Empty</span>
                    </div>
                ))}
            </div>
       </div>

       <div className="mt-4 text-sm text-muted-foreground">
           <p className="flex items-center gap-2">
               <ArrowRight className="h-4 w-4" /> 
               Arrays store elements in <strong>contiguous</strong> memory locations.
           </p>
           <p className="flex items-center gap-2 mt-1">
               <ArrowRight className="h-4 w-4" /> 
               Accessing index <code>i</code> is calculated as: <code>Base_Address + (i * Size_of_Element)</code>.
           </p>
       </div>
    </div>
  )
}
