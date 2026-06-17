import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { z } from "zod";
import { BookOpen, ArrowRight, Zap, Trophy, FileText, Bot, X,
  XCircle, ArrowLeft, Lightbulb, AlertTriangle, ChevronRight, BookMarked,
  Volume2, VolumeX, Share2,
} from "lucide-react";
import { useProfile } from "@/lib/profile-context";
import { getChaptersForSubject } from "@/data/notes/index";
import { api } from "@/lib/api-client";
import { useState, useEffect, useRef } from "react";
import { NoteAiChat } from "@/components/NoteAiChat";
import { toast } from "sonner";
import { speakGemini, type GeminiSpeechHandle } from "@/lib/gemini-speech";

export const Route = createFileRoute("/notes")({
  validateSearch: (search) =>
    z.object({
      subject: z.string().optional(),
      q: z.string().optional(),
    }).parse(search),
  head: () => ({ meta: [{ title: "Revision Notes — ExamGlow" }] }),
  component: NotesIndex,
});

const SUBJECTS = [
  { name: "Biology", emoji: "🧬", color: "from-emerald-500 to-teal-400", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", desc: "Cells, genetics, ecology, photosynthesis, and more" },
  { name: "Chemistry", emoji: "⚗️", color: "from-blue-500 to-indigo-400", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", desc: "Atomic structure, bonding, organic chemistry, electrolysis" },
  { name: "Physics", emoji: "⚡", color: "from-amber-500 to-orange-400", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", desc: "Forces, waves, electricity, thermal physics, radioactivity" },
  { name: "Mathematics", emoji: "📐", color: "from-violet-500 to-purple-400", bg: "bg-violet-50 border-violet-200", text: "text-violet-700", desc: "Algebra, geometry, statistics, trigonometry, sequences" },
  { name: "Additional Mathematics", emoji: "➕", color: "from-pink-500 to-rose-400", bg: "bg-pink-50 border-pink-200", text: "text-pink-700", desc: "Pure maths, mechanics, statistics" },
  { name: "Geography", emoji: "🌍", color: "from-teal-500 to-cyan-400", bg: "bg-teal-50 border-teal-200", text: "text-teal-700", desc: "Natural hazards, rivers, coasts, population, ecosystems" },
  { name: "English Language", emoji: "📖", color: "from-orange-500 to-red-400", bg: "bg-orange-50 border-orange-200", text: "text-orange-700", desc: "Language analysis, writing techniques, comprehension" },
  { name: "English Literature", emoji: "📚", color: "from-rose-500 to-pink-400", bg: "bg-rose-50 border-rose-200", text: "text-rose-700", desc: "Poetry, prose, drama — analysis and essay techniques" },
  { name: "ICT/Computer Science", emoji: "💻", color: "from-pink-500 to-rose-400", bg: "bg-pink-50 border-pink-200", text: "text-pink-700", desc: "Hardware, networking, programming, cybersecurity" },
  { name: "History", emoji: "📜", color: "from-stone-500 to-amber-600", bg: "bg-stone-50 border-stone-200", text: "text-stone-700", desc: "World wars, Cold War, rights movements, source analysis" },
  { name: "Economics", emoji: "📊", color: "from-green-600 to-emerald-400", bg: "bg-green-50 border-green-200", text: "text-green-700", desc: "Supply and demand, market structures, macroeconomics" },
  { name: "Business Studies", emoji: "💼", color: "from-sky-500 to-blue-400", bg: "bg-sky-50 border-sky-200", text: "text-sky-700", desc: "Marketing, finance, operations, human resources" },
  { name: "Accounting", emoji: "🧾", color: "from-slate-600 to-gray-500", bg: "bg-slate-50 border-slate-200", text: "text-slate-700", desc: "Financial statements, bookkeeping, ratios, ledgers" },
  { name: "Sociology", emoji: "🤝", color: "from-purple-500 to-fuchsia-400", bg: "bg-purple-50 border-purple-200", text: "text-purple-700", desc: "Culture, identity, social institutions, research methods" },
  { name: "Psychology", emoji: "🧠", color: "from-fuchsia-500 to-violet-400", bg: "bg-fuchsia-50 border-fuchsia-200", text: "text-fuchsia-700", desc: "Memory, development, social behaviour, research studies" },
  { name: "Art & Design", emoji: "🎨", color: "from-red-500 to-orange-400", bg: "bg-red-50 border-red-200", text: "text-red-700", desc: "Art history, techniques, critical analysis, design" },
  { name: "Music", emoji: "🎵", color: "from-indigo-500 to-blue-400", bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", desc: "Music theory, history, harmony, set works" },
  { name: "French", emoji: "🇫🇷", color: "from-blue-600 to-indigo-500", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", desc: "Grammar, vocabulary, reading, writing, speaking" },
  { name: "Spanish", emoji: "🇪🇸", color: "from-yellow-500 to-orange-400", bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", desc: "Grammar, vocabulary, culture, reading, writing" },
  { name: "Arabic", emoji: "🇸🇦", color: "from-emerald-600 to-teal-500", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", desc: "Reading, writing, speaking, and grammar" },
  { name: "German", emoji: "🇩🇪", color: "from-orange-600 to-yellow-500", bg: "bg-orange-50 border-orange-200", text: "text-orange-700", desc: "Grammar, vocabulary, speaking, listening" },
  { name: "Global Perspectives", emoji: "🌐", color: "from-cyan-500 to-blue-400", bg: "bg-cyan-50 border-cyan-200", text: "text-cyan-700", desc: "Global issues, research, critical thinking" },
  { name: "Environmental Management", emoji: "🌱", color: "from-emerald-600 to-green-500", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", desc: "Ecosystems, resources, conservation" },
  { name: "Physical Education", emoji: "⚽", color: "from-red-600 to-orange-500", bg: "bg-red-50 border-red-200", text: "text-red-700", desc: "Anatomy, training, sports psychology" },
  { name: "Drama", emoji: "🎭", color: "from-purple-600 to-pink-500", bg: "bg-purple-50 border-purple-200", text: "text-purple-700", desc: "Performance, theatre, play analysis" },
  { name: "Design & Technology", emoji: "🛠️", color: "from-gray-600 to-slate-500", bg: "bg-gray-50 border-gray-200", text: "text-gray-700", desc: "Product design, materials, CAD/CAM" },
  { name: "Enterprise", emoji: "🚀", color: "from-amber-600 to-yellow-500", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", desc: "Business creation, marketing, operations" },
  { name: "Marine Science", emoji: "🌊", color: "from-blue-600 to-cyan-500", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", desc: "Marine organisms, oceans, ecosystems" },
  { name: "Food & Nutrition", emoji: "🍳", color: "from-yellow-600 to-amber-500", bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", desc: "Nutrients, health, cooking techniques" },
  { name: "Travel & Tourism", emoji: "✈️", color: "from-sky-600 to-cyan-500", bg: "bg-sky-50 border-sky-200", text: "text-sky-700", desc: "Tourism industry, destination marketing" }
];

// ─── Math LaTeX cleaner ────────────────────────────────────────────────────────
function cleanMathLaTeX(text: string): string {
  if (!text) return "";
  let s = text;
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, "$1");
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, "$1");
  s = s.replace(/\$\$(.*?)\$\$/g, "$1");
  s = s.replace(/\/(.*?)\//g, "$1"); // Handle backslashes or other potential wrapping
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

// ── Inline & Block Markdown parser ──────────────────────────────────────────────
function parseInlineText(text: string) {
  if (!text) return null;
  const cleaned = cleanMathLaTeX(text);
  const parts = cleaned.split(/(\*\*[^*]+\*\*|==\S[^=]*\S==|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-extrabold text-foreground" style={{ fontWeight: 850 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return <mark key={i} className="bg-primary/20 text-primary px-0.5 rounded not-italic font-medium">{part.slice(2, -2)}</mark>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-foreground/90">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

function parseInlineWithBreaks(text: string) {
  if (!text) return null;
  const normalized = text.replace(/\/n/g, "\n");
  const lines = normalized.split("\n");
  return lines.map((line, i) => (
    <span key={i} className="block mt-1 first:mt-0">
      {parseInlineText(line)}
    </span>
  ));
}

function parseMarkdownContent(text: string) {
  if (!text) return null;
  const normalized = text.replace(/\/n/g, "\n");
  const lines = normalized.split("\n");
  
  return (
    <div className="space-y-2.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        if (trimmed.startsWith("####")) {
          return (
            <h5 key={lineIdx} className="font-bold text-sm text-foreground mt-3 mb-1">
              {parseInlineText(trimmed.replace(/^####\s*/, ""))}
            </h5>
          );
        }
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={lineIdx} className="font-bold text-base text-foreground mt-4 mb-1.5">
              {parseInlineText(trimmed.replace(/^###\s*/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={lineIdx} className="font-display font-bold text-lg text-foreground mt-5 mb-2">
              {parseInlineText(trimmed.replace(/^##\s*/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={lineIdx} className="font-display font-bold text-xl text-foreground mt-6 mb-3">
              {parseInlineText(trimmed.replace(/^#\s*/, ""))}
            </h2>
          );
        }
        
        return (
          <p key={lineIdx} className="text-base text-foreground/80 leading-relaxed">
            {parseInlineText(line)}
          </p>
        );
      })}
    </div>
  );
}

// ── Block renderer ─────────────────────────────────────────────────────────────
function NoteBlock({ block }: { block: any }) {
  switch (block.kind) {
    case "intro":
      return <div className="space-y-1">{parseMarkdownContent(block.text)}</div>;

    case "bullets":
      return (
        <ul className="space-y-2 mt-1">
          {(block.items ?? []).map((item: any, i: number) => (
            <li key={i}>
              <div className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className={`text-base leading-relaxed ${item?.bold ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                  {parseInlineWithBreaks(typeof item === "string" ? item : item?.text ?? "")}
                </span>
              </div>
              {item?.sub && item.sub.length > 0 && (
                <ul className="ml-7 mt-1.5 space-y-1">
                  {item.sub.map((s: string, j: number) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                      <span className="text-sm text-foreground/70 leading-relaxed">{parseInlineWithBreaks(s)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );

    case "numbered":
      return (
        <ol className="space-y-2 mt-1">
          {(block.items ?? []).map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span className="text-base text-foreground/80 leading-relaxed">{parseInlineWithBreaks(item)}</span>
            </li>
          ))}
        </ol>
      );

    case "definition":
      return (
        <div className="border-l-4 border-primary bg-primary/5 rounded-r-2xl px-5 py-4">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Definition</p>
          <p className="font-bold text-base text-foreground">{parseInlineText(block.term)}</p>
          <div className="text-sm text-foreground/75 leading-relaxed mt-1">{parseMarkdownContent(block.definition)}</div>
        </div>
      );

    case "keyterms":
      return (
        <div className="bg-muted/40 rounded-2xl p-4 space-y-2">
          {(block.terms ?? []).map((t: any, i: number) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="font-bold text-primary shrink-0">• {t.label}:</span>
              <span className="text-foreground/80">{parseInlineWithBreaks(t.value)}</span>
            </div>
          ))}
        </div>
      );

    case "equation":
      return (
        <div className="bg-lavender-soft/50 border border-lavender/20 rounded-2xl px-5 py-4 text-center">
          <p className="text-xs text-lavender font-semibold uppercase tracking-widest mb-2">{block.label}</p>
          <p className="font-mono text-2xl font-bold text-foreground">{block.formula}</p>
          {block.note && <p className="text-xs text-foreground/60 mt-2">{parseInlineText(block.note)}</p>}
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                {(block.headers ?? []).map((h: string, i: number) => (
                  <th key={i} className="text-left px-4 py-3 font-semibold text-foreground/70 border-b border-border text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row: string[], ri: number) => (
                <tr key={ri} className="border-b border-border last:border-0 hover:bg-muted/20">
                  {row.map((cell: string, ci: number) => (
                    <td key={ci} className={`px-4 py-3 text-foreground/80 ${ci === 0 ? "font-semibold" : ""}`}>{parseInlineWithBreaks(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "image":
      if (!block.src) return null;
      return (
        <figure className="rounded-2xl overflow-hidden border border-border bg-muted/20 shadow-sm">
          <img src={block.src} alt={block.caption || block.alt || "Diagram"} className="w-full object-contain max-h-96" />
          {block.caption && (
            <figcaption className="text-xs text-foreground/50 text-center px-4 py-3 italic border-t border-border">{block.caption}</figcaption>
          )}
        </figure>
      );

    case "tip":
      return (
        <div className="flex gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Exam Tip</p>
            <div className="text-sm text-amber-900 leading-relaxed">{parseMarkdownContent(block.text)}</div>
          </div>
        </div>
      );

    case "warning":
      return (
        <div className="flex gap-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Common Mistake</p>
            <div className="text-sm text-red-900 leading-relaxed">{parseMarkdownContent(block.text)}</div>
          </div>
        </div>
      );

    case "highlight": {
      const colorMap: Record<string, string> = {
        pink: "bg-pink-50 border-pink-200 text-pink-900",
        blue: "bg-blue-50 border-blue-200 text-blue-900",
        green: "bg-emerald-50 border-emerald-200 text-emerald-900",
        yellow: "bg-amber-50 border-amber-200 text-amber-900",
      };
      return (
        <div className={`border rounded-2xl px-5 py-4 text-sm font-medium leading-relaxed ${colorMap[block.color ?? "pink"] ?? colorMap.pink}`}>
          {parseMarkdownContent(block.text)}
        </div>
      );
    }

    case "comparison":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">{block.left?.label}</p>
            <ul className="space-y-1.5">
              {(block.left?.items ?? []).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>{parseInlineWithBreaks(item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-pink-700 mb-3 uppercase tracking-wide">{block.right?.label}</p>
            <ul className="space-y-1.5">
              {(block.right?.items ?? []).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-pink-900">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                  <span>{parseInlineWithBreaks(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ── Full Screen Note Viewer ────────────────────────────────────────────────────
function FullScreenNote({ note, topicQuery, onClose }: { note: any; topicQuery: string; onClose: () => void }) {
  const [showSummary, setShowSummary] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const pages = note.pages ?? [];
  const [speaking, setSpeaking] = useState(false);
  const speechHandleRef = useRef<GeminiSpeechHandle | null>(null);

  useEffect(() => {
    return () => {
      speechHandleRef.current?.stop();
      speechHandleRef.current = null;
    };
  }, []);

  const handleSpeak = () => {
    if (speaking) {
      speechHandleRef.current?.stop();
      speechHandleRef.current = null;
      setSpeaking(false);
      return;
    }
    const textToRead = (note.summary || "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/#+ /g, "").trim();
    if (!textToRead) { toast.info("No summary to read"); return; }
    setSpeaking(true);
    speechHandleRef.current = speakGemini(textToRead, {
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/notes?q=${encodeURIComponent(topicQuery)}`;
    const text = `Check out these study notes: "${note.title}" on ExamGlow!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: text,
          url: shareUrl
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

  function scrollToSection(idx: number) {
    document.getElementById(`note-section-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(idx);
  }

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handler = () => {
      for (let i = pages.length - 1; i >= 0; i--) {
        const el = document.getElementById(`note-section-${i}`);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(i); break; }
      }
    };
    container.addEventListener("scroll", handler);
    return () => container.removeEventListener("scroll", handler);
  }, [pages.length]);

  return (
    <div className="fixed inset-0 z-[150] bg-[#FAFAF9] flex flex-col">
      {/* Top sticky bar */}
      <div className="h-14 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
            <BookMarked className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="text-[10px] text-foreground/50 font-medium uppercase tracking-wide">{note.subject || "AI Notes"}</p>
            <p className="font-bold text-sm text-foreground truncate max-w-[200px] lg:max-w-sm">{note.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Summarize</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full border border-border text-foreground/60 text-xs font-semibold hover:bg-muted hover:text-foreground transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Notes</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16 py-10">
            {/* Topic Hero */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
                <Bot className="w-3 h-3" />
                AI-Generated Study Notes
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-3">
                {note.title}
              </h1>
              {note.subject && (
                <p className="text-xs font-medium text-foreground/40 uppercase tracking-widest mb-6">{note.subject}</p>
              )}
              {note.summary && (
                <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/15 rounded-2xl p-5">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Overview
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{note.summary}</p>
                </div>
              )}
            </div>

            <hr className="border-border/60 mb-12" />

            {/* Sections */}
            <div className="space-y-14">
              {pages.map((page: any, pageIdx: number) => (
                <section key={pageIdx} id={`note-section-${pageIdx}`} className="scroll-mt-20">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {pageIdx + 1}
                    </span>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{page.section}</h2>
                  </div>
                  <div className="space-y-5 ml-11">
                    {(page.blocks ?? []).map((block: any, bi: number) => (
                      <NoteBlock key={bi} block={block} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* End footer */}
            <div className="mt-16 pt-8 border-t border-border text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <p className="text-foreground/40 text-sm">End of notes for <strong className="text-foreground/60">{note.title}</strong></p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setShowSummary(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-all"
                >
                  <Bot className="w-4 h-4" /> Get Summary
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground/60 text-sm font-semibold hover:bg-muted hover:text-foreground transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Topics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full border border-border shadow-2xl relative">
            <button
              onClick={() => setShowSummary(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-foreground/40 hover:text-foreground transition-colors"
              aria-label="Close summary"
            >
              <X className="w-5 h-5" />
            </button>
             <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-bold">Topic Summary</h3>
                <p className="text-xs text-foreground/50 truncate">{note.title}</p>
              </div>
              <div className="flex gap-2 mr-8 shrink-0">
                <button
                  onClick={handleSpeak}
                  className={`p-2 rounded-full border text-xs font-semibold transition-all ${speaking ? "bg-primary text-white border-primary" : "border-border hover:border-primary/40 text-foreground/60 hover:text-foreground"}`}
                  title={speaking ? "Stop listening" : "Listen to summary"}
                >
                  {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border border-border hover:border-primary/40 text-foreground/60 hover:text-foreground transition-all"
                  title="Share summary"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 rounded-2xl p-5 mb-5">
              <p className="text-sm text-foreground/85 leading-relaxed">{note.summary || "No summary available."}</p>
            </div>
            <div className="space-y-1 mb-5">
              <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Sections Covered</p>
              {pages.map((p: any, i: number) => (
                <button
                  key={i}
                  onClick={() => { setShowSummary(false); setTimeout(() => scrollToSection(i), 100); }}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors w-full text-left py-1"
                >
                  <ChevronRight className="w-3 h-3 shrink-0" />
                  {p.section}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition-all"
            >
              Back to Notes
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Chat */}
      <NoteAiChat
        noteTitle={note.title}
        noteSubject={note.subject}
        noteContext={note.summary}
      />
    </div>
  );
}

// ── Notes Home Page ────────────────────────────────────────────────────────────
function NotesIndex() {
  const { enrolledSubjects } = useProfile();
  const { subject: preselected, q: topicQuery } = Route.useSearch();
  const navigate = useNavigate();

  const [aiInput, setAiInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedNote, setGeneratedNote] = useState<any | null>(null);

  // Redirect if subject preselected
  if (preselected) {
    navigate({ to: "/subject-notes/$subject" as any, params: { subject: preselected } as any, replace: true });
    return null;
  }

  // Fetch AI notes when topicQuery changes
  useEffect(() => {
    if (!topicQuery) {
      setGeneratedNote(null);
      setError(null);
      setLoading(false);
      return;
    }
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post<any>("/api/ai/generate-notes/", { topic: topicQuery });
        setGeneratedNote(res);
      } catch (err: any) {
        setError(err?.message || "Failed to generate notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [topicQuery]);

  const handleAISearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = aiInput.trim();
    if (!val) return;
    navigate({ to: "/notes" as any, search: { q: val } });
  };

  const handleClose = () => {
    setGeneratedNote(null);
    navigate({ to: "/notes" as any, search: {} });
  };

  const mySubjects = enrolledSubjects.length > 0
    ? SUBJECTS.filter((s) => enrolledSubjects.includes(s.name))
    : SUBJECTS;
  const otherSubjects = SUBJECTS.filter((s) => !mySubjects.includes(s));

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-[150] bg-[#FAFAF9] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8">
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-3 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <Bot className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold font-display text-foreground">Generating Notes</h2>
            <p className="text-foreground/60 leading-relaxed">
              Yumna is crafting a comprehensive study guide for<br />
              <strong className="text-foreground/80">"{topicQuery}"</strong>
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border text-xs text-foreground/60 leading-relaxed shadow-sm">
            📚 Gathering concepts · 🖊️ Drafting explanations · 🎨 Finding diagrams · 💡 Adding exam tips...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 z-[150] bg-[#FAFAF9] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display">Notes Generation Failed</h2>
          <p className="text-sm text-foreground/60 leading-relaxed">{error}</p>
          <button onClick={handleClose} className="px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/95 transition-all">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // Full-screen note view
  if (generatedNote) {
    return <FullScreenNote note={generatedNote} topicQuery={topicQuery ?? ""} onClose={handleClose} />;
  }

  // Homepage
  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />

      {/* Hero section */}
      <section className="bg-gradient-to-br from-pink-soft via-white to-lavender-soft text-center py-16 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-primary mb-4 border border-primary/20 shadow-sm">
          <BookMarked className="w-3 h-3" />
          Revision Notes
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-foreground mb-3">Choose Your Subject</h1>
        <p className="text-foreground/70 max-w-xl mx-auto mb-8">
          Structured notes with diagrams, definitions, and exam tips — or search any topic for instant AI-generated notes.
        </p>

        {/* AI Search Bar */}
        <form onSubmit={handleAISearchSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl p-2 border border-primary/20 shadow-lg flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0 ml-1">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm py-2 text-foreground"
            placeholder="Search any topic… e.g. 'Mitosis', 'Newton's Laws', 'The Carbon Cycle'"
          />
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white text-sm font-semibold shrink-0 hover:opacity-90 transition-all shadow-sm">
            Generate
          </button>
        </form>
      </section>

      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
        {/* My Subjects */}
        {mySubjects.length > 0 && (
          <>
            <h2 className="font-bold text-sm text-foreground/50 uppercase tracking-wider mb-4">
              {enrolledSubjects.length > 0 ? "My Subjects" : "All Subjects"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {mySubjects.map((s) => {
                const chapters = getChaptersForSubject(s.name);
                return (
                  <Link key={s.name} to="/subject-notes/$subject" params={{ subject: s.name }} className={`group border rounded-2xl overflow-hidden hover:shadow-md transition-all ${s.bg}`}>
                    <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
                    <div className="p-5 flex items-start gap-4">
                      <span className="text-3xl">{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold text-lg ${s.text}`}>{s.name}</h3>
                          <ArrowRight className={`w-4 h-4 ${s.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <p className="text-sm text-foreground/60 mt-0.5">{s.desc}</p>
                        <div className="flex gap-3 mt-3 text-xs text-foreground/50">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {chapters.length > 0 ? `${chapters.length} chapter${chapters.length !== 1 ? "s" : ""}` : "Notes available"}
                          </span>
                          {chapters.length > 0 && <span>{chapters.reduce((a, c) => a + c.pages.length, 0)} pages</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Other Subjects */}
        {otherSubjects.length > 0 && enrolledSubjects.length > 0 && (
          <>
            <h2 className="font-bold text-sm text-foreground/50 uppercase tracking-wider mb-4">Other Subjects</h2>
            <div className="grid md:grid-cols-3 gap-3 mb-10">
              {otherSubjects.map((s) => (
                <Link key={s.name} to="/subject-notes/$subject" params={{ subject: s.name }} className="group border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-pink-soft/20 transition-all flex items-center gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-foreground/50 mt-0.5 line-clamp-1">{s.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/30 group-hover:text-primary ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-br from-lavender-soft to-pink-soft rounded-2xl p-8 grid md:grid-cols-3 gap-6 items-center border border-lavender/20">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl text-lavender font-bold">Reinforce what you've learned</h3>
            <p className="text-sm text-foreground/70 mt-2">After reading your notes, test yourself with flashcards and quizzes to lock in the knowledge.</p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <Link to="/flashcards" className="flex items-center gap-2 px-4 py-2 rounded-full bg-lavender text-white text-sm font-semibold shadow-sm">
                <Zap className="w-4 h-4" /> Flashcards
              </Link>
              <Link to="/quizzes" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-lavender/30 text-lavender text-sm font-semibold">
                <Trophy className="w-4 h-4" /> Quizzes
              </Link>
              <Link to="/past-papers" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-sm font-semibold">
                <FileText className="w-4 h-4" /> Past Papers
              </Link>
            </div>
          </div>
          <div className="text-6xl text-center hidden md:block">📚</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
