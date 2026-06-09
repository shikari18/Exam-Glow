import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  BookOpen, FileText, Zap, Trophy, TrendingUp, Clock,
  Target, Award, Flame, ArrowRight, Loader2, GraduationCap, Library,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/api/user";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — ExamGlow" }] }),
  component: Home,
});

const quickActions = [
  { title: "Study Library", desc: "Upload & generate AI notes", icon: Library, to: "/library", color: "bg-pink-500" },
  { title: "Exam Prep", desc: "AI open session test", icon: GraduationCap, to: "/exam-prep", color: "bg-indigo-500" },
  { title: "Practice Quiz", desc: "Test your knowledge", icon: Trophy, to: "/quizzes", color: "bg-purple-500" },
  { title: "Flashcards", desc: "Quick revision", icon: Zap, to: "/flashcards", color: "bg-yellow-500" },
  { title: "Revision Notes", desc: "Browse all subjects", icon: BookOpen, to: "/notes", color: "bg-blue-500" },
  { title: "Past Papers", desc: "Exam practice", icon: FileText, to: "/past-papers", color: "bg-green-500" },
];

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getRelativeTime(val: string | number) {
  // SQLite stores created_at as Unix epoch (integer seconds)
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

const SUBJECT_SYLLABUS: Record<string, string> = {
  Biology: "biology-0610",
  Chemistry: "chemistry-0620",
  Physics: "physics-0625",
  Mathematics: "mathematics-0580",
};

const SUBJECT_COLORS: Record<string, string> = {
  Biology: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Chemistry: "bg-blue-50 text-blue-700 border-blue-200",
  Physics: "bg-amber-50 text-amber-700 border-amber-200",
  Mathematics: "bg-violet-50 text-violet-700 border-violet-200",
  Geography: "bg-teal-50 text-teal-700 border-teal-200",
  English: "bg-orange-50 text-orange-700 border-orange-200",
  "ICT/CS": "bg-pink-50 text-pink-700 border-pink-200",
};

function Home() {
  const { user, loading: authLoading } = useAuth();
  const { enrolledSubjects, course, yearGroup } = useProfile();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" as any });
      return;
    }
    if (!authLoading) {
      getDashboardData().then((d) => {
        setData(d);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user, authLoading]);

  const streak = data?.streak ?? 0;
  const avgScore = data?.avgScore;
  const activity = data?.activity ?? [];

  const stats = [
    { label: "Study Streak", value: `${streak} day${streak !== 1 ? "s" : ""}`, icon: Flame, color: "text-orange-500" },
    { label: "Topics Mastered", value: activity.filter((a: any) => a.activity_type === "Quiz").length.toString() || "0", icon: Target, color: "text-blue-500" },
    { label: "Quiz Score", value: avgScore != null ? `${avgScore}%` : "—", icon: Award, color: "text-purple-500" },
    { label: "Activities", value: activity.length.toString(), icon: Clock, color: "text-green-500" },
  ];

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header authed />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-pink-soft via-pink-softer to-lavender-soft px-6 py-10 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {course && (
                <span className="text-xs px-3 py-1 rounded-full bg-white/80 text-primary font-semibold border border-primary/20">
                  {course}
                </span>
              )}
              {yearGroup && (
                <span className="text-xs px-3 py-1 rounded-full bg-white/80 text-foreground/70 font-semibold border border-border">
                  <GraduationCap className="w-3 h-3 inline mr-1" />{yearGroup}
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold">
              {getTimeGreeting()}{user ? `, ${user.name.split(" ")[0]}` : ""}! 👋
            </h1>
            <p className="text-foreground/80 mt-2 text-lg">Ready to ace your exams today?</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg border border-border">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <p className="text-2xl font-bold mt-3">{loading ? "—" : stat.value}</p>
                <p className="text-sm text-foreground/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="font-display text-2xl font-bold mb-6">Start Studying</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.to as any}
                className="bg-white rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow group"
              >
                <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold">{action.title}</h3>
                <p className="text-sm text-foreground/60 mt-1">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* My Subjects */}
        {enrolledSubjects.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">My Subjects</h2>
              <Link to="/subjects" className="text-primary font-semibold flex items-center gap-1 text-sm">
                All Subjects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {enrolledSubjects.map((subject) => {
                const syllabusId = SUBJECT_SYLLABUS[subject];
                const colorClass = SUBJECT_COLORS[subject] ?? "bg-muted text-foreground/70 border-border";
                return (
                  <div key={subject} className={`rounded-2xl border p-5 ${colorClass}`}>
                    <h3 className="font-bold">{subject}</h3>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Link
                        to="/subject-notes/$subject"
                        params={{ subject }}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/70 font-semibold hover:bg-white transition-colors"
                      >
                        Notes
                      </Link>
                      <Link
                        to="/flashcards"
                        className="text-xs px-2.5 py-1 rounded-full bg-white/70 font-semibold hover:bg-white transition-colors"
                      >
                        Flashcards
                      </Link>
                      {syllabusId && (
                        <Link
                          to="/syllabus/$subjectId"
                          params={{ subjectId: syllabusId }}
                          className="text-xs px-2.5 py-1 rounded-full bg-white/70 font-semibold hover:bg-white transition-colors"
                        >
                          Syllabus
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Recent Activity</h2>
            <Link to="/dashboard" className="text-primary font-semibold flex items-center gap-1 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : activity.length === 0 ? (
              <div className="p-12 text-center text-foreground/50">
                <p className="font-semibold">No activity yet</p>
                <p className="text-sm mt-1">Start a quiz or review flashcards to see your progress here.</p>
              </div>
            ) : (
              activity.slice(0, 5).map((a: any, index: number) => (
                <div
                  key={a.id ?? index}
                  className={`flex items-center justify-between p-4 ${index !== Math.min(4, activity.length - 1) ? "border-b border-border" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {a.activity_type === "Quiz" && <Trophy className="w-5 h-5 text-purple-500" />}
                      {a.activity_type === "Notes" && <BookOpen className="w-5 h-5 text-blue-500" />}
                      {a.activity_type === "Flashcards" && <Zap className="w-5 h-5 text-yellow-500" />}
                      {a.activity_type === "Bookmark" && <BookOpen className="w-5 h-5 text-pink-500" />}
                      {!["Quiz","Notes","Flashcards","Bookmark"].includes(a.activity_type) && <FileText className="w-5 h-5 text-green-500" />}
                    </div>
                    <div>
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-sm text-foreground/60">{a.activity_type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {a.score_text && <p className="font-bold text-green-600">{a.score_text}</p>}
                    <p className="text-sm text-foreground/60">{getRelativeTime(a.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-12">
          <h2 className="font-display text-2xl font-bold mb-6">Your Progress</h2>
          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Keep it up!</h3>
                <p className="text-white/80">Every session gets you closer to your goal.</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{streak}</p>
                <p className="text-white/80 text-sm">Day Streak</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{activity.filter((a: any) => a.activity_type === "Quiz").length}</p>
                <p className="text-sm text-white/80">Quizzes Done</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{activity.filter((a: any) => a.activity_type === "Flashcards").length}</p>
                <p className="text-sm text-white/80">Flash Sessions</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{avgScore != null ? `${avgScore}%` : "—"}</p>
                <p className="text-sm text-white/80">Avg Score</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
