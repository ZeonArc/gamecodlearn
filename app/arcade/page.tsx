"use client"

import { BugBash } from "@/components/gamification/bug-bash"
import { CodeConstructor } from "@/components/gamification/code-constructor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2 } from "lucide-react"

export default function ArcadePage() {
  return (
    <div className="container py-10 space-y-8 min-h-screen">
         <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent flex justify-center items-center gap-4">
                <Gamepad2 className="h-12 w-12 text-purple-400" /> 
                Codely Arcade
            </h1>
            <p className="text-muted-foreground text-lg">
                Train your programmer eyes with fast-paced mini-games. Find bugs, reconstruct logic, and speed-run syntax.
            </p>
        </div>

        <Tabs defaultValue="bug-bash" className="max-w-4xl mx-auto">
             <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="bug-bash">Bug Bash</TabsTrigger>
                    <TabsTrigger value="constructor">Code Constructor</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="bug-bash">
                <BugBash />
            </TabsContent>

            <TabsContent value="constructor">
                <CodeConstructor />
            </TabsContent>
        </Tabs>
    </div>
  )
}
