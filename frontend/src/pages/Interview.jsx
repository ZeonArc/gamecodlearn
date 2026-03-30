import React, { useState } from 'react';
import { api } from '../services/api';

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "DevOps Engineer", "Mobile Developer",
];

export default function Interview({ currentUser }) {
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [role, setRole] = useState(currentUser?.targetRole || "Frontend Developer");
  const [currentQ, setCurrentQ] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [diffLabel, setDiffLabel] = useState('Beginner');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const diffColors = {
    1: 'from-emerald-500 to-green-400',
    2: 'from-amber-500 to-yellow-400',
    3: 'from-red-500 to-rose-400',
  };

  const startInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.startInterview(currentUser?.id || 'guest', role);
      if (data.error) { setError(data.error); setLoading(false); return; }
      setSessionId(data.sessionId);
      setCurrentQ(data.firstQuestion);
      setDifficulty(data.difficulty || 1);
      setDiffLabel('Beginner');
      setStarted(true);
      setHistory([]);
    } catch (err) {
      setError('Failed to start interview. Ensure the backend + AI engine are running.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const data = await api.submitAnswer({
        sessionId,
        question: currentQ,
        answer,
        difficulty,
        role,
      });
      if (data.error) { setError(data.error); setLoading(false); return; }

      const evaluation = data.evaluation;
      setHistory(prev => [...prev, {
        question: currentQ,
        answer,
        score: evaluation.score,
        classification: evaluation.classification,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
        keywords: evaluation.keywords_detected || [],
      }]);

      setCurrentQ(data.nextQuestion);
      setDifficulty(data.newDifficulty);
      setDiffLabel(data.difficultyLabel || (data.newDifficulty === 1 ? 'Beginner' : data.newDifficulty === 2 ? 'Intermediate' : 'Advanced'));
      setAnswer('');
    } catch (err) {
      setError('Evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  const endInterview = () => {
    setStarted(false);
    setSessionId(null);
    setCurrentQ('');
    setAnswer('');
  };

  const avgScore = history.length > 0
    ? (history.reduce((a, h) => a + h.score, 0) / history.length).toFixed(1)
    : 0;

  // ─── Not Started ──────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="fade-in max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">AI Interview Simulator</h1>
        <p className="text-slate-400 mb-8">Practice with an adaptive AI interviewer that scales difficulty based on your performance.</p>

        {error && <div className="glass-card p-4 mb-6 border-red-500/30 bg-red-500/5"><p className="text-red-400 text-sm">{error}</p></div>}

        <div className="glass-card p-8 pulse-glow">
          <h2 className="text-lg font-bold text-white mb-4">Select Interview Role</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 border text-left ${
                  role === r
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
            <h3 className="text-sm font-bold text-slate-300 mb-2">How it works</h3>
            <ul className="text-sm text-slate-500 space-y-1">
              <li>• Start at <span className="text-emerald-400">Beginner</span> level with foundational questions</li>
              <li>• Score ≥ 7 → Upgrade to <span className="text-amber-400">Intermediate</span> scenario-based questions</li>
              <li>• Score ≥ 7 again → Upgrade to <span className="text-red-400">Advanced</span> system design questions</li>
              <li>• Score ≤ 3 → Difficulty decreases to reinforce fundamentals</li>
            </ul>
          </div>

          <button onClick={startInterview} disabled={loading} className="btn-primary w-full text-center">
            {loading ? 'Starting...' : `Start ${role} Interview →`}
          </button>
        </div>

        {/* Previous Results */}
        {history.length > 0 && (
          <div className="glass-card p-6 mt-6">
            <h2 className="text-lg font-bold text-white mb-3">Previous Session Summary</h2>
            <p className="text-slate-400 text-sm">Questions answered: {history.length} · Average Score: {avgScore}/10</p>
          </div>
        )}
      </div>
    );
  }

  // ─── Active Interview ─────────────────────────────────────────────
  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview in Progress</h1>
          <p className="text-slate-500 text-sm">{role} · Question {history.length + 1}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${diffColors[difficulty]} text-white text-sm font-bold`}>
            {diffLabel}
          </div>
          <button onClick={endInterview} className="btn-secondary text-sm !py-2">End Session</button>
        </div>
      </div>

      {error && <div className="glass-card p-4 mb-4 border-red-500/30 bg-red-500/5"><p className="text-red-400 text-sm">{error}</p></div>}

      {/* History */}
      <div className="space-y-4 mb-6">
        {history.map((h, idx) => (
          <div key={idx} className="glass-card p-5 fade-in">
            <div className="flex items-start justify-between mb-2">
              <p className="text-blue-400 font-semibold text-sm flex-1">Q{idx + 1}: {h.question}</p>
              <div className={`ml-3 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                h.score >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
                h.score >= 4 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {h.score}/10
              </div>
            </div>
            <p className="text-slate-300 text-sm mt-1 mb-3 pl-1 border-l-2 border-white/5 ml-1">{h.answer}</p>
            <p className="text-slate-400 text-xs">{h.feedback}</p>
            {(h.strengths.length > 0 || h.improvements.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {h.strengths.map((s, i) => <span key={i} className="badge-strong">{s}</span>)}
                {h.improvements.map((s, i) => <span key={i} className="badge-weak">{s}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current Question */}
      <div className="glass-card p-6 pulse-glow">
        <p className="text-white font-semibold mb-4 text-lg">{currentQ}</p>
        <form onSubmit={submitAnswer}>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder="Type your answer here... Be specific and use technical terms for a higher score."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-600">{answer.split(/\s+/).filter(Boolean).length} words</p>
            <button type="submit" disabled={loading || !answer.trim()} className="btn-primary">
              {loading ? 'Evaluating...' : 'Submit Answer →'}
            </button>
          </div>
        </form>
      </div>

      {/* Stats Bar */}
      {history.length > 0 && (
        <div className="glass-card p-4 mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">Session Stats:</span>
          <span className="text-slate-400">Answered: <span className="text-white font-bold">{history.length}</span></span>
          <span className="text-slate-400">Avg Score: <span className="text-white font-bold">{avgScore}/10</span></span>
          <span className="text-slate-400">Level: <span className={`font-bold ${difficulty === 3 ? 'text-red-400' : difficulty === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>{diffLabel}</span></span>
        </div>
      )}
    </div>
  );
}
