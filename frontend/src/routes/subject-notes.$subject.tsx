import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getChaptersForSubject } from "@/data/notes/index";
import { 
  ArrowLeft, BookOpen, Bookmark, Share2, Loader2, 
  Bot, X, ChevronRight, BookMarked, ArrowRight, Zap, Trophy, FileText,
  Lightbulb, AlertTriangle, Search, Volume2, VolumeX
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { toggleBookmark, checkBookmark } from "@/api/user";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import type { NoteChapter, NotePage, NoteBlock, BulletItem } from "@/data/notes/index";
import { NoteAiChat } from "@/components/NoteAiChat";
import { speakGemini, type GeminiSpeechHandle } from "@/lib/gemini-speech";

export const Route = createFileRoute("/subject-notes/$subject")({
  head: ({ params }) => ({
    meta: [{ title: `${params.subject} Notes — ExamGlow` }],
  }),
  component: SubjectNotes,
});

const SUBJECT_COLORS: Record<string, string> = {
  Biology: "from-emerald-500 to-teal-400 border-emerald-100 bg-emerald-50/10",
  Chemistry: "from-blue-500 to-indigo-400 border-blue-100 bg-blue-50/10",
  Physics: "from-amber-500 to-orange-400 border-amber-100 bg-amber-50/10",
  Mathematics: "from-violet-500 to-purple-400 border-violet-100 bg-violet-50/10",
  Geography: "from-teal-500 to-cyan-400 border-teal-100 bg-teal-50/10",
  English: "from-orange-500 to-red-400 border-orange-100 bg-orange-50/10",
  "ICT/CS": "from-pink-500 to-rose-400 border-pink-100 bg-pink-50/10",
};

// ─── Math LaTeX cleaner ────────────────────────────────────────────────────────
function cleanMathLaTeX(text: string): string {
  if (!text) return "";
  let s = text;
  s = s.replace(/\\\[([\s\S]*?)\\\]/g, "$1");
  s = s.replace(/\\\(([\s\S]*?)\\\)/g, "$1");
  s = s.replace(/\$\$(.*?)\$\$/g, "$1");
  s = s.replace(/\/(.*?)\//g, "$1");
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
    <div className="space-y-3">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        if (trimmed.startsWith("####")) {
          return (
            <h5 key={lineIdx} className="font-bold text-sm text-slate-800 mt-4 mb-1 font-sans">
              {parseInlineText(trimmed.replace(/^####\s*/, ""))}
            </h5>
          );
        }
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={lineIdx} className="font-bold text-base text-slate-900 mt-5 mb-1.5 font-sans">
              {parseInlineText(trimmed.replace(/^###\s*/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={lineIdx} className="font-bold text-lg text-slate-900 mt-6 mb-2 font-sans tracking-tight">
              {parseInlineText(trimmed.replace(/^##\s*/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={lineIdx} className="font-bold text-xl text-slate-900 mt-7 mb-3 font-sans tracking-tight">
              {parseInlineText(trimmed.replace(/^#\s*/, ""))}
            </h2>
          );
        }
        
        return (
          <p key={lineIdx} className="text-[15px] md:text-[16px] text-slate-700 leading-relaxed font-serif">
            {parseInlineText(line)}
          </p>
        );
      })}
    </div>
  );
}

// ── Block renderers ──────────────────────────────────────────────────────────
function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul className="space-y-3 mt-3">
      {items.map((item, i) => (
        <li key={i}>
          <div className="flex items-start gap-2.5">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span className={`text-[15px] md:text-[16px] leading-relaxed font-serif ${item.bold ? "font-semibold text-slate-900" : "text-slate-700"}`}>
              {parseInlineWithBreaks(item.text)}
            </span>
          </div>
          {item.sub && item.sub.length > 0 && (
            <ul className="ml-6 mt-1.5 space-y-2">
              {item.sub.map((s, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-350 shrink-0" />
                  <span className="text-[14px] text-slate-650 leading-relaxed font-serif">{parseInlineWithBreaks(s)}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function DiagramPlaceholder({ caption }: { caption?: string }) {
  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 px-8 py-10 flex flex-col items-center justify-center gap-3 min-h-[180px]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-400/20 border border-primary/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-primary/60" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <div className="text-center">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary/60 bg-primary/8 px-2.5 py-0.5 rounded-full border border-primary/10 mb-2">Diagram</span>
          <p className="text-sm font-semibold text-slate-700 leading-snug max-w-xs">{caption || "Concept Illustration"}</p>
        </div>
      </div>
      {caption && (
        <div className="bg-white border-t border-slate-100/60 px-5 py-2.5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
          <p className="text-[11px] text-slate-500 italic leading-relaxed">{caption}</p>
        </div>
      )}
    </div>
  );
}

function ImageBlock({ block }: { block: NoteBlock & { kind: "image" } }) {
  const [error, setError] = useState(false);

  if (error || !block.src) {
    return <DiagramPlaceholder caption={block.caption} />;
  }

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/30 shadow-sm transition-all duration-300 hover:shadow-md">
      <img 
        src={block.src} 
        alt={block.caption || "Diagram"} 
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
        className="w-full object-contain max-h-72" 
      />
      {block.caption && (
        <p className="text-xs text-slate-500 text-center px-4 py-2.5 italic border-t border-slate-100/50 leading-relaxed bg-white/50">
          {block.caption}
        </p>
      )}
    </div>
  );
}

function BlockRenderer({ block }: { block: NoteBlock }) {
  switch (block.kind) {
    case "intro":
      return <div className="my-4">{parseMarkdownContent(block.text)}</div>;

    case "definition":
      return (
        <div className="my-6 p-5 bg-indigo-50/40 border border-indigo-100/50 rounded-2xl">
          <span className="text-[10px] tracking-wider uppercase font-bold text-indigo-600 bg-indigo-100/40 px-2 py-0.5 rounded">Definition</span>
          <h4 className="text-base font-bold text-slate-900 mt-2 font-sans">{parseInlineText(block.term)}</h4>
          <div className="text-[15px] text-slate-700 mt-1.5 leading-relaxed font-serif">{parseMarkdownContent(block.definition)}</div>
        </div>
      );

    case "keyterms":
      return (
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 my-6 space-y-2.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Key Terms</p>
          {block.terms.map((t, i) => (
            <div key={i} className="flex gap-2 text-[14px]">
              <span className="font-bold text-primary shrink-0">• {t.label}:</span>
              <span className="text-slate-700 leading-relaxed font-serif">{parseInlineWithBreaks(t.value)}</span>
            </div>
          ))}
        </div>
      );

    case "bullets":
      return <BulletList items={block.items} />;

    case "numbered":
      return (
        <ol className="space-y-2 mt-3 list-decimal list-inside">
          {block.items.map((item, i) => (
            <li key={i} className="text-[15px] md:text-[16px] text-slate-700 leading-relaxed font-serif pl-1">
              <span className="pl-1">{parseInlineWithBreaks(item)}</span>
            </li>
          ))}
        </ol>
      );

    case "equation":
      return (
        <div className="bg-violet-50/30 border border-violet-100/60 rounded-2xl p-5 my-6 text-center shadow-sm">
          <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-2 font-sans">{block.label}</p>
          <p className="font-mono text-xl font-bold text-violet-950 my-2 tracking-wide bg-white/70 inline-block px-4 py-1.5 rounded-xl border border-violet-100/40">{block.formula}</p>
          {block.note && <p className="text-xs text-slate-500 font-sans mt-2">{parseInlineText(block.note)}</p>}
        </div>
      );

    case "table":
      return (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm my-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-700">
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50/40 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-5 py-3.5 text-xs leading-relaxed ${ci === 0 ? "font-bold text-slate-900" : "text-slate-600"}`}>
                        {parseInlineWithBreaks(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "video":
      return (
        <div className="my-8 rounded-2xl overflow-hidden border border-slate-100 shadow-md">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${block.youtubeId}?rel=0&modestbranding=1`}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">{block.title}</p>
              {block.caption && <p className="text-[11px] text-slate-400 mt-0.5">{block.caption}</p>}
            </div>
          </div>
        </div>
      );

    case "image":
      if (block.side === "full" || !block.side) {
        return <ImageBlock block={block} />;
      }
      return null;

    case "tip":
      return (
        <div className="flex gap-3.5 bg-amber-50/40 border border-amber-100/50 rounded-2xl p-5 my-6 shadow-sm">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] tracking-wider uppercase font-bold text-amber-700 bg-amber-100/30 px-2 py-0.5 rounded">Exam Tip</span>
            <div className="text-[14px] text-amber-900 leading-relaxed font-serif mt-1.5">{parseMarkdownContent(block.text)}</div>
          </div>
        </div>
      );

    case "warning":
      return (
        <div className="flex gap-3.5 bg-rose-50/40 border border-rose-100/50 rounded-2xl p-5 my-6 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] tracking-wider uppercase font-bold text-rose-700 bg-rose-100/30 px-2 py-0.5 rounded">Common Mistake</span>
            <div className="text-[14px] text-rose-900 leading-relaxed font-serif mt-1.5">{parseMarkdownContent(block.text)}</div>
          </div>
        </div>
      );

    case "comparison":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">{block.left.label}</p>
            <ul className="space-y-2">
              {block.left.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-blue-900 leading-relaxed font-serif">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>{parseInlineWithBreaks(item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-pink-50/30 border border-pink-100/50 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-pink-700 mb-2 uppercase tracking-wide">{block.right.label}</p>
            <ul className="space-y-2">
              {block.right.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-pink-900 leading-relaxed font-serif">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                  <span>{parseInlineWithBreaks(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "highlight": {
      const colorMap = {
        pink: "bg-primary/5 border border-primary/10 text-slate-800",
        blue: "bg-blue-50/30 border border-blue-100/50 text-blue-950",
        green: "bg-emerald-50/30 border border-emerald-100/50 text-emerald-950",
        yellow: "bg-amber-50/30 border border-amber-100/50 text-amber-950",
      };
      const cls = colorMap[block.color ?? "pink"];
      return (
        <div className={`rounded-2xl px-5 py-4 my-6 text-[14px] leading-relaxed font-serif ${cls}`}>
          {parseMarkdownContent(block.text)}
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Page layout — handles side images ────────────────────────────────────────
function PageLayout({ page }: { page: NotePage }) {
  const sideImages = page.blocks.filter(
    (b): b is Extract<NoteBlock, { kind: "image" }> =>
      b.kind === "image" && (b.side === "right" || b.side === "left")
  );
  const mainBlocks = page.blocks.filter(
    (b) => !(b.kind === "image" && (b.side === "right" || b.side === "left"))
  );

  return (
    <div className={sideImages.length > 0 ? "lg:grid lg:grid-cols-[1fr_220px] gap-6 items-start animate-fade-in" : "animate-fade-in"}>
      <div className="space-y-4">
        {mainBlocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
      {sideImages.length > 0 && (
        <div className="space-y-4 mt-4 lg:mt-0">
          {sideImages.map((img, i) => (
            <ImageBlock key={i} block={img} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Full-Screen Reader Component ──────────────────────────────────────────────
interface FullScreenReaderProps {
  chapter: NoteChapter;
  onClose: () => void;
}

function FullScreenChapterReader({ chapter, onClose }: FullScreenReaderProps) {
  const [showSummary, setShowSummary] = useState(false);
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
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
    const textToRead = (chapter.summary || `This comprehensive guide covers all fundamental sections of ${chapter.title}.`)
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/==([^=]+)==/g, "$1")
      .replace(/#+ /g, "")
      .trim();
    setSpeaking(true);
    speechHandleRef.current = speakGemini(textToRead, {
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const handleShareSummary = async () => {
    const url = `${window.location.origin}/subject-notes/${encodeURIComponent(chapter.subject)}`;
    const text = `Check out the chapter summary for "${chapter.title}" on ExamGlow!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${chapter.subject}: ${chapter.title} Summary`,
          text: text,
          url: url
        });
      } catch (err) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  useEffect(() => {
    if (!user) return;
    checkBookmark("Note", `${chapter.subject}: ${chapter.title}`)
      .then((r) => setBookmarked(r.bookmarked));
    
    // Log analytical checkin
    api.post("/api/examglow/bookmarks/", {
      resourceType: "Notes",
      title: `${chapter.subject}: ${chapter.title}`,
      subject: chapter.subject
    }).catch(() => {});
  }, [user, chapter]);

  const handleBookmark = async () => {
    if (!user) { toast.info("Sign in to bookmark"); return; }
    setBookmarkLoading(true);
    const res = await toggleBookmark({
      resourceType: "Note", title: `${chapter.subject}: ${chapter.title}`, subject: chapter.subject, url: `/subject-notes/${chapter.subject}`,
    });
    setBookmarked(res.bookmarked);
    setBookmarkLoading(false);
    toast.success(res.bookmarked ? "Bookmarked!" : "Bookmark removed");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/subject-notes/${encodeURIComponent(chapter.subject)}`;
    if (navigator.share) {
      await navigator.share({ title: `${chapter.subject} Notes — ExamGlow`, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Link copied!");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#FAFAF9] flex flex-col animate-fade-in">
      {/* Top sticky bar */}
      <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
            <BookMarked className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{chapter.subject}</p>
            <p className="font-bold text-sm text-slate-800 truncate max-w-[200px] lg:max-w-sm">{chapter.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Summarize</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all hover:scale-[1.02]"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Reader</span>
          </button>
        </div>
      </div>

      {/* Main split-screen body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Notes content scroll area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-5 md:px-10 lg:px-16 py-12">
          {/* Note Title Header */}
          <div className="mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">{chapter.subject} · Revision Notes</p>
            <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
              {chapter.title}
            </h1>
            
            {/* Quick Action controls inside the article */}
            <div className="flex items-center justify-between border-t border-b border-slate-100 py-3 mt-6">
              <div className="flex gap-2">
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 ${
                    bookmarked ? "border-primary bg-primary/10 text-primary" : "border-slate-200 bg-white text-slate-600 hover:border-primary"
                  }`}
                >
                  {bookmarkLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bookmark className="w-3 h-3" />}
                  {bookmarked ? "Saved" : "Save Notes"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-650 text-xs font-bold hover:border-primary transition-all hover:scale-[1.02]"
                >
                  <Share2 className="w-3 h-3" /> Share
                </button>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/quizzes"
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold shadow-sm hover:opacity-95"
                >
                  Take Quiz
                </Link>
                <Link
                  to="/flashcards"
                  className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Flashcards
                </Link>
              </div>
            </div>
          </div>

          {/* Long Scroll pages vertical list */}
          <div className="space-y-16">
            {chapter.pages.map((page, pageIdx) => (
              <section key={pageIdx} className="scroll-mt-16">
                <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100/50 pb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {pageIdx + 1}
                  </span>
                  <h2 className="font-sans text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{page.section}</h2>
                </div>
                <div className="space-y-4">
                  {page.blocks.map((block, bi) => (
                    <BlockRenderer key={bi} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer inside note */}
          <div className="mt-20 pt-10 border-t border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto shadow-md">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <p className="text-slate-400 text-sm">Completed revision of <strong className="text-slate-600">{chapter.title}</strong></p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowSummary(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-bold hover:opacity-95 shadow-sm transition-all"
              >
                <Bot className="w-4 h-4" /> Get Chapter Summary
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
              >
                Exit Reader
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Right: Embedded AI Chat Sidebar (Desktop Only) */}
        <div className="hidden lg:block w-[360px] xl:w-[400px] border-l border-slate-100 bg-white shrink-0 h-full">
          <NoteAiChat
            noteTitle={chapter.title}
            noteSubject={chapter.subject}
            noteContext={chapter.summary}
            inline
          />
        </div>
      </div>

      {/* Summary Modal overlay */}
      {showSummary && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full border border-slate-100 shadow-2xl relative animate-zoom-in">
            <button
              onClick={() => setShowSummary(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close summary"
            >
              <X className="w-5 h-5" />
            </button>
             <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-lg font-extrabold text-slate-800">Chapter Summary</h3>
                <p className="text-xs text-slate-400 truncate">{chapter.title}</p>
              </div>
              <div className="flex gap-2 mr-8 shrink-0">
                <button
                  onClick={handleSpeak}
                  className={`p-2 rounded-full border text-xs font-semibold transition-all ${speaking ? "bg-primary text-white border-primary" : "border-border hover:border-primary/40 text-slate-500 hover:text-slate-700"}`}
                  title={speaking ? "Stop listening" : "Listen to summary"}
                >
                  {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleShareSummary}
                  className="p-2 rounded-full border border-border hover:border-primary/40 text-slate-500 hover:text-slate-700 transition-all"
                  title="Share summary"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-5">
              <p className="text-[14px] text-slate-700 leading-relaxed font-serif">
                {chapter.summary || `This comprehensive guide covers all fundamental sections of ${chapter.title}. Master the key terms, definitions, equations, and expert exam tips to secure top marks in your IGCSE preparations.`}
              </p>
            </div>
            <button
              onClick={() => setShowSummary(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white font-bold text-sm hover:opacity-95 transition-all shadow-md"
            >
              Back to Reading
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Chat (Mobile/Tablet Only) */}
      <div className="lg:hidden">
        <NoteAiChat
          noteTitle={chapter.title}
          noteSubject={chapter.subject}
          noteContext={chapter.summary}
        />
      </div>
    </div>
  );
}

// ── Main SubjectNotes Component ─────────────────────────────────────────────
function SubjectNotes() {
  const { subject } = Route.useParams();
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const chapters = getChaptersForSubject(subject);
  const filteredChapters = chapters.filter(ch => 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ch.summary && ch.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const colorScheme = SUBJECT_COLORS[subject] ?? "from-primary to-purple-500 border-slate-100 bg-slate-50/10";

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Header authed />

      {/* Subject banner hero card */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-6 pt-8 pb-4">
        <div className={`relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm`}>
          {/* Decorative absolute background accent */}
          <div className={`absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br ${colorScheme.split(" ")[0]} ${colorScheme.split(" ")[1]} opacity-5 filter blur-3xl pointer-events-none`} />

          <Link 
            to="/notes" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-primary transition-all mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Subjects
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-3xl font-extrabold text-slate-900 tracking-tight">{subject} Study Guide</h1>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
            Select a chapter below to open the full-screen study reader. Structured revisions with diagrams, definitions, comparison columns, and high-yield exam tips.
          </p>
          
          {/* Modern Search bar inside card */}
          <div className="mt-5 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${subject} topics or ask Yumna AI...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:bg-white focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all placeholder:text-slate-400 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6 text-xs font-bold text-slate-550 border-t border-slate-100/60 pt-4">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              {chapters.length} chapter{chapters.length !== 1 ? "s" : ""}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-350 self-center" />
            <span>{chapters.reduce((a, c) => a + c.pages.length, 0)} reading modules</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 py-6 flex-1">
        {chapters.length === 0 && !searchQuery.trim() ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-400/10 border border-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary/40" />
            </div>
            <h2 className="font-bold text-lg text-slate-800">Notes Coming Soon</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              We're generating comprehensive structured notes for <strong>{subject}</strong> right now. In the meantime, use AI Notes to search any topic instantly.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-95 shadow-md shadow-primary/25 transition-all"
              >
                <Bot className="w-3.5 h-3.5" /> AI Notes Search
              </Link>
              <Link
                to="/subjects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
              >
                All Subjects
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {searchQuery.trim() ? "Search Results" : "Chapters Directory"}
            </h2>
            
            {/* Grid of Chapter Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredChapters.map((ch, idx) => {
                const actualIdx = chapters.findIndex(c => c.title === ch.title);
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveChapterIndex(actualIdx)}
                    className="group text-left border border-slate-100 bg-white rounded-3xl p-6 transition-all duration-300 hover:shadow-md hover:border-slate-200 flex flex-col justify-between hover:scale-[1.01]"
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                          <BookMarked className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-450 bg-slate-50 border border-slate-100/50 rounded-full px-3 py-1 shrink-0">
                          {ch.pages.length} module{ch.pages.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <h3 className="font-sans font-bold text-base text-slate-855 mt-4 leading-tight group-hover:text-primary transition-colors">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-450 line-clamp-2 mt-2 leading-relaxed font-serif">
                        {ch.summary || "Complete structured curriculum guide. Review key concepts, definitions, bullet notes, comparison tables, and equations."}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary mt-6 pt-3 border-t border-slate-100/40 w-full justify-between">
                      <span>Open Revision Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}

              {/* Dynamic AI card fallback */}
              {searchQuery.trim() && (
                <button
                  onClick={() => navigate({ to: "/notes", search: { q: searchQuery } })}
                  className="group text-left border-2 border-dashed border-primary/20 bg-primary/5 rounded-3xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/40 flex flex-col justify-between hover:scale-[1.01]"
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 shrink-0">
                        AI Generated
                      </span>
                    </div>
                    <h3 className="font-sans font-bold text-base text-slate-855 mt-4 leading-tight group-hover:text-primary transition-colors">
                      Generate Study Guide for "{searchQuery}"
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed font-serif">
                      Let Yumna AI research and generate custom, comprehensive study notes, textbook diagrams, comparison tables, and exam questions for this topic.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary mt-6 pt-3 border-t border-primary/10 w-full justify-between">
                    <span>Create AI Notes Instantly</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )}
            </div>

            {filteredChapters.length === 0 && !searchQuery.trim() && (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-base text-slate-800">No chapters match "{searchQuery}"</h3>
                <p className="text-xs text-slate-450 mt-1 max-w-xs mx-auto">
                  Try adjusting your keywords, or generate custom AI notes for this topic.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Render Full-Screen Reader Overlay when a chapter index is active */}
      {activeChapterIndex !== null && (
        <FullScreenChapterReader 
          chapter={chapters[activeChapterIndex]}
          onClose={() => setActiveChapterIndex(null)}
        />
      )}
    </div>
  );
}
