"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Award, Briefcase, Zap, CheckCircle2, Lock, ArrowRight, X } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export type NodeType = "course" | "certification" | "project" | "internship"

export interface RoadmapNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  status: "locked" | "available" | "in-progress" | "completed";
  xp_reward: number;
  depends_on: string[]; // IDs of prerequisite nodes
  link?: string;
  column: number; // For layout (0 = start, 1 = mid, 2 = advanced, etc)
}

interface DAGProps {
  nodes: RoadmapNode[];
  onNodeComplete?: (nodeId: string) => void;
  isLoading?: boolean;
}

export function RoadmapDAG({ nodes, onNodeComplete, isLoading }: DAGProps) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)

  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center border border-dashed border-primary/30 rounded-xl bg-card/20 animate-pulse">
        <Zap className="h-10 w-10 text-primary animate-bounce mb-4" />
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Generating Your Optimal Path...</h3>
        <p className="text-muted-foreground mt-2">Analyzing skills and matching with industry trends.</p>
      </div>
    )
  }

  if (!nodes || nodes.length === 0) {
     return (
         <div className="w-full h-64 flex flex-col items-center justify-center border border-border rounded-xl bg-card">
             <p className="text-muted-foreground">Complete onboarding to generate your roadmap.</p>
         </div>
     )
  }

  // Group nodes by columns for layout
  const columns = Array.from(new Set(nodes.map(n => n.column))).sort()
  
  const getIcon = (type: NodeType) => {
    switch(type) {
      case 'course': return <BookOpen className="w-5 h-5" />
      case 'certification': return <Award className="w-5 h-5" />
      case 'project': return <Zap className="w-5 h-5" />
      case 'internship': return <Briefcase className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'completed': return 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          case 'in-progress': return 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          case 'available': return 'border-primary cursor-pointer hover:bg-primary/5 text-primary'
          case 'locked': return 'border-muted bg-muted/20 text-muted-foreground cursor-not-allowed opacity-60'
          default: return 'border-border'
      }
  }

  return (
    <div className="relative w-full overflow-x-auto pb-8">
      
      {/* Visual Roadmap Container */}
      <div className="flex gap-12 min-w-max p-8 relative">
          
          {/* SVGs for Edges (Simplified straight lines for demo, a real DAG needs complex routing) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10">
              <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.2)" />
                  </marker>
              </defs>
              {nodes.map(node => 
                  node.depends_on.map(parentId => {
                       // Find parent node coordinates (mocked for this specific column layout)
                       // In a full implementation, you'd calculate exact x/y coordinates using refs
                       return null; 
                  })
              )}
          </svg>

          {/* Render Columns */}
          {columns.map(col => (
             <div key={col} className="flex flex-col gap-6 relative">
                 {/* Column Phase Header */}
                 <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">
                     Phase {col + 1}
                 </div>
                 
                 {nodes.filter(n => n.column === col).map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: col * 0.2 + (i * 0.1) }}
                        className={`w-64 p-4 rounded-xl border-2 transition-all ${getStatusColor(node.status)}`}
                        onClick={() => node.status !== 'locked' && setSelectedNode(node)}
                    >
                        <div className="flex justify-between items-start mb-3">
                             <div className="p-2 rounded-md bg-background/50 backdrop-blur-sm">
                                {getIcon(node.type)}
                             </div>
                             {node.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                             {node.status === 'locked' && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        
                        <h4 className="font-bold text-sm mb-1 line-clamp-2">{node.title}</h4>
                        <div className="text-xs opacity-70 mb-3 line-clamp-2">{node.description}</div>
                        
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                            <span>{node.type}</span>
                            <span className="text-purple-400">+{node.xp_reward} XP</span>
                        </div>
                    </motion.div>
                 ))}
             </div>
          ))}
      </div>

       {/* Detail Modal Overlay */}
       <AnimatePresence>
          {selectedNode && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
               onClick={() => setSelectedNode(null)}
            >
                <motion.div
                   initial={{ scale: 0.95, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.95, y: 20 }}
                   onClick={(e) => e.stopPropagation()}
                   className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 relative overflow-hidden"
                >
                    {/* Glowing background gradient */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
                    
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setSelectedNode(null)}>
                        <X className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-3 mb-4 mt-2">
                        <div className={`p-3 rounded-lg ${getStatusColor(selectedNode.status).split(' ')[0]} bg-background`}>
                            {getIcon(selectedNode.type)}
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{selectedNode.type}</div>
                            <h2 className="text-2xl font-bold">{selectedNode.title}</h2>
                        </div>
                    </div>

                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                        {selectedNode.description}
                    </p>

                    {selectedNode.status === 'available' && (
                         <div className="flex gap-3 mt-6">
                            <Button className="w-full" onClick={() => {/* Start Node Logic */}}>
                                Start Context <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                         </div>
                    )}
                    
                    {selectedNode.status === 'in-progress' && (
                         <div className="mt-6 space-y-4">
                            <Progress value={65} className="h-2" />
                            <div className="flex gap-3">
                                <Button className="w-full" variant="outline">Resume Learning</Button>
                                <Button 
                                    className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
                                    onClick={() => {
                                        onNodeComplete?.(selectedNode.id)
                                        setSelectedNode(null)
                                    }}
                                >
                                    Mark Complete
                                </Button>
                            </div>
                         </div>
                    )}
                </motion.div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  )
}
