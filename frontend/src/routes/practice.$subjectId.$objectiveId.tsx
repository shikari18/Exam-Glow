import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { getQuestionsForObjective } from "@/data/questions";
import { getNoteForObjective } from "@/data/topicNotes";
import { useSyllabusProgress } from "@/hooks/useSyllabusProgress";
import { TopicQuestion, Difficulty } from "@/types/content";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  BookOpen,
  AlertCircle,
  Lightbulb,
  Trophy,
  StickyNote,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/practice/$subjectId/$objectiveId")({
  component: PracticePage,
});

const DIFFICULTY_COLOURS: Record<Difficulty, string> = {
  Easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Hard: "bg-rose-100 text-rose-700 border-rose-200",
};

const DIFFICULTY_DOT: Record<Difficulty, string> = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-rose-500",
};

function QuestionCard({
  question,
  index,
}: {
  question: TopicQuestion;
  index: number;
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/20">
        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DIFFICULTY_COLOURS[question.difficulty]}`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${DIFFICULTY_DOT[question.difficulty]}`}
          />
          {question.difficulty}
        </span>
        <span className="ml-auto text-xs text-foreground/50 font-medium">
          [{question.marks} mark{question.marks !== 1 ? "s" : ""}]
        </span>
      </div>

      {/* Question */}
      <div className="px-5 py-5">
        <p className="text-sm leading-relaxed text-foreground font-medium">
          {question.question}
        </p>

        {/* Answer space input */}
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Write your answer here…"
          rows={3}
          className="mt-4 w-full border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted/20 placeholder:text-foreground/40"
        />
      </div>

      {/* Toggle worked solution */}
      <div className="px-5 pb-5">
        <button
          onClick={() => setShowSolution((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-xs font-semibold hover:bg-pink-soft/40 transition-colors"
        >
          {showSolution ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Hide Worked Solution
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> Show Worked Solution
            </>
          )}
        </button>

        {showSolution && (
          <div className="mt-4 space-y-4">
            {/* Step-by-step */}
            <div className="rounded-xl bg-lavender-soft/40 border border-lavender/20 p-4">
              <p className="text-xs font-bold text-lavender uppercase tracking-wide mb-3">
                Step-by-step answer
              </p>
              <ol className="space-y-2">
                {question.workedSolution.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground/80">
                    <span className="w-5 h-5 rounded-full bg-lavender/20 text-lavender text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Mark scheme */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
                Mark scheme points
              </p>
              <ul className="space-y-1.5">
                {question.workedSolution.markSchemePoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam tip */}
            {question.workedSolution.examTip && (
              <div className="rounded-xl bg-pink-softer border-l-4 border-primary p-4 flex gap-3 text-sm">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary text-xs uppercase tracking-wide mb-1">
                    Exam Tip
                  </p>
                  <p className="text-foreground/75">{question.workedSolution.examTip}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PracticePage() {
  const { subjectId, objectiveId } = Route.useParams();
  const syllabusData = getSyllabusData(subjectId);
  const { toggleObjective, isComplete } = useSyllabusProgress(subjectId);

  const [activeFilter, setActiveFilter] = useState<Difficulty | "All">("All");

  if (!syllabusData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header authed />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-foreground/60">Subject not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const allSubObjectives = syllabusData.objectives.flatMap(
    (o) => o.subObjectives ?? [],
  );
  const subObjective = allSubObjectives.find((s) => s.id === objectiveId);
  const parentObjective = syllabusData.objectives.find((o) =>
    o.subObjectives?.some((s) => s.id === objectiveId),
  );

  const allQuestions = getQuestionsForObjective(subjectId, objectiveId);
  const note = getNoteForObjective(subjectId, objectiveId);
  const done = isComplete(objectiveId);

  const filtered =
    activeFilter === "All"
      ? allQuestions
      : allQuestions.filter((q) => q.difficulty === activeFilter);

  const counts = {
    All: allQuestions.length,
    Easy: allQuestions.filter((q) => q.difficulty === "Easy").length,
    Medium: allQuestions.filter((q) => q.difficulty === "Medium").length,
    Hard: allQuestions.filter((q) => q.difficulty === "Hard").length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />

      <main className="max-w-4xl mx-auto w-full px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-foreground/50 mb-6">
          <Link to="/home" className="hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <Link
            to="/syllabus/$subjectId"
            params={{ subjectId }}
            className="hover:text-primary"
          >
            {syllabusData.subject.name}
          </Link>
          <span>›</span>
          <span className="text-foreground/70">{subObjective?.code ?? objectiveId}</span>
        </div>

        {/* Header card */}
        <div className="rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/70 text-sm mb-1">
                {syllabusData.subject.name} ·{" "}
                {parentObjective ? `Section ${parentObjective.code}` : ""}
              </p>
              <h1 className="font-display text-2xl font-bold">
                {subObjective?.title ?? objectiveId}
              </h1>
              <p className="text-white/75 text-sm mt-1">
                {subObjective?.description}
              </p>
            </div>
            <button
              onClick={() => toggleObjective(objectiveId)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${
                done
                  ? "bg-white text-primary"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {done ? "Completed" : "Mark Done"}
            </button>
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
              {allQuestions.length} question{allQuestions.length !== 1 ? "s" : ""}
            </span>
            {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
              <span key={d} className="text-xs bg-white/20 px-2.5 py-1 rounded-full">
                {counts[d]} {d}
              </span>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex gap-3 mb-8">
          {note && (
            <Link
              to="/topic-notes/$subjectId/$objectiveId"
              params={{ subjectId, objectiveId }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-sm font-semibold hover:border-primary/40 hover:bg-pink-soft/20 transition-colors"
            >
              <StickyNote className="w-4 h-4 text-primary" />
              Revision Notes
            </Link>
          )}
          <Link
            to="/syllabus/$subjectId"
            params={{ subjectId }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-sm font-semibold hover:border-primary/40 hover:bg-pink-soft/20 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-foreground/60" />
            Full Syllabus
          </Link>
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 mb-6">
          {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveFilter(d)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeFilter === d
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              {d}
              {counts[d] > 0 && (
                <span
                  className={`ml-1.5 text-xs ${
                    activeFilter === d ? "opacity-80" : "text-foreground/50"
                  }`}
                >
                  ({counts[d]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Questions */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <AlertCircle className="w-8 h-8 text-foreground/30 mx-auto mb-3" />
            <p className="text-foreground/50 text-sm">
              No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} questions available yet for this topic.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {filtered.length > 0 && (
          <div className="mt-10 rounded-2xl bg-lavender-soft p-8 text-center">
            <Trophy className="w-8 h-8 text-lavender mx-auto mb-3" />
            <h3 className="font-display text-xl text-lavender">
              Finished all {activeFilter !== "All" ? activeFilter : ""} questions?
            </h3>
            <p className="text-sm text-foreground/60 mt-1 mb-5">
              Mark this topic as complete and move on to the next syllabus point.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => toggleObjective(objectiveId)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  done
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
                {done ? "Marked as Complete ✓" : "Mark as Complete"}
              </button>
              <Link
                to="/syllabus/$subjectId"
                params={{ subjectId }}
                className="px-5 py-2.5 rounded-full bg-white text-lavender text-sm font-semibold border border-lavender/20"
              >
                Back to Syllabus
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
