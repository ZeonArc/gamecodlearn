"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Prediction = {
  overallScore: number
  dimensions: {
    technicalReadiness: number
    marketAlignment: number
    experienceLevel: number
    portfolioStrength: number
  }
  strengths: string[]
  gaps: string[]
  nextBestAction: string
}

interface PredictiveScoreProps {
  userId: string
  initialScore?: number
}

export function PredictiveScore({ userId, initialScore }: PredictiveScoreProps) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [score] = useState(initialScore || 0)

  const fetchPrediction = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/mentor/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })
      const data = await res.json()
      if (data.success) {
        setPrediction(data.prediction)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const displayScore = prediction?.overallScore ?? score

  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-green-400"
    if (s >= 50) return "text-yellow-400"
    if (s >= 25) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreGradient = (s: number) => {
    if (s >= 75) return "from-green-500 to-emerald-500"
    if (s >= 50) return "from-yellow-500 to-amber-500"
    if (s >= 25) return "from-orange-500 to-red-500"
    return "from-red-500 to-rose-500"
  }

  const dimensions = prediction?.dimensions
    ? [
        { label: "Technical", value: prediction.dimensions.technicalReadiness, color: "bg-blue-500" },
        { label: "Market Fit", value: prediction.dimensions.marketAlignment, color: "bg-purple-500" },
        { label: "Experience", value: prediction.dimensions.experienceLevel, color: "bg-green-500" },
        { label: "Portfolio", value: prediction.dimensions.portfolioStrength, color: "bg-orange-500" },
      ]
    : []

  return (
    <Card className="bg-card/20 backdrop-blur border-border/50 overflow-hidden relative">
      {/* Ambient glow */}
      <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${getScoreGradient(displayScore)}`} />

      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="w-4 h-4 text-primary" />
          Predictive Success Score
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchPrediction}
          disabled={isLoading}
          className="h-8 px-2"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={getScoreColor(displayScore)}
                stroke="currentColor"
                strokeDasharray={`${(displayScore / 100) * 213.6} 213.6`}
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-black ${getScoreColor(displayScore)}`}>{displayScore}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              Probability of landing your target role based on your current skills, roadmap progress, and market trends.
            </p>
          </div>
        </div>

        {/* Dimension Bars */}
        {dimensions.length > 0 && (
          <div className="space-y-2">
            {dimensions.map((dim, i) => (
              <motion.div
                key={dim.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-1"
              >
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{dim.label}</span>
                  <span className="font-mono">{dim.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className={`h-full rounded-full ${dim.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Insights */}
        {prediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 pt-2 border-t border-border/30"
          >
            {prediction.strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Strengths</h4>
                <ul className="space-y-0.5">
                  {prediction.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {prediction.gaps.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Gaps</h4>
                <ul className="space-y-0.5">
                  {prediction.gaps.map((g, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-orange-500 mt-0.5">!</span> {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Next Best Action</h4>
              <p className="text-xs">{prediction.nextBestAction}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
