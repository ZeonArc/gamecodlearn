/**
 * Resilient Mock Data Fallbacks
 *
 * When the Gemini API key is missing, rate-limited, or fails during a live demo,
 * these high-quality mock responses prevent the app from crashing.
 * Every AI route should use: if (fallback) return MOCK_DATA.xxx
 */

export const MOCK_ASSESSMENTS = {
  mcq: [
    { id: 1, question: "What is the time complexity of binary search?", options: ["A) O(n)", "B) O(log n)", "C) O(n²)", "D) O(1)"], correct: "B", explanation: "Binary search halves the search space each time, giving O(log n)." },
    { id: 2, question: "Which hook re-runs when dependencies change?", options: ["A) useState", "B) useRef", "C) useEffect", "D) useMemo"], correct: "C", explanation: "useEffect runs side effects and re-executes when dependency array values change." },
    { id: 3, question: "What does REST stand for?", options: ["A) Remote Execution Standard Transfer", "B) Representational State Transfer", "C) Repeated Stateless Transaction", "D) Resource Estimation Service Tool"], correct: "B", explanation: "REST is an architectural style for networked applications." },
    { id: 4, question: "Which data structure uses FIFO?", options: ["A) Stack", "B) Queue", "C) Tree", "D) Graph"], correct: "B", explanation: "Queue follows First-In-First-Out ordering." },
    { id: 5, question: "What is a closure in JavaScript?", options: ["A) A function with no parameters", "B) A function that references variables from outer scope", "C) An immediately invoked function", "D) A class constructor"], correct: "B", explanation: "A closure captures and remembers the lexical scope in which it was created." },
    { id: 6, question: "Which HTTP method is idempotent?", options: ["A) POST", "B) PATCH", "C) PUT", "D) None"], correct: "C", explanation: "PUT is idempotent — repeating the same request produces the same result." },
    { id: 7, question: "What is the purpose of a foreign key?", options: ["A) Index optimization", "B) Referential integrity between tables", "C) Encrypting data", "D) Autoincrementing IDs"], correct: "B", explanation: "Foreign keys maintain referential integrity by linking rows across tables." },
    { id: 8, question: "What does the 'virtual DOM' optimize?", options: ["A) Network requests", "B) Database queries", "C) UI re-rendering", "D) File I/O"], correct: "C", explanation: "The virtual DOM minimizes expensive real DOM manipulations by diffing virtual trees." },
    { id: 9, question: "Which sorting algorithm is stable?", options: ["A) Quick Sort", "B) Heap Sort", "C) Merge Sort", "D) Selection Sort"], correct: "C", explanation: "Merge Sort preserves relative order of equal elements." },
    { id: 10, question: "What principle does SOLID's 'S' represent?", options: ["A) Security", "B) Single Responsibility", "C) Scalability", "D) Simplicity"], correct: "B", explanation: "The Single Responsibility Principle states a class should have only one reason to change." },
  ],
  coding: [
    {
      id: 1, title: "Two Sum", difficulty: "easy",
      description: "Given an array of integers and a target, return indices of two numbers that add up to the target.",
      examples: [{ input: "[2,7,11,15], target=9", output: "[0,1]" }],
      starterCode: "function twoSum(nums, target) {\n  // Your code here\n}",
    },
    {
      id: 2, title: "Valid Parentheses", difficulty: "easy",
      description: "Given a string containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: [{ input: "\"()[]{}\"", output: "true" }, { input: "\"(]\"", output: "false" }],
      starterCode: "function isValid(s) {\n  // Your code here\n}",
    },
    {
      id: 3, title: "Max Subarray Sum", difficulty: "medium",
      description: "Find the contiguous subarray with the largest sum (Kadane's Algorithm).",
      examples: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6 (subarray [4,-1,2,1])" }],
      starterCode: "function maxSubArray(nums) {\n  // Your code here\n}",
    },
  ],
  conceptmap: {
    concepts: [
      { id: "c1", label: "React" }, { id: "c2", label: "Components" }, { id: "c3", label: "State" },
      { id: "c4", label: "Props" }, { id: "c5", label: "Hooks" }, { id: "c6", label: "Virtual DOM" },
    ],
    connections: [
      { from: "c1", to: "c2", label: "is built with" },
      { from: "c2", to: "c4", label: "receive data via" },
      { from: "c2", to: "c3", label: "manage internal" },
    ],
    missingConnections: [
      { from: "c3", to: "c5", label: "???" },
      { from: "c1", to: "c6", label: "???" },
      { from: "c5", to: "c3", label: "???" },
    ],
  },
  viva: [
    { id: 1, question: "Explain the difference between let, const, and var in JavaScript.", difficulty: "medium" },
    { id: 2, question: "What is the event loop and how does it work in Node.js?", difficulty: "hard" },
    { id: 3, question: "Describe the CAP theorem and its implications for distributed systems.", difficulty: "hard" },
    { id: 4, question: "How would you optimize a React application that has slow rendering?", difficulty: "medium" },
    { id: 5, question: "Explain database indexing and when you would use a composite index.", difficulty: "medium" },
  ],
}

export const MOCK_GITHUB_ANALYSIS = {
  overallScore: 82,
  techStack: ["TypeScript", "React", "Next.js", "Tailwind CSS", "PostgreSQL"],
  codeQuality: { score: 78, details: "Good naming conventions. Consider reducing function length in some modules." },
  architecture: { score: 85, details: "Clean separation of concerns. Good use of Next.js app router patterns." },
  bestPractices: { score: 83, details: "TypeScript usage is strong. Missing some error boundary implementations." },
  improvements: [
    { priority: "high", suggestion: "Add comprehensive error boundaries", reason: "Prevents white screens of death in production" },
    { priority: "medium", suggestion: "Implement React.memo for expensive renders", reason: "Improves performance on data-heavy pages" },
    { priority: "low", suggestion: "Add JSDoc comments to exported functions", reason: "Improves developer experience and IDE support" },
  ],
  summary: "This is a well-structured Next.js application with strong TypeScript usage. The codebase follows modern React patterns and has good architecture. Main areas for improvement are error handling and performance optimization.",
}

export const MOCK_HR_JOBS = [
  {
    id: "job1", title: "Full Stack Developer", company: "TechCorp", location: "Remote",
    postedAt: "2 days ago", salary: "$120k-$150k",
    match: {
      matchPercent: 87,
      matchedSkills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      missingSkills: ["AWS", "Docker"],
      recommendation: "Strong match. Consider getting AWS certified to increase your competitiveness.",
    },
  },
  {
    id: "job2", title: "Frontend Engineer", company: "DesignStudio", location: "San Francisco, CA",
    postedAt: "1 week ago", salary: "$100k-$130k",
    match: {
      matchPercent: 92,
      matchedSkills: ["React", "TypeScript", "CSS", "Next.js", "Figma"],
      missingSkills: ["Vue.js"],
      recommendation: "Excellent match! Your frontend skills align perfectly with this role.",
    },
  },
  {
    id: "job3", title: "AI/ML Engineer", company: "DataMinds", location: "New York, NY",
    postedAt: "3 days ago", salary: "$140k-$180k",
    match: {
      matchPercent: 45,
      matchedSkills: ["Python"],
      missingSkills: ["TensorFlow", "PyTorch", "MLOps", "Kubernetes"],
      recommendation: "Skill gap is significant. Consider completing the AI/ML roadmap first before applying.",
    },
  },
]

export const MOCK_COVER_LETTER = `Dear Hiring Manager,

I am excited to apply for the Full Stack Developer position at TechCorp. With my strong foundation in React, TypeScript, and Node.js, combined with my passion for building scalable web applications, I am confident I would be a valuable addition to your team.

In my recent projects, I have:
- Built AI-powered educational platforms using Next.js and Supabase
- Implemented real-time collaboration features with WebSocket integration
- Designed and deployed RESTful APIs serving 10,000+ requests/minute
- Created responsive, accessible UIs with modern design systems

I am particularly drawn to TechCorp's mission of democratizing technology education. Your commitment to open-source aligns perfectly with my values, and I would love the opportunity to contribute to your engineering culture.

I look forward to discussing how my skills and experience can contribute to your team's success.

Best regards,
[Your Name]`

export const MOCK_COURSERA_PLAN = {
  learningPath: "Full Stack Development Mastery",
  totalWeeks: 16,
  phases: [
    {
      phase: "Foundation",
      weeks: "1-4",
      courses: [
        { title: "HTML, CSS, and Javascript for Web Developers", provider: "Johns Hopkins", url: "https://coursera.org/learn/html-css-javascript-for-web-developers", rating: 4.7 },
        { title: "Version Control with Git", provider: "Atlassian", url: "https://coursera.org/learn/version-control-with-git", rating: 4.6 },
      ],
    },
    {
      phase: "Frontend Mastery",
      weeks: "5-8",
      courses: [
        { title: "React Basics", provider: "Meta", url: "https://coursera.org/learn/react-basics", rating: 4.6 },
        { title: "Advanced React", provider: "Meta", url: "https://coursera.org/learn/advanced-react", rating: 4.5 },
      ],
    },
    {
      phase: "Backend & Databases",
      weeks: "9-12",
      courses: [
        { title: "Server-side Development with NodeJS", provider: "HKUST", url: "https://coursera.org/learn/server-side-nodejs", rating: 4.5 },
        { title: "Databases and SQL for Data Science", provider: "IBM", url: "https://coursera.org/learn/sql-data-science", rating: 4.6 },
      ],
    },
    {
      phase: "DevOps & Deployment",
      weeks: "13-16",
      courses: [
        { title: "Introduction to Cloud Computing", provider: "IBM", url: "https://coursera.org/learn/introduction-to-cloud", rating: 4.5 },
        { title: "Continuous Integration/Continuous Delivery", provider: "IBM", url: "https://coursera.org/learn/devops-continuous-delivery", rating: 4.4 },
      ],
    },
  ],
  estimatedCompletion: "4 months at 10 hrs/week",
}

export const MOCK_VIVA_EVALUATION = `## Evaluation

**Score: 7/10** ✅

### Strengths
- Good understanding of the core concept
- Clear and structured explanation
- Relevant examples provided

### Areas for Improvement
- Could go deeper into edge cases
- Missing discussion of performance implications
- Consider mentioning real-world applications

### Key Takeaway
Your answer demonstrates solid foundational knowledge. To reach an expert level, practice explaining the "why" behind design decisions, not just the "what."`

export const MOCK_PROBLEM_SOLUTIONS = {
  solutions: [
    {
      approach: "Hash Map (Optimal)",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      code: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      explanation: "Use a hash map to store seen values and their indices. For each element, check if its complement exists in the map.",
    },
    {
      approach: "Brute Force",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      code: "function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}",
      explanation: "Check every pair of numbers. Simple but inefficient for large inputs.",
    },
  ],
}

export const MOCK_AI_COURSE = {
  id: "ai-generated-course",
  title: "Full Stack Development 🚀",
  description: "A comprehensive AI-generated course covering modern full-stack development from frontend to deployment.",
  difficulty: "intermediate",
  estimatedHours: 12,
  prerequisites: ["Basic HTML/CSS knowledge", "JavaScript fundamentals"],
  learningOutcomes: [
    "Build modern React applications with hooks and state management",
    "Create REST APIs with Node.js and Express",
    "Deploy applications to production environments",
  ],
  modules: [
    {
      id: "m1",
      title: "Module 1: Modern React Fundamentals",
      lessons: [
        {
          id: "l1",
          title: "Components & JSX",
          type: "text",
          content: "# React Components & JSX\n\nReact is a JavaScript library for building user interfaces. At its core, React lets you create **components** — reusable pieces of UI.\n\n## What is JSX?\n\nJSX is a syntax extension that looks like HTML but lives inside JavaScript:\n\n```jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\n## Function Components\n\nModern React uses **function components** exclusively:\n\n```jsx\nfunction UserCard({ user }) {\n  return (\n    <div className=\"card\">\n      <img src={user.avatar} alt={user.name} />\n      <h2>{user.name}</h2>\n      <p>{user.bio}</p>\n    </div>\n  );\n}\n```\n\n## Key Takeaways\n- Components are reusable building blocks\n- JSX combines HTML-like syntax with JavaScript expressions\n- Props pass data from parent to child components\n- Always return a single root element (or use fragments `<></>`)",
        },
        {
          id: "l2",
          title: "State & Hooks",
          type: "text",
          content: "# React State & Hooks\n\nState lets components remember things between renders.\n\n## useState Hook\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```\n\n## useEffect Hook\n\nSide effects (API calls, subscriptions, timers):\n\n```jsx\nimport { useState, useEffect } from 'react';\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    fetch(`/api/users/${userId}`)\n      .then(res => res.json())\n      .then(data => setUser(data));\n  }, [userId]); // Re-runs when userId changes\n\n  if (!user) return <p>Loading...</p>;\n  return <h1>{user.name}</h1>;\n}\n```\n\n## Rules of Hooks\n1. Only call hooks at the top level\n2. Only call hooks in React functions\n3. Custom hooks start with `use`",
        },
      ],
    },
    {
      id: "m2",
      title: "Module 2: Building APIs with Node.js",
      lessons: [
        {
          id: "l3",
          title: "Express.js Basics",
          type: "text",
          content: "# Building REST APIs with Express.js\n\nExpress is a minimal web framework for Node.js.\n\n## Setup\n\n```bash\nnpm init -y\nnpm install express\n```\n\n## Your First API\n\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\n// GET endpoint\napp.get('/api/users', (req, res) => {\n  res.json([\n    { id: 1, name: 'Alice' },\n    { id: 2, name: 'Bob' },\n  ]);\n});\n\n// POST endpoint\napp.post('/api/users', (req, res) => {\n  const { name } = req.body;\n  const newUser = { id: Date.now(), name };\n  res.status(201).json(newUser);\n});\n\napp.listen(3001, () => {\n  console.log('API running on port 3001');\n});\n```\n\n## RESTful Route Conventions\n| Method | Route | Action |\n|--------|-------|--------|\n| GET | /api/items | List all |\n| GET | /api/items/:id | Get one |\n| POST | /api/items | Create |\n| PUT | /api/items/:id | Update |\n| DELETE | /api/items/:id | Delete |",
        },
        {
          id: "l4",
          title: "Database Integration",
          type: "text",
          content: "# Connecting to a Database\n\nMost APIs need persistent storage. Here's how to connect to PostgreSQL.\n\n## Using Prisma ORM\n\n```bash\nnpm install prisma @prisma/client\nnpx prisma init\n```\n\n## Define Your Schema\n\n```prisma\nmodel User {\n  id    Int     @id @default(autoincrement())\n  email String  @unique\n  name  String?\n  posts Post[]\n}\n\nmodel Post {\n  id       Int    @id @default(autoincrement())\n  title    String\n  content  String?\n  author   User   @relation(fields: [authorId], references: [id])\n  authorId Int\n}\n```\n\n## Query Data\n\n```typescript\nimport { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\n\n// Create\nconst user = await prisma.user.create({\n  data: { email: 'alice@example.com', name: 'Alice' }\n});\n\n// Read with relations\nconst users = await prisma.user.findMany({\n  include: { posts: true }\n});\n```\n\n## Key Concepts\n- **ORM** maps database tables to code objects\n- **Migrations** track schema changes over time\n- **Relations** connect related data across tables",
        },
      ],
    },
    {
      id: "m3",
      title: "Module 3: Deployment & DevOps",
      lessons: [
        {
          id: "l5",
          title: "Deploying to Vercel",
          type: "text",
          content: "# Deploying Your Application\n\n## Vercel (Recommended for Next.js)\n\n1. Push your code to GitHub\n2. Connect your repo to [vercel.com](https://vercel.com)\n3. Configure environment variables\n4. Deploy!\n\n```bash\n# Install Vercel CLI\nnpm install -g vercel\n\n# Deploy from terminal\nvercel --prod\n```\n\n## Environment Variables\n\nNever commit secrets to git:\n\n```env\n# .env.local (never committed)\nDATABASE_URL=postgresql://...\nAPI_SECRET=your-secret-key\nNEXT_PUBLIC_APP_URL=https://myapp.vercel.app\n```\n\n## CI/CD Pipeline\n\nVercel automatically:\n- Builds on every push to `main`\n- Creates preview deployments for PRs\n- Rolls back on build failures\n- Handles SSL certificates",
        },
        {
          id: "l6",
          title: "Performance Optimization",
          type: "text",
          content: "# Performance Best Practices\n\n## Frontend\n\n```jsx\n// Lazy loading components\nimport { lazy, Suspense } from 'react';\n\nconst HeavyChart = lazy(() => import('./HeavyChart'));\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<Skeleton />}>\n      <HeavyChart />\n    </Suspense>\n  );\n}\n```\n\n## Image Optimization\n\n```jsx\nimport Image from 'next/image';\n\n<Image\n  src=\"/hero.jpg\"\n  width={1200}\n  height={600}\n  alt=\"Hero image\"\n  priority // Load above-the-fold images immediately\n/>\n```\n\n## Backend\n- Use **caching** (Redis) for frequently accessed data\n- Implement **pagination** for large lists\n- Add **database indexes** on frequently queried columns\n- Use **connection pooling** for database connections",
        },
        {
          id: "l7",
          title: "Course Summary & Next Steps",
          type: "text",
          content: "# 🎉 Course Complete!\n\n## What You've Learned\n\n1. **React Fundamentals** — Components, JSX, State, Hooks\n2. **API Development** — Express.js, REST conventions, database integration\n3. **Deployment** — Vercel, environment variables, CI/CD\n4. **Performance** — Lazy loading, image optimization, caching\n\n## Recommended Next Steps\n\n- [ ] Build a full-stack project combining all concepts\n- [ ] Learn TypeScript for type-safe development\n- [ ] Explore authentication (NextAuth.js, Supabase Auth)\n- [ ] Study system design for scalable architectures\n- [ ] Practice coding challenges on the Problems page\n\n## Resources\n- [Next.js Documentation](https://nextjs.org/docs)\n- [React Documentation](https://react.dev)\n- [Prisma Documentation](https://www.prisma.io/docs)\n- [Vercel Platform](https://vercel.com)",
        },
      ],
    },
  ],
}
