import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import { AIChat } from "@/components/ai-chat"
import { StreakPopup } from "@/components/gamification/streak-popup"
import { LiveBackground } from "@/components/ui/live-background"
import { AIPipelineToast } from "@/components/ui/ai-activity-toast"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OmniEngineer",
  description: "Universal AI-Mentored Engineering Training Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">
               {/* Global Ambient Background */}
               {/* Live Background Manager */}
               <LiveBackground />
               
               {/* CyberGrid is now managed by LiveBackground, but we can keep it here if LiveBackground doesn't fully replace it (it does). Removing explicit CyberGrid call */}
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <AIChat />
              <StreakPopup />
              <AIPipelineToast />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
