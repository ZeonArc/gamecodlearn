"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Brain, Code2, Network, Mic, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const assessmentTypes = [
  {
    type: "mcq",
    title: "MCQ Quiz",
    description: "10 multiple-choice questions with timer and instant scoring",
    icon: Brain,
    color: "from-blue-600 to-cyan-600",
    iconBg: "bg-blue-500/20 text-blue-400",
    border: "border-blue-500/20 hover:border-blue-500/40",
  },
  {
    type: "coding",
    title: "Coding Challenge",
    description: "Solve 3 coding problems with built-in editor and test cases",
    icon: Code2,
    color: "from-emerald-600 to-teal-600",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
  {
    type: "conceptmap",
    title: "Concept Map",
    description: "Match and connect related concepts to test understanding",
    icon: Network,
    color: "from-purple-600 to-violet-600",
    iconBg: "bg-purple-500/20 text-purple-400",
    border: "border-purple-500/20 hover:border-purple-500/40",
  },
  {
    type: "viva",
    title: "AI Viva / Oral Exam",
    description: "Answer deep questions one-by-one with AI evaluation",
    icon: Mic,
    color: "from-rose-600 to-pink-600",
    iconBg: "bg-rose-500/20 text-rose-400",
    border: "border-rose-500/20 hover:border-rose-500/40",
  },
]

export default function AssessmentLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard</Link>
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Brain className="h-4 w-4" /> AI-Powered Assessments
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Choose Your Assessment</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Test your knowledge with AI-generated assessments tailored to your skills and career goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessmentTypes.map((item, i) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/mentor/assessment/${item.type}`}>
                <Card className={`bg-card/50 backdrop-blur border ${item.border} transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group h-full`}>
                  <CardContent className="p-8">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-5 ${item.iconBg} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    <div className="mt-5 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Start Assessment <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
