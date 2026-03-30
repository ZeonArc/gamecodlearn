import React, { useState } from 'react';

export default function InterviewSimulator({ role = "Frontend Developer" }) {
  const [history, setHistory] = useState([]);
  const [currentQ, setCurrentQ] = useState("What are the basic building blocks of React?");
  const [difficulty, setDifficulty] = useState(1);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Connects to Node.js Backend -> Python FastAPI
      const response = await fetch('http://localhost:5000/api/interviews/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, difficulty, question: currentQ, user_answer: answer })
      });
      
      const data = await response.json();
      
      setHistory(prev => [...prev, {
        question: currentQ,
        answer: answer,
        score: data.evaluation?.score || data.score,
        feedback: data.evaluation?.feedback || data.explanation
      }]);
      
      setCurrentQ(data.nextQuestion || data.next_question);
      setDifficulty(data.newDifficulty || data.new_difficulty);
      setAnswer("");
    } catch (err) {
      console.error("Failed to evaluate", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">AI HR Interview Simulator</h1>
      
      <div className="space-y-4 mb-8">
        {history.map((log, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="font-semibold text-blue-600">Q: {log.question}</p>
            <p className="mt-2 text-gray-700">A: {log.answer}</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span className="font-bold">Score: {log.score}/10</span>
              <span>- {log.feedback}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{currentQ}</h2>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Level {difficulty}
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
            rows="4"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !answer.trim()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </form>
      </div>
    </div>
  );
}
