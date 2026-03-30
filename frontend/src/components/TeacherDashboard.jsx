import React, { useState, useEffect } from 'react';

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedback, setFeedback] = useState("");

  const fetchData = async () => {
    try {
      const [studentsRes, analyticsRes] = await Promise.all([
        fetch('http://localhost:5000/api/teacher/students'),
        fetch('http://localhost:5000/api/teacher/analytics')
      ]);
      const stData = await studentsRes.json();
      const anData = await analyticsRes.json();
      
      setStudents(stData || []);
      setAnalytics(anData || null);
    } catch (err) {
      console.error("Failed to fetch teacher data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // For mock purposes if backend is not running, we set some stub data
    // Remove in production
    setTimeout(() => {
      setStudents([
        { id: "1", name: "Alice Johnson", skillsCount: 4, progressPercent: 80, averageInterviewScore: 8.5, isWeak: false },
        { id: "2", name: "Bob Smith", skillsCount: 2, progressPercent: 20, averageInterviewScore: 4.0, isWeak: true },
        { id: "3", name: "Charlie Davis", skillsCount: 5, progressPercent: 95, averageInterviewScore: 9.2, isWeak: false }
      ]);
      setAnalytics({
        averageClassScore: 7.2,
        totalStudents: 3,
        skillDistribution: { "HTML": 3, "CSS": 3, "React": 2, "Python": 1 },
      });
      setLoading(false);
    }, 1000);
    // fetchData();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if(!selectedStudent || !feedback) return;
    
    try {
      await fetch('http://localhost:5000/api/teacher/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          teacherId: "teacher-123", 
          studentId: selectedStudent.id, 
          comment: feedback, 
          suggestion: "Please review roadmap." 
        })
      });
      alert(`Feedback sent to ${selectedStudent.name}`);
      setFeedback("");
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Instructor Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-100 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Teacher Dashboard</h1>
        <p className="text-slate-600 mt-2 text-lg">Monitor class performance, identify skill gaps, and mentor students.</p>
      </header>

      {/* Analytics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm uppercase font-bold tracking-wider mb-2">Total Students</h3>
          <p className="text-4xl font-black text-slate-800">{analytics?.totalStudents || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm uppercase font-bold tracking-wider mb-2">Class Interview Avg</h3>
          <p className="text-4xl font-black text-blue-600">{analytics?.averageClassScore || 0} / 10</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200">
          <h3 className="text-red-500 text-sm uppercase font-bold tracking-wider mb-2">At-Risk Students</h3>
          <p className="text-4xl font-black text-red-600">
            {students.filter(s => s.isWeak).length}
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Student List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Student Progress Roster</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold">Skills</th>
                  <th className="p-4 font-semibold">Roadmap %</th>
                  <th className="p-4 font-semibold">Avg Score</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${s.isWeak ? 'bg-red-50/50' : ''}`}>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{s.name}</span>
                      {s.isWeak && <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 font-bold">Weak</span>}
                    </td>
                    <td className="p-4 text-slate-600">{s.skillsCount} skills</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${s.progressPercent < 50 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                            style={{ width: `${s.progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{s.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-800 font-bold">{s.averageInterviewScore}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedStudent(s)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-4"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-fit sticky top-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Instructor Feedback</h2>
          {selectedStudent ? (
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800">Drafting feedback for <span className="font-bold">{selectedStudent.name}</span></p>
                {selectedStudent.isWeak && <p className="text-xs text-red-600 mt-1 font-semibold">User requires intervention!</p>}
              </div>
              <label className="text-sm font-semibold text-slate-700">Comments & Guidance</label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
                rows="5"
                placeholder="Write your mentorship feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <button 
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition shadow-md mt-2"
              >
                Send Feedback
              </button>
              <button 
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-2 rounded-xl transition border border-slate-200 mt-2"
              >
                Cancel
              </button>
            </form>
          ) : (
             <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
               <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
               </svg>
               <p className="text-slate-500 font-medium">Select a student from the roster to provide feedback.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
