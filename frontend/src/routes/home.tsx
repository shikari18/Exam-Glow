import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  BookOpen, FileText, Zap, Trophy, TrendingUp, Clock,
  Target, Award, Flame, ArrowRight, Loader2, GraduationCap, Library,
  Sparkles, ChevronRight, BarChart3, Bot,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/api/user";
import type { ActivityItem } from "@/api/user";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — ExamGlow" }] }),
  component: Home,
});

const quickActions = [
  { title: "Study Library",  icon: Library,      to: "/library",     emoji: "📚", accent: "#ec4f88" },
  { title: "Exam Prep",      icon: GraduationCap, to: "/exam-prep",   emoji: "🎓", accent: "#8b5cf6" },
  { title: "Practice Quiz",  icon: Trophy,        to: "/quizzes",     emoji: "🏆", accent: "#a855f7" },
  { title: "Flashcards",     icon: Zap,           to: "/flashcards",  emoji: "⚡", accent: "#f59e0b" },
  { title: "Revision Notes", icon: BookOpen,      to: "/notes",       emoji: "📝", accent: "#0ea5e9" },
  { title: "Past Papers",    icon: FileText,      to: "/past-papers", emoji: "📄", accent: "#10b981" },
];

const SUBJECT_SYLLABUS: Record<string, string> = {
  Biology: "biology-0610",
  Chemistry: "chemistry-0620",
  Physics: "physics-0625",
  Mathematics: "mathematics-0580",
};

const SUBJECT_META: Record<string, { bg: string; border: string; text: string; icon: string; bar: string }> = {
  Biology:          { bg: "bg-emerald-50",  border: "border-emerald-100", text: "text-emerald-800",  icon: "🌿", bar: "bg-emerald-400" },
  Chemistry:        { bg: "bg-blue-50",     border: "border-blue-100",    text: "text-blue-800",     icon: "🧪", bar: "bg-blue-400" },
  Physics:          { bg: "bg-amber-50",    border: "border-amber-100",   text: "text-amber-800",    icon: "⚡", bar: "bg-amber-400" },
  Mathematics:      { bg: "bg-violet-50",   border: "border-violet-100",  text: "text-violet-800",   icon: "📐", bar: "bg-violet-400" },
  Geography:        { bg: "bg-teal-50",     border: "border-teal-100",    text: "text-teal-800",     icon: "🌍", bar: "bg-teal-400" },
  English:          { bg: "bg-orange-50",   border: "border-orange-100",  text: "text-orange-800",   icon: "📝", bar: "bg-orange-400" },
  "ICT/CS":         { bg: "bg-pink-50",     border: "border-pink-100",    text: "text-pink-800",     icon: "💻", bar: "bg-pink-400" },
  "Business Studies":{ bg: "bg-sky-50",     border: "border-sky-100",     text: "text-sky-800",      icon: "📈", bar: "bg-sky-400" },
  History:          { bg: "bg-yellow-50",   border: "border-yellow-100",  text: "text-yellow-800",   icon: "📜", bar: "bg-yellow-400" },
  Accounting:       { bg: "bg-green-50",    border: "border-green-100",   text: "text-green-800",    icon: "🧾", bar: "bg-green-400" },
};

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getRelativeTime(val: string | number) {
  const ts = typeof val === "number" ? val * 1000 : isNaN(Number(val)) ? new Date(val).getTime() : Number(val) * 1000;
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

const activityIcons: Record<string, { icon: typeof Trophy; color: string; dot: string }> = {
  Quiz:       { icon: Trophy,   color: "text-violet-500", dot: "bg-violet-400" },
  Notes:      { icon: BookOpen, color: "text-sky-500",    dot: "bg-sky-400" },
  Flashcards: { icon: Zap,      color: "text-amber-500",  dot: "bg-amber-400" },
  Bookmark:   { icon: BookOpen, color: "text-pink-500",   dot: "bg-pink-400" },
};

function Home() {
  const { user, loading: authLoading } = useAuth();
  const { enrolledSubjects, course, yearGroup } = useProfile();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate({ to: "/login" as any }); return; }
    if (!authLoading) {
      getDashboardData().then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [user, authLoading]);

  const streak    = data?.streak ?? 0;
  const avgScore  = data?.avgScore;
  const activity: ActivityItem[] = Array.isArray(data?.activity) ? data.activity : [];
  const quizCount = activity.filter((a: any) => a.activity_type === "Quiz").length;

  if (authLoading) return null;
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header authed />
      <main className="flex-1 pb-16">

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <div className="bg-pink-soft relative overflow-hidden py-12 md:py-14">
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none"
               style={{ backgroundImage: "radial-gradient(circle, var(--lavender) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {course && <span className="text-[11px] px-3 py-1 rounded-full bg-white font-semibold text-primary border border-primary/20 shadow-sm">{course}</span>}
                {yearGroup && <span className="text-[11px] px-3 py-1 rounded-full bg-white/70 font-semibold text-foreground/70 border border-border shadow-sm flex items-center gap-1"><GraduationCap className="w-3 h-3 text-primary/70" />{yearGroup}</span>}
                <span className="text-[11px] px-3 py-1 rounded-full bg-lavender-soft font-semibold text-purple-700 border border-purple-200/30 flex items-center gap-1 shadow-sm"><Sparkles className="w-3 h-3 text-purple-500" />Soft Revision Space</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1]">
                {getTimeGreeting()}{firstName ? "," : "!"}
                {firstName && (<><br /><span className="accent-italic text-primary">{firstName}</span> 👋</>)}
              </h1>
              <p className="text-foreground/70 mt-3 text-base max-w-lg leading-relaxed">
                Your organized IGCSE study hub. Let's make today's revision count.
              </p>
            </div>
            <Link to="/notes" className="group shrink-0 inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
              <Bot className="w-4.5 h-4.5" /> Ask AI Tutor <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Stats — left-border accent cards ──────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 -mt-5 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Study Streak",    value: `${streak}d`,         icon: Flame,    borderColor: "border-l-orange-400",  iconColor: "text-orange-500"  },
              { label: "Quizzes Solved",  value: `${quizCount}`,        icon: Trophy,   borderColor: "border-l-primary",     iconColor: "text-primary"     },
              { label: "Avg Score",       value: avgScore != null ? `${avgScore}%` : "—", icon: Award, borderColor: "border-l-violet-400", iconColor: "text-violet-500" },
              { label: "Activities Done", value: `${activity.length}`, icon: BarChart3, borderColor: "border-l-emerald-400", iconColor: "text-emerald-500" },
            ].map((stat) => (
              <div key={stat.label} className={`bg-white rounded-2xl px-5 py-4 shadow-sm border border-l-4 border-slate-100 ${stat.borderColor} flex items-center gap-4 hover:shadow-md transition-all duration-300`}>
                <stat.icon className={`w-8 h-8 ${stat.iconColor} shrink-0`} />
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-slate-800 mt-1 leading-none">
                    {loading ? <span className="animate-pulse inline-block bg-slate-100 rounded w-10 h-6" /> : stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions — colorful pill chips ───────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800 font-display">Study Dashboard</h2>
              <p className="text-slate-400 text-xs mt-0.5">Choose where to start today</p>
            </div>
          </div>

          {/* Bento-style asymmetric grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.to as any}
                className="group relative bg-white rounded-2xl border border-slate-100 p-5 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-3 overflow-hidden"
              >
                {/* faint accent stripe top */}
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-70" style={{ background: action.accent }} />
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl leading-none">{action.emoji}</span>
                  <p className="font-bold text-sm text-slate-800 group-hover:text-slate-900 leading-snug">{action.title}</p>
                </div>
                <div className="flex justify-end">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: `${action.accent}18` }}>
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: action.accent }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── My Subjects ───────────────────────────────────────────── */}
        {enrolledSubjects.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 pt-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800 font-display">My Subjects</h2>
                <p className="text-slate-400 text-xs mt-0.5">Quick access to your enrolled courses</p>
              </div>
              <Link to="/subjects" className="text-xs font-bold text-primary hover:opacity-80 flex items-center gap-1">All Subjects <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {enrolledSubjects.map((subject) => {
                const syllabusId = SUBJECT_SYLLABUS[subject];
                const meta = SUBJECT_META[subject] ?? { bg: "bg-slate-50", border: "border-slate-100", text: "text-slate-700", icon: "📚", bar: "bg-slate-400" };
                return (
                  <div key={subject} className={`bg-white rounded-2xl border ${meta.border} overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}>
                    {/* Color bar + header */}
                    <div className={`h-1.5 ${meta.bar}`} />
                    <div className={`${meta.bg} px-4 py-3.5 flex items-center gap-2.5`}>
                      <span className="text-xl">{meta.icon}</span>
                      <span className={`font-bold text-sm ${meta.text} flex-1 min-w-0 truncate`}>{subject}</span>
                    </div>
                    {/* Action buttons */}
                    <div className="px-4 py-3 flex gap-2">
                      <Link to="/subject-notes/$subject" params={{ subject }} className="flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 transition-colors flex items-center justify-center gap-1">
                        <BookOpen className="w-3 h-3" />Notes
                      </Link>
                      <Link to="/flashcards" className="flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 transition-colors flex items-center justify-center gap-1">
                        <Zap className="w-3 h-3" />Flash
                      </Link>
                      {syllabusId && (
                        <Link to="/syllabus/$subjectId" params={{ subjectId: syllabusId }} className="w-8 h-[30px] rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors flex items-center justify-center shrink-0" title="Syllabus">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Progress + Activity ────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Progress panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-lavender-soft via-white to-pink-soft rounded-3xl p-7 border border-lavender/30 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Weekly Overview</span>
              </div>
              <p className="text-xl font-bold text-slate-800">Revise & Improve</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">Stay consistent — even 15 minutes a day makes a huge difference.</p>
            </div>
            <div className="grid grid-cols-3 gap-2.5 mt-7 relative z-10">
              {[
                { icon: Flame,  val: streak,     label: "Streak",  iconCls: "text-orange-500" },
                { icon: Trophy, val: quizCount,   label: "Quizzes", iconCls: "text-violet-500" },
                { icon: Target, val: avgScore != null ? `${avgScore}%` : "—", label: "Avg Score", iconCls: "text-primary" },
              ].map((s) => (
                <div key={s.label} className="bg-white/80 border border-white rounded-xl p-3 text-center shadow-sm">
                  <s.icon className={`w-4 h-4 mx-auto mb-1.5 ${s.iconCls}`} />
                  <p className="text-base font-extrabold text-slate-800 leading-none">{loading ? "—" : s.val}</p>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display">Recent Activity</h2>
                <p className="text-slate-400 text-[11px] mt-0.5">Your latest study actions</p>
              </div>
              <Link to="/dashboard" className="text-xs font-bold text-primary hover:opacity-80 flex items-center gap-1">Full History <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1">
              {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : activity.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="font-semibold text-slate-700 text-sm">No activity yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[230px] mx-auto leading-normal">Complete a quiz or browse notes to see your history.</p>
                  <Link to="/quizzes" className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-[11px] font-bold hover:opacity-90 transition shadow-sm">
                    <Trophy className="w-3.5 h-3.5" /> Start a Quiz
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {activity.slice(0, 4).map((a: any, i: number) => {
                    const cfg = activityIcons[a.activity_type] ?? { icon: FileText, color: "text-slate-500", dot: "bg-slate-300" };
                    const Icon = cfg.icon;
                    return (
                      <div key={a.id ?? i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-800 truncate">{a.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{a.activity_type}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {a.score_text && <p className="text-xs font-bold text-emerald-600">{a.score_text}</p>}
                          <p className="text-[10px] text-slate-400">{getRelativeTime(a.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
