import { ArrayVisualizer } from "@/components/dsa/array-visualizer"
import { TreeVisualizer } from "@/components/dsa/tree-visualizer"
import { HeapVisualizer } from "@/components/dsa/heap-visualizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MemoryLab } from "@/components/dsa/memory-lab"
import { LinkedListVisualizer } from "@/components/dsa/linked-list-visualizer"
import { StackQueueVisualizer } from "@/components/dsa/stack-queue-visualizer"

export default function DSALearnPage() {
  return (
    <div className="container py-10 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Interactive DSA Lab
            </h1>
            <p className="text-muted-foreground text-lg">
                Visualize memory, build trees, and master algorithms with interactive playgrounds.
            </p>
        </div>

        <Tabs defaultValue="memory" className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                <TabsList className="grid w-auto grid-cols-5 min-w-[600px]">
                    <TabsTrigger value="memory">Memory & Refs</TabsTrigger>
                    <TabsTrigger value="arrays">Arrays</TabsTrigger>
                    <TabsTrigger value="stacks">Stacks & Queues</TabsTrigger>
                    <TabsTrigger value="lists">Linked Lists</TabsTrigger>
                    <TabsTrigger value="trees">Trees & Heaps</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="memory" className="space-y-4">
                <MemoryLab />
            </TabsContent>

            <TabsContent value="arrays" className="space-y-4">
                <ArrayVisualizer />
            </TabsContent>
            
            <TabsContent value="stacks" className="space-y-4">
                <StackQueueVisualizer />
            </TabsContent>

            <TabsContent value="lists" className="space-y-4">
                <LinkedListVisualizer />
            </TabsContent>
            
            <TabsContent value="trees" className="space-y-4 grid gap-8">
                <TreeVisualizer />
                <HeapVisualizer />
            </TabsContent>
        </Tabs>
    </div>
  )
}
