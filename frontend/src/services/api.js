const API_BASE = 'http://localhost:5000';

export const api = {
  // User APIs
  async createProfile(data) {
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getProfile(id) {
    const res = await fetch(`${API_BASE}/api/users/profile/${id}`);
    return res.json();
  },

  async getAllUsers() {
    const res = await fetch(`${API_BASE}/api/users/all`);
    return res.json();
  },

  async updateSkills(userId, newSkill) {
    const res = await fetch(`${API_BASE}/api/users/skills`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newSkill }),
    });
    return res.json();
  },

  // Roadmap APIs
  async generateRoadmap(userId) {
    const res = await fetch(`${API_BASE}/api/roadmaps/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  // Recommendations
  async getRecommendations(userId) {
    const res = await fetch(`${API_BASE}/api/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },

  // Interview APIs
  async startInterview(userId, role) {
    const res = await fetch(`${API_BASE}/api/interviews/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    return res.json();
  },

  async submitAnswer(data) {
    const res = await fetch(`${API_BASE}/api/interviews/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Teacher APIs
  async getStudents() {
    const res = await fetch(`${API_BASE}/api/teacher/students`);
    return res.json();
  },

  async getStudentDetails(id) {
    const res = await fetch(`${API_BASE}/api/teacher/student/${id}`);
    return res.json();
  },

  async getAnalytics() {
    const res = await fetch(`${API_BASE}/api/teacher/analytics`);
    return res.json();
  },

  async submitFeedback(data) {
    const res = await fetch(`${API_BASE}/api/teacher/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
