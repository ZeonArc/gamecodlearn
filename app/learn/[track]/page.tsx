"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Star, Lock, Wand2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const TRACK_DATA: Record<string, {
  title: string; description: string; courses: { id: string; title: string; desc: string; icon: string; locked: boolean }[]; theme: string
}> = {
  school: {
    title: "School Zone 🚀",
    description: "Start your adventure! Build games and learn how computers think.",
    courses: [
      { id: "scratch-basics", title: "Code with Blocks", desc: "Drag, drop, and play!", icon: "🧩", locked: false },
      { id: "python-kids", title: "Python for Kids", desc: "Write real code with Python.", icon: "🐍", locked: false },
      { id: "web-fun", title: "Make a Website", desc: "HTML & CSS fundamentals.", icon: "🌐", locked: false },
    ],
    theme: "from-yellow-400 to-orange-500",
  },
  college: {
    title: "College & CS 🎓",
    description: "Ace your exams and master the fundamentals of Computer Science.",
    courses: [
      { id: "dsa", title: "Data Structures", desc: "Arrays, Trees, Graphs with interactive visualizers.", icon: "🌳", locked: false },
      { id: "web-dev", title: "Full Stack Web", desc: "React, Node.js, Databases.", icon: "💻", locked: false },
      { id: "os", title: "Operating Systems", desc: "Processes, Threads, Memory.", icon: "⚙️", locked: false },
    ],
    theme: "from-blue-400 to-cyan-500",
  },
  pro: {
    title: "Professional 💼",
    description: "Advance your career with high-level architectural patterns.",
    courses: [
      { id: "system-design", title: "System Design", desc: "Scale to millions of users.", icon: "🏗️", locked: false },
      { id: "microservices", title: "Microservices", desc: "Event-driven architecture.", icon: "🔌", locked: false },
      { id: "devops-mastery", title: "DevOps Mastery", desc: "CI/CD & Kubernetes.", icon: "🚢", locked: false },
    ],
    theme: "from-purple-400 to-pink-500",
  },

  // ============ ENGINEERING LABS ============
  mechanical: {
    title: "Mechanical Eng ⚙️",
    description: "Master kinematics, fluid dynamics, and thermodynamics with interactive labs.",
    courses: [
      { id: "mech-kinematics", title: "Kinematics & Gears", desc: "Calculate gear ratios and torque interactively.", icon: "⚙️", locked: false },
      { id: "fea-mechanics", title: "FEA Mechanics", desc: "Test beam stress with Finite Element Analysis.", icon: "🏗️", locked: false },
      { id: "gdt-mastery", title: "GD&T Mastery", desc: "Learn Design for Manufacturing and Quality Control.", icon: "📏", locked: false },
    ],
    theme: "from-amber-500 to-orange-600",
  },
  civil: {
    title: "Civil Engineering 🏗️",
    description: "Design robust bridges, resolve BIM clashes, and master 3D structural analysis.",
    courses: [
      { id: "bim-coordination", title: "BIM Clash Resolution", desc: "Resolve MEP vs Structural clashes in 3D space.", icon: "🏢", locked: false },
      { id: "structural-analysis", title: "Truss Optimization", desc: "Design a bridge under budget that survives live loads.", icon: "🌉", locked: false },
      { id: "project-management", title: "Primavera P6", desc: "Manage billion-dollar construction schedules.", icon: "📅", locked: true },
    ],
    theme: "from-stone-400 to-zinc-600",
  },
  electrical: {
    title: "Electrical & ECE ⚡",
    description: "Design circuits, digital logic, and signal processing systems.",
    courses: [
      { id: "eee-circuits", title: "Digital Logic Design", desc: "Build circuits with AND, OR, NOT gates.", icon: "🔌", locked: false },
      { id: "analog-electronics", title: "Analog Circuits", desc: "Op-amps, transistors, and filters.", icon: "📻", locked: true },
      { id: "signals-systems", title: "Signals & Systems", desc: "Fourier transforms and filtering.", icon: "📶", locked: true },
    ],
    theme: "from-yellow-400 to-amber-500",
  },
  biotech: {
    title: "BioTech & Genetics 🧬",
    description: "Explore molecular biology, genetics, and synthetic life.",
    courses: [
      { id: "bio-genetics", title: "Genetics & Synthesis", desc: "Pair DNA nucleotides and synthesize proteins.", icon: "🧬", locked: false },
      { id: "microbiology", title: "Microbiology Lab", desc: "Cell structures and bacteria.", icon: "🔬", locked: true },
      { id: "bioinformatics", title: "Bioinformatics", desc: "Analyzing genomic data with code.", icon: "💻", locked: true },
    ],
    theme: "from-fuchsia-400 to-pink-600",
  },
  gametech: {
    title: "Game Tech 🎮",
    description: "Build the engines that power the games. Physics, rendering, math.",
    courses: [
      { id: "game-physics", title: "Physics Engine Dev", desc: "Simulate gravity, collisions, and restitution.", icon: "🕹️", locked: false },
      { id: "graphics-programming", title: "Graphics Programming", desc: "Shaders, OpenGL, and ray tracing.", icon: "🖥️", locked: true },
      { id: "game-ai", title: "Game AI (Pathfinding)", desc: "A* algorithm and state machines.", icon: "👾", locked: true },
    ],
    theme: "from-indigo-400 to-purple-600",
  },

  // ============ NEW TECH TRACKS ============

  iot: {
    title: "IoT & Embedded ⚡",
    description: "Build smart devices, sensor networks, and connected systems.",
    courses: [
      { id: "arduino-basics", title: "Arduino Fundamentals", desc: "LEDs, sensors, and motors — build your first circuit.", icon: "💡", locked: false },
      { id: "raspberry-pi", title: "Raspberry Pi Projects", desc: "Linux on a credit-card computer, GPIO, and camera.", icon: "🫐", locked: false },
      { id: "mqtt-iot", title: "IoT Protocols & MQTT", desc: "Connect devices with MQTT, HTTP, and WebSockets.", icon: "📡", locked: false },
      { id: "smart-home", title: "Smart Home Lab", desc: "Build a home automation system with sensors.", icon: "🏠", locked: false },
    ],
    theme: "from-emerald-400 to-teal-500",
  },
  datascience: {
    title: "Data Science & AI 📊",
    description: "From data cleaning to neural networks — master the full data pipeline.",
    courses: [
      { id: "python-data", title: "Python for Data", desc: "pandas, NumPy, and data wrangling.", icon: "🐍", locked: false },
      { id: "statistics", title: "Statistics Essentials", desc: "Probability, distributions, and hypothesis testing.", icon: "📈", locked: false },
      { id: "ml-intro", title: "Machine Learning 101", desc: "Regression, classification, clustering.", icon: "🤖", locked: false },
      { id: "deep-learning", title: "Deep Learning & NNs", desc: "TensorFlow, CNNs, and transformers.", icon: "🧠", locked: false },
    ],
    theme: "from-orange-400 to-red-500",
  },
  cybersecurity: {
    title: "Cybersecurity 🔒",
    description: "Learn to defend systems, find vulnerabilities, and think like a hacker.",
    courses: [
      { id: "security-fundamentals", title: "Security Fundamentals", desc: "CIA triad, threat modeling, and risk assessment.", icon: "🛡️", locked: false },
      { id: "network-security", title: "Network Security", desc: "Firewalls, VPNs, IDS/IPS, and packet analysis.", icon: "🌐", locked: false },
      { id: "ethical-hacking", title: "Ethical Hacking", desc: "Penetration testing, OWASP Top 10, and CTFs.", icon: "🏴‍☠️", locked: false },
      { id: "cryptography", title: "Cryptography", desc: "Symmetric, asymmetric, hashing, and digital signatures.", icon: "🔐", locked: false },
    ],
    theme: "from-red-400 to-rose-500",
  },
  uiux: {
    title: "UI/UX Design 🎨",
    description: "Create beautiful, user-centered interfaces people love to use.",
    courses: [
      { id: "design-thinking", title: "Design Thinking", desc: "Empathize, define, ideate, prototype, test.", icon: "💭", locked: false },
      { id: "figma-mastery", title: "Figma Mastery", desc: "Components, auto-layout, prototyping, and handoff.", icon: "🎨", locked: false },
      { id: "ux-research", title: "UX Research", desc: "User interviews, personas, journey maps, and testing.", icon: "🔍", locked: false },
      { id: "design-systems", title: "Design Systems", desc: "Build scalable design tokens, components, and docs.", icon: "📐", locked: false },
    ],
    theme: "from-pink-400 to-fuchsia-500",
  },
  cloud: {
    title: "Cloud & DevOps ☁️",
    description: "Master cloud infrastructure, containers, and deployment automation.",
    courses: [
      { id: "aws-fundamentals", title: "AWS Fundamentals", desc: "EC2, S3, Lambda, RDS, and IAM.", icon: "☁️", locked: false },
      { id: "docker-course", title: "Docker Deep Dive", desc: "Containers, Dockerfile, Compose, and volumes.", icon: "🐳", locked: false },
      { id: "kubernetes", title: "Kubernetes", desc: "Pods, deployments, services, and helm charts.", icon: "⎈", locked: false },
      { id: "terraform", title: "Infrastructure as Code", desc: "Terraform, CloudFormation, and GitOps.", icon: "🏗️", locked: false },
    ],
    theme: "from-sky-400 to-blue-500",
  },
  nocode: {
    title: "No-Code & Business 🛠️",
    description: "Build apps and automate workflows without writing code.",
    courses: [
      { id: "n8n-automation", title: "n8n Automation", desc: "Build workflows, connect APIs, and automate tasks.", icon: "🔄", locked: false },
      { id: "product-management", title: "Product Management", desc: "Roadmaps, user stories, metrics, and prioritization.", icon: "📋", locked: false },
      { id: "digital-marketing", title: "Digital Marketing", desc: "SEO, content marketing, analytics, and growth.", icon: "📣", locked: false },
      { id: "business-analytics", title: "Business Analytics", desc: "Excel, dashboards, KPIs, and data storytelling.", icon: "📊", locked: false },
    ],
    theme: "from-amber-400 to-yellow-500",
  },
}

export default function TrackPage() {
  const params = useParams()
  const trackId = params.track as string
  const data = TRACK_DATA[trackId]

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <p className="text-3xl">🔍</p>
        <h2 className="text-xl font-bold">Track not found</h2>
        <Link href="/learn" className="text-blue-400 hover:underline text-sm">← Back to Learning Hub</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
       <div className={cn("absolute top-0 left-0 w-full h-96 bg-gradient-to-b opacity-20 pointer-events-none", data.theme)} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Link href="/learn" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
        </Link>

        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {data.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400"
          >
            {data.description}
          </motion.p>
        </header>

        {/* AI Generate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Link href="/learn/generate" className="block group">
            <div className="p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20 hover:border-purple-500/40 transition-all flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                <Wand2 className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-bold text-white">Generate a Custom Course</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10">AI</span>
                </div>
                <p className="text-sm text-slate-400">Any topic in this domain — AI will create a full course with exercises</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.08 }}
            >
              <Link href={course.locked ? "#" : `/learn/course/${course.id}`} className={cn("block group h-full", course.locked && "cursor-not-allowed opacity-60")}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                  {course.locked && (
                    <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-1">{course.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center text-xs text-slate-500">
                      <BookOpen className="w-3 h-3 mr-1" /> {data.courses.length} courses
                    </div>
                    {course.locked ? (
                      <span className="text-xs font-mono uppercase text-slate-600">Locked</span>
                    ) : (
                      <span className="text-xs font-mono uppercase text-green-400 group-hover:underline">Start &rarr;</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Coursera Section */}
        <div className="mt-20 border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              AI Recommended External Courses
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20 font-mono">COURSERA</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CourseraRecommendations trackId={trackId} />
            </div>
        </div>
      </div>
    </div>
  )
}

function CourseraRecommendations({ trackId }: { trackId: string }) {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const queryMap: Record<string, string> = {
      school: "html css javascript basic",
      college: "data structures algorithms",
      pro: "system design architecture",
      iot: "internet of things arduino embedded",
      datascience: "data science machine learning python",
      cybersecurity: "cybersecurity ethical hacking",
      uiux: "ui ux design figma",
      cloud: "aws cloud computing devops",
      nocode: "no code automation product management",
    }
    const query = queryMap[trackId] || "programming"

    fetch(`/api/coursera?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.courses) setCourses(data.courses)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [trackId])

  if (loading) {
     return [1,2,3].map(i => (
        <div key={i} className="animate-pulse bg-white/5 border border-white/10 rounded-2xl h-48"></div>
     ))
  }

  if (courses.length === 0) {
      return <div className="text-slate-500 col-span-full">No external recommendations found at this time.</div>
  }

  return courses.map((c, i) => (
       <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
            <a href={`https://www.coursera.org/learn/${c.slug}`} target="_blank" rel="noreferrer" className="block group h-full">
                <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-2xl p-6 h-full flex flex-col hover:border-blue-500/50 transition-all duration-300">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 line-clamp-2">{c.name}</h3>
                    <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{c.description || "Learn from top universities and companies on Coursera."}</p>
                    <div className="mt-auto pt-4 border-t border-blue-500/20 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>External Link</span>
                        <span className="text-blue-400 group-hover:underline">View on Coursera &rarr;</span>
                    </div>
                </div>
            </a>
       </motion.div>
  ))
}
