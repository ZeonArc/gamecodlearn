import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Roadmap from './pages/Roadmap';
import Interview from './pages/Interview';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherAnalytics from './pages/TeacherAnalytics';

// Default demo user
const DEFAULT_STUDENT = {
  id: "student-1",
  email: "alice@demo.com",
  name: "Alice Johnson",
  role: "STUDENT",
  targetRole: "Frontend Developer",
  currentSkills: ["HTML", "CSS", "Git"],
};

const DEFAULT_TEACHER = {
  id: "teacher-1",
  email: "prof@demo.com",
  name: "Prof. Sarah Chen",
  role: "TEACHER",
  targetRole: null,
  currentSkills: [],
};

function App() {
  const [currentUser, setCurrentUser] = useState(DEFAULT_STUDENT);

  const switchRole = () => {
    setCurrentUser(prev =>
      prev.role === "STUDENT" ? DEFAULT_TEACHER : DEFAULT_STUDENT
    );
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar currentUser={currentUser} onSwitchRole={switchRole} />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} onUserUpdate={handleUserUpdate} />} />
            <Route path="/roadmap" element={<Roadmap currentUser={currentUser} />} />
            <Route path="/interview" element={<Interview currentUser={currentUser} />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
