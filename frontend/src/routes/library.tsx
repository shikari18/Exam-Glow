import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Upload, Link as LinkIcon, FileText, Youtube, Loader2, Trash2,
  Bot, BookOpen, Brain, HelpCircle, AlertCircle, CheckCircle2,
  RotateCcw, ChevronDown, ChevronUp, Plus, X, Layers, RefreshCw,
  MoreVertical, Share2, Volume2, VolumeX, Mic, Table2, List, Star,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  uploadResource, getMyResources, getCuratedResources, deleteResource,
  generateFlashcards, generateQuiz, generatePracticeQuestions, reprocessResource,
  type Resource, type AIFlashcard, type AIQuiz,
} from "@/api/library";
import { speakGemini, type GeminiSpeechHandle } from "@/lib/gemini-speech";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "My Library — ExamGlow" }] }),
  component: LibraryPage,
});

// ─── Subjects List (expanded IGCSE) ───────────────────────────────────────────
const SUBJECTS = [
  "Biology", "Chemistry", "Physics", "Mathematics", "Additional Mathematics",
  "Geography", "English Language", "English Literature", "ICT/Computer Science", "History",
  "Economics", "Business Studies", "Accounting", "Sociology", "Psychology",
  "Art & Design", "Music", "French", "Spanish", "Arabic",
  "German", "Global Perspectives", "Environmental Management", "Physical Education", "Drama",
  "Design & Technology", "Enterprise", "Marine Science", "Food & Nutrition", "Travel & Tourism"
];

// ─── Math LaTeX cleaner ────────────────────────────────────────────────────────
function cleanMathLaTeX(text: string): string {
  if (!text) return "";
  let s = text;
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, "$1");
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, "$1");
  s = s.replace(/\$\$(.*?)\$\$/g, "$1");
  s = s.replace(/\$(.*?)\$/g, "$1");

  const superscripts: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", "n": "ⁿ", "x": "ˣ", "i": "ⁱ"
  };
  const subscripts: Record<string, string> = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎", "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ",
    "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ"
  };

  s = s.replace(/\^([0-9+\-=()nx])/g, (match, p1) => superscripts[p1] || match);
  s = s.replace(/\^{([0-9+\-=()nx]+)}/g, (match, p1) => {
    return p1.split("").map((c: string) => superscripts[c] || c).join("");
  });
  
  s = s.replace(/_([0-9+\-=()aehijklmnoprstuvx])/g, (match, p1) => subscripts[p1] || match);
  s = s.replace(/_{([0-9+\-=()aehijklmnoprstuvx]+)}/g, (match, p1) => {
    return p1.split("").map((c: string) => subscripts[c] || c).join("");
  });

  s = s.replace(/\\frac\s*{(.*?)}\s*{(.*?)}/g, "($1)/($2)");
  s = s.replace(/\\sqrt\s*{(.*?)}/g, "√$1");
  s = s.replace(/\\text\s*{(.*?)}/g, "$1");
  s = s.replace(/\\mathrm\s*{(.*?)}/g, "$1");
  s = s.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");
  s = s.replace(/\\left\[/g, "[").replace(/\\right\]/g, "]");
  s = s.replace(/\\left\\{/g, "{").replace(/\\right\\}/g, "}");

  const latexSymbols: [RegExp, string][] = [
    [/\\times\b/g, "×"],
    [/\\div\b/g, "÷"],
    [/\\pm\b/g, "±"],
    [/\\approx\b/g, "≈"],
    [/\\leq?\b/g, "≤"],
    [/\\geq?\b/g, "≥"],
    [/\\neq\b/g, "≠"],
    [/\\cdot\b/g, "·"],
    [/\\degree\b/g, "°"],
    [/\\theta\b/g, "θ"],
    [/\\pi\b/g, "π"],
    [/\\alpha\b/g, "α"],
    [/\\beta\b/g, "β"],
    [/\\gamma\b/g, "γ"],
    [/\\Delta\b/g, "Δ"],
    [/\\lambda\b/g, "λ"],
    [/\\mu\b/g, "μ"],
    [/\\phi\b/g, "φ"],
    [/\\sigma\b/g, "σ"],
    [/\\omega\b/g, "ω"],
    [/\\infty\b/g, "∞"],
    [/\\quad\b/g, "  "],
    [/\\qquad\b/g, "    "],
    [/\\,/g, " "],
    [/\\!/g, ""],
  ];

  for (const [pattern, replacement] of latexSymbols) {
    s = s.replace(pattern, replacement);
  }

  s = s.replace(/\\/g, "");
  return s;
}

// ─── Inline markdown parser ───────────────────────────────────────────────────
function parseInlineText(text: string): React.ReactNode {
  if (!text) return null;
  const cleaned = cleanMathLaTeX(text);
  const parts = cleaned.split(/(\*\*[^*]+\*\*|==\S[^=]*\S==|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-extrabold text-foreground" style={{ fontWeight: 850 }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("==") && part.endsWith("==")) {
          return <mark key={i} className="bg-primary/20 text-primary px-1 rounded not-italic font-medium">{part.slice(2, -2)}</mark>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// Render multiline structured summaries and sections (supporting tables, bullet lists, numbered lists)
function renderStructuredContent(text: string): React.ReactNode {
  if (!text) return null;
  const normalized = text.replace(/\/n/g, "\n").replace(/\\n/g, "\n");
  const lines = normalized.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    // Table parsing
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      
      const parsedRows = tableLines
        .map(line => line.split("|").map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1))
        .filter(row => !row.every(cell => cell.startsWith("---") || cell.startsWith(":-") || cell.startsWith("-:")));
      
      if (parsedRows.length > 0) {
        const headers = parsedRows[0];
        const bodyRows = parsedRows.slice(1);
        elements.push(
          <div key={`table${i}`} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm my-4 max-w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/85">
                <thead className="bg-muted/40 border-b border-border text-foreground font-bold">
                  <tr>
                    {headers.map((h, j) => (
                      <th key={j} className="px-4 py-2 text-xs font-semibold">
                        {parseInlineText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white text-foreground/80">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/10 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2 text-xs leading-relaxed">
                          {parseInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        continue;
      }
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol${i}`} className="space-y-1.5 my-3 list-decimal list-inside pl-2">
          {items.map((item, j) => (
            <li key={j} className="text-sm text-foreground/75 leading-relaxed">
              <span>{parseInlineText(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Bullets
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("• ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().replace(/^[-•*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul${i}`} className="space-y-1.5 my-3 pl-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-foreground/75">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span className="flex-1 leading-relaxed">{parseInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    elements.push(<p key={i} className="text-sm leading-relaxed my-2">{parseInlineText(trimmed)}</p>);
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

// ─── Upload Panel ─────────────────────────────────────────────────────────────

function UploadPanel({ onUploaded }: { onUploaded: (r: Resource) => void }) {
  const [mode, setMode] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Bot className="w-4 h-4" /> Generate Study Kit</>}
      </button>
    </div>
  );
}

// ─── Resource Card ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  vectorizing: "bg-amber-50 text-amber-700 border-amber-200",
  generating: "bg-amber-50 text-amber-700 border-amber-200",
  ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  error: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};
const STATUS_ICON: Record<string, React.ElementType> = {
  processing: Loader2,
  vectorizing: Loader2,
  generating: Loader2,
  ready: CheckCircle2,
  error: AlertCircle,
  failed: AlertCircle,
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
  const isProcessing = ["processing", "vectorizing", "generating"].includes(resource.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    const shareUrl = `${window.location.origin}/library?resource=${resource.id}`;
    const text = `Check out my study kit: "${resource.title}" on ExamGlow!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: text,
          url: shareUrl,
        });
      } catch (err) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(resource.id);
  };

  const handleReprocess = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      toast.info("Restarting synthesis...");
      await reprocessResource(resource.id);
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.message || "Failed to restart synthesis");
    }
  };

  // Progress label
  let statusLabel: string;
  if (resource.status === "ready") {
    statusLabel = "the study kit is ready";
  } else if (isProcessing) {
    const pct = resource.processing_progress ?? 0;
    const progressVal = pct > 0 ? pct : 1;
    if (resource.status_text) {
      statusLabel = `${resource.status_text} (${progressVal}/100)`;
    } else {
      statusLabel = `Processing… ${progressVal}/100`;
    }
  } else {
    statusLabel = "Processing error";
  }

  return (
    <div
      className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow group cursor-pointer relative"
      onClick={() => resource.status === "ready" && onSelect(resource)}
    >
      {/* 3-dot menu — top right */}
      <div
        ref={menuRef}
        className="absolute top-2 right-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-border/60 text-foreground/50 hover:text-foreground hover:bg-white transition-all shadow-sm"
          aria-label="Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 w-48 bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors text-left"
            >
              <Share2 className="w-4 h-4 text-primary" /> Share this study kit
            </button>
            {(resource.status === "error" || resource.status === "failed") && (
              <button
                onClick={handleReprocess}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-amber-50 text-amber-700 transition-colors text-left"
              >
                <RefreshCw className="w-4 h-4 text-amber-600" /> Reprocess this study kit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-red-50 text-destructive transition-colors text-left"
            >
              <Trash2 className="w-4 h-4" /> Delete this study kit
            </button>
          </div>
        )}
      </div>

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
          <div className="flex-1 min-w-0 pr-6">
            <p className="font-semibold text-sm truncate">{resource.title}</p>
            {resource.subject && <p className="text-xs text-foreground/50 mt-0.5">{resource.subject}</p>}
          </div>
        </div>
        <div className={`mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold ${colorClass}`}>
          <Icon className={`w-3 h-3 ${isProcessing ? "animate-spin" : ""}`} />
          {statusLabel}
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
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [speaking, setSpeaking] = useState(false);
  const speechHandleRef = useRef<GeminiSpeechHandle | null>(null);

  useEffect(() => {
    return () => {
      speechHandleRef.current?.stop();
      speechHandleRef.current = null;
    };
  }, []);

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

  // Gemini TTS voice for summary
  const handleSpeak = () => {
    if (speaking) {
      speechHandleRef.current?.stop();
      speechHandleRef.current = null;
      setSpeaking(false);
      return;
    }
    const textToRead = [summary, ...keyPoints, ...sections.map(s => `${s.heading}. ${s.content}`)]
      .join(". ")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/==([^=]+)==/g, "$1")
      .replace(/#+ /g, "")
      .trim();
    if (!textToRead) { toast.info("No text to read"); return; }
    setSpeaking(true);
    speechHandleRef.current = speakGemini(textToRead, {
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  // Share
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/library?resource=${resource.id}`;
    const text = `Check out my Study Kit: "${resource.title}" on ExamGlow!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: text,
          url: shareUrl,
        });
      } catch (e) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

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

  const isUserAnswerCorrect = (q: any, userAnswerKey: string | undefined) => {
    if (!userAnswerKey) return false;
    const correct = q.correct_answer;
    if (!correct) return false;
    if (userAnswerKey.toUpperCase() === correct.toUpperCase()) return true;
    const opts = q.options ?? {};
    const userValue = opts[userAnswerKey] || (Array.isArray(opts) ? opts[parseInt(userAnswerKey)] : undefined);
    if (userValue && userValue.trim().toLowerCase() === correct.trim().toLowerCase()) return true;
    const correctKey = Object.keys(opts).find(k => opts[k]?.trim().toLowerCase() === correct.trim().toLowerCase());
    if (correctKey && userAnswerKey.toUpperCase() === correctKey.toUpperCase()) return true;
    return false;
  };

  // Quiz score — count correct answers
  const quizScore = quiz && quizSubmitted
    ? quiz.questions.filter((q, i) => isUserAnswerCorrect(q, quizAnswers[i])).length
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
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
        <div className="flex border-b border-border px-2 sm:px-4 shrink-0 overflow-x-auto scrollbar-none">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
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
              {/* Voice & Share toolbar */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSpeak}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${speaking ? "bg-primary text-white border-primary animate-pulse" : "border-border hover:border-primary/40"}`}
                >
                  {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  {speaking ? "Stop" : "🎙 Listen (Gemini)"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/40 text-xs font-semibold transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

              {summary && (
                <div className="bg-gradient-to-br from-primary/5 via-pink-50 to-purple-50 border border-primary/15 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">AI Summary</p>
                      <p className="text-[10px] text-foreground/50">Generated by ExamGlow AI</p>
                    </div>
                  </div>
                  <div className="text-sm text-foreground/80 leading-relaxed">
                    {renderStructuredContent(summary)}
                  </div>
                </div>
              )}

              {keyPoints.length > 0 && (
                <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-emerald-50/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-emerald-800">Key Points</h3>
                    <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{keyPoints.length} points</span>
                  </div>
                  <ul className="divide-y divide-border">
                    {keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-sm text-foreground/80 leading-relaxed flex-1">{parseInlineText(kp)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sections.length > 0 && (
                <div className="space-y-4">
                  {sections.map((sec, i) => (
                    <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-purple-50/50 border-b border-border">
                        <h3 className="font-bold text-sm text-foreground">{sec.heading}</h3>
                      </div>
                      <div className="px-4 py-3">
                        <div className="text-sm text-foreground/75 leading-relaxed">
                          {renderStructuredContent(sec.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!summary && sections.length === 0 && keyPoints.length === 0 && (
                <div className="text-center py-12 text-foreground/40">
                  <Bot className="w-10 h-10 mx-auto mb-3 opacity-30" />
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
                        <p className="font-display text-lg leading-snug">{parseInlineText(flashcards[flashIdx].question)}</p>
                        <p className="text-xs text-foreground/40 mt-4">Click to reveal answer</p>
                      </div>
                      <div className="absolute inset-0 bg-lavender-soft rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-lavender/20" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <p className="text-xs text-lavender uppercase tracking-wider mb-2">Answer</p>
                        <p className="font-display text-lg leading-snug">{parseInlineText(flashcards[flashIdx].answer)}</p>
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
                      <p className="text-sm text-foreground/60 mt-1">
                        You got <strong className="text-foreground">{quizScore} out of {quiz.questions.length}</strong> correct
                      </p>
                      <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="mt-3 text-xs text-primary flex items-center gap-1 mx-auto">
                        <RotateCcw className="w-3 h-3" /> Retry
                      </button>
                    </div>
                  )}
                  <div className="space-y-5">
                    {quiz.questions.map((q, i) => {
                      const opts = q.options ?? {};
                      const optKeys = Object.keys(opts);
                      const userAnswer = quizAnswers[i];
                      const isCorrect = quizSubmitted && isUserAnswerCorrect(q, userAnswer);
                      const isWrong = quizSubmitted && userAnswer && !isCorrect;
                      return (
                        <div key={i} className={`rounded-2xl border p-5 ${quizSubmitted ? (isCorrect ? "border-green-200 bg-green-50" : isWrong ? "border-red-200 bg-red-50" : "border-border") : "border-border"}`}>
                          <p className="font-semibold text-sm mb-3">Q{i + 1}. {parseInlineText(q.question)}</p>
                          {optKeys.length > 0 ? (
                            <div className="space-y-2">
                              {optKeys.map((k) => {
                                const isSelected = quizAnswers[i] === k;
                                const isThisCorrect = quizSubmitted && isUserAnswerCorrect(q, k);
                                const isThisWrong = quizSubmitted && isSelected && !isThisCorrect;
                                return (
                                  <button
                                    key={k}
                                    disabled={quizSubmitted}
                                    onClick={() => setQuizAnswers((p) => ({ ...p, [i]: k }))}
                                    className={`w-full text-left border rounded-xl px-4 py-2.5 text-sm flex items-center gap-3 transition-all ${
                                      isSelected
                                        ? isThisWrong
                                          ? "border-red-400 bg-red-50/50 text-red-900"
                                          : "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/30"
                                    } ${isThisCorrect ? "!border-green-400 !bg-green-50 !text-green-900" : ""}`}
                                  >
                                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${quizAnswers[i] === k ? "bg-primary text-white" : "bg-muted"}`}>{k}</span>
                                    {parseInlineText(opts[k])}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <textarea
                              disabled={quizSubmitted}
                              value={quizAnswers[i] ?? ""}
                              onChange={(e) => setQuizAnswers((p) => ({ ...p, [i]: e.target.value }))}
                              placeholder="Type your answer here…"
                              rows={3}
                              className="w-full border border-border rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          )}
                          {quizSubmitted && q.explanation && (
                            <p className="text-xs text-foreground/60 mt-3 italic">{parseInlineText(q.explanation)}</p>
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
                        <p className="text-sm font-medium">{parseInlineText(q.question ?? JSON.stringify(q))}</p>
                        <textarea
                          value={practiceAnswers[i] ?? ""}
                          onChange={(e) => setPracticeAnswers((p) => ({ ...p, [i]: e.target.value }))}
                          placeholder="Write your answer here…"
                          rows={3}
                          className="mt-3 w-full border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted/20 placeholder:text-foreground/40"
                        />
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
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{parseInlineText(q.solution)}</p>
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
    setMyResources(Array.isArray(mine) ? mine : []);
    setCurated(Array.isArray(pub) ? pub : []);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) { navigate({ to: "/login" as any }); return; }
    if (!authLoading) {
      fetchResources().finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  // Poll for processing resources every 2.5s — real-time updates
  useEffect(() => {
    const processing = myResources.filter((r) => ["processing", "vectorizing", "generating"].includes(r.status));
    if (processing.length === 0) { setPolling(false); return; }
    setPolling(true);
    const t = setInterval(async () => {
      const updated = await getMyResources().catch(() => [] as Resource[]);
      if (!Array.isArray(updated) || updated.length === 0) return;

      // Notify when any resource transitions to ready
      updated.forEach((fresh: Resource) => {
        const old = myResources.find((r) => r.id === fresh.id);
        if (old && ["processing", "vectorizing", "generating"].includes(old.status) && fresh.status === "ready") {
          toast.success(`"${fresh.title}" study kit is ready! 🎉`, { duration: 6000 });
        }
      });

      setMyResources([...updated]);

      // Update the selected resource if status/progress changed
      if (selectedResource) {
        const fresh = updated.find((r: Resource) => r.id === selectedResource.id);
        if (fresh && (fresh.status !== selectedResource.status || fresh.processing_progress !== selectedResource.processing_progress)) {
          setSelectedResource(fresh);
        }
      }
      if (updated.every((r: Resource) => !["processing", "vectorizing", "generating"].includes(r.status))) {
        clearInterval(t);
        setPolling(false);
      }
    }, 2500);
    return () => clearInterval(t);
  }, [myResources.map((r) => `${r.id}:${r.status}:${r.processing_progress}`).join("|")]);

  // Also immediately refetch on page focus to catch any changes
  useEffect(() => {
    const onFocus = () => {
      if (myResources.some((r) => ["processing", "vectorizing", "generating"].includes(r.status))) {
        fetchResources();
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [myResources]);

  // Auto-select resource from query parameter
  useEffect(() => {
    if (!loading && (myResources.length > 0 || curated.length > 0)) {
      const params = new URLSearchParams(window.location.search);
      const resId = params.get("resource");
      if (resId) {
        const idNum = parseInt(resId);
        const found = myResources.find((r) => r.id === idNum) || curated.find((r) => r.id === idNum);
        if (found && found.status === "ready") {
          setSelectedResource(found);
        }
      }
    }
  }, [loading, myResources, curated]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this study kit?")) return;
    await deleteResource(id).catch(() => {});
    setMyResources((prev) => prev.filter((r) => r.id !== id));
    if (selectedResource?.id === id) setSelectedResource(null);
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

      <section className="bg-pink-soft px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl">Study Library</h1>
          <p className="text-foreground/70 mt-2 text-sm sm:text-base">
            Upload your notes, textbooks, or YouTube videos — ExamGlow's AI turns them into flashcards, quizzes, and structured summaries instantly.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col lg:grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
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
              <p className="font-semibold text-sm sm:text-base">
                {activeTab === "mine" ? "No resources yet — upload your first file!" : "No curated resources available yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
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
