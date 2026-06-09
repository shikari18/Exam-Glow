import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  LayoutDashboard,
  Bookmark,
  BookOpen,
  Trophy,
  FileText,
  Zap,
  Star,
  BookmarkCheck,
  Plus,
  Loader2,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Target,
  Settings,
  Library,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData, addGoal, toggleGoal, deleteGoal } from "@/api/user";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ExamGlow" }] }),
  component: Dashboard,
});

function getRelativeTime(val: string | number) {
  const ts = typeof val === "number" ? val * 1000 : isNaN(Number(val)) ? new Date(val).getTime() : Number(val) * 1000;
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { enrolledSubjects, course, yearGroup, profile } = useProfile();
  const navigate = useNavigate();

  type ActivityItem = { id?: string; activity_type: string; title: string; score_text?: string; created_at: string };
  type GoalItem = { id: string; title: string; completed: boolean | number };
  type BookmarkItem = { id: string; resource_type: string; title: string; subject?: string; created_at: string };
  type DashboardData = {
    user: { id: string; name: string; email: string };
    streak: number;
    avgScore: number | null;
    activity: ActivityItem[];
    goals: GoalItem[];
    bookmarks: BookmarkItem[];
  };

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [addingGoal, setAddingGoal] = useState(false);
  const [showGoalInput, setShowGoalInput] = useState(false);

  const fetchData = async () => {
    const d = await getDashboardData();
    setData(d);
    setGoals(d?.goals ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" as any });
      return;
    }
    if (!authLoading) fetchData();
  }, [user, authLoading]);

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    setAddingGoal(true);
    try {
      const goal = await addGoal(newGoal.trim());
      setGoals((prev) => [...prev, goal]);
      setNewGoal("");
      setShowGoalInput(false);
    } finally {
      setAddingGoal(false);
    }
  };

  const handleToggleGoal = async (id: string, completed: boolean | number) => {
    const newCompleted = !completed;
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: newCompleted } : g))
    );
    await toggleGoal(Number(id), newCompleted);
  };

  const handleDeleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await deleteGoal(Number(id));
  };

  const streak = data?.streak ?? 0;
  const avgScore = data?.avgScore;
  const activity = data?.activity ?? [];
  const bookmarks = data?.bookmarks ?? [];
  const quizCount = activity.filter((a: any) => a.activity_type === "Quiz").length;
  const completedGoals = goals.filter((g) => g.completed && g.completed !== 0).length;

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-10 grid lg:grid-cols-[240px_1fr_320px] gap-6">
        <aside className="space-y-2 hidden lg:block">
          <p className="text-[11px] tracking-widest text-foreground/60">MAIN MENU</p>
          {[
            { Icon: LayoutDashboard, label: "Overview", active: true, to: "/dashboard" },
            { Icon: BookOpen, label: "Library", to: "/library" },
            { Icon: BookOpen, label: "Notes", to: "/notes" },
            { Icon: Zap, label: "Flashcards", to: "/flashcards" },
            { Icon: Trophy, label: "Quizzes", to: "/quizzes" },
            { Icon: FileText, label: "Past Papers", to: "/past-papers" },
            { Icon: GraduationCap, label: "Exam Prep", to: "/exam-prep" },
            { Icon: GraduationCap, label: "Syllabus", to: "/subjects" },
          ].map((i) => (
            <Link
              key={i.label}
              to={i.to as any}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                i.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <i.Icon className="w-4 h-4" /> {i.label}
            </Link>
          ))}
        </aside>

        <section>
          <div className="bg-pink-soft rounded-3xl p-8 flex items-center gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {course && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/80 text-primary font-semibold border border-primary/20">
                    {course}
                  </span>
                )}
                {yearGroup && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/80 text-foreground/60 font-semibold border border-border">
                    <GraduationCap className="w-3 h-3 inline mr-1" />{yearGroup}
                  </span>
                )}
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white">
                Welcome back, {user?.name?.split(" ")[0] ?? "Student"}! 👋
              </span>
              <h2 className="font-display text-3xl mt-3 leading-tight">
                {streak > 0
                  ? `You're on a ${streak}-day streak!`
                  : "Let's start your streak today!"}
                {quizCount > 0 && (
                  <>
                    <br />
                    You've completed{" "}
                    <span className="text-primary italic">{quizCount} quiz{quizCount !== 1 ? "zes" : ""}</span>.
                  </>
                )}
              </h2>
              <div className="flex gap-3 mt-4 flex-wrap">
                <Link to="/flashcards" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  Study Flashcards
                </Link>
                <Link to="/quizzes" className="px-5 py-2.5 rounded-full bg-white text-sm font-semibold border border-border">
                  Take a Quick Quiz
                </Link>
              </div>
            </div>
            <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-28 h-28 absolute">
                <circle cx="18" cy="18" r="16" fill="none" stroke="oklch(0.95 0.04 358)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="oklch(0.72 0.16 358)" strokeWidth="3"
                  strokeDasharray={`${Math.min(streak * 5, 100) * 1.005} 100`}
                  strokeDashoffset="0"
                  transform="rotate(-90 18 18)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <p className="font-display text-2xl text-primary">{streak}d</p>
                <p className="text-[10px] tracking-widest text-foreground/60">STREAK</p>
              </div>
            </div>
          </div>

          {/* My Subjects quick-links */}
          {enrolledSubjects.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> My Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {enrolledSubjects.map((subject) => (
                  <Link
                    key={subject}
                    to="/subject-notes/$subject"
                    params={{ subject }}
                    className="px-3 py-1.5 rounded-full border border-border bg-white text-sm font-semibold hover:border-primary/40 hover:bg-pink-soft/30 transition-colors"
                  >
                    {subject}
                  </Link>
                ))}
                <Link
                  to="/subjects"
                  className="px-3 py-1.5 rounded-full border border-dashed border-border text-sm text-foreground/50 hover:text-primary hover:border-primary/40 transition-colors"
                >
                  + Manage
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { Icon: Trophy, val: quizCount.toString(), lbl: "Quizzes Done", bg: "bg-orange-50 text-orange-500" },
              { Icon: FileText, val: bookmarks.length.toString(), lbl: "Bookmarks", bg: "bg-baby-blue/30 text-baby-blue" },
              { Icon: Zap, val: avgScore != null ? `${avgScore}%` : "—", lbl: "Avg Quiz Score", bg: "bg-lavender-soft text-lavender" },
              { Icon: Star, val: `${streak}d`, lbl: "Study Streak", bg: "bg-pink-soft text-primary" },
            ].map((s) => (
              <div key={s.lbl} className="bg-white border border-border rounded-2xl p-4">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`}>
                  <s.Icon className="w-4 h-4" />
                </span>
                <p className="font-display text-2xl mt-3">{loading ? "—" : s.val}</p>
                <p className="text-xs text-foreground/60">{s.lbl}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <div className="flex justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-primary" /> My Bookmarks
                </h3>
                <Link to="/notes" className="text-xs text-primary">Browse Notes</Link>
              </div>
              {loading ? (
                <div className="mt-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : bookmarks.length === 0 ? (
                <div className="mt-4 bg-muted/30 rounded-2xl p-6 text-center text-sm text-foreground/50">
                  <p>No bookmarks yet.</p>
                  <p className="mt-1">Bookmark notes to save them here.</p>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {bookmarks.map((b: any) => (
                    <div key={b.id} className="bg-white border border-border rounded-2xl p-3 flex items-center gap-3">
                      <span className="w-9 h-9 bg-lavender-soft rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-lavender" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{b.title}</p>
                        <p className="text-xs text-foreground/60">
                          {b.subject && <span className="border border-border rounded px-1.5">{b.subject}</span>}
                          {" "}{getRelativeTime(b.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-primary" /> Study Goals
                </h3>
                <span className="text-xs text-foreground/60">
                  {completedGoals} of {goals.length} completed
                </span>
              </div>
              {loading ? (
                <div className="mt-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : (
                <div className="mt-3 space-y-2">
                  {goals.map((g) => (
                    <div key={g.id} className="flex items-center gap-2 text-sm py-2 border-b border-border last:border-0 group">
                      <button
                        onClick={() => handleToggleGoal(g.id, g.completed)}
                        className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                          g.completed ? "bg-primary border-primary" : "border-border"
                        }`}
                      >
                        {g.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </button>
                      <span className={`flex-1 ${g.completed ? "line-through text-foreground/40" : ""}`}>
                        {g.title}
                      </span>
                      <button
                        onClick={() => handleDeleteGoal(g.id)}
                        className="opacity-0 group-hover:opacity-100 text-foreground/30 hover:text-destructive transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showGoalInput ? (
                <div className="mt-3 flex gap-2">
                  <input
                    autoFocus
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                    placeholder="E.g. Revise 30 Biology flashcards"
                    className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm"
                  />
                  <button
                    onClick={handleAddGoal}
                    disabled={addingGoal || !newGoal.trim()}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    {addingGoal ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                  </button>
                  <button
                    onClick={() => { setShowGoalInput(false); setNewGoal(""); }}
                    className="px-3 py-1.5 border border-border rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowGoalInput(true)}
                  className="mt-3 w-full py-2 border border-dashed border-border rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-muted/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Custom Goal
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-5 hidden lg:block">
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Recent Activity
            </h3>
            {loading ? (
              <div className="mt-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
            ) : activity.length === 0 ? (
              <div className="mt-4 text-sm text-foreground/50 bg-muted/30 rounded-xl p-4 text-center">
                No activity yet. Start a quiz or review flashcards!
              </div>
            ) : (
              <div className="mt-4 space-y-4 text-sm">
                {activity.slice(0, 6).map((a: any, i: number) => (
                  <div key={a.id ?? i} className="flex gap-3">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary">
                      {a.activity_type === "Quiz" && <Trophy className="w-3.5 h-3.5" />}
                      {a.activity_type === "Flashcards" && <Zap className="w-3.5 h-3.5" />}
                      {a.activity_type === "Bookmark" && <Bookmark className="w-3.5 h-3.5" />}
                      {!["Quiz", "Flashcards", "Bookmark"].includes(a.activity_type) && <BookOpen className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <p className="leading-tight">
                        {a.title}
                        {a.score_text && <span className="text-primary font-semibold ml-1">· {a.score_text}</span>}
                      </p>
                      <p className="text-xs text-foreground/60 mt-1">{getRelativeTime(a.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
