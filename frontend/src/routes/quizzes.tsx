import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Clock,
  BookOpen,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  Loader2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getQuizSets, getQuiz, submitQuiz } from "@/api/quizzes";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import type { QuizSet, QuizQuestion } from "@/api/quizzes";

export const Route = createFileRoute("/quizzes")({
  head: () => ({ meta: [{ title: "Quiz — ExamGlow" }] }),
  component: Quizzes,
});

function Quizzes() {
  const { user, loading: authLoading } = useAuth();
  const { enrolledSubjects } = useProfile();
  const navigate = useNavigate();
  interface QuizSet {
    id: string;
    title: string;
    subject: string;
    question_count: number;
    attempts?: number;
    best_score?: number;
  }

  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [selectedQuiz, setSelectedQuiz] = useState<{ quiz: QuizSet; questions: QuizQuestion[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  interface QuizResults {
    score: number;
    total: number;
    percentage: number;
    answers: Array<{ questionId: string; correct: boolean; userAnswer: string; correctAnswer: string }>;
  }

  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (!authLoading && !user) { navigate({ to: "/login" as any }); return; }
    if (!authLoading) {
      getQuizSets().then((sets) => { setQuizSets(sets); setLoading(false); });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!selectedQuiz || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [selectedQuiz, timeLeft, submitted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const loadQuiz = async (quizSet: QuizSet) => {
    setQuizLoading(true);
    const data = await getQuiz(quizSet.id);
    setSelectedQuiz(data);
    setTimeLeft(data.quiz.time_limit_seconds);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setSubmitted(false);
    setResults(null);
    startTime.current = Date.now();
    setQuizLoading(false);
  };

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleFlag = (questionId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedQuiz) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    const res = await submitQuiz(selectedQuiz.quiz.id, answers, timeTaken);
    setResults(res);
    setSubmitted(true);
    setSubmitting(false);
  };

  if (authLoading) return null;

  const subjectColors: Record<string, string> = {
    Biology: "bg-green-50 text-green-700",
    Chemistry: "bg-blue-50 text-blue-700",
    Physics: "bg-purple-50 text-purple-700",
    Mathematics: "bg-orange-50 text-orange-700",
  };

  // Quiz selection
  if (!selectedQuiz) {
    const filteredSets = activeSubject === "All"
      ? quizSets
      : quizSets.filter((qs: any) => qs.subject === activeSubject);

    const subjectTabs = ["All", ...enrolledSubjects.filter((s) =>
      quizSets.some((qs: any) => qs.subject === s)
    )];

    return (
      <div className="min-h-screen flex flex-col">
        <Header authed />
        <section className="bg-pink-soft text-center py-14 px-6">
          <h1 className="font-display text-4xl">Practice Quizzes</h1>
          <p className="text-foreground/70 mt-2 max-w-xl mx-auto">
            Test your knowledge with timed multiple-choice quizzes.
          </p>
        </section>
        <main className="max-w-4xl mx-auto w-full px-6 py-10">
          {/* Subject filter tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {subjectTabs.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  activeSubject === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/40 hover:bg-pink-soft/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filteredSets.map((qs: any) => (
                <button
                  key={qs.id}
                  onClick={() => loadQuiz(qs)}
                  className="bg-white border border-border rounded-2xl overflow-hidden text-left hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  {qs.image_url && (
                    <div className="h-36 w-full overflow-hidden">
                      <img src={qs.image_url} alt={qs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${subjectColors[qs.subject] ?? "bg-muted text-foreground/60"}`}>
                        {qs.subject}
                      </span>
                      {qs.best_score != null && (
                        <span className="text-xs text-green-600 font-semibold">Best: {qs.best_score}%</span>
                      )}
                    </div>
                    <h3 className="font-bold mt-3 text-lg group-hover:text-primary transition-colors">{qs.title}</h3>
                    <p className="text-sm text-foreground/60 mt-1">{qs.description}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-foreground/50">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(qs.time_limit_seconds / 60)} min</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> 8 questions</span>
                      {qs.attempt_count > 0 && <span>{qs.attempt_count} attempt{qs.attempt_count !== 1 ? "s" : ""}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const { quiz, questions } = selectedQuiz;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  // Results view
  if (submitted && results) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header authed />
        <main className="max-w-3xl mx-auto w-full px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">{results.pct >= 80 ? "🏆" : results.pct >= 50 ? "📚" : "💪"}</div>
            <h1 className="font-display text-4xl">Quiz Complete!</h1>
            <p className="text-foreground/60 mt-2">{quiz.title}</p>
            <div className="mt-6 inline-block bg-primary/10 rounded-2xl px-8 py-4">
              <p className="text-5xl font-bold text-primary">{results.pct}%</p>
              <p className="text-foreground/60 mt-1">{results.score} / {results.total} correct</p>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const graded = results.graded[q.id];
              const correct = graded?.correct;
              return (
                <div key={q.id} className={`rounded-2xl border p-5 ${correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-start gap-3">
                    {correct
                      ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Q{i + 1}. {q.question}</p>
                      <p className="text-sm mt-2">
                        Your answer: <span className={correct ? "text-green-700 font-semibold" : "text-red-600 font-semibold"}>
                          {userAns ? `(${userAns}) ${(q as any)[`option_${userAns.toLowerCase()}`] ?? userAns}` : "Not answered"}
                        </span>
                      </p>
                      {!correct && (
                        <p className="text-sm text-green-700 mt-1">
                          Correct: <span className="font-semibold">({graded.correctAnswer}) {(q as any)[`option_${graded.correctAnswer.toLowerCase()}`]}</span>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-xs text-foreground/60 mt-2 italic">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center mt-10">
            <button
              onClick={() => loadQuiz(quiz)}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
            >
              Retry Quiz
            </button>
            <button
              onClick={() => { setSelectedQuiz(null); }}
              className="px-6 py-3 rounded-full border border-border font-semibold"
            >
              All Quizzes
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const options = [
    { key: "A", text: currentQuestion.option_a },
    { key: "B", text: currentQuestion.option_b },
    { key: "C", text: currentQuestion.option_c },
    { key: "D", text: currentQuestion.option_d },
  ];
  const isFlagged = flagged.has(currentQuestion.id);
  const selectedAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" /> Time Remaining:{" "}
            <b className={`ml-1 ${timeLeft < 60 ? "text-destructive" : "text-primary"}`}>{formatTime(timeLeft)}</b>
          </span>
          <span className="text-foreground/60">
            Question <b>{currentIndex + 1} of {questions.length}</b>
          </span>
        </div>
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 py-10 grid md:grid-cols-[1fr_280px] gap-8">
        <section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-soft text-primary">
                {quiz.subject}
              </span>
              <span className="text-xs text-foreground/60 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {currentQuestion.topic}
              </span>
            </div>
            <button
              onClick={() => handleFlag(currentQuestion.id)}
              className={`text-xs flex items-center gap-1 ${isFlagged ? "text-primary" : "text-foreground/60"}`}
            >
              <Flag className="w-3 h-3" /> {isFlagged ? "Flagged" : "Flag for review"}
            </button>
          </div>
          <h1 className="font-display text-2xl md:text-3xl mt-4">{currentQuestion.question}</h1>

          {currentQuestion.image_url && (
            <div className="mt-5 rounded-2xl overflow-hidden border border-border bg-muted/30">
              <img
                src={currentQuestion.image_url}
                alt="Question diagram"
                className="w-full max-h-64 object-cover"
              />
            </div>
          )}

          <div className="mt-6 space-y-3">
            {options.map(({ key, text }) => (
              <button
                key={key}
                onClick={() => handleAnswer(currentQuestion.id, key)}
                className={`w-full text-left border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${
                  selectedAnswer === key
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:bg-pink-softer/40"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                    selectedAnswer === key ? "bg-primary text-white" : "bg-muted"
                  }`}
                >
                  {key}
                </span>
                <span className="text-sm">{text}</span>
              </button>
            ))}
          </div>

          <hr className="my-7" />
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); }}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-full border border-border text-sm flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-3 h-3" /> Previous
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="text-sm text-foreground/60 hover:text-primary"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Finish Quiz"}
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1"
              >
                Next Question <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Quiz"}
              </button>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="border border-border rounded-2xl p-5">
            <p className="font-bold">Navigator</p>
            <p className="text-xs text-foreground/60 mb-3">Jump to any question</p>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, n) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(n)}
                  className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                    n === currentIndex
                      ? "bg-primary text-white"
                      : answers[q.id]
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : flagged.has(q.id)
                      ? "border-2 border-orange-400 text-orange-500"
                      : "border border-border text-foreground/60"
                  }`}
                >
                  {n + 1}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] mt-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Answered ({answeredCount})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted border" /> Unanswered ({questions.length - answeredCount})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-orange-400" /> Flagged ({flagged.size})</span>
            </div>
          </div>

          <div className="bg-pink-softer rounded-2xl p-5">
            <p className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Progress
            </p>
            <p className="text-sm text-foreground/70 mt-1">
              {answeredCount} of {questions.length} questions answered.
            </p>
            {answeredCount === questions.length && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-3 w-full py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trophy className="w-4 h-4" /> Submit Now</>}
              </button>
            )}
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
