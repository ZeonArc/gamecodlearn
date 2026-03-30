const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProfile = async (req, res) => {
  try {
    const { email, name, targetRole, currentSkills } = req.body;
    const user = await prisma.user.create({
      data: { email, name, targetRole, currentSkills }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
