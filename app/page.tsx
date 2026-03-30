import { Hero } from "@/components/hero"
import { FeaturesGrid } from "@/components/home/features-grid"
import { HowItWorks } from "@/components/home/how-it-works"
import { Testimonials } from "@/components/home/testimonials"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollReveal><FeaturesGrid /></ScrollReveal>
      <ScrollReveal delay={0.2}><HowItWorks /></ScrollReveal>
      <ScrollReveal delay={0.4}><Testimonials /></ScrollReveal>
      
      <ScrollReveal delay={0.6}>
        <div className="container py-24 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Master Algorithms?</h2>
            <div className="flex justify-center gap-4">
                <a href="/learn" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                    Start Learning Now
                </a>
                  <a href="/problems" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                    Solve Problems
                </a>
            </div>
        </div>
      </ScrollReveal>
    </>
  )
}
