import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { getNoteForObjective } from "@/data/topicNotes";
import { useSyllabusProgress } from "@/hooks/useSyllabusProgress";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  StickyNote,
  Link2,
} from "lucide-react";
import { NoteAiChat } from "@/components/NoteAiChat";


export const Route = createFileRoute(
  "/topic-notes/$subjectId/$objectiveId",
)({
  component: TopicNotesPage,
});

function TopicNotesPage() {
  const { subjectId, objectiveId } = Route.useParams();
  const syllabusData = getSyllabusData(subjectId);
  const note = getNoteForObjective(subjectId, objectiveId);
  const { toggleObjective, isComplete } = useSyllabusProgress(subjectId);

  if (!syllabusData || !note) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header authed />
        <main className="flex-1 flex items-center justify-center flex-col gap-4">
          <StickyNote className="w-12 h-12 text-foreground/20" />
          <p className="text-foreground/60 text-sm">
            Notes for this topic are not yet available.
          </p>
          {syllabusData && (
            <Link
              to="/syllabus/$subjectId"
              params={{ subjectId }}
              className="flex items-center gap-2 text-primary text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to syllabus
            </Link>
          )}
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
  const done = isComplete(objectiveId);

  const subObjIndex = allSubObjectives.findIndex((s) => s.id === objectiveId);
  const prevSubObj = subObjIndex > 0 ? allSubObjectives[subObjIndex - 1] : null;
  const nextSubObj =
    subObjIndex < allSubObjectives.length - 1
      ? allSubObjectives[subObjIndex + 1]
      : null;

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
          <span className="text-foreground/70">
            {subObjective?.code ?? objectiveId} Notes
          </span>
        </div>

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">
                {syllabusData.subject.name} ·{" "}
                {parentObjective
                  ? `${parentObjective.code}. ${parentObjective.title}`
                  : ""}
              </p>
              <h1 className="font-display text-2xl font-bold">{note.title}</h1>
              <div className="flex gap-2 mt-3 flex-wrap">
                {note.keyPoints.slice(0, 2).map((kp, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/20 px-2.5 py-1 rounded-full"
                  >
                    {kp}
                  </span>
                ))}
              </div>
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
        </div>

        {/* Key points summary */}
        <div className="rounded-2xl bg-pink-soft/50 border border-primary/10 p-5 mb-8">
          <p className="font-semibold text-sm flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            Key Points to Know
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {note.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {kp}
              </li>
            ))}
          </ul>
        </div>

        {/* Main content sections */}
        <div className="space-y-8">
          {note.content.map((section, idx) => {
            if (section.kind === "paragraph") {
              return (
                <div key={idx}>
                  <h2 className="font-display text-xl mb-3">{section.heading}</h2>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              );
            }

            if (section.kind === "bullets") {
              return (
                <div key={idx}>
                  <h2 className="font-display text-xl mb-3">{section.heading}</h2>
                  <ul className="space-y-2">
                    {section.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (section.kind === "definition") {
              return (
                <div key={idx} className="rounded-xl border-l-4 border-lavender bg-lavender-soft/30 p-5">
                  <p className="text-xs font-bold text-lavender uppercase tracking-wide mb-1">
                    Definition
                  </p>
                  <p className="font-semibold text-base mb-1">{section.term}</p>
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {section.definition}
                  </p>
                </div>
              );
            }

            if (section.kind === "table") {
              return (
                <div key={idx}>
                  <h2 className="font-display text-xl mb-3">{section.heading}</h2>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          {section.headers.map((h, i) => (
                            <th
                              key={i}
                              className="text-left px-4 py-3 font-semibold text-foreground/70 border-b border-border"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.rows.map((row, ri) => (
                          <tr
                            key={ri}
                            className="border-b border-border last:border-0 hover:bg-muted/20"
                          >
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`px-4 py-3 text-foreground/80 ${ci === 0 ? "font-medium" : ""}`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            if (section.kind === "image") {
              return (
                <div key={idx} className="rounded-2xl overflow-hidden border border-border bg-muted/20">
                  <img
                    src={section.src}
                    alt={section.alt}
                    className="w-full object-contain max-h-80"
                  />
                  {section.caption && (
                    <p className="text-xs text-foreground/50 text-center px-4 py-2.5 italic border-t border-border">
                      {section.caption}
                    </p>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Exam tips */}
        {note.examTips.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Exam Tips
            </h2>
            <div className="space-y-3">
              {note.examTips.map((tip, i) => (
                <div
                  key={i}
                  className="border-l-4 border-primary bg-pink-softer rounded-r-xl p-4 flex gap-3 text-sm"
                >
                  <span className="text-primary font-bold shrink-0">💡</span>
                  <p className="text-foreground/80">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common mistakes */}
        {note.commonMistakes.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Common Mistakes
            </h2>
            <div className="space-y-3">
              {note.commonMistakes.map((mistake, i) => (
                <div
                  key={i}
                  className="border-l-4 border-destructive bg-destructive/5 rounded-r-xl p-4 flex gap-3 text-sm"
                >
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-foreground/80">{mistake}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Topics */}
        {note.relatedTopics && note.relatedTopics.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Related Topics
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {note.relatedTopics.map((rt, i) => (
                <Link
                  key={i}
                  to="/topic-notes/$subjectId/$objectiveId"
                  params={{ subjectId: rt.subjectId, objectiveId: rt.objectiveId }}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-pink-soft/30 transition-all p-4"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-foreground/50 mb-0.5">Related Topic</p>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {rt.label}
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-foreground/30 group-hover:text-primary ml-auto shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Practice CTA */}
        <div className="mt-10 rounded-2xl bg-lavender-soft p-8 text-center">
          <HelpCircle className="w-8 h-8 text-lavender mx-auto mb-3" />
          <h3 className="font-display text-xl text-lavender">
            Ready to test yourself?
          </h3>
          <p className="text-sm text-foreground/60 mt-1 mb-5">
            Practice exam questions with full worked solutions for this topic.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/practice/$subjectId/$objectiveId"
              params={{ subjectId, objectiveId }}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              Practice Questions
            </Link>
            <Link
              to="/syllabus/$subjectId"
              params={{ subjectId }}
              className="px-5 py-2.5 rounded-full bg-white text-lavender text-sm font-semibold border border-lavender/20"
            >
              Back to Syllabus
            </Link>
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {prevSubObj ? (
            <Link
              to="/topic-notes/$subjectId/$objectiveId"
              params={{ subjectId, objectiveId: prevSubObj.id }}
              className="border border-border rounded-2xl p-4 text-left flex items-center gap-3 hover:bg-muted/30"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <div>
                <p className="text-xs text-foreground/50">PREVIOUS</p>
                <p className="text-sm font-semibold">{prevSubObj.code} {prevSubObj.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextSubObj ? (
            <Link
              to="/topic-notes/$subjectId/$objectiveId"
              params={{ subjectId, objectiveId: nextSubObj.id }}
              className="border border-border rounded-2xl p-4 text-right flex items-center justify-end gap-3 hover:bg-muted/30"
            >
              <div>
                <p className="text-xs text-foreground/50">NEXT</p>
                <p className="text-sm font-semibold">{nextSubObj.code} {nextSubObj.title}</p>
              </div>
              <ArrowLeft className="w-4 h-4 rotate-180 shrink-0" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      <Footer />

      {/* Floating AI Chat */}
      <NoteAiChat
        noteTitle={note.title}
        noteSubject={syllabusData.subject.name}
        noteContext={note.keyPoints.join(", ")}
      />
    </div>
  );
}

