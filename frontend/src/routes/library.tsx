import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Upload, Link as LinkIcon, FileText, Youtube, Loader2, Trash2,
  Sparkles, BookOpen, Brain, HelpCircle, AlertCircle, CheckCircle2,
  RotateCcw, ChevronDown, ChevronUp, Plus, X, Layers, RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  uploadResource, getMyResources, getCuratedResources, deleteResource,
  generateFlashcards, generateQuiz, generatePracticeQuestions, reprocessResource,
  type Resource, type AIFlashcard, type AIQuiz,
} from "@/api/library";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "My Library — ExamGlow" }] }),
  component: LibraryPage,
});

// ─── Upload Panel ─────────────────────────────────────────────────────────────

function UploadPanel({ onUploaded }: { onUploaded: (r: Resource) => void }) {
  const [mode, setMode] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "Geography", "English", "ICT/CS", "History"];

  const handleFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const guessType = (): "pdf" | "video" | "slides" | "other" => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") return "pdf";
      if (ext === "pptx" || ext === "ppt") return "slides";
    }
    return "other";
  };

  const handleUpload = async () => {
    if (!title.trim()) { toast.error("Please enter a title"); return; }
    if (mode === "file" && !file) { toast.error("Please select a file"); return; }
    if (mode === "url" && !url.trim()) { toast.error("Please enter a URL"); return; }

    setUploading(true);
    try {
      const resource = await uploadResource({
        title: title.trim(),
        resource_type: guessType(),
        file: mode === "file" ? file ?? undefined : undefined,
        url: mode === "url" ? url.trim() : undefined,
        subject: subject || undefined,
        selected_features: ["flashcards", "quiz", "summary"],
      });
      toast.success("Uploaded! AI synthesis starting…");
      onUploaded(resource);
      setFile(null);
      setUrl("");
      setTitle("");
      setSubject("");
    } catch (err: any) {
      if (err?.status === 402) {
        toast.error("Free limit reached. Upgrade to Premium for unlimited uploads.");
      } else {
        toast.error(err?.message ?? "Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-primary" /> Upload Material
      </h2>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-5 bg-muted/40 rounded-xl p-1">
        <button
          onClick={() => setMode("file")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "file" ? "bg-white shadow text-foreground" : "text-foreground/50"}`}
        >
          <FileText className="w-4 h-4" /> File
        </button>
        <button
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "url" ? "bg-white shadow text-foreground" : "text-foreground/50"}`}
        >
          <Youtube className="w-4 h-4" /> YouTube / URL
        </button>
      </div>

      {/* Drop zone */}
      {mode === "file" && (
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${file ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.pptx,.ppt,.txt,.mp4,.jpg,.jpeg,.png"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-sm">{file.name}</p>
                <p className="text-xs text-foreground/50">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-2 text-foreground/40 hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
              <p className="font-semibold text-sm">Drop a file or click to browse</p>
              <p className="text-xs text-foreground/50 mt-1">PDF, DOCX, PPTX, TXT, MP4 · max 50 MB</p>
            </>
          )}
        </div>
      )}

      {mode === "url" && (
        <div className="space-y-3">
          <div className="relative">
            <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-foreground/40" />
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm"
            />
          </div>
          <p className="text-xs text-foreground/50">Paste a YouTube video or any public page URL</p>
        </div>
      )}

      {/* Metadata */}
      <div className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm"
        />
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-white"
        >
          <option value="">Subject (optional)</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || (!file && !url) || !title.trim()}
        className="mt-4 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Sparkles className="w-4 h-4" /> Generate Study Kit</>}
      </button>
    </div>
  );
}

// ─── Resource Card ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  error: "bg-red-50 text-red-700 border-red-200",
};
const STATUS_ICON: Record<string, React.ElementType> = {
  processing: Loader2,
  ready: CheckCircle2,
  error: AlertCircle,
};

function ResourceCard({
  resource,
  onSelect,
  onDelete,
}: {
  resource: Resource;
  onSelect: (r: Resource) => void;
  onDelete: (id: number) => void;
}) {
  const Icon = STATUS_ICON[resource.status] ?? Loader2;
  const colorClass = STATUS_COLOR[resource.status] ?? "";

  return (
    <div
      className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
      onClick={() => resource.status === "ready" && onSelect(resource)}
    >
      {resource.cover_image_url ? (
        <div className="h-28 overflow-hidden">
          <img src={resource.cover_image_url} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className={`h-28 flex items-center justify-center ${resource.resource_type === "video" ? "bg-red-50" : "bg-pink-softer/60"}`}>
          {resource.resource_type === "video" ? <Youtube className="w-8 h-8 text-red-400" /> : <FileText className="w-8 h-8 text-primary/30" />}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{resource.title}</p>
            {resource.subject && <p className="text-xs text-foreground/50 mt-0.5">{resource.subject}</p>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(resource.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 text-foreground/30 hover:text-destructive transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className={`mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold ${colorClass}`}>
          <Icon className={`w-3 h-3 ${resource.status === "processing" ? "animate-spin" : ""}`} />
          {resource.status === "processing"
            ? resource.status_text || `Processing ${resource.processing_progress}%`
            : resource.status === "ready" ? "Study kit ready" : "Processing error"}
        </div>
      </div>
    </div>
  );
}

// ─── Study Kit Viewer ─────────────────────────────────────────────────────────

function StudyKitViewer({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"summary" | "flashcards" | "quiz" | "practice">("summary");
  const [flashcards, setFlashcards] = useState<AIFlashcard[] | null>(null);
  const [quiz, setQuiz] = useState<AIQuiz | null>(null);
  const [practice, setPractice] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const load = useCallback(async (tab: typeof activeTab) => {
    if (loading[tab]) return;
    setLoading((p) => ({ ...p, [tab]: true }));
    try {
      if (tab === "flashcards" && !flashcards) {
        const r = await generateFlashcards(resource.id, 12);
        setFlashcards(r.preview_cards);
      } else if (tab === "quiz" && !quiz) {
        const r = await generateQuiz(resource.id, "mcq", 8);
        setQuiz(r);
      } else if (tab === "practice" && !practice) {
        const r = await generatePracticeQuestions(resource.id, "medium", 5);
        setPractice(r as unknown[]);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate content");
    } finally {
      setLoading((p) => ({ ...p, [tab]: false }));
    }
  }, [resource.id, flashcards, quiz, practice, loading]);

  useEffect(() => {
    if (activeTab !== "summary") load(activeTab);
  }, [activeTab]);

  const notesJson = resource.ai_notes_json ?? {};
  const summary = resource.ai_summary || (notesJson as any)?.summary || "";
  const sections: Array<{ heading: string; content: string }> = (notesJson as any)?.sections ?? [];
  const keyPoints: string[] = (notesJson as any)?.key_points ?? [];

  const TABS = [
    { id: "summary" as const, label: "Summary", Icon: BookOpen },
    { id: "flashcards" as const, label: "Flashcards", Icon: Layers },
    { id: "quiz" as const, label: "Quiz", Icon: HelpCircle },
    { id: "practice" as const, label: "Practice Q's", Icon: Brain },
  ];

  const quizScore = quiz && quizSubmitted
    ? quiz.questions.filter((q, i) => quizAnswers[i]?.toUpperCase() === q.correct_answer?.toUpperCase()).length
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{resource.title}</p>
            {resource.subject && <p className="text-xs text-foreground/50">{resource.subject}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border px-4 shrink-0 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id ? "border-primary text-primary" : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Summary ── */}
          {activeTab === "summary" && (
            <div className="space-y-5">
              {summary && (
                <div className="bg-pink-softer/60 rounded-2xl p-5">
                  <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> AI Summary
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{summary}</p>
                </div>
              )}
              {keyPoints.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {kp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sections.map((sec, i) => (
                <div key={i}>
                  <h3 className="font-bold text-base mb-2">{sec.heading}</h3>
                  <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-wrap">{sec.content}</p>
                </div>
              ))}
              {!summary && sections.length === 0 && keyPoints.length === 0 && (
                <div className="text-center py-12 text-foreground/40">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>AI is still processing this resource.</p>
                  <button onClick={() => window.location.reload()} className="mt-3 flex items-center gap-1 mx-auto text-sm text-primary">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Flashcards ── */}
          {activeTab === "flashcards" && (
            <div>
              {loading.flashcards ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-foreground/60">Generating flashcards…</p>
                </div>
              ) : flashcards && flashcards.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-foreground/60">{flashIdx + 1} / {flashcards.length}</p>
                    <button onClick={() => { setFlashIdx(0); setFlipped(false); }} className="text-xs text-primary flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Restart
                    </button>
                  </div>
                  <div
                    className="cursor-pointer select-none"
                    style={{ perspective: "1000px" }}
                    onClick={() => setFlipped(!flipped)}
                  >
                    <div
                      className="relative transition-transform duration-500 min-h-[200px]"
                      style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                    >
                      <div className="absolute inset-0 bg-pink-softer rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-pink-soft" style={{ backfaceVisibility: "hidden" }}>
                        <p className="text-xs text-primary uppercase tracking-wider mb-2">Question</p>
                        <p className="font-display text-lg leading-snug">{flashcards[flashIdx].question}</p>
                        <p className="text-xs text-foreground/40 mt-4">Click to reveal answer</p>
                      </div>
                      <div className="absolute inset-0 bg-lavender-soft rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-lavender/20" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <p className="text-xs text-lavender uppercase tracking-wider mb-2">Answer</p>
                        <p className="font-display text-lg leading-snug">{flashcards[flashIdx].answer}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center mt-6">
                    <button
                      onClick={() => { setFlashIdx(Math.max(0, flashIdx - 1)); setFlipped(false); }}
                      disabled={flashIdx === 0}
                      className="px-4 py-2 rounded-full border border-border text-sm disabled:opacity-40"
                    >← Previous</button>
                    <button
                      onClick={() => { setFlashIdx(Math.min(flashcards.length - 1, flashIdx + 1)); setFlipped(false); }}
                      disabled={flashIdx === flashcards.length - 1}
                      className="px-4 py-2 rounded-full border border-border text-sm disabled:opacity-40"
                    >Next →</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-foreground/40">
                  <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No flashcards available yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Quiz ── */}
          {activeTab === "quiz" && (
            <div>
              {loading.quiz ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-foreground/60">Generating quiz…</p>
                </div>
              ) : quiz ? (
                <div>
                  {quizSubmitted && quizScore !== null && (
                    <div className="mb-5 rounded-2xl bg-primary/10 p-5 text-center">
                      <p className="text-3xl font-bold text-primary">{Math.round((quizScore / quiz.questions.length) * 100)}%</p>
                      <p className="text-sm text-foreground/60 mt-1">{quizScore} / {quiz.questions.length} correct</p>
                      <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="mt-3 text-xs text-primary flex items-center gap-1 mx-auto">
                        <RotateCcw className="w-3 h-3" /> Retry
                      </button>
                    </div>
                  )}
                  <div className="space-y-5">
                    {quiz.questions.map((q, i) => {
                      const opts = q.options ?? {};
                      const optKeys = Object.keys(opts);
                      const isCorrect = quizSubmitted && quizAnswers[i]?.toUpperCase() === q.correct_answer?.toUpperCase();
                      const isWrong = quizSubmitted && quizAnswers[i] && !isCorrect;
                      return (
                        <div key={i} className={`rounded-2xl border p-5 ${quizSubmitted ? (isCorrect ? "border-green-200 bg-green-50" : isWrong ? "border-red-200 bg-red-50" : "border-border") : "border-border"}`}>
                          <p className="font-semibold text-sm mb-3">Q{i + 1}. {q.question}</p>
                          {optKeys.length > 0 ? (
                            <div className="space-y-2">
                              {optKeys.map((k) => (
                                <button
                                  key={k}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers((p) => ({ ...p, [i]: k }))}
                                  className={`w-full text-left border rounded-xl px-4 py-2.5 text-sm flex items-center gap-3 transition-all ${
                                    quizAnswers[i] === k
                                      ? "border-primary bg-primary/10"
                                      : "border-border hover:border-primary/30"
                                  } ${quizSubmitted && k.toUpperCase() === q.correct_answer?.toUpperCase() ? "border-green-400 bg-green-50" : ""}`}
                                >
                                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${quizAnswers[i] === k ? "bg-primary text-white" : "bg-muted"}`}>{k}</span>
                                  {opts[k]}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              disabled={quizSubmitted}
                              value={quizAnswers[i] ?? ""}
                              onChange={(e) => setQuizAnswers((p) => ({ ...p, [i]: e.target.value }))}
                              placeholder="Your answer…"
                              className="w-full border border-border rounded-xl px-4 py-2 text-sm"
                            />
                          )}
                          {quizSubmitted && q.explanation && (
                            <p className="text-xs text-foreground/60 mt-3 italic">{q.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {!quizSubmitted && (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="mt-5 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-foreground/40">
                  <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No quiz available yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Practice Questions ── */}
          {activeTab === "practice" && (
            <div>
              {loading.practice ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-foreground/60">Generating practice questions…</p>
                </div>
              ) : practice && (practice as any[]).length > 0 ? (
                <div className="space-y-4">
                  {(practice as any[]).map((q: any, i: number) => (
                    <div key={i} className="rounded-2xl border border-border bg-white overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/20">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        {q.marks && <span className="ml-auto text-xs text-foreground/50">[{q.marks} mark{q.marks !== 1 ? "s" : ""}]</span>}
                      </div>
                      <div className="p-5">
                        <p className="text-sm font-medium">{q.question ?? JSON.stringify(q)}</p>
                        <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-3 text-xs text-foreground/40 italic">
                          Write your answer here before checking the solution…
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <button
                          onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                          className="flex items-center gap-2 text-xs text-primary font-semibold"
                        >
                          {expandedQ === i ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {expandedQ === i ? "Hide" : "Show"} Worked Solution
                        </button>
                        {expandedQ === i && q.solution && (
                          <div className="mt-3 rounded-xl bg-lavender-soft/40 border border-lavender/20 p-4">
                            <p className="text-xs font-bold text-lavender uppercase tracking-wide mb-2">Solution</p>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{q.solution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-foreground/40">
                  <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No practice questions available yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [curated, setCurated] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"mine" | "curated">("mine");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [polling, setPolling] = useState(false);

  const fetchResources = useCallback(async () => {
    const [mine, pub] = await Promise.all([getMyResources(), getCuratedResources()]);
    setMyResources(mine);
    setCurated(pub);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) { navigate({ to: "/login" as any }); return; }
    if (!authLoading) {
      fetchResources().finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  // Poll for processing resources
  useEffect(() => {
    const processing = myResources.filter((r) => r.status === "processing");
    if (processing.length === 0) { setPolling(false); return; }
    setPolling(true);
    const t = setInterval(async () => {
      const updated = await getMyResources().catch(() => []);
      setMyResources(updated);
      if (updated.every((r) => r.status !== "processing")) {
        clearInterval(t);
        setPolling(false);
      }
    }, 4000);
    return () => clearInterval(t);
  }, [myResources.map((r) => r.status).join(",")]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this resource?")) return;
    await deleteResource(id).catch(() => {});
    setMyResources((prev) => prev.filter((r) => r.id !== id));
    toast.success("Deleted");
  };

  const handleUploaded = (resource: Resource) => {
    setMyResources((prev) => [resource, ...prev]);
    setActiveTab("mine");
  };

  const displayList = activeTab === "mine" ? myResources : curated;

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />

      <section className="bg-pink-soft px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl">Study Library</h1>
          <p className="text-foreground/70 mt-2">
            Upload your notes, textbooks, or YouTube videos — ExamGlow's AI turns them into flashcards, quizzes, and structured summaries instantly.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 grid lg:grid-cols-[340px_1fr] gap-8">
        {/* Left: Upload panel */}
        <div className="space-y-5">
          <UploadPanel onUploaded={handleUploaded} />
          <div className="bg-lavender-soft/50 rounded-2xl p-5 text-sm">
            <p className="font-bold text-lavender mb-2">What ExamGlow AI can do</p>
            <ul className="space-y-1.5 text-foreground/70">
              {[
                "✨ AI summary of any document or video",
                "🃏 Auto-generate flashcard decks",
                "📝 Create MCQ and written quizzes",
                "🧠 Generate practice exam questions",
              ].map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>

        {/* Right: Resource library */}
        <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-muted/40 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("mine")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "mine" ? "bg-white shadow text-foreground" : "text-foreground/50"}`}
            >
              My Resources {myResources.length > 0 && `(${myResources.length})`}
            </button>
            <button
              onClick={() => setActiveTab("curated")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "curated" ? "bg-white shadow text-foreground" : "text-foreground/50"}`}
            >
              Curated {curated.length > 0 && `(${curated.length})`}
            </button>
          </div>

          {polling && (
            <div className="mb-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              AI synthesis in progress — auto-updating every few seconds…
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-20 text-foreground/40 border-2 border-dashed border-border rounded-2xl">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold">
                {activeTab === "mine" ? "No resources yet — upload your first file!" : "No curated resources available yet."}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayList.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  onSelect={setSelectedResource}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedResource && (
        <StudyKitViewer resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </div>
  );
}
