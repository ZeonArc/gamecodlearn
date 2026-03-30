import { Hero } from "@/components/hero"
import { FeaturesGrid } from "@/components/home/features-grid"
import { HowItWorks } from "@/components/home/how-it-works"
import { Testimonials } from "@/components/home/testimonials"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
                <Button asChild size="lg" className="px-8 py-3 text-sm">
                  <Link href="/learn">
                    Start Learning Now
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-3 text-sm">
                  <Link href="/problems">
                    Solve Problems
                  </Link>
                </Button>
            </div>
        </div>
      </ScrollReveal>
    </>
  )
}
