"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { ArrowDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { XPBadge } from "@/components/gamification/xp-badge"

export function Navbar() {
  const { user, signOut, isTeacher } = useAuth()

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2.5 group">
            {/* Modern Minimal Logo */}
            <div className="h-8 w-8 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-[10px] transform rotate-3 group-hover:rotate-6 transition-transform shadow-sm" />
                <div className="absolute inset-px bg-background rounded-[9px] flex items-center justify-center">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-primary to-accent">C</span>
                </div>
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight text-foreground">
              OmniEngineer
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger className="transition-colors hover:text-primary text-foreground/80 flex items-center gap-1 outline-none">
                Domain Hub
                <ArrowDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Select your path</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/learn/school" className="flex items-center gap-2 cursor-pointer">
                    <span>🚀</span> School Zone
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/learn/college" className="flex items-center gap-2 cursor-pointer">
                    <span>🎓</span> College & CS
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/learn/pro" className="flex items-center gap-2 cursor-pointer">
                    <span>💼</span> Professional
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

             <Link
              href="/arcade"
              className="transition-colors hover:text-primary text-foreground/80"
            >
              Arcade
            </Link>
            <Link
              href="/problems"
              className="transition-colors hover:text-primary text-foreground/80"
            >
              Problems
            </Link>
            <Link
              href="/jobs"
              className="transition-colors hover:text-primary text-foreground/80 font-semibold"
            >
              Jobs
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="transition-colors hover:text-primary text-foreground/80 flex items-center gap-1 outline-none">
                AI Mentor
                <ArrowDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>AI Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="flex items-center gap-2 cursor-pointer">
                    <span>💬</span> AI Chat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mentor/interview" className="flex items-center gap-2 cursor-pointer">
                    <span>🧠</span> Mock Interview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mentor/resume" className="flex items-center gap-2 cursor-pointer">
                    <span>📄</span> Smart Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mentor/assessment" className="flex items-center gap-2 cursor-pointer">
                    <span>📝</span> AI Assessments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mentor/github" className="flex items-center gap-2 cursor-pointer">
                    <span>🐙</span> GitHub Analyzer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mentor/hr-bot" className="flex items-center gap-2 cursor-pointer">
                    <span>💼</span> Career Match
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isTeacher && (
              <Link
                href="/teacher"
                className="transition-colors hover:text-emerald-400 text-emerald-500/80 font-semibold"
              >
                Teacher Panel
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none flex items-center gap-4">
             <XPBadge />
             {/* Search or other items */}
          </div>
          <nav className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth?mode=signup">Get Started</Link>
                </Button>
              </>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </div>
  )
}
