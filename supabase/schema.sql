-- ============================================================================
-- CODELY PLATFORM — COMPLETE SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (supabase.com > Project > SQL Editor)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USER PROFILES
-- Core user data collected during onboarding
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role            TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  
  -- Academic info
  academic_background TEXT,        -- e.g. "B.Tech Computer Science"
  institution         TEXT,        -- e.g. "MIT"
  
  -- Skills & interests
  skills          TEXT[] DEFAULT '{}',    -- e.g. {"JavaScript", "Python", "React"}
  interests       TEXT[] DEFAULT '{}',    -- e.g. {"AI/ML", "Web Dev"}
  
  -- Career
  career_goal     TEXT,                   -- e.g. "Full Stack Developer at FAANG"
  
  -- GitHub
  github_username TEXT,
  
  -- Teacher/Student linking
  class_code      TEXT,                   -- students join a class via code
  
  -- Gamification
  xp              INTEGER DEFAULT 0,
  level           INTEGER DEFAULT 1,
  streak_days     INTEGER DEFAULT 0,
  last_active     TIMESTAMPTZ DEFAULT now(),
  
  -- Predictive score (updated by AI)
  predictive_score FLOAT DEFAULT 0,
  
  -- Metadata
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for teacher queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_class ON user_profiles(class_code);

-- ============================================================================
-- 2. CAREER ROADMAPS
-- AI-generated DAG roadmap for each student
-- ============================================================================
CREATE TABLE IF NOT EXISTS career_roadmaps (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- DAG structure (array of nodes with edges)
  dag_data        JSONB NOT NULL DEFAULT '[]',
  -- Example node: { id, label, title, status, column, row, edges, xp }
  
  -- Progress
  progress_percent FLOAT DEFAULT 0,
  
  -- AI Predictive Score (cached)
  predicted_completion_days INTEGER,
  predictive_score        FLOAT DEFAULT 0,
  
  -- Metadata
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. USER SKILLS
-- Individual skill tracking with decay system
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_skills (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  skill_name      TEXT NOT NULL,
  proficiency     FLOAT DEFAULT 0 CHECK (proficiency >= 0 AND proficiency <= 100),
  
  -- Decay tracking
  last_practiced  TIMESTAMPTZ DEFAULT now(),
  decay_rate      FLOAT DEFAULT 2.0,  -- % per day of inactivity
  is_decayed      BOOLEAN DEFAULT false,
  
  -- Source (how the skill was acquired)
  source          TEXT DEFAULT 'roadmap' CHECK (source IN ('roadmap', 'assessment', 'github', 'manual')),
  
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_skills_user ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_decay ON user_skills(is_decayed, last_practiced);

-- ============================================================================
-- 4. TEACHER TASKS
-- Task board for teachers to assign work to students
-- ============================================================================
CREATE TABLE IF NOT EXISTS teacher_tasks (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  title           TEXT NOT NULL,
  description     TEXT,
  task_type       TEXT NOT NULL DEFAULT 'assignment' 
    CHECK (task_type IN ('assignment', 'quiz', 'project', 'lab', 'reading')),
  
  -- Kanban status
  status          TEXT NOT NULL DEFAULT 'todo' 
    CHECK (status IN ('todo', 'in-progress', 'done')),
  
  -- Assignment metadata
  due_date        TIMESTAMPTZ,
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to     TEXT[] DEFAULT '{}',  -- array of class codes or student IDs
  tags            TEXT[] DEFAULT '{}',
  
  -- Points
  xp_reward       INTEGER DEFAULT 50,
  
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_teacher ON teacher_tasks(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON teacher_tasks(status);

-- ============================================================================
-- 5. STUDENT TASK PROGRESS
-- Tracks individual student progress on teacher tasks
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_task_progress (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id         UUID REFERENCES teacher_tasks(id) ON DELETE CASCADE NOT NULL,
  student_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  status          TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'in-progress', 'submitted', 'graded')),
  
  submission_url  TEXT,
  submission_text TEXT,
  grade           FLOAT,
  feedback        TEXT,
  
  submitted_at    TIMESTAMPTZ,
  graded_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(task_id, student_id)
);

-- ============================================================================
-- 6. AI INTERVIEWS
-- Stores AI mock interview sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_interviews (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  interview_type  TEXT DEFAULT 'behavioral' 
    CHECK (interview_type IN ('behavioral', 'technical', 'system-design', 'hr')),
  
  -- Content
  questions       JSONB DEFAULT '[]',
  answers         JSONB DEFAULT '[]',
  evaluation      JSONB DEFAULT '{}',
  
  -- Score
  overall_score   FLOAT,
  
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interviews_user ON ai_interviews(user_id);

-- ============================================================================
-- 7. RESUMES
-- AI-generated resumes stored per user
-- ============================================================================
CREATE TABLE IF NOT EXISTS resumes (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Content
  markdown_content TEXT NOT NULL,
  latex_content    TEXT,
  
  -- Metadata
  template         TEXT DEFAULT 'modern',
  version          INTEGER DEFAULT 1,
  
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);

-- ============================================================================
-- 8. ASSESSMENT RESULTS
-- Stores results from MCQ, Coding, Viva, Concept Map assessments
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_results (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('mcq', 'coding', 'viva', 'conceptmap')),
  topic           TEXT,
  
  -- Results
  score           FLOAT,
  max_score       FLOAT,
  questions       JSONB DEFAULT '[]',
  answers         JSONB DEFAULT '{}',
  evaluation      TEXT,
  
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessment_results(assessment_type);

-- ============================================================================
-- 9. AI GENERATED COURSES
-- Stores AI-generated courses for persistence
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_courses (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title           TEXT NOT NULL,
  description     TEXT,
  topic           TEXT NOT NULL,
  difficulty      TEXT DEFAULT 'intermediate',
  
  -- Full course structure
  course_data     JSONB NOT NULL,  -- { modules: [{ lessons: [...] }] }
  
  -- Metadata
  estimated_hours FLOAT,
  is_public       BOOLEAN DEFAULT false,
  
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_user ON ai_courses(user_id);

-- ============================================================================
-- 10. GITHUB ANALYSES
-- Cached GitHub code reviews
-- ============================================================================
CREATE TABLE IF NOT EXISTS github_analyses (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  repo_owner      TEXT NOT NULL,
  repo_name       TEXT NOT NULL,
  
  -- Analysis results
  analysis_data   JSONB NOT NULL,  -- { overallScore, techStack, codeQuality, ... }
  
  created_at      TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(repo_owner, repo_name)
);

-- ============================================================================
-- 11. N8N WORKFLOW LOGS
-- Tracks all n8n workflow executions for auditing
-- ============================================================================
CREATE TABLE IF NOT EXISTS n8n_workflow_logs (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  workflow_id     TEXT NOT NULL,       -- e.g. "onboarding-pipeline"
  trigger_source  TEXT,                -- e.g. "api/mentor/generate"
  
  -- Execution
  status          TEXT DEFAULT 'triggered' 
    CHECK (status IN ('triggered', 'running', 'completed', 'failed')),
  payload         JSONB DEFAULT '{}',
  result          JSONB DEFAULT '{}',
  error_message   TEXT,
  
  -- Timing
  triggered_at    TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  
  -- User context
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_n8n_logs_workflow ON n8n_workflow_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_status ON n8n_workflow_logs(status);

-- ============================================================================
-- 12. GAMIFICATION: ACHIEVEMENTS & BADGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  badge_id        TEXT NOT NULL,       -- e.g. "first-assessment", "streak-7"
  badge_name      TEXT NOT NULL,
  badge_icon      TEXT,                -- emoji or icon identifier
  
  earned_at       TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, badge_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE n8n_workflow_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- USER PROFILES: Users can read/write their own profile, teachers can read students
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can view students" ON user_profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles tp 
      WHERE tp.user_id = auth.uid() AND tp.role = 'teacher'
    )
  );

-- CAREER ROADMAPS: Users can CRUD their own roadmap
CREATE POLICY "Own roadmap" ON career_roadmaps FOR ALL USING (auth.uid() = user_id);

-- USER SKILLS: Users can CRUD their own skills
CREATE POLICY "Own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);

-- TEACHER TASKS: Teachers can CRUD their tasks, students can read assigned tasks
CREATE POLICY "Teachers manage own tasks" ON teacher_tasks FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Students read tasks" ON teacher_tasks FOR SELECT USING (true);

-- STUDENT TASK PROGRESS: Students manage their own progress
CREATE POLICY "Own progress" ON student_task_progress FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Teachers read progress" ON student_task_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_tasks tt 
      WHERE tt.id = task_id AND tt.teacher_id = auth.uid()
    )
  );

-- AI INTERVIEWS: Users own their interviews
CREATE POLICY "Own interviews" ON ai_interviews FOR ALL USING (auth.uid() = user_id);

-- RESUMES: Users own their resumes
CREATE POLICY "Own resumes" ON resumes FOR ALL USING (auth.uid() = user_id);

-- ASSESSMENT RESULTS: Users own their results
CREATE POLICY "Own assessments" ON assessment_results FOR ALL USING (auth.uid() = user_id);

-- AI COURSES: Users own their courses, public courses readable by all
CREATE POLICY "Own courses" ON ai_courses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public courses" ON ai_courses FOR SELECT USING (is_public = true);

-- GITHUB ANALYSES: Readable by all authenticated users
CREATE POLICY "Read analyses" ON github_analyses FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Insert analyses" ON github_analyses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- N8N LOGS: Admin/service role only (use service key in cron routes)
CREATE POLICY "Service access only" ON n8n_workflow_logs FOR ALL USING (true);

-- ACHIEVEMENTS: Users can read their own
CREATE POLICY "Own achievements" ON achievements FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated  BEFORE UPDATE ON user_profiles    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_roadmaps_updated  BEFORE UPDATE ON career_roadmaps  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_skills_updated    BEFORE UPDATE ON user_skills      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_tasks_updated     BEFORE UPDATE ON teacher_tasks    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_resumes_updated   BEFORE UPDATE ON resumes          FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- DONE! All tables created with RLS and triggers.
-- ============================================================================
