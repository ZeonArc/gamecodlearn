const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

exports.startInterview = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    // Create new result entry
    const log = await prisma.interviewResult.create({
      data: {
        userId,
        role,
        score: 0,
        level: "Beginner",
        feedback: 'Started',
        conversation: []
      }
    });

    res.status(200).json({ 
      sessionId: log.id, 
      firstQuestion: `What are the basic building blocks of ${role}?`, 
      difficulty: 1 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start interview' });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const { sessionId, question, answer, difficulty, role } = req.body;
    
    // Call AI Engine for evaluation
    const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/ai/interview/evaluate`, {
      role,
      difficulty,
      question,
      user_answer: answer
    });

    const evalData = aiResponse.data;

    // Fetch and update log in DB
    const log = await prisma.interviewResult.findUnique({ where: { id: sessionId } });
    if(log) {
      const updatedConv = [...(log.conversation || []), {
        q: question,
        a: answer,
        difficulty,
        score: evalData.score,
        feedback: evalData.explanation
      }];

      await prisma.interviewResult.update({
        where: { id: sessionId },
        data: { 
          conversation: updatedConv, 
          score: evalData.score,
          level: evalData.classification,
          feedback: evalData.explanation
        }
      });
    }

    res.status(200).json({
      evaluation: {
        score: evalData.score,
        classification: evalData.classification,
        feedback: evalData.explanation
      },
      nextQuestion: evalData.next_question,
      newDifficulty: evalData.new_difficulty
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
};
