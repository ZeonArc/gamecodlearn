import Link from "next/link"
import { Github, Twitter, Linkedin, Terminal } from "lucide-react"

export function Footer() {
  return (
    <div className="container mx-auto px-4 pb-8 mt-20">
        <footer className="rounded-3xl border border-border/40 bg-background/30 backdrop-blur-xl p-10 md:p-16 relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 relative z-10">
            <div className="col-span-1 md:col-span-2">
                <Link href="/" className="flex items-center space-x-2 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Terminal className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        GameCodLearn
                    </span>
                </Link>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                    Level up your coding skills with our gamified platform. Master Algorithms, System Design, and more.
                </p>
                <div className="flex space-x-4 mt-6">
                    <Link href="#" className="h-10 w-10 rounded-full bg-background/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors border border-border/50">
                        <Github className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="h-10 w-10 rounded-full bg-background/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors border border-border/50">
                        <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="h-10 w-10 rounded-full bg-background/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors border border-border/50">
                        <Linkedin className="h-5 w-5" />
                    </Link>
                </div>
            </div>
            
            <div>
                <h4 className="font-bold mb-6 text-foreground">Platform</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                    <li><Link href="/learn" className="hover:text-primary transition-colors">Learning Paths</Link></li>
                    <li><Link href="/problems" className="hover:text-primary transition-colors">Problem Set</Link></li>
                    <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                    <li><Link href="/pricing" className="hover:text-primary transition-colors">Pro Pricing</Link></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold mb-6 text-foreground">Company</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                    <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                    <li><Link href="/blog" className="hover:text-primary transition-colors">Engineering Blog</Link></li>
                </ul>
            </div>

            <div>
                 <h4 className="font-bold mb-6 text-foreground">Legal</h4>
                 <ul className="space-y-4 text-sm text-muted-foreground">
                    <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Settings</Link></li>
                </ul>
            </div>
        </div>
        
        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Codely Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
                 <span>System Status:</span>
                 <span className="flex items-center gap-1.5 text-green-500 font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Operational
                 </span>
            </div>
        </div>
        </footer>
    </div>
  )
}
