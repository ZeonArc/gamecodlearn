const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

// ─── In-Memory Store (Demo Mode — No DB Required) ─────────────────────────
// This makes the app fully self-contained for hackathon demos.
// Replace with Prisma/Supabase calls in production.

const store = {
  users: [
    {
      id: "student-1",
      email: "alice@demo.com",
      name: "Alice Johnson",
      role: "STUDENT",
      targetRole: "Frontend Developer",
      currentSkills: ["HTML", "CSS", "Git"],
    },
    {
      id: "student-2",
      email: "bob@demo.com",
      name: "Bob Smith",
      role: "STUDENT",
      targetRole: "Backend Developer",
      currentSkills: ["Python"],
    },
    {
      id: "student-3",
      email: "charlie@demo.com",
      name: "Charlie Davis",
      role: "STUDENT",
      targetRole: "Full Stack Developer",
      currentSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git"],
    },
    {
      id: "student-4",
      email: "diana@demo.com",
      name: "Diana Prince",
      role: "STUDENT",
      targetRole: "Data Scientist",
      currentSkills: ["Python", "Statistics"],
    },
    {
      id: "student-5",
      email: "eve@demo.com",
      name: "Eve Martinez",
      role: "STUDENT",
      targetRole: "Frontend Developer",
      currentSkills: ["HTML"],
    },
    {
      id: "teacher-1",
      email: "prof@demo.com",
      name: "Prof. Sarah Chen",
      role: "TEACHER",
      targetRole: null,
      currentSkills: [],
    },
  ],
  roadmaps: [],
  interviewResults: [
    { id: "ir-1", userId: "student-1", role: "Frontend Developer", score: 8, level: "Advanced", feedback: "Excellent understanding of React concepts", conversation: [], createdAt: new Date().toISOString() },
    { id: "ir-2", userId: "student-1", role: "Frontend Developer", score: 7, level: "Intermediate", feedback: "Good problem-solving skills", conversation: [], createdAt: new Date().toISOString() },
    { id: "ir-3", userId: "student-2", role: "Backend Developer", score: 4, level: "Beginner", feedback: "Needs to review core database concepts", conversation: [], createdAt: new Date().toISOString() },
    { id: "ir-4", userId: "student-3", role: "Full Stack Developer", score: 9, level: "Advanced", feedback: "Outstanding system design thinking", conversation: [], createdAt: new Date().toISOString() },
    { id: "ir-5", userId: "student-4", role: "Data Scientist", score: 6, level: "Intermediate", feedback: "Solid stats foundation, improve ML concepts", conversation: [], createdAt: new Date().toISOString() },
    { id: "ir-6", userId: "student-5", role: "Frontend Developer", score: 3, level: "Beginner", feedback: "Review JavaScript basics", conversation: [], createdAt: new Date().toISOString() },
    { id: "ir-7", userId: "student-5", role: "Frontend Developer", score: 2, level: "Beginner", feedback: "Struggling with core concepts", conversation: [], createdAt: new Date().toISOString() },
  ],
  studentProgress: [
    { id: "sp-1", userId: "student-1", skillsCompleted: ["HTML", "CSS", "Git"], roadmapProgress: 75 },
    { id: "sp-2", userId: "student-2", skillsCompleted: ["Python"], roadmapProgress: 15 },
    { id: "sp-3", userId: "student-3", skillsCompleted: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Git"], roadmapProgress: 92 },
    { id: "sp-4", userId: "student-4", skillsCompleted: ["Python", "Statistics"], roadmapProgress: 40 },
    { id: "sp-5", userId: "student-5", skillsCompleted: ["HTML"], roadmapProgress: 10 },
  ],
  teacherFeedback: [
    { id: "tf-1", teacherId: "teacher-1", studentId: "student-2", comment: "Bob, please focus on database fundamentals before moving ahead.", suggestion: "Complete the SQL module first.", createdAt: new Date().toISOString() },
    { id: "tf-2", teacherId: "teacher-1", studentId: "student-5", comment: "Eve, let's schedule a 1-on-1 to review JavaScript basics.", suggestion: "Try freeCodeCamp's JavaScript course.", createdAt: new Date().toISOString() },
  ],
};

let idCounter = 100;
function newId(prefix = "id") {
  return `${prefix}-${++idCounter}`;
}

// ─── User APIs ────────────────────────────────────────────────────────────────

app.post('/api/users/profile', (req, res) => {
  const { email, name, targetRole, currentSkills, role } = req.body;
  const existing = store.users.find(u => u.email === email);
  if (existing) {
    // Update
    if (name) existing.name = name;
    if (targetRole) existing.targetRole = targetRole;
    if (currentSkills) existing.currentSkills = currentSkills;
    if (role) existing.role = role;
    return res.json(existing);
  }
  const user = {
    id: newId("user"),
    email,
    name: name || "New User",
    role: role || "STUDENT",
    targetRole: targetRole || "Full Stack Developer",
    currentSkills: currentSkills || [],
  };
  store.users.push(user);
  // Create progress entry
  store.studentProgress.push({
    id: newId("sp"),
    userId: user.id,
    skillsCompleted: [],
    roadmapProgress: 0
  });
  res.status(201).json(user);
});

app.get('/api/users/profile/:id', (req, res) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const progress = store.studentProgress.find(p => p.userId === user.id);
  const feedbacks = store.teacherFeedback.filter(f => f.studentId === user.id);
  res.json({ ...user, progress, feedbacks });
});

app.get('/api/users/all', (req, res) => {
  res.json(store.users);
});

// ─── Roadmap APIs ─────────────────────────────────────────────────────────────

app.post('/api/roadmaps/generate', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = store.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/ai/skill-gap-roadmap`, {
      current_skills: user.currentSkills,
      target_role: user.targetRole
    });

    const roadmap = {
      id: newId("rm"),
      userId,
      generatedAt: new Date().toISOString(),
      dagNodes: aiResponse.data.dag.nodes,
      edges: aiResponse.data.dag.edges,
    };
    store.roadmaps.push(roadmap);

    res.status(201).json({
      roadmap,
      order: aiResponse.data.order,
      missing_skills: aiResponse.data.missing_skills
    });
  } catch (error) {
    console.error("Roadmap generation error:", error.message);
    res.status(500).json({ error: 'Failed to generate roadmap. Is the AI engine running on port 8000?' });
  }
});

app.get('/api/roadmaps/:userId', (req, res) => {
  const roadmaps = store.roadmaps.filter(r => r.userId === req.params.userId);
  res.json(roadmaps);
});

// ─── Recommendations API ──────────────────────────────────────────────────────

app.post('/api/recommendations', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = store.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // First get skill gaps from AI
    const gapResponse = await axios.post(`${AI_ENGINE_URL}/api/ai/skill-gap-roadmap`, {
      current_skills: user.currentSkills,
      target_role: user.targetRole
    });

    // Then get recommendations
    const recResponse = await axios.post(`${AI_ENGINE_URL}/api/ai/recommendations`, {
      missing_skills: gapResponse.data.missing_skills,
      target_role: user.targetRole
    });

    res.json(recResponse.data);
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ error: 'Failed to get recommendations. Is the AI engine running?' });
  }
});

// ─── Interview APIs ───────────────────────────────────────────────────────────

app.post('/api/interviews/start', async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Get first question from AI engine
    const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/ai/interview/start`, { role });

    const result = {
      id: newId("iv"),
      userId: userId || "guest",
      role,
      score: 0,
      level: "Beginner",
      feedback: "Interview started",
      conversation: [],
      createdAt: new Date().toISOString(),
    };
    store.interviewResults.push(result);

    res.json({
      sessionId: result.id,
      firstQuestion: aiResponse.data.question,
      difficulty: aiResponse.data.difficulty,
      tips: aiResponse.data.tips,
    });
  } catch (error) {
    console.error("Interview start error:", error.message);
    res.status(500).json({ error: 'Failed to start interview. Is the AI engine running?' });
  }
});

app.post('/api/interviews/answer', async (req, res) => {
  try {
    const { sessionId, question, answer, difficulty, role } = req.body;

    const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/ai/interview/evaluate`, {
      role: role || "Frontend Developer",
      difficulty: difficulty || 1,
      question,
      user_answer: answer,
    });

    const evalData = aiResponse.data;

    // Update in-memory store
    const session = store.interviewResults.find(r => r.id === sessionId);
    if (session) {
      session.conversation.push({
        q: question,
        a: answer,
        difficulty,
        score: evalData.score,
        feedback: evalData.explanation,
      });
      session.score = evalData.score;
      session.level = evalData.classification;
      session.feedback = evalData.explanation;
    }

    res.json({
      evaluation: {
        score: evalData.score,
        classification: evalData.classification,
        feedback: evalData.explanation,
        strengths: evalData.strengths,
        improvements: evalData.improvements,
        keywords_detected: evalData.keywords_detected,
      },
      nextQuestion: evalData.next_question,
      newDifficulty: evalData.new_difficulty,
      difficultyLabel: evalData.difficulty_label,
    });
  } catch (error) {
    console.error("Interview answer error:", error.message);
    res.status(500).json({ error: 'Failed to evaluate. Is the AI engine running?' });
  }
});

// ─── Teacher APIs ─────────────────────────────────────────────────────────────

app.get('/api/teacher/students', (req, res) => {
  const students = store.users.filter(u => u.role === "STUDENT");

  const mapped = students.map(s => {
    const results = store.interviewResults.filter(r => r.userId === s.id);
    const progress = store.studentProgress.find(p => p.userId === s.id);
    const avgScore = results.length > 0
      ? results.reduce((acc, r) => acc + r.score, 0) / results.length
      : 0;
    const roadmapProg = progress?.roadmapProgress || 0;

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      targetRole: s.targetRole,
      skills: s.currentSkills,
      skillsCount: s.currentSkills.length,
      progressPercent: roadmapProg,
      averageInterviewScore: parseFloat(avgScore.toFixed(1)),
      interviewCount: results.length,
      latestLevel: results[0]?.level || "N/A",
      isWeak: (roadmapProg < 30 && avgScore < 5 && results.length >= 1),
    };
  });

  res.json(mapped);
});

app.get('/api/teacher/student/:id', (req, res) => {
  const student = store.users.find(u => u.id === req.params.id && u.role === "STUDENT");
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const progress = store.studentProgress.find(p => p.userId === student.id);
  const results = store.interviewResults.filter(r => r.userId === student.id);
  const roadmaps = store.roadmaps.filter(r => r.userId === student.id);
  const feedbacks = store.teacherFeedback
    .filter(f => f.studentId === student.id)
    .map(f => {
      const teacher = store.users.find(u => u.id === f.teacherId);
      return { ...f, teacherName: teacher?.name || "Unknown" };
    });

  res.json({
    ...student,
    progress,
    interviewResults: results,
    roadmaps,
    feedbacks,
  });
});

app.get('/api/teacher/analytics', (req, res) => {
  const students = store.users.filter(u => u.role === "STUDENT");
  let totalScore = 0;
  let scoresCount = 0;
  let skillDistribution = {};
  let roleDistribution = {};
  let studentStats = [];

  students.forEach(s => {
    // Skill distribution
    s.currentSkills.forEach(skill => {
      skillDistribution[skill] = (skillDistribution[skill] || 0) + 1;
    });

    // Role distribution
    if (s.targetRole) {
      roleDistribution[s.targetRole] = (roleDistribution[s.targetRole] || 0) + 1;
    }

    // Scores
    const results = store.interviewResults.filter(r => r.userId === s.id);
    let avgS = 0;
    if (results.length > 0) {
      results.forEach(r => { totalScore += r.score; scoresCount++; });
      avgS = results.reduce((a, b) => a + b.score, 0) / results.length;
    }

    const progress = store.studentProgress.find(p => p.userId === s.id);
    studentStats.push({
      id: s.id,
      name: s.name,
      avgScore: parseFloat(avgS.toFixed(1)),
      progressPercent: progress?.roadmapProgress || 0,
      interviewCount: results.length,
    });
  });

  studentStats.sort((a, b) => b.avgScore - a.avgScore);

  res.json({
    averageClassScore: scoresCount ? parseFloat((totalScore / scoresCount).toFixed(1)) : 0,
    totalStudents: students.length,
    totalInterviews: scoresCount,
    skillDistribution,
    roleDistribution,
    topStudents: studentStats.slice(0, 3),
    weakStudents: studentStats.filter(s => s.avgScore > 0 && s.avgScore < 5),
    allStudents: studentStats,
  });
});

app.post('/api/teacher/feedback', (req, res) => {
  const { teacherId, studentId, comment, suggestion } = req.body;
  if (!studentId || !comment) {
    return res.status(400).json({ error: 'studentId and comment are required' });
  }
  const feedback = {
    id: newId("tf"),
    teacherId: teacherId || "teacher-1",
    studentId,
    comment,
    suggestion: suggestion || "",
    createdAt: new Date().toISOString(),
  };
  store.teacherFeedback.push(feedback);
  res.status(201).json(feedback);
});

// ─── Dynamic Feedback / Skill Update ──────────────────────────────────────────

app.put('/api/users/skills', async (req, res) => {
  try {
    const { userId, newSkill } = req.body;
    const user = store.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.currentSkills.includes(newSkill)) {
      user.currentSkills.push(newSkill);
    }

    // Update progress
    const progress = store.studentProgress.find(p => p.userId === userId);
    if (progress) {
      if (!progress.skillsCompleted.includes(newSkill)) {
        progress.skillsCompleted.push(newSkill);
      }
      // Recalculate progress percentage against roadmap
      try {
        const gapResp = await axios.post(`${AI_ENGINE_URL}/api/ai/skill-gap-roadmap`, {
          current_skills: user.currentSkills,
          target_role: user.targetRole
        });
        const totalRequired = gapResp.data.missing_skills.length + user.currentSkills.length;
        progress.roadmapProgress = Math.round((user.currentSkills.length / totalRequired) * 100);
      } catch {
        progress.roadmapProgress = Math.min(progress.roadmapProgress + 10, 100);
      }
    }

    res.json({ user, progress, message: `Skill "${newSkill}" added successfully. Roadmap recalculated.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    status: "Career Mentor Backend API is running",
    version: "1.0.0",
    endpoints: [
      "POST /api/users/profile",
      "GET /api/users/profile/:id",
      "POST /api/roadmaps/generate",
      "POST /api/interviews/start",
      "POST /api/interviews/answer",
      "GET /api/teacher/students",
      "GET /api/teacher/analytics",
      "POST /api/teacher/feedback",
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✅ Career Mentor Backend running on http://localhost:${PORT}`);
  console.log(`🔗 AI Engine expected at: ${AI_ENGINE_URL}`);
});
