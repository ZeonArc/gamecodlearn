const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/teacher/students
exports.getStudentsList = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        progress: true,
        interviewResults: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    const mapped = students.map(s => {
      const avgScore = s.interviewResults.length > 0 
        ? s.interviewResults.reduce((acc, curr) => acc + curr.score, 0) / s.interviewResults.length 
        : 0;
      
      const roadmapProg = s.progress?.roadmapProgress || 0;
      
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        targetRole: s.targetRole,
        skillsCount: s.currentSkills.length,
        progressPercent: roadmapProg,
        averageInterviewScore: parseFloat(avgScore.toFixed(1)),
        isWeak: (roadmapProg < 30 && avgScore < 5 && s.interviewResults.length > 1) 
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students list' });
  }
};

// GET /api/teacher/student/:id
exports.getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.user.findUnique({
      where: { id, role: 'STUDENT' },
      include: {
        progress: true,
        interviewResults: { orderBy: { createdAt: 'desc' } },
        roadmaps: { orderBy: { generatedAt: 'desc' }, take: 1 },
        feedbacksReceived: {
          include: { teacher: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
};

// GET /api/teacher/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { progress: true, interviewResults: true }
    });

    let totalScore = 0;
    let scoresCount = 0;
    let skillDistribution = {};
    let studentStats = [];

    students.forEach(s => {
      // 1. Skill Distribution Calculate
      s.currentSkills.forEach(skill => {
        skillDistribution[skill] = (skillDistribution[skill] || 0) + 1;
      });

      // 2. Class Average Score Calculate
      let avgS = 0;
      if (s.interviewResults.length > 0) {
        s.interviewResults.forEach(r => {
          totalScore += r.score;
          scoresCount++;
        });
        avgS = s.interviewResults.reduce((a, b) => a + b.score, 0) / s.interviewResults.length;
      }
      
      studentStats.push({
        id: s.id,
        name: s.name,
        avgScore: avgS
      });
    });

    studentStats.sort((a, b) => b.avgScore - a.avgScore);

    res.json({
      averageClassScore: scoresCount ? parseFloat((totalScore / scoresCount).toFixed(1)) : 0,
      totalStudents: students.length,
      skillDistribution,
      topStudents: studentStats.slice(0, 3),
      weakStudents: studentStats.filter(s => s.avgScore > 0).reverse().slice(0, 3) 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// POST /api/teacher/feedback
exports.giveFeedback = async (req, res) => {
  try {
    const { teacherId, studentId, comment, suggestion } = req.body;
    
    // In actual auth, teacherId would come from req.user
    const feedback = await prisma.teacherFeedback.create({
      data: { teacherId, studentId, comment, suggestion }
    });
    
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
