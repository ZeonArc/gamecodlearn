import React, { useState } from 'react';
import { api } from '../services/api';

const AVAILABLE_SKILLS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Node.js", "Python",
  "Databases", "SQL", "REST APIs", "Git", "Docker", "Testing",
  "State Management", "System Design", "Authentication", "CI/CD",
  "Machine Learning", "Statistics", "Deep Learning", "Data Visualization",
  "Linux", "Kubernetes", "AWS/Cloud", "Responsive Design",
  "Performance Optimization", "Pandas", "NumPy",
];

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "DevOps Engineer", "Mobile Developer",
];

export default function Profile({ currentUser, onUserUpdate }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [targetRole, setTargetRole] = useState(currentUser?.targetRole || '');
  const [selectedSkills, setSelectedSkills] = useState(currentUser?.currentSkills || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await api.createProfile({
        email: email || currentUser?.email,
        name,
        targetRole,
        currentSkills: selectedSkills,
      });
      if (onUserUpdate) onUserUpdate({ ...currentUser, ...result, currentSkills: selectedSkills, name, targetRole });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-in max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
      <p className="text-slate-400 mb-8">Configure your profile and skills for personalized AI roadmap generation.</p>

      {/* Basic Info */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={e => { setName(e.target.value); setSaved(false); }}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => { setEmail(e.target.value); setSaved(false); }}
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>

      {/* Target Role */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Target Career Role</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => { setTargetRole(role); setSaved(false); }}
              className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 border text-left ${
                targetRole === role
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1">Current Skills</h2>
        <p className="text-xs text-slate-500 mb-4">Select all the skills you already possess. This powers your AI roadmap.</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SKILLS.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                selectedSkills.includes(skill)
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10'
              }`}
            >
              {selectedSkills.includes(skill) ? '✓ ' : ''}{skill}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3">{selectedSkills.length} skills selected</p>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
        </button>
        {saved && <span className="text-emerald-400 text-sm font-medium">Profile updated successfully!</span>}
      </div>
    </div>
  );
}
