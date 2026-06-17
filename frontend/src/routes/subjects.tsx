import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  FlaskConical,
  Atom,
  Calculator,
  Globe,
  Cpu,
  Type,
  BookOpen,
  FileText,
  Plus,
  ArrowRight,
  Layers,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Scroll,
} from "lucide-react";

export const Route = createFileRoute("/subjects")({
  head: () => ({ meta: [{ title: "Subjects — ExamGlow" }] }),
  component: Subjects,
});

const cards = [
  {
    name: "Biology",
    subjectId: "biology-0610",
    topics: 21,
    notes: 8,
    papers: 8,
    Icon: FlaskConical,
    accent: "bg-emerald-500",
    color: "text-emerald-600",
  },
  {
    name: "Chemistry",
    subjectId: "chemistry-0620",
    topics: 14,
    notes: 7,
    papers: 5,
    Icon: FlaskConical,
    accent: "bg-blue-500",
    color: "text-blue-600",
  },
  {
    name: "Physics",
    subjectId: "physics-0625",
    topics: 6,
    notes: 5,
    papers: 5,
    Icon: Atom,
    accent: "bg-amber-500",
    color: "text-amber-600",
  },
  {
    name: "Mathematics",
    subjectId: "mathematics-0580",
    topics: 9,
    notes: 4,
    papers: 5,
    Icon: Calculator,
    accent: "bg-violet-500",
    color: "text-violet-600",
  },
  {
    name: "Geography",
    subjectId: "geography-0460",
    topics: 3,
    notes: 0,
    papers: 0,
    Icon: Globe,
    accent: "bg-teal-500",
    color: "text-teal-600",
  },
  {
    name: "Computer Science",
    subjectId: "computer-science-0478",
    topics: 10,
    notes: 0,
    papers: 0,
    Icon: Cpu,
    accent: "bg-pink-500",
    color: "text-pink-600",
  },
  {
    name: "English Language",
    subjectId: "english-language-0500",
    topics: 2,
    notes: 0,
    papers: 0,
    Icon: Type,
    accent: "bg-orange-500",
    color: "text-orange-600",
  },
  {
    name: "Economics",
    subjectId: "economics-0455",
    topics: 6,
    notes: 0,
    papers: 0,
    Icon: TrendingUp,
    accent: "bg-green-500",
    color: "text-green-600",
  },
  {
    name: "Business Studies",
    subjectId: "business-studies-0450",
    topics: 6,
    notes: 0,
    papers: 0,
    Icon: Briefcase,
    accent: "bg-sky-500",
    color: "text-sky-600",
  },
  {
    name: "Accounting",
    subjectId: "accounting-0452",
    topics: 7,
    notes: 0,
    papers: 0,
    Icon: FileText,
    accent: "bg-slate-500",
    color: "text-slate-600",
  },
  {
    name: "History",
    subjectId: "history-0470",
    topics: 7,
    notes: 0,
    papers: 0,
    Icon: Scroll,
    accent: "bg-stone-500",
    color: "text-stone-600",
  },
];

function Subjects() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />
      <section className="bg-pink-soft text-center py-14 px-6">
        <span className="inline-block px-3 py-1 rounded-full bg-white text-xs font-semibold text-primary">Study Tracks</span>
        <h1 className="font-display text-4xl mt-3">Explore Your Subjects</h1>
        <p className="text-foreground/70 mt-2 max-w-2xl mx-auto">
          Detailed resources tailored specifically for the latest IGCSE syllabuses.
        </p>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 py-10">
        {/* Last studied banner */}
        <div className="bg-pink-soft rounded-2xl p-6 flex items-center gap-6 mb-10">
          <div className="flex-1">
            <span className="inline-block bg-white text-xs px-2 py-0.5 rounded-full">Quick Access</span>
            <h2 className="font-display text-2xl mt-2">Jump back in</h2>
            <p className="text-sm text-foreground/70 mt-1">
              Pick up where you left off — browse notes, take a quiz, or review flashcards.
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <Link to="/notes" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1">
                Revision Notes <ArrowRight className="w-3 h-3" />
              </Link>
              <Link to="/quizzes" className="px-4 py-2 rounded-full bg-white border border-border text-sm font-semibold">
                Take a Quiz
              </Link>
              <Link to="/flashcards" className="px-4 py-2 rounded-full bg-white border border-border text-sm font-semibold">
                Flashcards
              </Link>
            </div>
          </div>
          <div className="hidden md:flex w-24 h-24 rounded-2xl bg-white items-center justify-center shadow-sm text-4xl">
            📚
          </div>
        </div>

        {/* Subject catalog */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="font-display text-xl">Subject Catalog</h3>
            <p className="text-sm text-foreground/70">Explore resources across all IGCSE subjects.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div key={c.name} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className={`h-1.5 ${c.accent}`} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                    <c.Icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  {!c.subjectId && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-foreground/50">Coming soon</span>
                  )}
                </div>
                <h4 className="font-bold mt-4">{c.name}</h4>
                <p className="text-xs text-foreground/60">{c.topics} Topics · IGCSE</p>
                <div className="flex gap-4 text-xs text-foreground/60 mt-3">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {c.notes} Notes</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {c.papers} Papers</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    to="/subject-notes/$subject"
                    params={{ subject: c.name }}
                    search={{}}
                    className="flex-1 py-1.5 rounded-lg border border-border text-xs inline-flex items-center justify-center gap-1 hover:bg-muted/40 transition-colors"
                  >
                    <Layers className="w-3 h-3" /> Notes
                  </Link>
                  {c.subjectId ? (
                    <Link
                      to="/syllabus/$subjectId"
                      params={{ subjectId: c.subjectId }}
                      className="flex-1 py-1.5 rounded-lg border border-border text-xs inline-flex items-center justify-center gap-1 hover:bg-muted/40 transition-colors"
                    >
                      <GraduationCap className="w-3 h-3" /> Syllabus
                    </Link>
                  ) : (
                    <button disabled className="flex-1 py-1.5 rounded-lg border border-border text-xs inline-flex items-center justify-center gap-1 opacity-40 cursor-not-allowed">
                      <GraduationCap className="w-3 h-3" /> Syllabus
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add subject card */}
          <div className="rounded-2xl border-2 border-dashed border-border p-7 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <h4 className="font-bold mt-3">More Coming</h4>
            <p className="text-xs text-foreground/60 mt-1">Additional subjects are being added regularly.</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 bg-white border border-border rounded-2xl p-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-display text-2xl">Don't know where to start?</h3>
            <p className="text-sm text-foreground/70 mt-2">
              Try one of our global study tools to boost your recall and practice exam techniques across all subjects.
            </p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <Link to="/past-papers" className="flex-1 min-w-[160px] border border-border rounded-xl px-4 py-3 text-sm flex items-center gap-3 hover:bg-muted/30 transition-colors">
                <FileText className="w-4 h-4 text-foreground/60" />
                <div>
                  <div className="font-semibold">Past Paper Bank</div>
                  <div className="text-xs text-foreground/60">Practice real IGCSE exams</div>
                </div>
              </Link>
              <Link to="/flashcards" className="flex-1 min-w-[160px] border border-border rounded-xl px-4 py-3 text-sm flex items-center gap-3 bg-lavender-soft/50 hover:bg-lavender-soft transition-colors">
                <Layers className="w-4 h-4 text-lavender" />
                <div>
                  <div className="font-semibold">Flashcard Decks</div>
                  <div className="text-xs text-foreground/60">Master key terminology</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-lavender-soft to-pink-soft flex items-center justify-center text-6xl">
            📚
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
