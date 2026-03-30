import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function TeacherAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fade-in flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) return <p className="text-slate-500">No analytics data</p>;

  const skillEntries = Object.entries(analytics.skillDistribution || {}).sort((a, b) => b[1] - a[1]);
  const roleEntries = Object.entries(analytics.roleDistribution || {}).sort((a, b) => b[1] - a[1]);
  const maxSkillCount = skillEntries.length > 0 ? skillEntries[0][1] : 1;
  const maxRoleCount = roleEntries.length > 0 ? roleEntries[0][1] : 1;

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-white mb-2">Class Analytics</h1>
      <p className="text-slate-400 mb-8">Aggregate performance metrics, skill distribution, and student insights.</p>

      {error && <div className="glass-card p-4 mb-6 border-red-500/30 bg-red-500/5"><p className="text-red-400 text-sm">{error}</p></div>}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <span className="text-2xl">👥</span>
          <p className="text-3xl font-bold text-white">{analytics.totalStudents}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Students</p>
        </div>
        <div className="stat-card">
          <span className="text-2xl">📝</span>
          <p className="text-3xl font-bold text-blue-400">{analytics.totalInterviews}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Interviews</p>
        </div>
        <div className="stat-card">
          <span className="text-2xl">⭐</span>
          <p className="text-3xl font-bold text-amber-400">{analytics.averageClassScore}/10</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Average Score</p>
        </div>
        <div className="stat-card">
          <span className="text-2xl">⚠️</span>
          <p className="text-3xl font-bold text-red-400">{analytics.weakStudents?.length || 0}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">At-Risk Students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Skill Distribution */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Skill Distribution</h2>
          <div className="space-y-3">
            {skillEntries.map(([skill, count]) => (
              <div key={skill}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{skill}</span>
                  <span className="text-slate-500">{count} student{count !== 1 ? 's' : ''}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="fill bg-gradient-to-r from-blue-500 to-violet-500"
                    style={{ width: `${(count / maxSkillCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {skillEntries.length === 0 && <p className="text-slate-600 text-sm">No skill data yet.</p>}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Target Role Distribution</h2>
          <div className="space-y-4">
            {roleEntries.map(([role, count]) => {
              const pct = Math.round((count / analytics.totalStudents) * 100);
              return (
                <div key={role} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{role}</p>
                    <p className="text-xs text-slate-500">{count} student{count !== 1 ? 's' : ''} · {pct}%</p>
                  </div>
                  <div className="w-32 progress-bar">
                    <div className="fill bg-gradient-to-r from-emerald-500 to-cyan-400" style={{ width: `${(count / maxRoleCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">🏆 Top Performers</h2>
          <div className="space-y-3">
            {(analytics.topStudents || []).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  i === 0 ? 'bg-amber-500/20 text-amber-400' :
                  i === 1 ? 'bg-slate-400/20 text-slate-300' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.interviewCount} interviews</p>
                </div>
                <p className="text-lg font-bold text-emerald-400">{s.avgScore}</p>
              </div>
            ))}
            {(!analytics.topStudents || analytics.topStudents.length === 0) && <p className="text-slate-500 text-sm">No data yet.</p>}
          </div>
        </div>

        {/* At-Risk Students */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">⚠️ At-Risk Students</h2>
          <div className="space-y-3">
            {(analytics.weakStudents || []).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">!</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-xs text-slate-500">Progress: {s.progressPercent}%</p>
                </div>
                <p className="text-lg font-bold text-red-400">{s.avgScore}</p>
              </div>
            ))}
            {(!analytics.weakStudents || analytics.weakStudents.length === 0) && (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-slate-500 text-sm">No at-risk students!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
