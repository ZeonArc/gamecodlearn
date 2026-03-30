"use client"

import { motion } from "framer-motion"
import {
  Sparkles, GraduationCap, Briefcase, ChevronRight, Globe, Code2, Brain,
  Wand2, BookOpen, Layers, Shield, Cpu, BarChart3, Palette,
  Cloud, Megaphone, Wrench, Microscope, Settings, Zap, Beaker, Gamepad2, HardHat
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Hero } from "@/components/hero"

export default function Home() {
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
      tag: "Beginner",
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
      tag: "Core CS",
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
      tag: "Advanced",
    },
    {
      id: "mechanical",
      title: "Mechanical Eng",
      description: "Master kinematics, fluid dynamics, and thermodynamics with interactive labs.",
      icon: <Settings className="w-8 h-8 text-amber-500" />,
      color: "from-amber-500/20 to-orange-600/20",
      border: "hover:border-amber-500/50",
      stats: "Kinematics • Gears • Thermo",
      href: "/learn/mechanical",
      tag: "Hardware",
    },
    {
      id: "civil",
      title: "Civil Engineering",
      description: "Design massive structures, optimize BIM clashes, and manage project schedules.",
      icon: <HardHat className="w-8 h-8 text-stone-400" />,
      color: "from-stone-400/20 to-zinc-600/20",
      border: "hover:border-stone-400/50",
      stats: "BIM • Structures • GeoTech",
      href: "/learn/civil",
      tag: "Infrastructure",
    },
    {
      id: "electrical",
      title: "Electrical & ECE",
      description: "Design circuits, digital logic, and signal processing systems.",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-400/20 to-amber-500/20",
      border: "hover:border-yellow-400/50",
      stats: "Circuits • Logic Gates",
      href: "/learn/electrical",
      tag: "Electronics",
    },
    {
      id: "biotech",
      title: "BioTech & Genetics",
      description: "Explore molecular biology, genetics, and synthetic life.",
      icon: <Beaker className="w-8 h-8 text-fuchsia-400" />,
      color: "from-fuchsia-400/20 to-pink-600/20",
      border: "hover:border-fuchsia-400/50",
      stats: "DNA • Synthesis • Cells",
      href: "/learn/biotech",
      tag: "Biology",
    },
    {
      id: "gametech",
      title: "Game Tech",
      description: "Build the engines that power the games. Physics, rendering, math.",
      icon: <Gamepad2 className="w-8 h-8 text-indigo-400" />,
      color: "from-indigo-400/20 to-purple-600/20",
      border: "hover:border-indigo-400/50",
      stats: "Physics • Shaders • AI",
      href: "/learn/gametech",
      tag: "Game Dev",
    },
    {
      id: "iot",
      title: "IoT & Embedded",
      description: "Build smart devices with Arduino, Raspberry Pi, and sensor networks.",
      icon: <Cpu className="w-8 h-8 text-emerald-400" />,
      color: "from-emerald-400/20 to-teal-500/20",
      border: "hover:border-emerald-400/50",
      stats: "Arduino • RPi • MQTT",
      href: "/learn/iot",
      tag: "Hardware",
    },
    {
      id: "datascience",
      title: "Data Science & AI",
      description: "Master data analysis, machine learning, and deep learning.",
      icon: <BarChart3 className="w-8 h-8 text-orange-400" />,
      color: "from-orange-400/20 to-red-500/20",
      border: "hover:border-orange-400/50",
      stats: "Python • ML • TensorFlow",
      href: "/learn/datascience",
      tag: "Analytics",
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      description: "Learn ethical hacking, network security, and threat analysis.",
      icon: <Shield className="w-8 h-8 text-red-400" />,
      color: "from-red-400/20 to-rose-500/20",
      border: "hover:border-red-400/50",
      stats: "Pentesting • OWASP • Crypto",
      href: "/learn/cybersecurity",
      tag: "Security",
    },
    {
      id: "uiux",
      title: "UI/UX Design",
      description: "Design beautiful, user-centered interfaces and experiences.",
      icon: <Palette className="w-8 h-8 text-pink-400" />,
      color: "from-pink-400/20 to-fuchsia-500/20",
      border: "hover:border-pink-400/50",
      stats: "Figma • UX Research • Design Systems",
      href: "/learn/uiux",
      tag: "Design",
    },
    {
      id: "cloud",
      title: "Cloud & DevOps",
      description: "Master AWS, Docker, Kubernetes, and CI/CD pipelines.",
      icon: <Cloud className="w-8 h-8 text-sky-400" />,
      color: "from-sky-400/20 to-blue-500/20",
      border: "hover:border-sky-400/50",
      stats: "AWS • Docker • K8s • Terraform",
      href: "/learn/cloud",
      tag: "Infrastructure",
    },
    {
      id: "nocode",
      title: "No-Code & Business",
      description: "Build apps, automate workflows, and manage products without coding.",
      icon: <Wrench className="w-8 h-8 text-amber-400" />,
      color: "from-amber-400/20 to-yellow-500/20",
      border: "hover:border-amber-400/50",
      stats: "n8n • Zapier • Product Mgmt",
      href: "/learn/nocode",
      tag: "No-Code",
    },
  ]

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-500/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Hero />

      <div className="relative z-10 container mx-auto px-4 py-8">
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
            9 learning tracks, 30+ courses, interactive labs, and AI-powered tutoring — from coding to cybersecurity to no-code.
          </motion.p>
        </div>

        {/* AI Course Generator Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-6xl mx-auto mb-10"
        >
          <Link href="/learn/generate" className="block group">
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-blue-900/30 p-8 md:p-10 hover:border-purple-500/50 transition-all duration-500">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Wand2 className="w-10 h-10 text-purple-300" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10">
                      ✨ AI Powered
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                    Generate Any Course with AI
                  </h2>
                  <p className="text-slate-400 max-w-lg">
                    Enter any topic — IoT, Cybersecurity, Product Management, anything — and our AI instantly creates a full course with modules, exercises, and examples.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-purple-300 font-semibold group-hover:gap-3 transition-all">
                  Try Now <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {tracks.map((track, idx) => (
            <Link key={track.id} href={track.href} className="group relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                whileHover={{ y: -5 }}
                className={cn(
                  "h-full p-7 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300",
                  "hover:shadow-2xl hover:shadow-black/50",
                  track.border
                )}
              >
                <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", track.color)} />
                
                <div className="relative z-10 space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      {track.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded-full border border-white/5 bg-white/5">
                      {track.tag}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-white">
                      {track.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      {track.stats}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-6xl mx-auto mt-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/learn/dsa" className="group">
              <div className="p-5 rounded-2xl border border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Interactive DSA Lab</h3>
                  <p className="text-[10px] text-slate-400">Sorting, trees, linked lists, stacks</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-emerald-400 transition-colors" />
              </div>
            </Link>
            <Link href="/mentor/assessment" className="group">
              <div className="p-5 rounded-2xl border border-white/5 bg-black/40 hover:border-blue-500/30 transition-all flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">AI Assessments</h3>
                  <p className="text-[10px] text-slate-400">MCQ, Coding, Concept Maps, Viva</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-blue-400 transition-colors" />
              </div>
            </Link>
            <Link href="/learn/generate" className="group">
              <div className="p-5 rounded-2xl border border-white/5 bg-black/40 hover:border-purple-500/30 transition-all flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Generate Course</h3>
                  <p className="text-[10px] text-slate-400">AI creates any course instantly</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-purple-400 transition-colors" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Features Footer */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-white/5 pt-12 max-w-6xl mx-auto">
          {[
            { icon: <Globe className="w-5 h-5" />, color: "text-blue-400 bg-blue-500/10", title: "30+ Courses", desc: "From IoT to UI/UX" },
            { icon: <Brain className="w-5 h-5" />, color: "text-purple-400 bg-purple-500/10", title: "AI Tutor", desc: "Context-aware help" },
            { icon: <Code2 className="w-5 h-5" />, color: "text-green-400 bg-green-500/10", title: "Interactive Labs", desc: "Hands-on exercises" },
            { icon: <Microscope className="w-5 h-5" />, color: "text-amber-400 bg-amber-500/10", title: "Multi-Domain", desc: "Tech & non-tech" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg shrink-0", f.color)}>{f.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
