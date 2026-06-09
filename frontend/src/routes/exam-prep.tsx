import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Clock, Brain, FileText, Trophy, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, RotateCcw, Loader2, Sparkles, Play,
  Flag, ChevronLeft, ChevronRight, Pause, Timer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/exam-prep")({
  head: () => ({ meta: [{ title: "Exam Prep — ExamGlow" }] }),
  component: ExamPrepPage,
});

type SessionMode = "mcq" | "written" | "mixed";
type SessionState = "setup" | "active" | "review";

type MCQQuestion = {
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
  topic?: string;
  marks?: number;
};

type WrittenQuestion = {
  question: string;
  marks: number;
  solution: string;
  examTip?: string;
  topic?: string;
};

type AnyQuestion = MCQQuestion | WrittenQuestion;

const isMCQ = (q: AnyQuestion): q is MCQQuestion => "options" in q;

const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "Geography", "English", "ICT/CS"];
const DURATIONS = [
  { label: "15 minutes", value: 900 },
  { label: "30 minutes", value: 1800 },
  { label: "45 minutes", value: 2700 },
  { label: "1 hour", value: 3600 },
  { label: "Open (no timer)", value: 0 },
];
const QUESTION_COUNTS = [5, 10, 15, 20];

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({
  onStart,
}: {
  onStart: (config: { subject: string; mode: SessionMode; duration: number; count: number }) => void;
}) {
  const { enrolledSubjects } = useProfile();
  const [subject, setSubject] = useState(enrolledSubjects[0] ?? "Biology");
  const [mode, setMode] = useState<SessionMode>("mcq");
  const [duration, setDuration] = useState(1800);
  const [count, setCount] = useState(10);

  const modeOptions: { id: SessionMode; label: string; desc: string; Icon: React.ElementType }[] = [
    { id: "mcq", label: "Multiple Choice", desc: "Classic MCQ exam format. Pick the best answer from 4 options.", Icon: CheckCircle2 },
    { id: "written", label: "Written Test", desc: "Structured written questions with worked solutions to compare.", Icon: FileText },
    { id: "mixed", label: "Mixed Mode", desc: "A combination of MCQ and written questions — most exam-like.", Icon: Brain },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />
      <section className="bg-gradient-to-br from-primary via-pink-soft to-lavender-soft px-6 py-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-xs font-semibold text-primary mb-3">Open Session Mode</span>
        <h1 className="font-display text-4xl text-foreground">Exam Prep</h1>
        <p className="text-foreground/70 mt-2 max-w-xl mx-auto">
          AI generates a personalised exam paper on any topic. Work through it at your pace, then review with full worked solutions.
        </p>
      </section>

      <main className="max-w-2xl mx-auto w-full px-6 py-10 space-y-8">
        {/* Subject */}
        <div>
          <h2 className="font-bold mb-3">1. Choose Subject</h2>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${subject === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div>
          <h2 className="font-bold mb-3">2. Session Mode</h2>
          <div className="grid gap-3">
            {modeOptions.map(({ id, label, desc, Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex items-start gap-4 border rounded-2xl px-5 py-4 text-left transition-all ${mode === id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"}`}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mode === id ? "bg-primary text-white" : "bg-muted"}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-foreground/60 mt-0.5">{desc}</p>
                </div>
                {mode === id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto shrink-0 mt-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <h2 className="font-bold mb-3">3. Time Limit</h2>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setDuration(value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${duration === value ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div>
          <h2 className="font-bold mb-3">4. Number of Questions</h2>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`w-14 h-14 rounded-2xl text-sm font-bold border transition-colors ${count === n ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => onStart({ subject, mode, duration, count })}
          className="w-full py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center gap-3 shadow-lg hover:opacity-90 transition-opacity"
        >
          <Play className="w-5 h-5" />
          Start Session — {subject} · {mode.toUpperCase()} · {count} Questions
        </button>
      </main>
      <Footer />
    </div>
  );
}

// ─── Active Session ────────────────────────────────────────────────────────────

function ActiveSession({
  config,
  questions,
  onFinish,
}: {
  config: { subject: string; mode: SessionMode; duration: number; count: number };
  questions: AnyQuestion[];
  onFinish: (answers: Record<number, string>) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(Date.now());

  const hasTimer = config.duration > 0;

  useEffect(() => {
    if (!hasTimer || paused) return;
    if (timeLeft <= 0) { onFinish(answers); return; }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [hasTimer, paused, timeLeft]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const q = questions[current];
  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />

      {/* Timer bar */}
      <div className="sticky top-16 z-10 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold">{config.subject} · {config.mode.toUpperCase()}</span>
            <span className="text-foreground/50">Q{current + 1}/{questions.length}</span>
          </div>
          <div className="flex items-center gap-3">
            {hasTimer && (
              <>
                <span className={`flex items-center gap-1.5 font-mono font-bold text-base ${timeLeft < 300 ? "text-destructive" : "text-primary"}`}>
                  <Timer className="w-4 h-4" /> {fmt(timeLeft)}
                </span>
                <button onClick={() => setPaused((p) => !p)} className="p-1.5 rounded-full hover:bg-muted" title={paused ? "Resume" : "Pause"}>
                  {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              </>
            )}
            <button
              onClick={() => onFinish(answers)}
              className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              Finish & Review
            </button>
          </div>
        </div>
        {hasTimer && (
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${(timeLeft / config.duration) * 100}%` }}
            />
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 grid md:grid-cols-[1fr_260px] gap-8">
        <section>
          {isMCQ(q) ? (
            <MCQQuestionView
              q={q}
              index={current}
              selected={answers[current]}
              flagged={flagged.has(current)}
              onAnswer={(a) => setAnswers((p) => ({ ...p, [current]: a }))}
              onFlag={() => setFlagged((prev) => { const n = new Set(prev); n.has(current) ? n.delete(current) : n.add(current); return n; })}
            />
          ) : (
            <WrittenQuestionView
              q={q as WrittenQuestion}
              index={current}
              value={answers[current] ?? ""}
              flagged={flagged.has(current)}
              onChange={(v) => setAnswers((p) => ({ ...p, [current]: v }))}
              onFlag={() => setFlagged((prev) => { const n = new Set(prev); n.has(current) ? n.delete(current) : n.add(current); return n; })}
            />
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
              className="px-4 py-2 rounded-full border border-border text-sm flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-3 h-3" /> Previous
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(current + 1)}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1"
              >
                Next <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={() => onFinish(answers)}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
              >
                Finish & Review
              </button>
            )}
          </div>
        </section>

        {/* Navigator */}
        <aside>
          <div className="border border-border rounded-2xl p-5 sticky top-32">
            <p className="font-bold mb-1">Navigator</p>
            <p className="text-xs text-foreground/50 mb-3">{answered}/{questions.length} answered</p>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`aspect-square rounded-lg text-xs font-bold transition-all ${
                    i === current ? "bg-primary text-white" :
                    answers[i] ? "bg-primary/20 text-primary border border-primary/30" :
                    flagged.has(i) ? "border-2 border-orange-400 text-orange-500" :
                    "border border-border text-foreground/60"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] mt-4 text-foreground/60">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Answered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted border" /> Blank</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-orange-400" /> Flagged</span>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

function MCQQuestionView({ q, index, selected, flagged, onAnswer, onFlag }: {
  q: MCQQuestion; index: number; selected?: string; flagged: boolean;
  onAnswer: (a: string) => void; onFlag: () => void;
}) {
  const opts = Object.entries(q.options ?? {});
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-pink-soft text-primary font-semibold">MCQ</span>
          {q.topic && <span className="text-xs text-foreground/50">{q.topic}</span>}
        </div>
        <button onClick={onFlag} className={`text-xs flex items-center gap-1 ${flagged ? "text-orange-500" : "text-foreground/50"}`}>
          <Flag className="w-3.5 h-3.5" /> {flagged ? "Flagged" : "Flag"}
        </button>
      </div>
      <h2 className="font-display text-2xl mb-6">{q.question}</h2>
      <div className="space-y-3">
        {opts.map(([key, text]) => (
          <button
            key={key}
            onClick={() => onAnswer(key)}
            className={`w-full text-left border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${selected === key ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:bg-pink-softer/40"}`}
          >
            <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${selected === key ? "bg-primary text-white" : "bg-muted"}`}>{key}</span>
            <span className="text-sm">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WrittenQuestionView({ q, index, value, flagged, onChange, onFlag }: {
  q: WrittenQuestion; index: number; value: string; flagged: boolean;
  onChange: (v: string) => void; onFlag: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-lavender-soft text-lavender font-semibold">Written</span>
          {q.topic && <span className="text-xs text-foreground/50">{q.topic}</span>}
          <span className="text-xs text-foreground/50 ml-auto">[{q.marks} mark{q.marks !== 1 ? "s" : ""}]</span>
        </div>
        <button onClick={onFlag} className={`text-xs flex items-center gap-1 ${flagged ? "text-orange-500" : "text-foreground/50"}`}>
          <Flag className="w-3.5 h-3.5" /> {flagged ? "Flagged" : "Flag"}
        </button>
      </div>
      <h2 className="font-display text-2xl mb-5">{q.question}</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Write your answer here…"
        className="w-full border border-border rounded-2xl px-5 py-4 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
      />
    </div>
  );
}

// ─── Review Screen ─────────────────────────────────────────────────────────────

function ReviewScreen({
  config,
  questions,
  answers,
  onRestart,
  onNewSession,
}: {
  config: { subject: string; mode: SessionMode; duration: number; count: number };
  questions: AnyQuestion[];
  answers: Record<number, string>;
  onRestart: () => void;
  onNewSession: () => void;
}) {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const mcqQuestions = questions.filter(isMCQ);
  const correct = mcqQuestions.filter((q, i) => {
    const actualIndex = questions.indexOf(q);
    return answers[actualIndex]?.toUpperCase() === q.correct_answer?.toUpperCase();
  }).length;
  const mcqTotal = mcqQuestions.length;
  const pct = mcqTotal > 0 ? Math.round((correct / mcqTotal) * 100) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />

      <main className="max-w-3xl mx-auto w-full px-6 py-10">
        {/* Score card */}
        <div className="bg-gradient-to-r from-primary to-purple-500 text-white rounded-3xl p-8 text-center mb-8">
          <div className="text-5xl mb-3">{pct !== null ? (pct >= 80 ? "🏆" : pct >= 50 ? "📚" : "💪") : "📋"}</div>
          <h1 className="font-display text-3xl">Session Complete!</h1>
          <p className="text-white/80 mt-1">{config.subject} · {config.mode.toUpperCase()}</p>
          {pct !== null && (
            <div className="mt-5 bg-white/20 rounded-2xl px-8 py-4 inline-block">
              <p className="text-4xl font-bold">{pct}%</p>
              <p className="text-white/80 text-sm mt-1">{correct} / {mcqTotal} MCQ correct</p>
            </div>
          )}
        </div>

        {/* Answer review */}
        <div className="space-y-5">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isWritten = !isMCQ(q);
            const mcqCorrect = isMCQ(q) && userAns?.toUpperCase() === q.correct_answer?.toUpperCase();
            const mcqWrong = isMCQ(q) && userAns && !mcqCorrect;

            return (
              <div key={i} className={`rounded-2xl border overflow-hidden ${isMCQ(q) ? (mcqCorrect ? "border-green-200 bg-green-50" : mcqWrong ? "border-red-200 bg-red-50" : "border-border") : "border-border"}`}>
                <div className="flex items-start gap-3 px-5 py-4 border-b border-border/50">
                  {isMCQ(q) ? (
                    mcqCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> :
                    mcqWrong ? <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> :
                    <span className="w-5 h-5 rounded-full border-2 border-foreground/30 shrink-0 mt-0.5" />
                  ) : <FileText className="w-5 h-5 text-lavender shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">Q{i + 1}. {q.question}</p>
                    {isMCQ(q) && (
                      <div className="mt-2 text-sm">
                        <p>Your answer: <span className={`font-semibold ${mcqCorrect ? "text-green-700" : mcqWrong ? "text-red-600" : "text-foreground/50"}`}>
                          {userAns ? `(${userAns}) ${(q as MCQQuestion).options[userAns] ?? ""}` : "Not answered"}
                        </span></p>
                        {mcqWrong && (
                          <p className="text-green-700 mt-1">Correct: <span className="font-semibold">({(q as MCQQuestion).correct_answer}) {(q as MCQQuestion).options[(q as MCQQuestion).correct_answer] ?? ""}</span></p>
                        )}
                      </div>
                    )}
                    {isWritten && userAns && (
                      <div className="mt-2 text-sm bg-white/80 rounded-xl px-4 py-3 border border-border">
                        <p className="text-xs text-foreground/50 mb-1">Your answer:</p>
                        <p className="text-foreground/80 whitespace-pre-wrap">{userAns}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Show solution toggle */}
                <div className="px-5 py-3">
                  <button
                    onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                    className="flex items-center gap-2 text-xs text-primary font-semibold"
                  >
                    {expandedQ === i ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expandedQ === i ? "Hide" : "Show"} Worked Solution
                  </button>

                  {expandedQ === i && (
                    <div className="mt-3 space-y-3 animate-in fade-in">
                      {isMCQ(q) && (q as MCQQuestion).explanation && (
                        <div className="rounded-xl bg-lavender-soft/40 border border-lavender/20 p-4">
                          <p className="text-xs font-bold text-lavender uppercase mb-2">Explanation</p>
                          <p className="text-sm text-foreground/80">{(q as MCQQuestion).explanation}</p>
                        </div>
                      )}
                      {isWritten && (q as WrittenQuestion).solution && (
                        <div className="rounded-xl bg-lavender-soft/40 border border-lavender/20 p-4">
                          <p className="text-xs font-bold text-lavender uppercase mb-2">Model Answer</p>
                          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{(q as WrittenQuestion).solution}</p>
                        </div>
                      )}
                      {isWritten && (q as WrittenQuestion).examTip && (
                        <div className="rounded-xl bg-pink-softer border-l-4 border-primary p-4 text-sm">
                          <p className="font-semibold text-primary text-xs uppercase mb-1">Exam Tip</p>
                          <p className="text-foreground/75">{(q as WrittenQuestion).examTip}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center mt-10">
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retry Same Session
          </button>
          <button
            onClick={onNewSession}
            className="px-6 py-3 rounded-full border border-border font-semibold"
          >
            New Session
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Main Coordinator ─────────────────────────────────────────────────────────

function ExamPrepPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<SessionState>("setup");
  const [config, setConfig] = useState<{ subject: string; mode: SessionMode; duration: number; count: number } | null>(null);
  const [questions, setQuestions] = useState<AnyQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" as any });
  }, [user, authLoading]);

  const handleStart = async (cfg: typeof config) => {
    if (!cfg) return;
    setConfig(cfg);
    setGenerating(true);

    try {
      const payload = {
        subject: cfg.subject,
        mode: cfg.mode,
        count: cfg.count,
      };

      // Use the Django AI assistant endpoint to generate exam questions
      const res = await api.post<{ questions: AnyQuestion[] }>('/api/ai/exam-prep/', payload);
      setQuestions(res.questions);
      setAnswers({});
      setState("active");
    } catch (err: any) {
      // Fallback: generate via GROQ client-side if backend endpoint isn't wired yet
      const groqKey = import.meta.env.VITE_GROQ_API_KEY;
      if (groqKey && groqKey !== "your_groq_api_key_here") {
        try {
          const prompt = buildPrompt(cfg.subject, cfg.mode, cfg.count);
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
              max_tokens: 4096,
            }),
          });
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content ?? "[]";
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]) as AnyQuestion[];
            setQuestions(parsed);
            setAnswers({});
            setState("active");
          } else {
            throw new Error("Could not parse questions from AI response");
          }
        } catch (groqErr: any) {
          toast.error(groqErr?.message ?? "Failed to generate questions. Check your VITE_GROQ_API_KEY.");
        }
      } else {
        toast.error("AI key not configured. Set VITE_GROQ_API_KEY or connect the backend.");
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleFinish = (finalAnswers: Record<number, string>) => {
    setAnswers(finalAnswers);
    setState("review");
  };

  if (authLoading || generating) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header authed />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="font-display text-2xl">Generating your exam…</p>
          <p className="text-foreground/60 text-sm">AI is crafting {config?.count} {config?.mode} questions on {config?.subject}</p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mt-2" />
        </main>
        <Footer />
      </div>
    );
  }

  if (state === "setup") return <SetupScreen onStart={handleStart} />;

  if (state === "active" && config) {
    return (
      <ActiveSession
        config={config}
        questions={questions}
        onFinish={handleFinish}
      />
    );
  }

  if (state === "review" && config) {
    return (
      <ReviewScreen
        config={config}
        questions={questions}
        answers={answers}
        onRestart={() => handleStart(config)}
        onNewSession={() => setState("setup")}
      />
    );
  }

  return null;
}

// ─── Prompt builder for Groq fallback ─────────────────────────────────────────

function buildPrompt(subject: string, mode: SessionMode, count: number): string {
  const isMCQOnly = mode === "mcq";
  const isWrittenOnly = mode === "written";
  const half = Math.floor(count / 2);

  if (isMCQOnly) {
    return `Generate exactly ${count} IGCSE-style multiple-choice questions on ${subject}.

Return ONLY a JSON array (no extra text). Each object:
{
  "question": "...",
  "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
  "correct_answer": "A",
  "explanation": "...",
  "topic": "...",
  "marks": 1
}`;
  }

  if (isWrittenOnly) {
    return `Generate exactly ${count} IGCSE-style written exam questions on ${subject}.

Return ONLY a JSON array (no extra text). Each object:
{
  "question": "...",
  "marks": 4,
  "solution": "Full model answer with key marking points...",
  "examTip": "Tip for maximising marks on this type of question",
  "topic": "..."
}`;
  }

  // Mixed
  return `Generate a mixed IGCSE exam paper on ${subject} with exactly ${half} MCQ questions followed by ${count - half} written questions.

Return ONLY a JSON array (no extra text). MCQ objects:
{"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct_answer":"A","explanation":"...","topic":"...","marks":1}

Written objects:
{"question":"...","marks":4,"solution":"...","examTip":"...","topic":"..."}`;
}
