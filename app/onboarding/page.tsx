"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Code, Target, ChevronRight, ChevronLeft, Sparkles, Loader2, GraduationCap, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client"

const SKILLS_LIBRARY = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust",
  "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express",
  "HTML/CSS", "Tailwind", "SQL", "PostgreSQL", "MongoDB",
  "Docker", "AWS", "Git", "Linux", "Machine Learning", "TensorFlow",
  "Data Structures", "Algorithms", "System Design", "REST APIs", "GraphQL",
  "Figma", "UI/UX", "Cybersecurity", "DevOps", "CI/CD"
]

const ONBOARDING_STEPS = [
  { id: "role", title: "I am a...", description: "Select your role to personalize your experience.", icon: GraduationCap },
  { id: "background", title: "Your Background", description: "Tell us where you are starting from.", icon: Brain },
  { id: "skills", title: "Current Skills", description: "Select the tools in your belt.", icon: Code },
  { id: "github", title: "GitHub Connect", description: "Link your GitHub for code analysis.", icon: Github },
  { id: "goals", title: "Career Goals", description: "Where do you want to go?", icon: Target },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    role: "student" as "student" | "teacher",
    academic_background: "",
    institution: "",
    skills: [] as string[],
    interests: "",
    career_goal: "",
    github_username: "",
    class_code: "",
  })

  if (!user) {
    if (typeof window !== "undefined") router.push("/auth")
    return null
  }

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      submitProfile()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1)
  }

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const submitProfile = async () => {
    setIsSubmitting(true)
    const interestsArray = formData.interests.split(",").map((s) => s.trim()).filter((s) => s)

    try {
      const { error: profileError } = await supabase.from("user_profiles").upsert(
        {
          user_id: user.id,
          role: formData.role,
          academic_background: formData.academic_background,
          institution: formData.institution,
          skills: formData.skills,
          interests: interestsArray,
          career_goal: formData.career_goal,
          github_username: formData.github_username || null,
          class_code: formData.class_code || null,
        },
        { onConflict: "user_id" }
      )

      if (profileError) throw profileError

      // Trigger AI Roadmap only for students
      if (formData.role === "student") {
        await fetch("/api/mentor/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        })
        router.push("/dashboard")
      } else {
        router.push("/teacher")
      }
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Progress */}
        <div className="mb-8 flex justify-center gap-2">
          {ONBOARDING_STEPS.map((step, idx) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx <= currentStep ? "w-12 bg-primary shadow-[0_0_10px_var(--primary)]" : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border pb-8 pt-10 px-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className={`absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl transition-opacity duration-700 ${isSubmitting ? "animate-pulse opacity-100" : "opacity-50"}`} />

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
                {/* Step 0: Role */}
                {currentStep === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { role: "student" as const, label: "Student", desc: "Learn, practice & get AI-guided", emoji: "🎓" },
                      { role: "teacher" as const, label: "Teacher / Faculty", desc: "Monitor students, assign tasks", emoji: "👨‍🏫" },
                    ].map((item) => (
                      <button
                        key={item.role}
                        onClick={() => setFormData({ ...formData, role: item.role })}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${
                          formData.role === item.role
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                            : "border-border/50 hover:border-primary/30"
                        }`}
                      >
                        <div className="text-3xl mb-2">{item.emoji}</div>
                        <h3 className="font-bold">{item.label}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 1: Background */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>What is your current academic/professional status?</Label>
                      <Input
                        placeholder="e.g. 3rd Year CS Student, Self-taught Dev..."
                        value={formData.academic_background}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, academic_background: e.target.value })
                        }
                        className="bg-background/50"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution / Organization (optional)</Label>
                      <Input
                        placeholder="e.g. MIT, Google, Self-taught..."
                        value={formData.institution}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, institution: e.target.value })
                        }
                        className="bg-background/50"
                      />
                    </div>
                    {formData.role === "student" && (
                      <div className="space-y-2">
                        <Label>Class Code (if given by teacher)</Label>
                        <Input
                          placeholder="e.g. CS101-2024"
                          value={formData.class_code}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, class_code: e.target.value })
                          }
                          className="bg-background/50"
                        />
                      </div>
                    )}
                    {formData.role === "teacher" && (
                      <div className="space-y-2">
                        <Label>Your Class Code (students will use this to join)</Label>
                        <Input
                          placeholder="e.g. CS101-2024"
                          value={formData.class_code}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, class_code: e.target.value })
                          }
                          className="bg-background/50"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Skills (tag picker) */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Label>Select your skills (click to toggle)</Label>
                    <div className="flex flex-wrap gap-2 max-h-[250px] overflow-auto">
                      {SKILLS_LIBRARY.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            formData.skills.includes(skill)
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border/50"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{formData.skills.length} skills selected</p>
                  </div>
                )}

                {/* Step 3: GitHub */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>GitHub Username (optional)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">github.com/</span>
                        <Input
                          placeholder="your-username"
                          value={formData.github_username}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, github_username: e.target.value })
                          }
                          className="bg-background/50 pl-[6.5rem]"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Connect your GitHub to enable AI code analysis and portfolio review.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Career Goals */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        {formData.role === "teacher" ? "What subjects do you teach?" : "What is your target role or goal?"}
                      </Label>
                      <Input
                        placeholder={formData.role === "teacher" ? "e.g. Data Structures, Web Development..." : "e.g. Full Stack Developer, AI Engineer..."}
                        value={formData.career_goal}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, career_goal: e.target.value })
                        }
                        className="bg-background/50"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Areas of interest (comma separated)</Label>
                      <Input
                        placeholder="e.g. Machine Learning, Cloud Architecture..."
                        value={formData.interests}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, interests: e.target.value })
                        }
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

            <Button onClick={handleNext} disabled={isSubmitting} className="relative group overflow-hidden">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {formData.role === "teacher" ? "Setting up..." : "Building Roadmap..."}
                </>
              ) : currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>
                  {formData.role === "teacher" ? "Launch Faculty Panel" : "Generate AI Path"}{" "}
                  <Sparkles className="w-4 h-4 ml-2 text-yellow-300" />
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
