"use client"

import { useState, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Play, Code2, CheckCircle2, AlertCircle, Terminal, Sparkles, X, ChevronRight, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"

// Mock Problem Data
const problemData = {
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists."
  ],
  starterCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
    python: `def twoSum(nums, target):
    # Write your code here
    pass
    
# Test Case format
print("Test Output Here")`,
    "c++": `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};

int main() {
    cout << "Test Output Here" << endl;
    return 0;
}`
  }
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<"javascript" | "python" | "c++">("javascript")
  const [code, setCode] = useState(problemData.starterCode["javascript"])
  const [output, setOutput] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle")
  const [showConfetti, setShowConfetti] = useState(false)
  
  // AI Tutor State
  const [isTutorOpen, setIsTutorOpen] = useState(false)
  const [tutorState, setTutorState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [hintData, setHintData] = useState<{ hintText: string, recommendedCourses: any[] } | null>(null)

  const handleGetHint = async () => {
      setIsTutorOpen(true)
      if (hintData) return // don't refetch if already have one for this session, simple logic
      
      setTutorState("loading")
      try {
          const res = await fetch('/api/problems/hint', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  problemText: problemData.description,
                  currentCode: code 
              })
          })
          const data = await res.json()
          if (data.success) {
              setHintData(data)
              setTutorState("success")
          } else {
              setTutorState("error")
          }
      } catch (e) {
          setTutorState("error")
      }
  }

  const handleRun = async () => {
    setStatus("running")
    setOutput(null)

    const versionMap = {
        javascript: "18.15.0",
        python: "3.10.0",
        "c++": "10.2.0"
    }

    try {
        const res = await fetch('/api/compiler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: code,
                language: language,
                version: versionMap[language]
            })
        })
        const data = await res.json()
        
        if (data.success) {
            let out = ""
            if (data.output.compile) out += "Compilation Error:\n" + data.output.compile + "\n\n"
            if (data.output.stdout) out += data.output.stdout
            if (data.output.stderr) out += "\nStdErr:\n" + data.output.stderr
            
            setOutput(out || "Executed successfully with no output.")
            
            if (!data.output.stderr && !data.output.compile && (data.output.code === 0 || data.output.code === null)) {
               setStatus("success")
               setShowConfetti(true)
            } else {
               setStatus("error")
            }
        } else {
            setStatus("error")
            setOutput(data.error || "Failed to compile.")
        }
    } catch (e) {
        setStatus("error")
        setOutput("Network error interacting with compiler backend.")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background/50 backdrop-blur">
          <div className="flex items-center gap-4">
              <h1 className="font-bold text-lg">{problemData.title}</h1>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">{problemData.difficulty}</Badge>
          </div>
          <div className="flex items-center gap-3">
              <select 
                  value={language}
                  onChange={(e) => {
                      const lang = e.target.value as "javascript" | "python" | "c++"
                      setLanguage(lang)
                      setCode(problemData.starterCode[lang])
                  }}
                  className="bg-muted/50 border border-border text-sm rounded-md px-3 py-2 cursor-pointer outline-none focus:ring-2 ring-primary/50 transition-all font-mono"
              >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="python">Python (3.10)</option>
                  <option value="c++">C++ (GCC 10)</option>
              </select>
              <Button onClick={handleGetHint} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 transition-all hidden md:flex">
                  <Sparkles className="h-4 w-4 mr-2" /> Contextual AI Tutor
              </Button>
              <Button onClick={handleRun} disabled={status === "running"} className="bg-green-600 hover:bg-green-700 text-white">
                  {status === "running" ? (
                      <span className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> Running...</span>
                  ) : (
                      <span className="flex items-center gap-2"><Play className="h-4 w-4" /> Run Code</span>
                  )}
              </Button>
          </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Left Panel: Description */}
          <div className="border-r border-border/40 bg-card/20 overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" /> Description
                        </h2>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {problemData.description}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Examples</h3>
                        {problemData.examples.map((ex, i) => (
                            <div key={i} className="rounded-lg bg-muted/40 p-4 font-mono text-sm space-y-2 border border-border/50">
                                <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                                <div><span className="text-muted-foreground">Output:</span> {ex.output}</div>
                                {ex.explanation && <div><span className="text-muted-foreground">Explanation:</span> {ex.explanation}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold">Constraints</h3>
                         <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {problemData.constraints.map((c, i) => (
                                <li key={i} className="font-mono bg-muted/20 w-fit px-2 py-0.5 rounded">{c}</li>
                            ))}
                         </ul>
                    </div>
                </div>
              </ScrollArea>
          </div>

          {/* Right Panel: Editor & Console */}
          <div className="flex flex-col bg-[#1e1e1e]">
              <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    language={language === "c++" ? "cpp" : language}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        padding: { top: 20 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                  />
                  
                  {/* Floating Action/Status */}
                  <AnimatePresence>
                      {showConfetti && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-50"
                          >
                             <div className="bg-background border border-green-500/50 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                                 <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                     <CheckCircle2 className="h-10 w-10 text-green-500" />
                                 </div>
                                 <div className="text-center">
                                     <h3 className="text-2xl font-bold text-green-500">Solved!</h3>
                                     <p className="text-muted-foreground">You earned <span className="text-yellow-500 font-bold">+50 XP</span></p>
                                 </div>
                                 <Button onClick={() => setShowConfetti(false)}>Continue</Button>
                             </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
              
              {/* Console Panel */}
              <div className="h-48 border-t border-white/10 bg-[#151515] flex flex-col">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      <Terminal className="h-3 w-3" /> Console
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                      {!output && status === "idle" && (
                          <div className="text-muted-foreground/50">output will appear here...</div>
                      )}
                      {status === "running" && (
                          <div className="text-yellow-500 animate-pulse">Running test cases...</div>
                      )}
                      {output && (
                          <pre className={status === "error" ? "text-red-400" : "text-green-400"}>
                              {output}
                          </pre>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* Contextual AI Tutor Sidebar Overlay */}
      <AnimatePresence>
        {isTutorOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    onClick={() => setIsTutorOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" 
                />
                <motion.div
                    initial={{ x: "100%", opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-border/50 z-50 flex flex-col shadow-2xl"
                >
                    <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h2 className="font-bold text-lg">AI Mentor Hint</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsTutorOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        {tutorState === "loading" && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                                    <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
                                </div>
                                <div className="p-4 bg-muted/20 border border-border/30 rounded-xl mt-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-5 w-5 rounded-full bg-blue-500/20 animate-pulse" />
                                        <div className="h-4 w-1/2 bg-muted/50 rounded animate-pulse" />
                                    </div>
                                    <div className="h-10 w-full bg-background/50 rounded animate-pulse mt-4" />
                                </div>
                            </div>
                        )}

                        {tutorState === "error" && (
                            <div className="text-center text-red-400 py-10">
                                <AlertCircle className="h-10 w-10 mx-auto mb-4 opacity-50" />
                                <p>Failed to generate hint. Please try again.</p>
                                <Button onClick={handleGetHint} variant="outline" className="mt-4">Retry</Button>
                            </div>
                        )}

                        {tutorState === "success" && hintData && (
                            <div className="space-y-8 pb-10">
                                {/* Hint Content */}
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground/90">
                                    <ReactMarkdown>{hintData.hintText}</ReactMarkdown>
                                </div>

                                {/* Coursera Contextual Recommendations */}
                                {hintData.recommendedCourses && hintData.recommendedCourses.length > 0 && (
                                    <div className="border border-blue-500/20 bg-blue-500/5 rounded-2xl overflow-hidden mt-8">
                                        <div className="bg-blue-500/10 px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-blue-400" />
                                            <span className="text-sm font-semibold text-blue-400">Deep Dive with Coursera</span>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {hintData.recommendedCourses.map((c: any, i: number) => (
                                                <a key={i} href={`https://www.coursera.org/learn/${c.slug}`} target="_blank" rel="noreferrer" className="block group">
                                                    <div className="p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                                                        <h4 className="text-sm font-bold text-foreground group-hover:text-blue-400 transition-colors">{c.name}</h4>
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                                                        <span className="text-xs text-blue-400 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            View Course <ChevronRight className="h-3 w-3" />
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  )
}
