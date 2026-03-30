import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard({ currentUser }) {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = currentUser;
  const skills = user?.currentSkills || [];

  const quickStats = [
    { label: 'Skills Acquired', value: skills.length, color: 'from-blue-500 to-cyan-400', icon: '⚡' },
    { label: 'Target Role', value: user?.targetRole || 'Not Set', color: 'from-violet-500 to-purple-400', icon: '🎯', isText: true },
    { label: 'Roadmap Progress', value: '—', color: 'from-emerald-500 to-green-400', icon: '📈' },
    { label: 'Interview Score', value: '—', color: 'from-amber-500 to-orange-400', icon: '🏆' },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-violet-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2 text-slate-900">
            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-xl">
            Your AI-powered career mentor is ready. Track skills, generate roadmaps, and practice interviews — all in one place.
          </p>
          <div className="flex gap-3 mt-6">
            <Link to="/roadmap" className="btn-primary text-sm">Generate Roadmap →</Link>
            <Link to="/interview" className="btn-secondary text-sm">Start Interview</Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, i) => (
          <div key={i} className="stat-card group hover:border-blue-200 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} opacity-20 group-hover:opacity-40 transition`} />
            </div>
            <p className={`${stat.isText ? 'text-lg' : 'text-3xl'} font-bold text-slate-800 mt-2`}>{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Skills & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Skills */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Current Skills</h2>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No skills added yet. Go to your Profile to set up.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/profile" className="block w-full text-left nav-link hover:bg-slate-100">
              <span>◉</span><span>Edit Profile & Skills</span>
            </Link>
            <Link to="/roadmap" className="block w-full text-left nav-link hover:bg-slate-100">
              <span>◈</span><span>View Learning Path</span>
            </Link>
            <Link to="/interview" className="block w-full text-left nav-link hover:bg-slate-100">
              <span>◎</span><span>Practice Interview</span>
            </Link>
            <Link to="/teacher" className="block w-full text-left nav-link hover:bg-slate-100">
              <span>▣</span><span>Teacher Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
