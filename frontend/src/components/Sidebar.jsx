import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS_STUDENT = [
  { to: '/', icon: '◆', label: 'Dashboard' },
  { to: '/profile', icon: '◉', label: 'My Profile' },
  { to: '/roadmap', icon: '◈', label: 'Skill Roadmap' },
  { to: '/interview', icon: '◎', label: 'Interview Sim' },
];

const NAV_ITEMS_TEACHER = [
  { to: '/teacher', icon: '▣', label: 'Class Overview' },
  { to: '/teacher/analytics', icon: '▦', label: 'Analytics' },
];

export default function Sidebar({ currentUser, onSwitchRole }) {
  const isTeacher = currentUser?.role === 'TEACHER';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-bold">
          <span className="gradient-text">Career</span>
          <span className="text-white">Mentor</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">AI-Powered Learning Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Student</p>
        {NAV_ITEMS_STUDENT.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="h-px bg-white/5 my-4" />

        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">Teacher</p>
        {NAV_ITEMS_TEACHER.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/teacher'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-white/5">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser?.name || 'Guest'}</p>
            <p className="text-[11px] text-slate-500">{isTeacher ? 'Teacher' : 'Student'}</p>
          </div>
        </div>
        <button
          onClick={onSwitchRole}
          className="w-full mt-2 text-xs text-slate-500 hover:text-slate-300 transition py-1.5 rounded-lg hover:bg-white/5"
        >
          Switch to {isTeacher ? 'Student' : 'Teacher'} View
        </button>
      </div>
    </aside>
  );
}
