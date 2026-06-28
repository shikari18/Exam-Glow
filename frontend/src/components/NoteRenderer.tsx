import { useState } from "react";
import { ChevronLeft, ChevronRight, Lightbulb, AlertTriangle, BookOpen } from "lucide-react";
import type { NoteChapter, NotePage, NoteBlock, BulletItem } from "@/data/notes/index";

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
      return <strong key={i} className="font-extrabold text-slate-900" style={{ fontWeight: 850 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return <mark key={i} className="bg-primary/20 text-primary px-1 rounded not-italic font-medium">{part.slice(2, -2)}</mark>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-slate-800">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Inline & Block Markdown parser with Breaks ─────────────────────────────────
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

// ── Markdown Content Block parser ──────────────────────────────────────────────
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
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                  <span className="text-[14px] text-slate-600 leading-relaxed font-serif">{parseInlineWithBreaks(s)}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

// ── Resilient Image Block ──────────────────────────────────────────────────────
function ImageBlock({ block }: { block: NoteBlock & { kind: "image" } }) {
  const [error, setError] = useState(false);

  if (error || !block.src) {
    return (
      <div className="my-6 rounded-2xl p-6 border border-dashed border-slate-200 bg-slate-50/50 text-center flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Educational Diagram</p>
          <p className="text-[11px] text-slate-450 max-w-xs mt-0.5 leading-normal">{block.caption || "Concept Illustration"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/30 shadow-sm transition-all duration-300 hover:shadow-md">
      <img 
        src={block.src} 
        alt={block.caption || "Diagram"} 
        onError={() => setError(true)}
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
        red: "bg-rose-50/30 border border-rose-100/50 text-rose-950",
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

// ── Main NoteRenderer component ───────────────────────────────────────────────
export function NoteRenderer({
  chapter,
  pageIndex: controlledPageIndex,
  onPageChange,
}: {
  chapter: NoteChapter;
  pageIndex?: number;
  onPageChange?: (idx: number) => void;
}) {
  const [localPageIndex, setLocalPageIndex] = useState(0);
  const isControlled = controlledPageIndex !== undefined;
  const pageIndex = isControlled ? controlledPageIndex : localPageIndex;
  const setPageIndex = (idx: number) => {
    if (onPageChange) onPageChange(idx);
    if (!isControlled) setLocalPageIndex(idx);
  };

  const total = chapter.pages.length;
  const page = chapter.pages[pageIndex];

  return (
    <div className="bg-[#FCFCFA] rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="bg-slate-50/60 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{chapter.subject}</p>
          <h2 className="font-bold text-sm text-slate-800 truncate mt-0.5">{chapter.title}</h2>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-100 rounded-full px-3 py-1 shadow-sm">
            {pageIndex + 1} of {total}
          </span>
        </div>
      </div>

      {/* Section title */}
      <div className="px-6 pt-5 pb-3 border-b border-slate-100/40 bg-white">
        <h3 className="font-bold text-lg text-slate-900 tracking-tight">
          {page.section}
        </h3>
      </div>

      {/* Content */}
      <div className="px-6 py-6 min-h-[420px] bg-white">
        <PageLayout page={page} />
      </div>

      {/* Navigation */}
      <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/40">
        <button
          onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 bg-white disabled:opacity-40 hover:bg-slate-50 transition-all hover:shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Page dots */}
        <div className="flex gap-2">
          {chapter.pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPageIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === pageIndex ? "bg-primary w-5" : "bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setPageIndex(Math.min(total - 1, pageIndex + 1))}
          disabled={pageIndex === total - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 bg-white disabled:opacity-40 hover:bg-slate-50 transition-all hover:shadow-sm"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
