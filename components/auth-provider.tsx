"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  role: "student" | "teacher" | null
  isTeacher: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  role: null,
  isTeacher: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState<"student" | "teacher" | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Fetch role from user_profiles
  const fetchRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", userId)
        .single()
      setRole((data?.role as "student" | "teacher") || "student")
    } catch {
      setRole("student")
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: any) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
        if (session?.user) {
          fetchRole(session.user.id)
        } else {
          setRole(null)
        }
        if (event === 'SIGNED_OUT') {
           router.refresh()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    setRole(null)
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, role, isTeacher: role === "teacher", signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
