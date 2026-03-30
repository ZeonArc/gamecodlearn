import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuggestion, setFeedbackSuggestion] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await api.getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load students. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const viewStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const detail = await api.getStudentDetails(student.id);
      setStudentDetail(detail);
    } catch (err) {
      setStudentDetail(null);
    }
  };

  const sendFeedback = async () => {
    if (!feedbackComment.trim() || !selectedStudent) return;
    setSendingFeedback(true);
    try {
      await api.submitFeedback({
        teacherId: "teacher-1",
        studentId: selectedStudent.id,
        comment: feedbackComment,
        suggestion: feedbackSuggestion,
      });
      setFeedbackComment('');
      setFeedbackSuggestion('');
      // Reload detail
      const detail = await api.getStudentDetails(selectedStudent.id);
      setStudentDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingFeedback(false);
    }
  };

  const weakCount = students.filter(s => s.isWeak).length;

  if (loading) {
    return (
      <div className="fade-in flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Class Overview</h1>
      <p className="text-slate-600 mb-8">Monitor student progress, identify at-risk learners, and provide mentorship.</p>

      {error && <div className="glass-card p-4 mb-6 border-red-200 bg-red-50"><p className="text-red-600 text-sm">{error}</p></div>}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <span className="text-2xl">👥</span>
          <p className="text-3xl font-bold text-slate-900">{students.length}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Students</p>
        </div>
        <div className="stat-card">
          <span className="text-2xl">⚠️</span>
          <p className="text-3xl font-bold text-red-600">{weakCount}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">At-Risk Students</p>
        </div>
        <div className="stat-card">
          <span className="text-2xl">📊</span>
          <p className="text-3xl font-bold text-blue-600">
            {students.length > 0 ? (students.reduce((a, s) => a + s.averageInterviewScore, 0) / students.length).toFixed(1) : 0}
          </p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Class Average Score</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Student Roster</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id} className={`hover:bg-slate-50 transition cursor-pointer ${s.isWeak ? 'bg-red-50' : 'bg-white'}`} onClick={() => viewStudent(s)}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                            <p className="text-xs text-slate-500">{s.skillsCount} skills</p>
                          </div>
                          {s.isWeak && <span className="badge-weak">At Risk</span>}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{s.targetRole || '—'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="progress-bar w-24">
                            <div className={`fill ${s.progressPercent >= 50 ? 'bg-emerald-500' : s.progressPercent >= 25 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.progressPercent}%` }} />
                          </div>
                          <span className="text-xs text-slate-500 font-semibold w-8">{s.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold text-sm ${s.averageInterviewScore >= 7 ? 'text-emerald-600' : s.averageInterviewScore >= 4 ? 'text-amber-600' : 'text-red-600'}`}>
                          {s.averageInterviewScore}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-blue-600 hover:text-blue-500 text-xs font-semibold">View →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail / Feedback Panel */}
        <div className="space-y-6">
          {selectedStudent ? (
            <>
              {/* Student Detail Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-lg font-bold text-white">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold">{selectedStudent.name}</h3>
                    <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xl font-bold text-slate-900">{selectedStudent.progressPercent}%</p>
                    <p className="text-[10px] text-slate-500 uppercase">Progress</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xl font-bold text-slate-900">{selectedStudent.averageInterviewScore}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Avg Score</p>
                  </div>
                </div>

                {/* Skills */}
                {selectedStudent.skills && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Current Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStudent.skills.map((sk, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">{sk}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Previous Feedback */}
                {studentDetail?.feedbacks?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Past Feedback</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {studentDetail.feedbacks.map((f, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <p className="text-slate-700">{f.comment}</p>
                          {f.suggestion && <p className="text-slate-500 mt-1 italic">→ {f.suggestion}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Form */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Send Feedback to {selectedStudent.name}</h3>
                <textarea
                  className="input-field text-sm mb-3"
                  rows="3"
                  placeholder="Write your mentorship comments..."
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field text-sm mb-3"
                  placeholder="Suggestion (optional)"
                  value={feedbackSuggestion}
                  onChange={e => setFeedbackSuggestion(e.target.value)}
                />
                <button onClick={sendFeedback} disabled={sendingFeedback || !feedbackComment.trim()} className="btn-primary w-full text-sm text-center">
                  {sendingFeedback ? 'Sending...' : 'Send Feedback'}
                </button>
              </div>
            </>
          ) : (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">👈</div>
              <p className="text-slate-500 text-sm">Select a student from the roster to view details and provide feedback.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
