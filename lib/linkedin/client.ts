export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // "Full-time", "Contract", "Internship"
  postedAt: string;
  description: string;
  tags: string[];
}

/**
 * Simulates fetching job postings from LinkedIn or another Job Board.
 * Direct access to LinkedIn's Job API requires partner approval, so this provides
 * a structured, realistic dataset for the AI Mentor to analyze.
 */
export async function fetchMockJobs(): Promise<JobPosting[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      id: "job-001",
      title: "Junior Frontend Engineer",
      company: "TechNova Solutions",
      location: "Remote (San Francisco, CA)",
      type: "Full-time",
      postedAt: "2 days ago",
      tags: ["React", "TypeScript", "CSS", "Frontend"],
      description: `TechNova is looking for a passionate Junior Frontend Engineer to join our core product team.
      
Responsibilities:
- Build responsive, accessible, and highly performant user interfaces using React and modern CSS.
- Collaborate with designers to translate Figma mockups into living code.
- Write unit tests and participate in code reviews to ensure quality.

Requirements:
- 1-2 years of experience with HTML, CSS, and modern JavaScript (ES6+).
- Strong proficiency in React and a good understanding of component lifecycle and state management.
- Experience with TypeScript is a massive plus.
- Basic understanding of web performance optimization and accessibility standards.`,
    },
    {
      id: "job-002",
      title: "Backend Software Developer",
      company: "DataStream Systems",
      location: "New York, NY (Hybrid)",
      type: "Full-time",
      postedAt: "5 hours ago",
      tags: ["Node.js", "Python", "SQL", "Backend", "API"],
      description: `Join DataStream as a Backend Developer to build robust and scalable APIs powering our data analytics platform.

Responsibilities:
- Design, develop, and maintain high-performance RESTful APIs.
- Optimize database queries and schema designs for PostgreSQL.
- Implement secure authentication and authorization flows.
- Work closely with frontend engineers to integrate APIs.

Requirements:
- Solid understanding of server-side languages, primarily Node.js or Python.
- Strong knowledge of SQL and relational databases.
- Familiarity with cloud services (AWS or GCP).
- Understanding of distributed systems and microservices architecture is preferred.`,
    },
    {
      id: "job-003",
      title: "Machine Learning Intern",
      company: "AI Frontiers",
      location: "Remote",
      type: "Internship",
      postedAt: "1 week ago",
      tags: ["Python", "TensorFlow", "Data Science", "AI"],
      description: `AI Frontiers is offering a 12-week summer internship for students passionate about Artificial Intelligence and Machine Learning.

Responsibilities:
- Assist in data collection, cleaning, and preprocessing for model training.
- Run experiments, tune hyperparameters, and evaluate model performance.
- Develop scripts to automate data pipelines.
- Present findings and model results to the ML team.

Requirements:
- Currently pursuing a BS/MS in Computer Science, Mathematics, or related field.
- Proficiency in Python, Pandas, and NumPy.
- Basic understanding of ML algorithms and frameworks (e.g., Scikit-Learn, TensorFlow, or PyTorch).
- Strong analytical and problem-solving skills.`,
    },
    {
      id: "job-004",
      title: "Full Stack Engineer",
      company: "GrowthStack Startup",
      location: "Austin, TX (On-site)",
      type: "Full-time",
      postedAt: "1 day ago",
      tags: ["Next.js", "React", "PostgreSQL", "Fullstack", "Startup"],
      description: `GrowthStack is an early-stage startup looking for a versatile Full Stack Engineer to help build our MVP.

Responsibilities:
- Take ownership of features from database schema design to frontend implementation.
- Build scalable web applications using Next.js, React, and Tailwind CSS.
- Design database architectures and write efficient SQL queries.
- Rapidly iterate on product feedback and ship features daily.

Requirements:
- 3+ years of experience building full-stack web applications.
- Deep expertise in React and modern Next.js (App Router).
- Strong experience with relational databases (PostgreSQL preferred).
- Ability to work independently in a fast-paced, ambiguous startup environment.`,
    }
  ];
}

export async function getMockJobById(id: string): Promise<JobPosting | null> {
    const jobs = await fetchMockJobs();
    return jobs.find(j => j.id === id) || null;
}
