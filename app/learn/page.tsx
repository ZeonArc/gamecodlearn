"use client"

import { motion } from "framer-motion"
import { Sparkles, GraduationCap, Briefcase, ChevronRight, Lock, Globe, Code2, Brain } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LearningHub() {
  const tracks = [
    {
      id: "school",
      title: "School Zone",
      description: "Learn how computers work, build games, and start coding!",
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-400/20 to-orange-500/20",
      border: "hover:border-yellow-400/50",
      stats: "Block Code • Python • Games",
      href: "/learn/school",
    },
    {
      id: "college",
      title: "College & CS",
      description: "Master Data Structures, Algorithms, and Web Development.",
      icon: <GraduationCap className="w-8 h-8 text-blue-400" />,
      color: "from-blue-400/20 to-cyan-500/20",
      border: "hover:border-blue-400/50",
      stats: "DSA • Web Dev • OS",
      href: "/learn/college",
    },
    {
      id: "pro",
      title: "Professional",
      description: "System Design, Cloud Arch, and Advanced Engineering.",
      icon: <Briefcase className="w-8 h-8 text-purple-400" />,
      color: "from-purple-400/20 to-pink-500/20",
      border: "hover:border-purple-400/50",
      stats: "System Design • DevOps",
      href: "/learn/pro",
    },
  ]

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            Where do you want to learn?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Select your path to access tailored courses, interactive visualizations, and AI-powered tutoring.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tracks.map((track, idx) => (
            <Link key={track.id} href={track.href} className="group relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={cn(
                  "h-full p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300",
                  "hover:shadow-2xl hover:shadow-black/50",
                  track.border
                )}
              >
                <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", track.color)} />
                
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {track.icon}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300">
                      {track.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {track.stats}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Global Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-16">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Universal Subjects</h3>
            <p className="text-sm text-slate-400">From Biology to Blockchain, learn anything with AI-generated modules.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">AI-Powered Tutor</h3>
            <p className="text-sm text-slate-400">Get instant explanations, analogies, and quizzes tailored to your level.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-green-500/10 rounded-full text-green-400">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Interactive Labs</h3>
            <p className="text-sm text-slate-400">Don't just read. Visualize algorithms and build real projects.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
