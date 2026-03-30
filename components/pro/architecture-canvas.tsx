"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Database, Server, Smartphone, Globe, Box, Trash2, ArrowRight } from "lucide-react"

type NodeType = "client" | "lb" | "server" | "db" | "cache" | "queue"

interface Node {
  id: string
  type: NodeType
  x: number
  y: number
}

const COMPONENTS = [
  { type: "client", icon: Smartphone, label: "Client" },
  { type: "lb", icon: ArrowRight, label: "Load Balancer" },
  { type: "server", icon: Server, label: "API Server" },
  { type: "db", icon: Database, label: "Database" },
  { type: "cache", icon: Box, label: "Redis Cache" },
  { type: "queue", icon: Globe, label: "Message Queue" },
] as const

export function ArchitectureCanvas() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [draggedType, setDraggedType] = useState<NodeType | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (type: NodeType) => {
    setDraggedType(type)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedType || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 40 // Center offset
    const y = e.clientY - rect.top - 40

    const newNode: Node = {
      id: crypto.randomUUID(),
      type: draggedType,
      x,
      y
    }

    setNodes([...nodes, newNode])
    setDraggedType(null)
  }

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id))
  }

  return (
    <div className="flex flex-col h-[500px] border border-white/10 rounded-xl bg-slate-950 overflow-hidden">
      {/* Toolbox */}
      <div className="p-4 border-b border-white/10 bg-black/50 flex gap-4 overflow-x-auto">
        {COMPONENTS.map((comp) => (
          <div
            key={comp.type}
            draggable
            onDragStart={() => handleDragStart(comp.type)}
            className="flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing p-2 hover:bg-white/5 rounded-lg transition-colors min-w-[80px]"
          >
            <div className="p-3 bg-slate-800 rounded-lg border border-white/10">
              <comp.icon className="w-6 h-6 text-slate-300" />
            </div>
            <span className="text-xs text-slate-400 font-mono">{comp.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center px-4 text-xs text-slate-500 border-l border-white/10">
            Drag items to canvas
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex-1 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        
        {nodes.map((node) => {
            const CompIcon = COMPONENTS.find(c => c.type === node.type)?.icon || Box
            
            return (
                <motion.div
                    key={node.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    drag
                    dragConstraints={containerRef}
                    dragElastic={0}
                    className="absolute cursor-move group"
                    style={{ left: node.x, top: node.y }}
                >
                    <div className="relative p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-xl flex flex-col items-center gap-2 group-hover:border-blue-500/50 transition-colors">
                         <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button size="icon" variant="destructive" className="h-6 w-6 rounded-full" onClick={() => removeNode(node.id)}>
                                 <Trash2 className="w-3 h-3" />
                             </Button>
                         </div>
                         <CompIcon className="w-8 h-8 text-blue-400" />
                         <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                             {COMPONENTS.find(c => c.type === node.type)?.label}
                         </span>
                         
                         {/* Connection Points */}
                         <div className="absolute -left-1 top-1/2 w-2 h-2 bg-slate-600 rounded-full" />
                         <div className="absolute -right-1 top-1/2 w-2 h-2 bg-slate-600 rounded-full" />
                    </div>
                </motion.div>
            )
        })}

        {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-700 font-bold text-2xl uppercase tracking-widest opacity-20">System Design Canvas</p>
            </div>
        )}
      </div>
    </div>
  )
}
