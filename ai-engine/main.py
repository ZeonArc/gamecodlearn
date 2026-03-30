from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import networkx as nx
import random

app = FastAPI(title="AI Career Mentor Engine")

# Allow all origins for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request/Response Models ───────────────────────────────────────────────────

class SkillGapReq(BaseModel):
    current_skills: List[str]
    target_role: str

class InterviewStartReq(BaseModel):
    role: str
    company_type: Optional[str] = "Startup"

class InterviewAnswerReq(BaseModel):
    role: str
    difficulty: int
    question: str
    user_answer: str
    company_type: Optional[str] = "Startup"

class RecommendationReq(BaseModel):
    missing_skills: List[str]
    target_role: str

# ─── Rich Knowledge Base ──────────────────────────────────────────────────────

ROLE_REQUIREMENTS = {
    "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "TypeScript", "React",
        "State Management", "REST APIs", "Testing", "Performance Optimization",
        "Responsive Design", "Git", "System Design"
    ],
    "Backend Developer": [
        "Python", "Node.js", "Databases", "SQL", "REST APIs",
        "Authentication", "Docker", "CI/CD", "System Architecture",
        "Caching", "Message Queues", "Git"
    ],
    "Full Stack Developer": [
        "HTML", "CSS", "JavaScript", "React", "Node.js",
        "Databases", "REST APIs", "Authentication", "Docker",
        "Git", "Testing", "System Design"
    ],
    "Data Scientist": [
        "Python", "Statistics", "Machine Learning", "Deep Learning",
        "Data Visualization", "SQL", "Pandas", "NumPy",
        "Feature Engineering", "Model Deployment", "Git"
    ],
    "DevOps Engineer": [
        "Linux", "Docker", "Kubernetes", "CI/CD", "AWS/Cloud",
        "Terraform", "Monitoring", "Networking", "Scripting",
        "Git", "Security"
    ],
    "Mobile Developer": [
        "JavaScript", "React Native", "State Management", "REST APIs",
        "UI/UX Design", "Native APIs", "App Store Deployment",
        "Testing", "Performance Optimization", "Git"
    ]
}

SKILL_DEPENDENCIES = {
    "HTML": [],
    "CSS": ["HTML"],
    "JavaScript": ["HTML", "CSS"],
    "TypeScript": ["JavaScript"],
    "React": ["JavaScript"],
    "React Native": ["JavaScript", "React"],
    "State Management": ["React"],
    "Responsive Design": ["CSS"],
    "REST APIs": ["JavaScript"],
    "Testing": ["JavaScript"],
    "Performance Optimization": ["React", "JavaScript"],
    "System Design": ["REST APIs", "Databases"],
    "Node.js": ["JavaScript"],
    "Python": [],
    "Databases": [],
    "SQL": ["Databases"],
    "Authentication": ["REST APIs"],
    "Docker": ["Git"],
    "CI/CD": ["Docker", "Git"],
    "System Architecture": ["System Design", "Docker"],
    "Caching": ["Databases"],
    "Message Queues": ["Node.js"],
    "Git": [],
    "Statistics": ["Python"],
    "Machine Learning": ["Python", "Statistics"],
    "Deep Learning": ["Machine Learning"],
    "Data Visualization": ["Python"],
    "Pandas": ["Python"],
    "NumPy": ["Python"],
    "Feature Engineering": ["Pandas", "Statistics"],
    "Model Deployment": ["Docker", "Machine Learning"],
    "Linux": [],
    "Kubernetes": ["Docker"],
    "AWS/Cloud": ["Linux"],
    "Terraform": ["AWS/Cloud"],
    "Monitoring": ["Linux"],
    "Networking": ["Linux"],
    "Scripting": ["Linux"],
    "Security": ["Networking"],
    "UI/UX Design": [],
    "Native APIs": ["React Native"],
    "App Store Deployment": ["React Native"],
}

COURSE_DATABASE = {
    "HTML": {"course": "HTML & CSS Mastery — freeCodeCamp", "cert": "Meta Front-End Developer Certificate", "project": "Build a personal portfolio website"},
    "CSS": {"course": "Advanced CSS & Sass — Udemy (Free)", "cert": "Responsive Web Design — freeCodeCamp", "project": "Create a CSS animation showcase"},
    "JavaScript": {"course": "JavaScript Algorithms — freeCodeCamp", "cert": "JavaScript Certification — freeCodeCamp", "project": "Build a task manager app"},
    "TypeScript": {"course": "TypeScript for Beginners — Scrimba", "cert": "TypeScript Essential Training — LinkedIn", "project": "Convert a JS project to TypeScript"},
    "React": {"course": "Full Stack Open — University of Helsinki", "cert": "Meta React Developer Certificate", "project": "Build a real-time chat application"},
    "State Management": {"course": "Redux Toolkit Tutorial — Official Docs", "cert": "Advanced React — Scrimba", "project": "Build a shopping cart with global state"},
    "REST APIs": {"course": "RESTful APIs — Coursera", "cert": "API Design Certification — Postman", "project": "Build a weather dashboard using APIs"},
    "Node.js": {"course": "Node.js — The Odin Project", "cert": "Node.js Backend — freeCodeCamp", "project": "Build a REST API with authentication"},
    "Python": {"course": "Python for Everybody — Coursera", "cert": "Python Certification — freeCodeCamp", "project": "Build a web scraper"},
    "Databases": {"course": "Database Engineering — CMU 15-445", "cert": "MongoDB Developer Certificate", "project": "Design a multi-tenant database schema"},
    "SQL": {"course": "SQL for Data Science — Coursera", "cert": "SQL Certification — HackerRank", "project": "Build a reporting dashboard with SQL"},
    "Docker": {"course": "Docker for Beginners — KodeKloud", "cert": "Docker Certified Associate", "project": "Containerize a full-stack app"},
    "Git": {"course": "Git & GitHub — The Odin Project", "cert": "Git Certification — GitLab", "project": "Contribute to an open source project"},
    "Testing": {"course": "JavaScript Testing — Kent C. Dodds", "cert": "ISTQB Foundation", "project": "Write a test suite for a React app"},
    "System Design": {"course": "System Design Primer — GitHub", "cert": "Grokking System Design", "project": "Design a URL shortener system"},
    "Authentication": {"course": "OAuth 2.0 & JWT — Udemy", "cert": "Security+ Certification", "project": "Build a secure login system"},
    "Performance Optimization": {"course": "Web Performance — Google Dev", "cert": "Core Web Vitals Certification", "project": "Optimize a React app to score 100 on Lighthouse"},
    "Responsive Design": {"course": "Responsive Design — freeCodeCamp", "cert": "Responsive Web Design Cert", "project": "Build a mobile-first e-commerce layout"},
    "CI/CD": {"course": "GitHub Actions Tutorial", "cert": "AWS DevOps Engineer", "project": "Set up auto-deploy pipeline"},
    "Machine Learning": {"course": "ML Course — Andrew Ng (Coursera)", "cert": "TensorFlow Developer Certificate", "project": "Build a sentiment analysis model"},
    "Statistics": {"course": "Intro to Statistics — Khan Academy", "cert": "Google Data Analytics Cert", "project": "Statistical analysis of a real dataset"},
    "Deep Learning": {"course": "Deep Learning Specialization — Coursera", "cert": "Deep Learning Nanodegree — Udacity", "project": "Build an image classifier"},
    "Data Visualization": {"course": "Data Viz with Python — Coursera", "cert": "Tableau Desktop Specialist", "project": "Interactive dashboard with Plotly"},
    "Pandas": {"course": "Data Analysis with Pandas — Kaggle", "cert": "Data Analysis with Python — freeCodeCamp", "project": "Clean and analyze a messy dataset"},
    "NumPy": {"course": "NumPy for Data Science — DataCamp", "cert": "Scientific Computing with Python", "project": "Implement matrix operations from scratch"},
    "Linux": {"course": "Linux Basics — edX", "cert": "LPIC-1 Certification", "project": "Set up a Linux web server"},
    "Kubernetes": {"course": "Kubernetes for Beginners — KodeKloud", "cert": "CKA Certification", "project": "Deploy a microservices app on K8s"},
    "AWS/Cloud": {"course": "AWS Cloud Practitioner — AWS Skill Builder", "cert": "AWS Cloud Practitioner Cert", "project": "Deploy an app on AWS"},
}

# ─── Interview Question Bank ────────────────────────────────────────────────

INTERVIEW_QUESTIONS = {
    "Frontend Developer": {
        1: [
            "Explain the difference between `var`, `let`, and `const` in JavaScript.",
            "What is the virtual DOM in React and why is it important?",
            "Explain the CSS box model and how `box-sizing: border-box` changes it.",
            "What are semantic HTML elements? Give 3 examples and explain why they matter.",
            "What is the difference between `==` and `===` in JavaScript?",
        ],
        2: [
            "How would you implement lazy loading for images in a React application?",
            "Explain the React component lifecycle and how hooks replace lifecycle methods.",
            "How would you handle state in a complex React application with multiple levels of nesting?",
            "What strategies would you use to optimize a slow-rendering React component?",
            "Explain how CORS works and how you'd handle CORS errors in a React app.",
        ],
        3: [
            "Design a scalable front-end architecture for a real-time collaborative document editor like Google Docs.",
            "How would you build a micro-frontend architecture for an e-commerce platform serving 10M daily users?",
            "Design a client-side caching strategy for an offline-first progressive web application.",
            "How would you architect a design system that serves 50+ applications across an organization?",
            "Explain how you would build a real-time dashboard that handles 100K concurrent WebSocket connections.",
        ]
    },
    "Backend Developer": {
        1: [
            "What is the difference between SQL and NoSQL databases? When would you use each?",
            "Explain what REST is and name its key constraints.",
            "What is middleware in Express.js? Give a practical example.",
            "What is the difference between authentication and authorization?",
            "Explain what an ORM is and name one advantage and one disadvantage.",
        ],
        2: [
            "How would you design a rate-limiting system for an API?",
            "Explain database indexing and when you would and wouldn't use indexes.",
            "How would you implement pagination for an API that returns millions of records?",
            "Explain the N+1 query problem and how to solve it.",
            "How would you handle file uploads for a service that needs to support files up to 5GB?",
        ],
        3: [
            "Design a notification system that can handle 1M+ push notifications per minute.",
            "How would you design a distributed caching layer for a microservices architecture?",
            "Design a payment processing system that ensures exactly-once delivery.",
            "How would you architect a multi-tenant SaaS application with data isolation?",
            "Design a system for processing 10TB of log data daily with real-time alerting.",
        ]
    },
    "Full Stack Developer": {
        1: [
            "What is the difference between server-side rendering and client-side rendering?",
            "Explain how HTTP cookies work and their role in authentication.",
            "What is an API and what are the common types (REST, GraphQL, gRPC)?",
            "What is version control and why is Git important for development?",
            "Explain the concept of responsive design and how you'd implement it.",
        ],
        2: [
            "How would you implement real-time features (like chat) in a full-stack application?",
            "Explain how you'd secure an application against XSS and CSRF attacks.",
            "How would you implement database migrations in a production environment?",
            "Describe how you'd set up CI/CD for a full-stack application.",
            "How would you handle image optimization and CDN delivery in a web app?",
        ],
        3: [
            "Design a complete architecture for a food delivery platform like Uber Eats.",
            "How would you build a real-time bidding system that handles 1M concurrent auctions?",
            "Design a scalable video streaming platform with content recommendation.",
            "Architect a multi-region deployment for a social media app with 50M users.",
            "Design an event-driven architecture for an IoT platform managing 1M devices.",
        ]
    }
}

# Default fallback questions for roles not in the bank
DEFAULT_QUESTIONS = {
    1: [
        "What are the fundamental concepts of your target role?",
        "Explain a basic concept related to your field.",
        "What tools do you commonly use in this role?",
    ],
    2: [
        "How would you handle a complex scenario in your domain?",
        "Describe a challenging problem and your approach to solving it.",
        "How do you ensure quality in your work?",
    ],
    3: [
        "Design a scalable system for your domain serving millions of users.",
        "How would you architect a production-grade solution?",
        "Discuss trade-offs in a complex architectural decision.",
    ]
}


# ─── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "AI Career Mentor Engine is running", "version": "1.0.0"}


@app.post("/api/ai/skill-gap-roadmap")
def generate_roadmap(req: SkillGapReq):
    """Generate a DAG-based learning roadmap from skill gap analysis."""
    required_skills = ROLE_REQUIREMENTS.get(req.target_role, [])
    if not required_skills:
        # Fallback: allow custom roles with generic skills
        required_skills = ["Programming Fundamentals", "Domain Knowledge", "Project Work", "System Design"]

    current_lower = [s.lower() for s in req.current_skills]
    missing_skills = [s for s in required_skills if s.lower() not in current_lower]

    if not missing_skills:
        return {
            "missing_skills": [],
            "dag": {"nodes": [], "edges": []},
            "order": [],
            "message": "Congratulations! You have all the required skills for this role."
        }

    # Build the DAG
    G = nx.DiGraph()
    for skill in missing_skills:
        G.add_node(skill)
        deps = SKILL_DEPENDENCIES.get(skill, [])
        for dep in deps:
            if dep in missing_skills:
                G.add_edge(dep, skill)

    try:
        learning_order = list(nx.topological_sort(G))
    except nx.NetworkXUnfeasible:
        raise HTTPException(status_code=400, detail="Cycle detected in skill dependencies")

    nodes = [{"id": s, "label": s, "level": i} for i, s in enumerate(learning_order)]
    edges = [{"source": u, "target": v} for u, v in G.edges()]

    return {
        "missing_skills": missing_skills,
        "dag": {"nodes": nodes, "edges": edges},
        "order": learning_order
    }


@app.post("/api/ai/recommendations")
def get_recommendations(req: RecommendationReq):
    """Return course, certification, and project recommendations for missing skills."""
    results = []
    for skill in req.missing_skills:
        info = COURSE_DATABASE.get(skill, {
            "course": f"Learn {skill} — Free online resources",
            "cert": f"{skill} Fundamentals Certificate",
            "project": f"Build a project using {skill}"
        })
        results.append({
            "skill": skill,
            "course": info["course"],
            "certification": info["cert"],
            "project_idea": info["project"],
            "priority": "High" if skill in ROLE_REQUIREMENTS.get(req.target_role, [])[:4] else "Medium"
        })
    return {"recommendations": results, "total": len(results)}


@app.post("/api/ai/interview/start")
def start_interview(req: InterviewStartReq):
    """Get the first interview question for a role."""
    role_qs = INTERVIEW_QUESTIONS.get(req.role, None)
    if role_qs:
        question = random.choice(role_qs[1])
    else:
        question = random.choice(DEFAULT_QUESTIONS[1])

    return {
        "question": question,
        "difficulty": 1,
        "difficulty_label": "Beginner",
        "company_type": req.company_type,
        "tips": "Focus on demonstrating understanding of core concepts. Use specific examples."
    }


@app.post("/api/ai/interview/evaluate")
def evaluate_answer(req: InterviewAnswerReq):
    """Evaluate an interview answer with adaptive difficulty."""
    answer = req.user_answer.strip()

    if not answer:
        return {
            "score": 0,
            "classification": "No Answer",
            "explanation": "You didn't provide an answer. Try to explain your thought process.",
            "next_question": req.question,
            "new_difficulty": req.difficulty,
            "strengths": [],
            "improvements": ["Provide a complete answer"],
        }

    words = answer.split()
    length = len(words)

    # ── Scoring Engine ──
    score = 0

    # Length scoring (0-3 points)
    if length >= 50:
        score += 3
    elif length >= 30:
        score += 2
    elif length >= 15:
        score += 1

    # Technical keyword scoring (0-3 points)
    tech_keywords = [
        "component", "state", "props", "hook", "render", "virtual dom", "lifecycle",
        "database", "api", "rest", "graphql", "query", "index", "cache",
        "algorithm", "complexity", "optimize", "performance", "scalable", "architecture",
        "docker", "kubernetes", "ci/cd", "testing", "security", "authentication",
        "server", "client", "request", "response", "middleware", "framework",
        "function", "class", "object", "array", "promise", "async", "await",
        "deploy", "monitor", "debug", "refactor", "pattern", "design",
        "because", "therefore", "however", "for example", "specifically",
    ]
    matched_keywords = [kw for kw in tech_keywords if kw in answer.lower()]
    keyword_count = len(matched_keywords)
    if keyword_count >= 5:
        score += 3
    elif keyword_count >= 3:
        score += 2
    elif keyword_count >= 1:
        score += 1

    # Structure scoring (0-2 points)
    if any(marker in answer.lower() for marker in ["first", "second", "1.", "2.", "step", "then"]):
        score += 1
    if any(marker in answer.lower() for marker in ["for example", "such as", "like", "consider"]):
        score += 1

    # Depth scoring (0-2 points)
    sentences = [s.strip() for s in answer.replace("!", ".").replace("?", ".").split(".") if s.strip()]
    if len(sentences) >= 4:
        score += 1
    if length >= 80:
        score += 1

    score = min(score, 10)

    # ── Classification ──
    if score <= 3:
        classification = "Beginner"
    elif score <= 6:
        classification = "Intermediate"
    else:
        classification = "Advanced"

    # ── Feedback Generation ──
    strengths = []
    improvements = []

    if length >= 30:
        strengths.append("Good answer length with detail")
    else:
        improvements.append("Provide more detail and explanation")

    if keyword_count >= 3:
        strengths.append(f"Used {keyword_count} relevant technical terms")
    else:
        improvements.append("Include more technical terminology")

    if len(sentences) >= 3:
        strengths.append("Well-structured response")
    else:
        improvements.append("Structure your answer with clear points")

    # Difficulty-specific feedback
    if req.difficulty == 1:
        feedback = f"Score: {score}/10. {'Solid grasp of the basics!' if score >= 5 else 'Review the fundamental concepts.'} "
        if score >= 5:
            feedback += "You show understanding of core concepts. Try to also mention real-world applications."
        else:
            feedback += "Focus on building a strong foundation. Try to define key terms clearly."
    elif req.difficulty == 2:
        feedback = f"Score: {score}/10. {'Strong analytical thinking!' if score >= 6 else 'Good attempt, but dig deeper.'} "
        if score >= 6:
            feedback += "Good use of scenarios. Consider discussing edge cases and trade-offs."
        else:
            feedback += "Think about real-world implications. What happens at scale? What are the trade-offs?"
    else:
        feedback = f"Score: {score}/10. {'Excellent system-level thinking!' if score >= 7 else 'Show more architectural reasoning.'} "
        if score >= 7:
            feedback += "Impressive depth. Consider discussing monitoring, failure modes, and evolution of the system."
        else:
            feedback += "At this level, we expect discussion of distributed systems concepts, CAP theorem, and scalability patterns."

    # ── Adapt Difficulty ──
    new_diff = req.difficulty
    if score >= 7 and req.difficulty < 3:
        new_diff = req.difficulty + 1
    elif score <= 3 and req.difficulty > 1:
        new_diff = req.difficulty - 1

    diff_labels = {1: "Beginner", 2: "Intermediate", 3: "Advanced"}

    # ── Next Question ──
    role_qs = INTERVIEW_QUESTIONS.get(req.role, DEFAULT_QUESTIONS)
    available = role_qs.get(new_diff, DEFAULT_QUESTIONS[new_diff])
    # Try not to repeat the same question
    candidates = [q for q in available if q != req.question]
    next_question = random.choice(candidates) if candidates else random.choice(available)

    return {
        "score": score,
        "classification": classification,
        "explanation": feedback,
        "next_question": next_question,
        "new_difficulty": new_diff,
        "difficulty_label": diff_labels.get(new_diff, "Beginner"),
        "strengths": strengths,
        "improvements": improvements,
        "keywords_detected": matched_keywords[:5],
    }
