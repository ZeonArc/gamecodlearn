const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

exports.generateRoadmap = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Fetch User Profile
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Call AI Engine
    const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/ai/skill-gap-roadmap`, {
      current_skills: user.currentSkills,
      target_role: user.targetRole
    });

    // Save to Postgres
    const roadmap = await prisma.roadmap.create({
      data: {
        userId,
        dagNodes: aiResponse.data.dag.nodes,
        edges: aiResponse.data.dag.edges
      }
    });

    res.status(201).json({ roadmap, order: aiResponse.data.order, missing_skills: aiResponse.data.missing_skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate roadmap via AI Engine' });
  }
};
