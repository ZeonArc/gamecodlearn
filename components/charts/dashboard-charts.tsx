"use client"

import {
  AreaChart, Area, BarChart, Bar,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts"

/* ═══ SHARED STYLES ═══ */
const CHART_COLORS = {
  primary: "hsl(173, 80%, 50%)",
  accent: "hsl(265, 89%, 70%)",
  orange: "hsl(30, 90%, 55%)",
  emerald: "hsl(160, 60%, 45%)",
  rose: "hsl(350, 80%, 60%)",
  blue: "hsl(210, 80%, 60%)",
  amber: "hsl(40, 95%, 55%)",
}

const tooltipStyle = {
  contentStyle: {
    background: "hsl(0,0%,8%)",
    border: "1px solid hsl(0,0%,20%)",
    borderRadius: "12px",
    fontSize: "12px",
    padding: "8px 12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  itemStyle: { color: "hsl(0,0%,80%)" },
  labelStyle: { color: "white", fontWeight: "bold" },
}

/* ═══ PROGRESS OVER TIME (Area Chart) ═══ */
const weeklyProgressData = [
  { week: "W1", progress: 12, xp: 320 },
  { week: "W2", progress: 24, xp: 580 },
  { week: "W3", progress: 35, xp: 1100 },
  { week: "W4", progress: 41, xp: 1450 },
  { week: "W5", progress: 53, xp: 2200 },
  { week: "W6", progress: 62, xp: 2800 },
  { week: "W7", progress: 71, xp: 3500 },
  { week: "W8", progress: 79, xp: 4100 },
]

export function ProgressOverTimeChart() {
  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={weeklyProgressData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradProgress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradXP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
          <XAxis dataKey="week" tick={{ fill: "hsl(0,0%,50%)", fontSize: 11 }} axisLine={false} />
          <YAxis tick={{ fill: "hsl(0,0%,50%)", fontSize: 11 }} axisLine={false} />
          <Tooltip {...tooltipStyle} />
          <Area type="monotone" dataKey="progress" stroke={CHART_COLORS.primary} fill="url(#gradProgress)" strokeWidth={2} name="Progress %" />
          <Area type="monotone" dataKey="xp" stroke={CHART_COLORS.accent} fill="url(#gradXP)" strokeWidth={2} name="XP Earned" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ═══ SKILL DISTRIBUTION (Radial Bar) ═══ */
const skillDistribution = [
  { name: "Mechanics", value: 85, fill: CHART_COLORS.primary },
  { name: "Electronics", value: 70, fill: CHART_COLORS.accent },
  { name: "Software", value: 60, fill: CHART_COLORS.orange },
  { name: "Biology", value: 45, fill: CHART_COLORS.emerald },
  { name: "Thermals", value: 35, fill: CHART_COLORS.rose },
]

export function SkillRadarChart() {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="15%" outerRadius="90%" barSize={10} data={skillDistribution}>
          <RadialBar
            background={{ fill: "hsl(0,0%,10%)" }}
            dataKey="value"
            cornerRadius={6}
          />
          <Tooltip {...tooltipStyle} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: "11px", color: "hsl(0,0%,60%)" }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ═══ TEACHER: STUDENT PERFORMANCE BAR CHART ═══ */
const studentPerformance = [
  { name: "Alice", tasks: 8, score: 92 },
  { name: "Bob", tasks: 6, score: 78 },
  { name: "Carol", tasks: 9, score: 88 },
  { name: "Dan", tasks: 4, score: 65 },
  { name: "Eve", tasks: 7, score: 85 },
  { name: "Frank", tasks: 5, score: 72 },
]

export function StudentPerformanceChart() {
  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={studentPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
          <XAxis dataKey="name" tick={{ fill: "hsl(0,0%,50%)", fontSize: 11 }} axisLine={false} />
          <YAxis tick={{ fill: "hsl(0,0%,50%)", fontSize: 11 }} axisLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="tasks" name="Tasks Done" fill={CHART_COLORS.emerald} radius={[4, 4, 0, 0]} barSize={18} />
          <Bar dataKey="score" name="AI Score" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ═══ ASSESSMENT RESULTS PIE ═══ */
const assessmentResults = [
  { name: "Correct", value: 7, fill: CHART_COLORS.emerald },
  { name: "Wrong", value: 2, fill: CHART_COLORS.rose },
  { name: "Skipped", value: 1, fill: "hsl(0,0%,25%)" },
]

export function AssessmentResultsPie() {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={assessmentResults}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {assessmentResults.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: "11px", color: "hsl(0,0%,60%)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ═══ GITHUB LANGUAGES (Horizontal Bar) ═══ */
export function GitHubLanguagesChart({ languages }: { languages?: Record<string, number> }) {
  const data = languages
    ? Object.entries(languages).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6)
    : [
        { name: "TypeScript", value: 45 },
        { name: "JavaScript", value: 25 },
        { name: "Python", value: 15 },
        { name: "CSS", value: 10 },
        { name: "HTML", value: 5 },
      ]

  const COLORS = [CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.orange, CHART_COLORS.emerald, CHART_COLORS.blue, CHART_COLORS.rose]

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "hsl(0,0%,50%)", fontSize: 10 }} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "hsl(0,0%,60%)", fontSize: 11 }} width={80} axisLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="value" name="%" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
