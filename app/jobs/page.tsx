import { fetchMockJobs } from "@/lib/linkedin/client"
import Link from "next/link"
import { Briefcase, MapPin, Clock, Search, ExternalLink } from "lucide-react"

export default async function JobsPage() {
  const jobs = await fetchMockJobs()

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header Section */}
      <div className="border-b border-border/40 bg-card/20 backdrop-blur-sm sticky top-16 z-30">
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Tech Opportunities
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
                Discover roles from our simulated LinkedIn integration. Find your next position and use our AI to analyze what skills you need to land it.
            </p>
            
            <div className="mt-8 flex items-center gap-4 bg-background/50 border border-border/50 rounded-2xl p-2 max-w-2xl shadow-sm">
                <Search className="h-5 w-5 text-muted-foreground ml-3" />
                <input 
                    type="text" 
                    placeholder="Search jobs, skills, or companies..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base outline-none disabled:opacity-50"
                    disabled
                />
                <div className="hidden md:flex gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">Remote</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">Full-time</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block space-y-8">
              <div>
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Job Type</h3>
                  <div className="space-y-3">
                      {["Full-time", "Part-time", "Contract", "Internship"].map(type => (
                          <label key={type} className="flex items-center gap-3 text-sm cursor-pointer group">
                              <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary/20 bg-background" disabled />
                              <span className="group-hover:text-primary transition-colors">{type}</span>
                          </label>
                      ))}
                  </div>
              </div>
              <div>
                  <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Location</h3>
                  <div className="space-y-3">
                      {["Remote", "On-site", "Hybrid"].map(loc => (
                          <label key={loc} className="flex items-center gap-3 text-sm cursor-pointer group">
                              <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary/20 bg-background" disabled />
                              <span className="group-hover:text-primary transition-colors">{loc}</span>
                          </label>
                      ))}
                  </div>
              </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3 space-y-4">
              <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">{jobs.length} roles found</span>
                  <select className="bg-background border border-border/50 rounded-lg px-3 py-1.5 text-sm outline-none disabled:opacity-50" disabled>
                      <option>Most Recent</option>
                      <option>Most Relevant</option>
                  </select>
              </div>

              {jobs.map(job => (
                  <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                      <div className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)] transition-all duration-300 relative overflow-hidden">
                          {/* Hover Gradient Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="relative z-10">
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
                                          {job.title}
                                      </h2>
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                          <span className="font-medium text-foreground">{job.company}</span>
                                          <span>&bull;</span>
                                          <span className="flex items-center gap-1 text-sm"><MapPin className="h-3 w-3" /> {job.location}</span>
                                      </div>
                                  </div>
                                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
                                      <Briefcase className="h-6 w-6 text-primary" />
                                  </div>
                              </div>
                              
                              <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                                  {job.description}
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                      {job.tags.slice(0, 3).map(tag => (
                                          <span key={tag} className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-lg text-xs font-medium border border-border/50">
                                              {tag}
                                          </span>
                                      ))}
                                      {job.tags.length > 3 && (
                                          <span className="px-2 py-1 text-muted-foreground text-xs font-medium">+{job.tags.length - 3} more</span>
                                      )}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.postedAt}</span>
                                      <span className="text-primary group-hover:underline flex items-center gap-1">View Details <ExternalLink className="h-3 w-3" /></span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>
      </div>
    </div>
  )
}
