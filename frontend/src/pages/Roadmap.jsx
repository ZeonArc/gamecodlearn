import React, { useState } from 'react';
import { api } from '../services/api';

export default function Roadmap({ currentUser }) {
  const [roadmapData, setRoadmapData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.generateRoadmap(currentUser.id);
      if (data.error) { setError(data.error); return; }
      setRoadmapData(data);

      // Also fetch recommendations
      try {
        const recs = await api.getRecommendations(currentUser.id);
        setRecommendations(recs);
      } catch (e) { /* Recommendations are optional */ }
    } catch (err) {
      setError('Failed to generate roadmap. Make sure the backend and AI engine are running.');
    } finally {
      setLoading(false);
    }
  };

  const nodes = roadmapData?.roadmap?.dagNodes || [];
  const order = roadmapData?.order || [];
  const missingSkills = roadmapData?.missing_skills || [];

  return (
    <div className="fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skill Roadmap</h1>
          <p className="text-slate-400">AI-generated DAG-based learning path to your target role: <span className="text-blue-400 font-semibold">{currentUser?.targetRole || 'Not Set'}</span></p>
        </div>
        <button onClick={generateRoadmap} disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Generating...' : roadmapData ? 'Regenerate' : 'Generate Roadmap'}
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 mb-6 border-red-500/30 bg-red-500/5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!roadmapData && !loading && (
        <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-bold text-white mb-2">No Roadmap Generated Yet</h2>
          <p className="text-slate-500 max-w-md mb-6">Click "Generate Roadmap" to analyze your skill gaps and create a personalized, dependency-ordered learning path.</p>
          <button onClick={generateRoadmap} disabled={loading} className="btn-primary">
            {loading ? 'Analyzing Skills...' : 'Generate My Roadmap'}
          </button>
        </div>
      )}

      {roadmapData && (
        <div className="space-y-6">
          {/* Missing Skills Summary */}
          {missingSkills.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-3">Skill Gap Analysis</h2>
              <p className="text-sm text-slate-400 mb-3">You are missing {missingSkills.length} skills for <span className="text-blue-400">{currentUser?.targetRole}</span>:</p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills.length === 0 && (
            <div className="glass-card p-8 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-white">Congratulations!</h2>
              <p className="text-slate-400">You have all required skills for this role.</p>
            </div>
          )}

          {/* DAG Visualization */}
          {order.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">Learning Path (Topological Order)</h2>
              <div className="space-y-3">
                {order.map((skill, i) => {
                  const node = nodes.find(n => n.id === skill);
                  return (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white font-bold text-sm shrink-0 shadow-lg shadow-blue-500/20">
                        {i + 1}
                      </div>
                      <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-300">
                        <p className="font-semibold text-white">{skill}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Level {(node?.level || i) + 1} dependency</p>
                      </div>
                      {i < order.length - 1 && (
                        <div className="text-slate-600 text-lg">→</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations?.recommendations?.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">Recommended Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{rec.skill}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p className="text-slate-400">📚 <span className="text-slate-300">{rec.course}</span></p>
                      <p className="text-slate-400">🏅 <span className="text-slate-300">{rec.certification}</span></p>
                      <p className="text-slate-400">🛠️ <span className="text-slate-300">{rec.project_idea}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
