"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { LightMesh } from "./backgrounds/light-mesh"
import { DarkParticles } from "./backgrounds/dark-particles"


export function LiveBackground() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentTheme = theme === "system" ? resolvedTheme : theme



  if (currentTheme === "dark") {
      return <DarkParticles />
  }

  return <LightMesh />
}
