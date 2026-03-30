"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Code, Target, ChevronRight, ChevronLeft, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"

const ONBOARDING_STEPS = [
  {
    id: "background",
    title: "Your Background",
    description: "Tell us where you are starting from.",
    icon: Brain
  },
  {
    id: "skills",
    title: "Current Skills",
    description: "What tools are in your belt?",
    icon: Code
  },
  {
    id: "goals",
    title: "Career Goals",
    description: "Where do you want to go?",
    icon: Target
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    academic_background: "",
    skills: "", // Will split into array
    interests: "", // Will split into array
    career_goal: ""
  })

  // Prevent accessing without auth
  if (!user) {
      if (typeof window !== 'undefined') router.push('/auth')
      return null
  }

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      submitProfile()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const submitProfile = async () => {
    setIsSubmitting(true)
    
    // Process input
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s)
    const interestsArray = formData.interests.split(',').map(s => s.trim()).filter(s => s)

    try {
      // 1. Save Profile to DB
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          academic_background: formData.academic_background,
          skills: skillsArray,
          interests: interestsArray,
          career_goal: formData.career_goal
        }, { onConflict: 'user_id' })

      if (profileError) throw profileError

      // 2. Trigger AI Roadmap Generation via API
      // In a real app, you might await this or do it asynchronously via a webhook
      await fetch('/api/mentor/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
      })

      // Redirect to Dashboard (which will show the loading/generated roadmap)
      router.push('/dashboard')
      
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentIcon = ONBOARDING_STEPS[currentStep].icon

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Visual background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      
      <div className="w-full max-w-xl relative z-10">
        
        {/* Progress Display */}
        <div className="mb-8 flex justify-center gap-2">
            {ONBOARDING_STEPS.map((step, idx) => (
                <div key={step.id} className={`h-2 rounded-full transition-all duration-500 ${idx <= currentStep ? 'w-12 bg-primary shadow-[0_0_10px_var(--primary)]' : 'w-4 bg-muted'}`} />
            ))}
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border pb-8 pt-10 px-8 rounded-2xl shadow-2xl relative overflow-hidden">
             {/* Decorative glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl transition-opacity duration-700 ${isSubmitting ? 'animate-pulse opacity-100' : 'opacity-50'}`} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                            <CurrentIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{ONBOARDING_STEPS[currentStep].title}</h2>
                            <p className="text-muted-foreground">{ONBOARDING_STEPS[currentStep].description}</p>
                        </div>
                    </div>

                    <div className="space-y-6 mt-8">
                        {currentStep === 0 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>What is your current academic/professional status?</Label>
                                    <Input 
                                        placeholder="e.g. 3rd Year CS Student, Self-taught Dev..." 
                                        value={formData.academic_background}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, academic_background: e.target.value})}
                                        className="bg-background/50"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>List your technical skills (comma separated)</Label>
                                    <Textarea 
                                        placeholder="JavaScript, React, Python, Figma..." 
                                        value={formData.skills}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, skills: e.target.value})}
                                        className="bg-background/50 min-h-[100px]"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>What is your target role or goal?</Label>
                                    <Input 
                                        placeholder="e.g. Full Stack Developer, AI Engineer..." 
                                        value={formData.career_goal}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, career_goal: e.target.value})}
                                        className="bg-background/50"
                                        autoFocus
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <Label>What specific areas interest you? (comma separated)</Label>
                                    <Input 
                                        placeholder="e.g. Machine Learning, Cloud Architecture..." 
                                        value={formData.interests}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, interests: e.target.value})}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
                <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    disabled={currentStep === 0 || isSubmitting}
                    className={currentStep === 0 ? "opacity-0 pointer-events-none" : ""}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                <Button 
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="relative group overflow-hidden"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                            Building Roadmap...
                        </>
                    ) : currentStep === ONBOARDING_STEPS.length - 1 ? (
                        <>
                            Generate AI Path <Sparkles className="w-4 h-4 ml-2 text-yellow-300" />
                        </>
                    ) : (
                        <>
                            Continue <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
