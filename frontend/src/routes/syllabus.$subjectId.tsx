import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { 
  ArrowLeft, FileText, ChevronLeft, ChevronRight, X, 
  Download, Printer, ZoomIn, ZoomOut, Trophy,
  Bot, Sparkles, Volume2, VolumeX, Play, Pause, Send, HelpCircle,
  Plus, Minus, BookOpen, MessageCircleQuestion, Square
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { playSpeechConversation, playSpeechConversationChained, stopAllSpeech, speakSingleTurn, type SpeechTurn } from "@/lib/speech-utils";
import { groqAsk } from "@/lib/groq-client";

export const Route = createFileRoute("/syllabus/$subjectId")({
  component: SyllabusPage,
});

// Helper to clean "Cambridge" out of the name
function cleanSubjectName(name: string): string {
  return name.replace(/^Cambridge\s+/i, "").replace(/^IGCSE\s+/i, "");
}

// ── Subject Categorizer ──
type SubjectCategory = "math" | "science" | "tech" | "business" | "language" | "humanities" | "creative";

function getSubjectCategory(name: string, code: string): SubjectCategory {
  const n = name.toLowerCase();
  const c = code.toLowerCase();
  
  if (n.includes("biology") || n.includes("chemistry") || n.includes("physics") || n.includes("science") || n.includes("agriculture") || n.includes("marine") || c === "0620" || c === "0625" || c === "0610" || c === "0972") {
    return "science";
  }
  if (n.includes("mathematics") || n.includes("statistics") || n.includes("calculator") || c === "0580" || c === "0606" || c === "0607" || c === "0980") {
    return "math";
  }
  if (n.includes("computer") || n.includes("technology") || n.includes("ict") || n.includes("information") || c === "0478" || c === "0984" || c === "0417") {
    return "tech";
  }
  if (n.includes("business") || n.includes("economics") || n.includes("accounting") || n.includes("commerce") || n.includes("enterprise") || c === "0450" || c === "0455" || c === "0452") {
    return "business";
  }
  if (n.includes("history") || n.includes("geography") || n.includes("sociology") || n.includes("global perspectives") || n.includes("pakistan studies") || c === "0470" || c === "0460") {
    return "humanities";
  }
  if (n.includes("music") || n.includes("art") || n.includes("design") || n.includes("drama") || n.includes("physical education")) {
    return "creative";
  }
  return "language";
}

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
              <table className="w-full text-left text-[11px] text-foreground/85">
                <thead className="bg-muted/40 border-b border-border text-foreground font-bold">
                  <tr>
                    {headers.map((h, j) => (
                      <th key={j} className="px-4 py-2 text-[11px] font-semibold">
                        {parseInlineText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white text-foreground/80">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/10 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2 text-[11px] leading-relaxed">
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
        <ol key={`ol${i}`} className="space-y-1.5 my-3 list-decimal list-inside pl-2 text-[11px]">
          {items.map((item, j) => (
            <li key={j} className="text-[11px] text-foreground/75 leading-relaxed">
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
        <ul key={`ul${i}`} className="space-y-1.5 my-3 pl-2 text-[11px]">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[11px] text-foreground/75">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span className="flex-1 leading-relaxed">{parseInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    elements.push(<p key={i} className="text-[11px] leading-relaxed my-2">{parseInlineText(trimmed)}</p>);
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

// ── Visual Aid Image Loader Component ──────────────────────────────────────────
function VisualAidImage({ src, alt }: { src: string; alt: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div className="relative w-full bg-slate-50 min-h-32 flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase animate-pulse">Generating visual aid...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full object-cover max-h-48 transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}

// ── Syllabus PDF Reader Component ──────────────────────────────────────────────
interface PDFReaderProps {
  subjectName: string;
  subjectCode: string;
  subjectId: string;
  yearRange: string;
  fileName: string;
  onClose: () => void;
}

function SyllabusPDFReader({ subjectName, subjectCode, subjectId, yearRange, fileName, onClose }: PDFReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fitScale = viewportWidth < 850 ? (viewportWidth - 24) / 800 : 1;
  const activeScale = (zoom / 100) * fitScale;
  
  // AI Chat States
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant" | "smith" | "jones" | "yumna"; text: string; speaker?: string; imageUrl?: string }>>([]);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [audioState, setAudioState] = useState<"idle" | "speaking" | "teaching">("idle");
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState<number | null>(null);
  // 40-minute teach session timer (seconds)
  const [teachTimer, setTeachTimer] = useState<number | null>(null);
  const teachTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Teaching session tracking
  const [teachingPageNum, setTeachingPageNum] = useState<number | null>(null);
  const [qaMode, setQaMode] = useState(false);
  const sessionIdRef = useRef(0); // increment to cancel active session
  const chatAbortRef = useRef<AbortController | null>(null); // for stopping AI chat responses

  const audioControllerRef = useRef<{ stop: () => void } | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const cleanName = cleanSubjectName(subjectName);
  const category = getSubjectCategory(subjectName, subjectCode);
  const totalPages = 13;

  const syllabus = getSyllabusData(subjectId);
  const objectives = syllabus?.objectives || [];

  // Stop TTS speech on unmount
  useEffect(() => {
    return () => {
      stopAllSpeech();
      if (teachTimerRef.current) clearInterval(teachTimerRef.current);
    };
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, speakingMsgIndex]);

  // Clean reader on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Teach session countdown timer
  useEffect(() => {
    if (teachTimer === null) return;
    if (teachTimer <= 0) {
      handleStopAudio();
    }
  }, [teachTimer]);

  const startTeachTimer = (seconds = 2400) => {
    if (teachTimerRef.current) clearInterval(teachTimerRef.current);
    setTeachTimer(seconds);
    teachTimerRef.current = setInterval(() => {
      setTeachTimer(prev => {
        if (prev === null || prev <= 1) {
          if (teachTimerRef.current) clearInterval(teachTimerRef.current!);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const adjustTimer = (delta: number) => {
    if (delta < 0) {
      const ok = window.confirm(
        `⚠️ Reducing time means the AIs may rush and not cover everything.\n` +
        `The less time you give, the harder it is for them to teach you everything.\n\nAre you sure you want to reduce the time?`
      );
      if (!ok) return;
    }
    setTeachTimer(prev => prev !== null ? Math.max(60, prev + delta) : null);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Build image URL for visual topics via Pollinations.ai (free, no key needed)
  const buildImageUrl = (topic: string, subject: string) => {
    const prompt = encodeURIComponent(
      `Extremely simple minimal educational drawing: ${topic} for IGCSE ${subject} students, basic clean lines on plain white background, zero tiny text, minimal shapes, very clear and easy to understand`
    );
    return `https://image.pollinations.ai/prompt/${prompt}?width=640&height=400&nologo=true&seed=${Math.floor(Math.random()*9999)}`;
  };

  // Build content summary for any page number
  const buildPageContentSummary = (pageNum: number): string => {
    const objs = getObjectivesForPage(pageNum - 8);
    const aims = getCategoryAims();
    if (pageNum === 1) return `Subject: ${cleanName}, Code: ${subjectCode}, Year range: ${yearRange}.`;
    if (pageNum === 2) return `Cambridge philosophy, learner attributes: confident, responsible, reflective, innovative, engaged. Duke University endorsement of rigour.`;
    if (pageNum === 3) return `Table of Contents: ${objectives.map(o => `Chapter ${o.code}: ${o.title}`).join("; ")}.`;
    if (pageNum === 4) return `Educational aims: ${aims.join("; ")}.`;
    if (pageNum === 5) return `Curriculum overview: ${objectives.map(o => `${o.code} ${o.title} — ${o.description}`).join(" | ")}.`;
    if (pageNum === 6) return `Assessment structure: tiered Core and Extended papers, durations, mark allocations, percentage weightings.`;
    if (pageNum === 7) return `Assessment objectives: AO1 Knowledge & understanding, AO2 Handling information & problem solving, AO3 Experimental skills & investigation (if applicable).`;
    if (pageNum >= 8 && pageNum <= 13) {
      if (objs.length > 0) {
        return objs.map(o =>
          `${o.code}: ${o.title}. ${o.description}. Sub-topics: ${o.subObjectives?.map(so => `${so.code} ${so.title}: ${so.description}`).join("; ") || "See syllabus"}.`
        ).join(" || ");
      }
      return `Syllabus conventions: command words (describe, explain, calculate, estimate), SI units, significant figures rules, mathematical notation.`;
    }
    return `Syllabus page ${pageNum}.`;
  };

  // Generate an 8-turn teaching script for one page via Groq
  // Includes Yumna (3rd character) as the AI image specialist
  interface TeachTurn extends SpeechTurn {
    needsImage?: boolean;
    imagePrompt?: string; // Yumna image-generation turns carry this
    isYumna?: boolean;    // true for Yumna's turns
  }

  const generatePageScript = async (pageNum: number, contentSummary: string): Promise<TeachTurn[]> => {
    const pageTitle = getPageTitle(pageNum);
    const systemPrompt = `You are writing an educational podcast script for THREE human professors teaching IGCSE students. Never mention Gemini, Google, or AI models.

The three professors are:
1. Prof. Sophia Jones (female) — warm, cheery, uses real-world analogies to explain concepts.
2. Dr. Marcus Smith (male) — analytical, deep-voiced, enthusiastic, breaks down exam details and key terms.
3. Yumna Hassan (female) — the visual learning specialist. She ONLY speaks when Sophia or Marcus explicitly says "Yumna, generate an image of [topic]" — she then briefly agrees and describes what she will visualize. She does NOT teach on her own.

Rules:
- Sophia and Marcus carry the teaching dialogue naturally.
- Once during the page, ONE of them says "Yumna, generate an image of [specific topic from this page] to help the student visualize this." — this should be turn 5 or 6.
- Yumna replies with 1 short sentence confirming she will create the visual, e.g. "Sure! Here's a clear diagram showing [topic]." — this is a Yumna turn.
- Sophia or Marcus then continues after Yumna.
- Output ONLY a raw JSON array. No markdown, no backticks.`;

    const userPrompt = `Write an 8-turn teaching script for Page ${pageNum} ("${pageTitle}") of IGCSE ${cleanName} (${subjectCode}).

Page Content:
${contentSummary}

Turn structure:
- Turn 1: Prof. Sophia Jones — introduces core topic with a real-world analogy (2-3 sentences).
- Turn 2: Dr. Marcus Smith — asks Sophia a clarifying question about it (1-2 sentences).
- Turn 3: Prof. Sophia Jones — answers, then asks Marcus to explain the next key point (2-3 sentences).
- Turn 4: Dr. Marcus Smith — explains that key point analytically (2-3 sentences).
- Turn 5: Prof. Sophia Jones OR Dr. Marcus Smith — says "Yumna, generate an image of [specific visual topic from this page] to help the student understand." (1 sentence exactly — just this request).
- Turn 6: Yumna Hassan — says "Sure! Here's a clear diagram showing [topic]." (1 sentence, isYumna: true, imagePrompt: "[exact topic for image]").
- Turn 7: The other professor (Sophia or Marcus) — continues teaching an exam tip or common pitfall (2-3 sentences).
- Turn 8: The remaining professor — summarizes the key takeaway of this page (1-2 sentences).

Output ONLY this JSON format (no markdown, no backticks, no extra text):
[
  {"speaker":"Prof. Sophia Jones","gender":"female","text":"..."},
  {"speaker":"Dr. Marcus Smith","gender":"male","text":"..."},
  {"speaker":"Prof. Sophia Jones","gender":"female","text":"..."},
  {"speaker":"Dr. Marcus Smith","gender":"male","text":"..."},
  {"speaker":"Prof. Sophia Jones","gender":"female","text":"Yumna, generate an image of [specific topic] to help the student understand."},
  {"speaker":"Yumna Hassan","gender":"female","text":"Sure! Here's a clear diagram showing [topic].","isYumna":true,"imagePrompt":"[topic]"},
  {"speaker":"Dr. Marcus Smith","gender":"male","text":"..."},
  {"speaker":"Prof. Sophia Jones","gender":"female","text":"..."}
]`;

    const raw = await groqAsk(systemPrompt, userPrompt, { max_tokens: 1800, temperature: 0.72 });
    let json = raw.trim();
    if (json.startsWith("```")) json = json.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    const s = json.indexOf("["); const e = json.lastIndexOf("]");
    if (s !== -1 && e > s) json = json.slice(s, e + 1);
    json = json.replace(/,\s*([\]}])/g, "$1"); // strip trailing commas to prevent parsing errors
    return JSON.parse(json) as TeachTurn[];
  };

  const generateFallbackScript = (pageNum: number): TeachTurn[] => {
    const aims = getCategoryAims();
    const objs = getObjectivesForPage(pageNum - 8);
    const aimsText = aims.length > 0 ? aims[0] : "develop subject-specific skills and deep conceptual understanding";

    if (pageNum === 1) {
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Welcome, everyone! Today, we are beginning our comprehensive syllabus walkthrough for IGCSE ${cleanName}, course code ${subjectCode}, covering the ${yearRange} examination periods. Understanding your syllabus is the ultimate foundation for exam success!`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Absolutely, Sophia! Many students underestimate the syllabus, but it is literally the official guide to everything that can be tested. By aligning your studies with these official objectives, you ensure no surprises on exam day.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Precisely, Marcus. We will look at how the entire course is structured, what chapters are covered, and how you will be assessed. Let's make sure we build a perfect conceptual map right from the start.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Yes, a clear learning path is essential. When you know where you are going, studying becomes far more structured and much less stressful. We'll be here with you every step of the way!`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is the spirit, Marcus! Yumna, generate an image of the syllabus cover page with a roadmap to show how we'll navigate this subject together.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing a learning roadmap for IGCSE ${cleanName}.`,
          isYumna: true,
          imagePrompt: `IGCSE ${cleanName} syllabus learning roadmap pathway`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `That is a fantastic roadmap, Yumna! It shows exactly how our journey unfolds from basic principles to advanced exam-style applications.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `It really does. Let's turn the page and look at the core Cambridge learner attributes that will guide our mindset.`
        }
      ];
    }

    if (pageNum === 2) {
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `On page two, we explore the core Cambridge philosophy. Cambridge education is designed to cultivate five essential learner attributes: being confident, responsible, reflective, innovative, and engaged.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `These are outstanding qualities, Sophia. They aren't just academic goals; they are life skills. Duke University even endorses this curriculum for its exceptional rigour, which prepares students perfectly for university.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `I absolutely agree. For instance, being 'reflective' means analyzing your own work, learning from mistakes, and improving your study strategies. That is how you turn a B grade into an A-star!`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Indeed. And being 'innovative' means applying what you know to unfamiliar problems. In IGCSE exams, they love to give you scenarios you've never seen before to test if you can think on your feet.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is so true, Marcus! Yumna, generate an image of the five Cambridge Learner Attributes represented as a beautiful interconnected gears diagram.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing the five Cambridge Learner Attributes.`,
          isYumna: true,
          imagePrompt: `Cambridge Learner Attributes five gears diagram`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Look at that! The gears show how these attributes drive each other. Being responsible makes you reflective, which makes you innovative!`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `A perfect visual, Yumna. Let's carry this positive, reflective mindset as we move to the next page and look at our table of contents.`
        }
      ];
    }

    if (pageNum === 3) {
      const chapterList = objectives.slice(0, 5).map(o => `Chapter ${o.code}: ${o.title}`).join(", ");
      const chaptersText = chapterList ? `Our main chapters include ${chapterList}, and more` : "We have a structured sequence of chapters that build your knowledge step-by-step";
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Welcome to the Table of Contents! This page gives us a complete directory of the chapters we need to cover. ${chaptersText}.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `This table of contents is a great checklist, Sophia. As you study, you can tick off each chapter. It gives you a great sense of progress and helps you see how different topics connect.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Yes, and it is crucial to study them in order because the early chapters lay the foundations for the more advanced ones. Marcus, which areas do students usually find most challenging here?`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Usually, it is the chapters that combine theoretical concepts with quantitative calculations or complex diagrams. Students need to spend extra time on those to build fluency.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Exactly, those are the high-yield chapters! Yumna, generate an image of a table of contents mind map showing the key chapters of this course.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing a mind map of the chapters in IGCSE ${cleanName}.`,
          isYumna: true,
          imagePrompt: `IGCSE ${cleanName} chapters mind map overview`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Seeing the chapters laid out as a mind map is highly effective. It helps students understand the macro-structure of the entire subject.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `It really does. Now, let's turn the page to discover the educational aims that Cambridge has set for us.`
        }
      ];
    }

    if (pageNum === 4) {
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `On page four, we focus on the educational aims of the curriculum. The primary aim is to ${aimsText}.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `That is an excellent aim, Sophia. Cambridge wants to make sure you don't just memorize facts for a exam, but that you develop deep understanding and analytical skills that you can use in the real world.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Yes! They want to foster curiosity, scientific accuracy, and logical reasoning. This is why exams test your ability to explain 'why' things happen, not just 'what' happens.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Precisely. When answering questions, remember that explaining the underlying principles and showing how they apply will always score you the highest marks.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is the key! Yumna, generate an image of a balance scale showing theory on one side and real-world application on the other.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing the balance between curriculum theory and real-world application.`,
          isYumna: true,
          imagePrompt: `balance scale theory on one side and real world application on the other`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Perfect visualization. That balance is exactly what you should strive for in your revision: learn the theory, then practice applying it.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Beautifully said, Marcus. Let's move to page five to see the full curriculum content overview.`
        }
      ];
    }

    if (pageNum === 5) {
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Here is the Curriculum Content Overview. This page is critical because it details the specific content requirements and highlights the difference between Core and Extended paths.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `That is a very important distinction, Sophia. The Core curriculum is designed for everyone, covering the essential foundations. The Extended path includes additional, more advanced topics.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Yes! If you are aiming for the top grades—like an A or A-star—you must study the Extended curriculum. It covers the concepts in much more mathematical and analytical depth.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Exactly. Make sure you check which papers you are registered for so you know exactly which sections of this overview apply to you.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is vital! Yumna, generate an image of a tree diagram showing the core trunk and extended branches of the curriculum.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing the Core vs Extended curriculum paths as a tree.`,
          isYumna: true,
          imagePrompt: `curriculum tree core trunk and extended branches`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `The tree diagram shows it perfectly: the Core forms the sturdy trunk of basic concepts, while the Extended branches out into higher-level details.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `It really does. Let's keep climbing this tree of knowledge as we move to page six and look at the exam paper structure.`
        }
      ];
    }

    if (pageNum === 6) {
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `On page six, we look at the Examination Components. This is where we learn how you will be graded! You will sit multiple papers, including a multiple-choice paper, a theory paper, and a practical paper.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `That's right, Sophia. The weightings of these papers are key. For example, the theory paper usually carries about 50% of the total grade, which makes it incredibly important to master.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Yes, and the practical paper or alternative-to-practical tests your experimental skills and ability to design investigations, record data, and draw valid conclusions.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `A top exam tip here: look at the mark allocations! A 2-mark question only requires two key points, whereas a 6-mark question requires a structured, detailed explanation.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is an invaluable tip, Marcus. Yumna, generate an image of a pie chart showing the percentage weightings of the different exam papers.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing the exam paper weightings.`,
          isYumna: true,
          imagePrompt: `exam papers percentage weightings pie chart`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Seeing the weightings as a pie chart is so helpful. It shows that both theory and multiple-choice are major pillars of your success.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Exactly. Now let's move to page seven to see the Assessment Objectives and how they are evaluated.`
        }
      ];
    }

    if (pageNum === 7) {
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Page seven covers the Assessment Objectives, or AOs. These are the specific cognitive skills the examiners are testing. AO1 is recall and understanding, while AO2 is handling information and problem-solving.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `This is a critical page, Sophia. AO2—applying your knowledge to new situations—often carries a very large percentage of the marks. Many students fail because they only memorize facts and don't practice application.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Yes! That is why doing past papers is so essential. You have to train your brain to solve problems, analyze data, and perform calculations under exam conditions.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Absolutely. If you also have a practical component, AO3 tests your experimental skills. Make sure you know how to draw accurate graphs and identify sources of experimental error.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Indeed. Yumna, generate an image of a brain with puzzle pieces representing different assessment objectives like knowledge and problem solving.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing the assessment objectives as puzzle pieces in a brain.`,
          isYumna: true,
          imagePrompt: `brain puzzle pieces knowledge and problem solving`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `That is a perfect representation! Your knowledge and your problem-solving skills are the puzzle pieces that fit together to make you an expert student.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Beautifully put, Marcus. Now that we have covered the syllabus structure and exam format, let's dive into the core subject content guides starting on page eight!`
        }
      ];
    }

    if (objs.length > 0) {
      const mainObj = objs[0];
      const subList = mainObj.subObjectives?.map(so => so.title).slice(0, 3).join(", ") || "";
      const subsText = subList ? `, covering key topics like ${subList}` : "";

      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Welcome to Page ${pageNum}! We are now diving deep into the Subject Content Guide. On this page, we focus on Chapter ${mainObj.code}: ${mainObj.title}${subsText}.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `This is a highly important chapter, Sophia. In Chapter ${mainObj.code}, the syllabus expects students to master the core principles of ${mainObj.title}. Examiners frequently test this area using both conceptual and calculation questions.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Yes! For instance, when studying ${mainObj.title}, students often struggle to connect the theory to real-world examples. Let's think about how these concepts apply to everyday life to make them super clear.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `That is the best way to learn, Sophia. A common exam mistake here is forgetting to use precise definitions. Make sure you memorize the exact terms and keywords listed in the syllabus for this chapter.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is a stellar tip! Yumna, generate an image of a conceptual diagram for ${mainObj.title} to help the student visualize this.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing the key concepts of ${mainObj.title}.`,
          isYumna: true,
          imagePrompt: `${mainObj.title} conceptual diagram educational illustration`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Fabulous diagram, Yumna. Seeing the relationships between these variables visually makes them much easier to remember under exam pressure.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `It absolutely does. Let's make sure we review the sub-topics and practice standard calculations for this chapter before moving to the next page!`
        }
      ];
    } else {
      return [
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `On Page ${pageNum}, we explore the essential syllabus conventions, command words, and mathematical guidelines. These are the underlying rules that govern how you should write your answers!`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `This page is a goldmine, Sophia. Command words like 'describe', 'explain', 'calculate', and 'suggest' have very precise definitions. If a question asks you to 'explain', you will not get full marks by simply describing what happens!`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `Exactly! You must give the reasons 'why' it happens. And when doing calculations, always round your final answers to three significant figures unless the question specifies otherwise.`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Yes, and always state the correct SI units! Leaving out the units or writing the wrong ones is a very common way to lose easy marks. And remember, show all your working so you can get method marks!`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is an absolute lifesaver! Yumna, generate an image of a cheat sheet showing the key command words and their definitions.`
        },
        {
          speaker: "Yumna Hassan",
          gender: "female",
          text: `Sure! Here's a clear diagram showing a cheat sheet of exam command words.`,
          isYumna: true,
          imagePrompt: `exam command words definitions cheat sheet`
        },
        {
          speaker: "Dr. Marcus Smith",
          gender: "male",
          text: `Excellent cheat sheet, Yumna. Underline the command word in every exam question you read to ensure your response matches exactly what is being asked.`
        },
        {
          speaker: "Prof. Sophia Jones",
          gender: "female",
          text: `That is brilliant advice, Marcus. This brings us to the end of our complete syllabus walk! You now have a perfect roadmap for your exam preparation.`
        }
      ];
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `Syllabus Overview for IGCSE ${cleanName} (${subjectCode})\nYear Range: ${yearRange}\nDownloaded from ExamGlow`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get dynamic objectives distributed across pages 8-13 (indices 0 to 5)
  const getObjectivesForPage = (pageIdx: number) => {
    if (objectives.length === 0) return [];
    if (objectives.length <= 6) {
      return objectives[pageIdx] ? [objectives[pageIdx]] : [];
    }
    const perPage = Math.ceil(objectives.length / 6);
    const start = pageIdx * perPage;
    return objectives.slice(start, start + perPage);
  };

  const getPageTitle = (page: number): string => {
    if (page === 1) return "Cover Page";
    if (page === 2) return "Introduction & Student Pathways";
    if (page === 3) return "Table of Contents";
    if (page === 4) return "1 Aims of the Curriculum";
    if (page === 5) return "1.2 Curriculum Content Overview";
    if (page === 6) return "2 Examination Components Overview";
    if (page === 7) return "2.2 Assessment Objectives Weightings";
    if (page >= 8 && page <= 13) {
      const objs = getObjectivesForPage(page - 8);
      if (objs.length > 0) return `3 Subject Content Guide: ${objs.map(o => o.title).join(" & ")}`;
      return "3 Subject Content Guide";
    }
    return "Syllabus Review & Conventions";
  };

  // ── Render Category SVG Illustration ──
  const renderIllustration = () => {
    switch (category) {
      case "math":
        return (
          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none">
            <rect x="5" y="5" width="90" height="90" rx="10" stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="2 2" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M 15 80 C 35 70, 45 30, 85 20" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="50" cy="50" r="3.5" fill="#ef4444" />
            <path d="M 50 50 A 15 15 0 0 0 63 42" stroke="#6366f1" strokeWidth="1.5" />
            <text x="60" y="36" fill="#6366f1" className="text-[7px] font-mono font-bold">θ</text>
          </svg>
        );
      case "science":
        return (
          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none">
            <path d="M 38 20 L 38 28 L 22 74 A 8 8 0 0 0 30 84 L 70 84 A 8 8 0 0 0 78 74 L 62 28 L 62 20 Z" stroke="#10b981" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 24.5 70 L 75.5 70 A 8 8 0 0 1 70 84 L 30 84 A 8 8 0 0 1 24.5 70 Z" fill="#3b82f6" fillOpacity="0.25" />
            <circle cx="44" cy="56" r="4.5" fill="#60a5fa" fillOpacity="0.8" />
            <circle cx="56" cy="46" r="3.5" fill="#60a5fa" fillOpacity="0.8" />
            <circle cx="42" cy="38" r="2.5" fill="#60a5fa" fillOpacity="0.8" />
            <ellipse cx="50" cy="52" rx="42" ry="12" stroke="#8b5cf6" strokeWidth="1" transform="rotate(35, 50, 52)" />
            <ellipse cx="50" cy="52" rx="42" ry="12" stroke="#8b5cf6" strokeWidth="1" transform="rotate(-35, 50, 52)" />
            <circle cx="50" cy="52" r="7.5" fill="#ef4444" />
          </svg>
        );
      case "tech":
        return (
          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none">
            <rect x="28" y="28" width="44" height="44" rx="8" stroke="#3b82f6" strokeWidth="3" />
            <rect x="36" y="36" width="28" height="28" rx="4" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
            {[20, 50, 80].map((coord) => (
              <g key={coord}>
                <line x1="16" y1={coord} x2="28" y2={coord} stroke="#3b82f6" strokeWidth="2.5" />
                <line x1="72" y1={coord} x2="84" y2={coord} stroke="#3b82f6" strokeWidth="2.5" />
                <line x1={coord} y1="16" x2={coord} y2="28" stroke="#3b82f6" strokeWidth="2.5" />
                <line x1={coord} y1="72" x2={coord} y2="84" stroke="#3b82f6" strokeWidth="2.5" />
              </g>
            ))}
            <path d="M 12 12 L 28 12 L 28 28" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <path d="M 88 88 L 72 88 L 72 72" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" fill="#10b981" />
            <circle cx="88" cy="88" r="3" fill="#10b981" />
          </svg>
        );
      case "business":
        return (
          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none">
            <line x1="15" y1="85" x2="85" y2="85" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="15" y1="15" x2="15" y2="85" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="24" y="58" width="12" height="27" fill="#f59e0b" rx="2" />
            <rect x="42" y="42" width="12" height="43" fill="#3b82f6" rx="2" />
            <rect x="60" y="26" width="12" height="59" fill="#10b981" rx="2" />
            <path d="M 18 78 L 30 62 L 48 48 L 66 32 L 82 14" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="82,14 74,15 80,21" fill="#ef4444" stroke="#ef4444" strokeWidth="1" />
          </svg>
        );
      case "humanities":
        return (
          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="36" stroke="#06b6d4" strokeWidth="3" />
            <path d="M 14 50 Q 50 32 86 50" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 14 50 Q 50 68 86 50" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 50 14 Q 32 50 50 86" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 50 14 Q 68 50 50 86" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
            <polygon points="50,22 55,47 50,50" fill="#ef4444" />
            <polygon points="50,78 45,53 50,50" fill="#475569" />
            <polygon points="22,50 47,45 50,50" fill="#475569" />
            <polygon points="78,50 53,55 50,50" fill="#475569" />
            <circle cx="50" cy="50" r="3.5" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
          </svg>
        );
      case "creative":
        return (
          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none">
            <circle cx="34" cy="74" r="7.5" fill="#ec4899" />
            <line x1="41.5" y1="74" x2="41.5" y2="34" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="66" cy="64" r="7.5" fill="#ec4899" />
            <line x1="73.5" y1="64" x2="73.5" y2="24" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="41.5" y1="38" x2="73.5" y2="28" stroke="#ec4899" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 18 42 C 12 28, 42 16, 62 26 C 76 34, 82 54, 68 68 C 58 78, 38 82, 23 72 C 14 62, 23 54, 18 42 Z" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="30" cy="36" r="4.5" fill="#3b82f6" />
            <circle cx="52" cy="34" r="4.5" fill="#10b981" />
            <circle cx="62" cy="48" r="4.5" fill="#ef4444" />
          </svg>
        );
      default: // language
        return (
          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="none">
            <path d="M 18 68 C 22 64, 40 64, 48 68 L 48 24 C 40 20, 22 20, 18 24 Z" fill="#6366f1" fillOpacity="0.05" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 82 68 C 78 64, 60 64, 52 68 L 52 24 C 60 20, 78 20, 82 24 Z" fill="#6366f1" fillOpacity="0.05" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="34" x2="42" y2="34" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="44" x2="38" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="54" x2="42" y2="54" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="34" x2="76" y2="34" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="44" x2="70" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="54" x2="76" y2="54" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <path d="M 86 16 C 81 25, 77 34, 67 43 C 64 46, 60 43, 62 40 C 69 34, 73 25, 80 16 Z" fill="#f59e0b" />
          </svg>
        );
    }
  };

  // ── Render Category Assessment Table ──
  const renderAssessmentTable = () => {
    switch (category) {
      case "science":
        return (
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-2.5">Component</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Marks</th>
                <th className="px-4 py-2.5">Weighting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              <tr>
                <td className="px-4 py-3"><strong>Paper 1:</strong> Multiple Choice (Core)</td>
                <td className="px-4 py-3">45m</td>
                <td className="px-4 py-3">40</td>
                <td className="px-4 py-3">30%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 2:</strong> Multiple Choice (Extended)</td>
                <td className="px-4 py-3">45m</td>
                <td className="px-4 py-3">40</td>
                <td className="px-4 py-3">30%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 3:</strong> Theory (Core)</td>
                <td className="px-4 py-3">1h 15m</td>
                <td className="px-4 py-3">80</td>
                <td className="px-4 py-3">50%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 4:</strong> Theory (Extended)</td>
                <td className="px-4 py-3">1h 15m</td>
                <td className="px-4 py-3">80</td>
                <td className="px-4 py-3">50%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 5/6:</strong> Practical Test / Alternative</td>
                <td className="px-4 py-3">1h 00m</td>
                <td className="px-4 py-3">40</td>
                <td className="px-4 py-3">20%</td>
              </tr>
            </tbody>
          </table>
        );
      case "math":
        return (
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-2.5">Component</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Marks</th>
                <th className="px-4 py-2.5">Weighting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              <tr>
                <td className="px-4 py-3"><strong>Paper 1:</strong> Short-answer (Core)</td>
                <td className="px-4 py-3">1h 30m</td>
                <td className="px-4 py-3">56</td>
                <td className="px-4 py-3">35%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 2:</strong> Short-answer (Extended)</td>
                <td className="px-4 py-3">1h 30m</td>
                <td className="px-4 py-3">70</td>
                <td className="px-4 py-3">35%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 3:</strong> Structured questions (Core)</td>
                <td className="px-4 py-3">2h 00m</td>
                <td className="px-4 py-3">104</td>
                <td className="px-4 py-3">65%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 4:</strong> Structured questions (Extended)</td>
                <td className="px-4 py-3">2h 30m</td>
                <td className="px-4 py-3">130</td>
                <td className="px-4 py-3">65%</td>
              </tr>
            </tbody>
          </table>
        );
      case "tech":
        return (
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-2.5">Component</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Marks</th>
                <th className="px-4 py-2.5">Weighting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              <tr>
                <td className="px-4 py-3"><strong>Paper 1:</strong> Computer Systems (Written Theory)</td>
                <td className="px-4 py-3">1h 45m</td>
                <td className="px-4 py-3">75</td>
                <td className="px-4 py-3">50%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 2:</strong> Algorithms, Programming and Logic</td>
                <td className="px-4 py-3">1h 45m</td>
                <td className="px-4 py-3">75</td>
                <td className="px-4 py-3">50%</td>
              </tr>
            </tbody>
          </table>
        );
      case "business":
        return (
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-2.5">Component</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Marks</th>
                <th className="px-4 py-2.5">Weighting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              <tr>
                <td className="px-4 py-3"><strong>Paper 1:</strong> Short Answer and Data Response</td>
                <td className="px-4 py-3">1h 30m</td>
                <td className="px-4 py-3">80</td>
                <td className="px-4 py-3">50%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 2:</strong> Case Study (Structured Written)</td>
                <td className="px-4 py-3">1h 30m</td>
                <td className="px-4 py-3">80</td>
                <td className="px-4 py-3">50%</td>
              </tr>
            </tbody>
          </table>
        );
      case "language":
        return (
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-2.5">Component</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Marks</th>
                <th className="px-4 py-2.5">Weighting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              <tr>
                <td className="px-4 py-3"><strong>Paper 1:</strong> Reading (Comprehension)</td>
                <td className="px-4 py-3">2h 00m</td>
                <td className="px-4 py-3">80</td>
                <td className="px-4 py-3">50%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 2:</strong> Writing (Directed/Composition)</td>
                <td className="px-4 py-3">2h 00m</td>
                <td className="px-4 py-3">80</td>
                <td className="px-4 py-3">50%</td>
              </tr>
            </tbody>
          </table>
        );
      default: // humanities / creative
        return (
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="px-4 py-2.5">Component</th>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Marks</th>
                <th className="px-4 py-2.5">Weighting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 bg-white">
              <tr>
                <td className="px-4 py-3"><strong>Paper 1:</strong> Written Theory (Structured Data)</td>
                <td className="px-4 py-3">1h 45m</td>
                <td className="px-4 py-3">75</td>
                <td className="px-4 py-3">45%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 2:</strong> Case Study / Document Analysis</td>
                <td className="px-4 py-3">1h 30m</td>
                <td className="px-4 py-3">60</td>
                <td className="px-4 py-3">35%</td>
              </tr>
              <tr>
                <td className="px-4 py-3"><strong>Paper 3/Coursework:</strong> Investigation Portfolio</td>
                <td className="px-4 py-3">Ongoing</td>
                <td className="px-4 py-3">40</td>
                <td className="px-4 py-3">20%</td>
              </tr>
            </tbody>
          </table>
        );
    }
  };

  // ── Render Category Assessment Objectives (AO) ──
  const renderAssessmentObjectives = () => {
    switch (category) {
      case "science":
        return (
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr>
              <td className="p-3"><strong>AO1: Knowledge with understanding</strong></td>
              <td className="p-3">Candidates must recall facts, laws, terminology, symbols, and concepts.</td>
              <td className="p-3 font-mono font-bold text-slate-700">50%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO2: Handling information & problem solving</strong></td>
              <td className="p-3">Candidates must translate, organize, calculate, and evaluate scientific data.</td>
              <td className="p-3 font-mono font-bold text-slate-700">30%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO3: Experimental skills & investigations</strong></td>
              <td className="p-3">Candidates must plan procedures, record readings, and evaluate methods.</td>
              <td className="p-3 font-mono font-bold text-slate-700">20%</td>
            </tr>
          </tbody>
        );
      case "math":
        return (
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr>
              <td className="p-3"><strong>AO1: Mathematical techniques</strong></td>
              <td className="p-3">Recall facts, select and apply appropriate math techniques, perform calculations.</td>
              <td className="p-3 font-mono font-bold text-slate-700">60%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO2: Applying techniques to solve problems</strong></td>
              <td className="p-3">Analyze contexts, formulate mathematical models, interpret and communicate solutions.</td>
              <td className="p-3 font-mono font-bold text-slate-700">40%</td>
            </tr>
          </tbody>
        );
      case "tech":
        return (
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr>
              <td className="p-3"><strong>AO1: Recall & understand facts</strong></td>
              <td className="p-3">Show understanding of hardware, networking, databases, logic gates, and syntax.</td>
              <td className="p-3 font-mono font-bold text-slate-700">60%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO2: Design, write & test programs</strong></td>
              <td className="p-3">Create flowcharts, write pseudocode, trace dry runs, construct algorithms.</td>
              <td className="p-3 font-mono font-bold text-slate-700">40%</td>
            </tr>
          </tbody>
        );
      case "business":
        return (
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr>
              <td className="p-3"><strong>AO1: Knowledge & understanding</strong></td>
              <td className="p-3">Define terms, explain theoretical principles and corporate structures.</td>
              <td className="p-3 font-mono font-bold text-slate-700">30%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO2: Application</strong></td>
              <td className="p-3">Apply knowledge to case studies, perform accounting and financial computations.</td>
              <td className="p-3 font-mono font-bold text-slate-700">30%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO3: Analysis & evaluation</strong></td>
              <td className="p-3">Analyse indicators, recommend business strategies, formulate reasoned assessments.</td>
              <td className="p-3 font-mono font-bold text-slate-700">40%</td>
            </tr>
          </tbody>
        );
      case "language":
        return (
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr>
              <td className="p-3"><strong>AO1: Reading (Comprehension)</strong></td>
              <td className="p-3">Understand explicit/implicit meanings, select details, analyze style and register.</td>
              <td className="p-3 font-mono font-bold text-slate-700">50%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO2: Writing (Expression)</strong></td>
              <td className="p-3">Express thoughts clearly, employ accurate grammar, vary vocabulary and sentence lengths.</td>
              <td className="p-3 font-mono font-bold text-slate-700">50%</td>
            </tr>
          </tbody>
        );
      default: // humanities / creative
        return (
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr>
              <td className="p-3"><strong>AO1: Knowledge & understanding</strong></td>
              <td className="p-3">Demonstrate clear knowledge of historical, geographic, or artistic details.</td>
              <td className="p-3 font-mono font-bold text-slate-700">40%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO2: Analysis & evaluation</strong></td>
              <td className="p-3">Interpret maps, primary sources, or media; structure responses and argue viewpoints.</td>
              <td className="p-3 font-mono font-bold text-slate-700">40%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AO3: Synthesis & communication</strong></td>
              <td className="p-3">Organize observations logically; present conclusions, reports, or portfolios.</td>
              <td className="p-3 font-mono font-bold text-slate-700">20%</td>
            </tr>
          </tbody>
        );
    }
  };

  // ── Aims bullet list by category ──
  const getCategoryAims = (): string[] => {
    switch (category) {
      case "science":
        return [
          "provide an enjoyable and worthwhile educational experience for all learners, whether or not they go on to study science beyond this level.",
          "enable learners to acquire sufficient knowledge and understanding to become confident citizens in a technological world.",
          "develop useful skills in practical procedures and safe investigation methods.",
          "foster critical thinking, scientific accuracy, and logical reasoning.",
          "encourage an understanding of how scientific discoveries impact societies and ecosystems."
        ];
      case "math":
        return [
          "develop mathematical ability and confidence as a core life skill.",
          "encourage reasoning, logical thinking, and identifying patterns and relationships.",
          "foster problem solving in pure mathematics and real-life applied contexts.",
          "promote accurate and clear mathematical communication and interpretation of results.",
          "provide a strong mathematical foundation for further academic and professional studies."
        ];
      case "tech":
        return [
          "develop an understanding of computational thinking and programming principles.",
          "enable learners to analyze problems and design logic-based algorithm solutions.",
          "foster knowledge of hardware, software, data representation, and internet systems.",
          "encourage critical thinking regarding the ethical, social, and economic impact of computer systems.",
          "provide a pathway for advanced computer science studies and practical development skills."
        ];
      case "business":
        return [
          "develop an understanding of business, economic, or accounting terminology and frameworks.",
          "enable learners to apply analytical tools to corporate, financial, and market data.",
          "foster critical evaluation of corporate decisions, market trends, and financial performance indicators.",
          "encourage logical, evidence-supported arguments and recommendations.",
          "provide a strong foundation for business management, financial services, or professional career pathways."
        ];
      case "language":
        return [
          "enable learners to communicate clearly, accurately, and effectively in speech and writing.",
          "develop the ability to read, understand, and evaluate explicit and implicit meanings of various texts.",
          "foster a critical appreciation of language registers, styles, and literary contexts.",
          "encourage accurate use of grammar, spelling, punctuation, and extensive vocabulary.",
          "enrich learners' understanding of global cultural communication frameworks."
        ];
      default: // humanities / creative
        return [
          "develop an understanding of historical context, geographic environments, or creative portfolios.",
          "enable learners to analyze source documents, maps, or creative artifacts critically.",
          "foster organized, logical, and evidence-driven presentations of facts and evaluations.",
          "encourage reflection regarding cultural heritage, global resources, and social developments.",
          "provide a solid base for advanced arts, humanities, or practical career paths."
        ];
    }
  };

  // ── Teach Me This Page audio readout ──
  const handleTeachMe = async () => {
    // Stop active speech first
    if (audioControllerRef.current) {
      audioControllerRef.current.stop();
      audioControllerRef.current = null;
    }
    setAudioState("idle");
    setSpeakingMsgIndex(null);

    const clean = cleanSubjectName(subjectName);
    const activePageTitle = getPageTitle(currentPage);
    const aims = getCategoryAims().join("\n* ");
    const objs = getObjectivesForPage(currentPage - 8);

    let contentSummary = "";
    if (currentPage === 1) {
      contentSummary = `Subject: ${clean}, Code: ${subjectCode}, Years: ${yearRange}, Cover Page.`;
    } else if (currentPage === 2) {
      contentSummary = `Philosophy, pathway, and Cambridge Learner Attributes: confident, responsible, reflective, innovative, engaged. Duke University endorsement of rigour.`;
    } else if (currentPage === 3) {
      contentSummary = `Table of Contents. Chapters: ${objectives.map(o => `Chapter ${o.code}: ${o.title}`).join(", ")}.`;
    } else if (currentPage === 4) {
      contentSummary = `Educational Aims:\n* ${aims}`;
    } else if (currentPage === 5) {
      contentSummary = `Curriculum Content Overview. Chapters:\n${objectives.map(o => `* Chapter ${o.code}: ${o.title} - ${o.description}`).join("\n")}`;
    } else if (currentPage === 6) {
      contentSummary = `Details of the Assessment: tiered paper structure, core vs extended, durations, marks, and percentage weightings.`;
    } else if (currentPage === 7) {
      contentSummary = `Assessment Objectives: AO1 (Knowledge with understanding), AO2 (Handling information and problem solving), AO3 (Experimental skills and investigation) if applicable, and weightings.`;
    } else if (currentPage >= 8 && currentPage <= 13) {
      if (objs.length > 0) {
        contentSummary = `Subject Content Guide:\n${objs.map(o => `Chapter ${o.code}: ${o.title}\nDescription: ${o.description}\nSub-topics:\n${o.subObjectives?.map(so => `- ${so.code} ${so.title}: ${so.description}`).join("\n")}`).join("\n\n")}`;
      } else {
        contentSummary = `Syllabus Review and Conventions: Command words (explain, describe, calculate, estimate), units, mathematical conventions, and three significant figures rules.`;
      }
    }

    setAiChatOpen(true);
    setIsTyping(true);

    try {
      const systemPrompt = `You are a warm, expert IGCSE tutor with a cheery, bright, and encouraging personality. Your job is to teach students the syllabus content in a thorough, engaging, and easy-to-understand way, celebrating their curiosity! Never mention Gemini, Google, or any AI model names. If asked who you are, you are an expert human tutor on ExamGlow. Speak directly to the student. Do not use headers or bullet points — write in flowing, natural paragraphs as if you are speaking. Be extremely detailed and comprehensive.`;

      const userPrompt = `Teach me everything on Page ${currentPage} ("${activePageTitle}") of the IGCSE ${clean} (${subjectCode}) syllabus.

Page content:
${contentSummary}

Give a complete, long, detailed lesson covering every single concept, term, aim, sub-topic, and exam detail on this page. Include real-world examples to help understanding. Do not skip anything. Do not give a brief summary — teach every part fully.`;

      const explanationText = await groqAsk(systemPrompt, userPrompt, { max_tokens: 4096, temperature: 0.65 });

      setIsTyping(false);
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `🌸 **AI Tutor Lesson (Page ${currentPage})**:\n\n${explanationText}` }
      ]);

      setAudioState("speaking");
      audioControllerRef.current = speakSingleTurn(
        explanationText,
        "male",
        () => {},
        () => { setAudioState("idle"); }
      );
    } catch (err) {
      console.error("Teach Me generation failed", err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `❌ AI Tutor error: ${err instanceof Error ? err.message : "Unknown error"}.` }
      ]);
    }
  };

  // ── 45-Minute All-Pages AI Teaching Session (3 Professors) ──
  const handleAiTeach = async () => {
    // Stop any active session
    sessionIdRef.current++;
    const mySession = sessionIdRef.current;
    if (audioControllerRef.current) { audioControllerRef.current.stop(); audioControllerRef.current = null; }
    stopAllSpeech();
    if (teachTimerRef.current) clearInterval(teachTimerRef.current);
    setAudioState("idle");
    setSpeakingMsgIndex(null);
    setTeachTimer(null);
    setQaMode(false);
    setTeachingPageNum(null);

    setAiChatOpen(true);
    setMessages([{ role: "assistant", text: `🎓 **45-Minute Teaching Session**\nProf. Sophia Jones, Dr. Marcus Smith & Yumna Hassan (Visual Specialist) will now teach you every page of the IGCSE ${cleanName} syllabus. Sit back, listen, and learn!` }]);
    setAudioState("teaching");
    startTeachTimer(2700);

    for (let pg = 1; pg <= totalPages; pg++) {
      if (sessionIdRef.current !== mySession) break;

      // Advance the visible page
      setCurrentPage(pg);
      setTeachingPageNum(pg);

      // Page announcement
      setMessages(prev => [...prev, {
        role: "assistant",
        text: `\n📖 **Page ${pg} of ${totalPages}: ${getPageTitle(pg)}**`
      }]);

      // Generate script for this page
      let turns: TeachTurn[] = [];
      try {
        setIsTyping(true);
        const summary = buildPageContentSummary(pg);
        turns = await generatePageScript(pg, summary);
        setIsTyping(false);
      } catch (err) {
        setIsTyping(false);
        console.warn(`Page ${pg} script generation failed, using high-quality backup script`, err);
        turns = generateFallbackScript(pg);
      }

      if (!turns || turns.length === 0) {
        turns = generateFallbackScript(pg);
      }

      if (sessionIdRef.current !== mySession) break;

      // Play all speech turns sequentially using chained (no stopAllSpeech between pages)
      // Use playSpeechConversationChained from page 2 onwards so audio doesn't get killed
      await new Promise<void>((resolve) => {
        const playFn = pg === 1 ? playSpeechConversation : playSpeechConversationChained;
        const ctrl = playFn(
          turns,
          (speechIdx) => {
            if (sessionIdRef.current !== mySession) { ctrl.stop(); return; }
            const turn = turns[speechIdx];

            if (turn.isYumna || turn.speaker === "Yumna Hassan") {
              // Yumna's turn: speak and generate image
              const imageTopic = turn.imagePrompt || turn.text.split("showing")[1]?.trim() || "diagram";
              const imgUrl = buildImageUrl(imageTopic, cleanName);
              // Add Yumna's message card with the generated image and set active speaker to Yumna
              setMessages(prev => {
                const nextIdx = prev.length;
                setSpeakingMsgIndex(nextIdx);
                return [...prev, {
                  role: "yumna",
                  text: turn.text,
                  speaker: "Yumna Hassan",
                  imageUrl: imgUrl,
                }];
              });
            } else {
              // Professor's turn: speak and add to chat
              const role: "jones" | "smith" = turn.gender === "female" ? "jones" : "smith";
              setMessages(prev => {
                const nextIdx = prev.length;
                setSpeakingMsgIndex(nextIdx);
                return [...prev, {
                  role,
                  text: turn.text,
                  speaker: turn.speaker,
                }];
              });
            }
          },
          () => { resolve(); }
        );
        audioControllerRef.current = { stop: () => { ctrl.stop(); resolve(); } };
      });

      setSpeakingMsgIndex(null);
      if (sessionIdRef.current !== mySession) break;

      // Brief pause between pages
      await new Promise(r => setTimeout(r, 600));
    }

    if (sessionIdRef.current !== mySession) return;

    // All pages done — enter Q&A
    setAudioState("idle");
    setTeachingPageNum(null);
    if (teachTimerRef.current) clearInterval(teachTimerRef.current);
    setTeachTimer(null);
    setQaMode(true);
    setMessages(prev => [...prev, {
      role: "assistant",
      text: `✅ **Teaching Complete!** Prof. Jones & Dr. Smith have covered all ${totalPages} pages of the IGCSE ${cleanName} syllabus.\n\nDo you have any questions? Ask anything you’re unsure about and Dr. Smith will answer.`
    }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInputText("");
    setIsTyping(true);

    const controller = new AbortController();
    chatAbortRef.current = controller;

    const wantsLong = /long|detail|explain everything|full|comprehensive|elaborate/i.test(userMsg);
    const maxTok = wantsLong ? 2000 : 450;

    try {
      // In Q&A mode Dr. Smith answers in character; otherwise general tutor
      const systemPrompt = qaMode
        ? `You are Dr. Marcus Smith, a bright, cheery, and highly encouraging IGCSE professor who just finished teaching the entire ${cleanName} (code ${subjectCode}) syllabus. Never mention Gemini, Google, or any AI model names. The student is asking a follow-up question. Answer in character as Dr. Smith — warm, enthusiastic, friendly, and thorough. ${wantsLong ? "Give a detailed explanation." : "Keep your answer clear and concise, 2-5 sentences."}  Plain text only.`
        : `You are a cheery, friendly, and concise IGCSE tutor specialising in ${cleanName} (code ${subjectCode}), currently on Page ${currentPage} (${getPageTitle(currentPage)}). Never mention Gemini, Google, or any AI model names. Be warm and encouraging in your explanation. ${wantsLong ? "Give a thorough, detailed explanation." : "Keep your answer short — 2-4 sentences."}  Plain text only.`;

      const answer = await groqAsk(systemPrompt, userMsg, { max_tokens: maxTok, temperature: 0.65, signal: controller.signal });

      if (controller.signal.aborted) return;
      chatAbortRef.current = null;

      // In Q&A mode, show answer as Dr. Smith
      if (qaMode) {
        setMessages(prev => [...prev, { role: "smith", text: answer, speaker: "Dr. Marcus Smith" }]);
        // Speak the answer aloud as Dr. Smith (male voice)
        speakSingleTurn(answer, "male", () => {}, () => {});
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: answer }]);
      }
      setIsTyping(false);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      console.error("AI chat failed", err);
      setMessages(prev => [...prev, { role: "assistant", text: `❌ Could not reach AI: ${err instanceof Error ? err.message : "Unknown error"}.` }]);
      setIsTyping(false);
    }
  };

  const handleStopChat = () => {
    chatAbortRef.current?.abort();
    chatAbortRef.current = null;
    setIsTyping(false);
  };

  const handleStopAudio = () => {
    // Invalidate any running teaching session
    sessionIdRef.current++;
    if (audioControllerRef.current) {
      audioControllerRef.current.stop();
      audioControllerRef.current = null;
    }
    setAudioState("idle");
    setSpeakingMsgIndex(null);
    setTeachingPageNum(null);
    if (teachTimerRef.current) clearInterval(teachTimerRef.current);
    setTeachTimer(null);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/95 flex flex-col animate-fade-in font-sans">
      {/* Top Controls Toolbar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-3 text-white shrink-0 shadow-md">
        <div className="flex items-center gap-2 min-w-0 max-w-[35%] sm:max-w-none">
          <FileText className="w-4.5 h-4.5 text-red-400 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold truncate text-slate-100">{cleanName}</h3>
            <p className="text-[8px] sm:text-[10px] text-slate-400 truncate">
              Pg {currentPage} ({getPageTitle(currentPage)})
            </p>
          </div>
        </div>

        {/* Toolbar Middle: Navigation & Zoom */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-0.5 bg-slate-900/60 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 sm:p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] sm:text-xs px-1 sm:px-2.5 font-mono min-w-[2.8rem] sm:min-w-[3.5rem] text-center">
              P. {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 sm:p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>


        </div>

        {/* Toolbar Action / Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {audioState !== "idle" && (
            <button
              onClick={handleStopAudio}
              className="flex items-center gap-1 px-2 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Stop speech"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Stop</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded hover:bg-slate-700 transition-colors hidden md:block cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-slate-700 transition-colors hidden md:block cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-4.5 h-4.5" />
          </button>
          <div className="h-6 w-px bg-slate-700 mx-0.5 hidden md:block" />
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-8 flex bg-slate-800 relative">
        <div
          style={{
            width: `${800 * activeScale}px`,
            height: `${1100 * activeScale}px`,
            position: "relative",
            margin: "auto",
            transition: "width 0.3s ease, height 0.3s ease",
          }}
        >
          <div 
            className="bg-white shadow-2xl absolute left-0 top-0 select-text transition-all duration-300 origin-top-left flex flex-col justify-between"
            style={{ 
              width: "800px", 
              height: "1100px",
              transform: `scale(${activeScale})`,
            }}
          >
            {/* Document Content Pages */}
          <div className="p-12 flex-1 flex flex-col justify-between text-slate-850">
            {/* Page Rendering based on currentPage state */}
            <>
              {currentPage === 1 && (
                /* PAGE 1: COVER PAGE */
                <div className="h-full flex flex-col justify-between relative flex-1 text-slate-800">
                  <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {cleanName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">IGCSE</h4>
                        <p className="text-[9px] text-slate-450 uppercase tracking-wider leading-none mt-0.5">{cleanName} {subjectCode}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Syllabus {yearRange}</span>
                  </div>

                  <div className="my-auto relative p-10 border-4 border-amber-500 rounded-br-[120px] rounded-tl-[120px] bg-amber-50/5 flex flex-col justify-center min-h-[500px]">
                    <h1 className="text-2xl font-semibold text-slate-500 tracking-wide uppercase">Syllabus</h1>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight mt-2 leading-none">
                      Cambridge IGCSE™
                    </h2>
                    <h3 className="text-4xl font-extrabold text-amber-600 mt-2 leading-tight">
                      {cleanName} {subjectCode}
                    </h3>
                    <p className="text-sm font-semibold text-slate-700 mt-6 max-w-md leading-relaxed font-serif">
                      Use this syllabus for exams in {yearRange}.<br />
                      Exams are available in the June and November series.<br />
                      Exams are also available in the March series in India.
                    </p>
                    <p className="text-xs text-slate-450 mt-4">
                      Syllabus Version 3 (Published May 2024)
                    </p>

                    {/* Dynamic Vector Illustration Box */}
                    <div className="absolute bottom-6 right-6 w-48 h-48 rounded-2xl border border-slate-100/50 flex items-center justify-center bg-white/60 p-4 shadow-inner">
                      {renderIllustration()}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Cambridge Assessment International Education</span>
                    <span>Page 1 of {totalPages}</span>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                /* PAGE 2: WHY CHOOSE THIS SYLLABUS */
                <div className="h-full flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-150 pb-2.5">Why choose Cambridge International?</h2>
                    <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed font-serif">
                      <p>
                        <strong>Cambridge International</strong> prepares school students for life, helping them develop an informed curiosity and a lasting passion for learning. We are part of Cambridge University Press & Assessment, which is a department of the University of Cambridge.
                      </p>
                      <p>
                        Our <strong>Cambridge Pathway</strong> gives students a clear path for educational success from age 5 to 19. Schools can shape the curriculum around how they want students to learn – with a wide range of subjects and flexible ways to offer them. It helps students discover new abilities and a wider world, and gives them the skills they need for life, so they can achieve at school, university and work.
                      </p>
                      <p>
                        Our programmes and qualifications set the global standard for international education. They are created by subject experts, rooted in academic rigour and reflect the latest educational research. They provide a strong platform for learners to progress from one stage to the next, and are well supported by teaching and learning resources.
                      </p>
                      <p>
                        Our mission is to provide educational benefit through provision of international programmes and qualifications for school education and to be the world leader in this field. Together with schools, we develop Cambridge learners who are <strong>confident, responsible, reflective, innovative and engaged</strong> – equipped for success in the modern world.
                      </p>
                      
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 font-sans my-4 italic text-slate-650">
                        "We think the Cambridge curriculum is superb preparation for university."
                        <div className="text-[10px] font-bold text-slate-500 mt-1 not-italic">
                          — Christoph Guttentag, Dean of Undergraduate Admissions, Duke University, USA
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 font-sans my-4">
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Quality Management</h4>
                        <p className="text-[11px] text-slate-600 mt-1 font-serif">
                          Our quality management system is certified under standard <strong>ISO 9001:2015</strong>. Learn more at www.cambridgeinternational.org/ISO9001
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                    <span>© Cambridge University Press & Assessment September 2022</span>
                    <span>Page 2 of {totalPages}</span>
                  </div>
                </div>
              )}

              {currentPage === 3 && (
                /* PAGE 3: CONTENTS */
                <div className="h-full flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-150 pb-2.5">Contents</h2>
                    <div className="mt-6 space-y-3 font-sans text-xs">
                      {[
                        { title: "Why choose Cambridge International?", page: 2 },
                        { title: "1 Why choose this syllabus?", page: 4 },
                        { title: "2 Syllabus overview", page: 5 },
                        { title: "   • Aims", page: 4 },
                        { title: "   • Content overview", page: 5 },
                        { title: "   • Assessment overview", page: 6 },
                        { title: "   • Assessment objectives", page: 7 },
                        { title: "3 Subject content directory", page: 8 },
                        { title: "   • Core curriculum chapters (Pages 8 - 10)", page: 8 },
                        { title: "   • Extended curriculum guide (Pages 11 - 13)", page: 11 },
                        { title: "4 Details of the assessment", page: 6 },
                        { title: "5 What else you need to know", page: 2 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-end group">
                          <button 
                            onClick={() => setCurrentPage(item.page)}
                            className="text-left font-semibold text-slate-700 hover:text-amber-600 cursor-pointer"
                          >
                            {item.title}
                          </button>
                          <div className="flex-1 border-b border-dotted border-slate-200 mx-2 mb-1" />
                          <span className="font-mono text-slate-400">{item.page}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                    <span>Syllabus Table of Contents</span>
                    <span>Page 3 of {totalPages}</span>
                  </div>
                </div>
              )}

              {currentPage === 4 && (
                /* PAGE 4: AIMS OF THE CURRICULUM */
                <div className="h-full flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-150 pb-2.5">1 Why choose this syllabus?</h2>
                    <div className="mt-6 space-y-6 text-xs text-slate-700 leading-relaxed font-serif">
                      <div>
                        <h3 className="font-sans font-bold text-slate-900 text-sm mb-1.5">Aims</h3>
                        <p>
                          The aims describe the purposes of a course based on this syllabus. The aims are to enable students to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2 font-sans text-xs">
                          {getCategoryAims().map((aim, idx) => (
                            <li key={idx}>{aim}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl font-sans mt-4">
                        <h4 className="text-xs font-bold text-slate-800">Cambridge Learner Attributes</h4>
                        <p className="text-[11px] text-slate-655 mt-1 leading-relaxed">
                          Our curriculum develops learners who are confident, responsible, reflective, innovative, and engaged. It provides a platform to progress to university, careers and long term success.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                    <span>Syllabus Aims & Learner Attributes</span>
                    <span>Page 4 of {totalPages}</span>
                  </div>
                </div>
              )}

              {currentPage === 5 && (
                /* PAGE 5: CONTENT OVERVIEW */
                <div className="h-full flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-150 pb-2.5">2 Syllabus overview</h2>
                    <div className="mt-6 space-y-4">
                      <h3 className="text-sm font-bold text-slate-800">Content overview</h3>
                      <p className="text-xs text-slate-600 font-serif leading-relaxed">
                        The course covers a broad range of key concepts, analytical tools, and practical exercises. Below is the main outline of the curriculum chapters:
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {objectives.length > 0 ? (
                          objectives.map((obj) => (
                            <div key={obj.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <span className="text-[10px] font-bold text-amber-600 font-mono">Chapter {obj.code}</span>
                              <h4 className="font-bold text-xs text-slate-800 leading-tight mt-0.5">{obj.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-normal truncate">{obj.description}</p>
                            </div>
                          ))
                        ) : (
                          // Fallback chapters
                          [1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <span className="text-[10px] font-bold text-amber-600 font-mono">Module {i}</span>
                              <h4 className="font-bold text-xs text-slate-800 leading-tight mt-0.5">Core Syllabus Area {i}</h4>
                              <p className="text-[10px] text-slate-500 mt-1 leading-normal">General knowledge, definitions and case calculations.</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                    <span>Syllabus Content Overview</span>
                    <span>Page 5 of {totalPages}</span>
                  </div>
                </div>
              )}

              {currentPage === 6 && (
                /* PAGE 6: ASSESSMENT OVERVIEW */
                <div className="h-full flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-150 pb-2.5">Details of the assessment</h2>
                    <div className="mt-6 space-y-6">
                      <p className="text-xs text-slate-700 font-serif leading-relaxed">
                        All candidates take the following components. The assessment structure is tiered to provide appropriate differentiation and allows candidates of all abilities to demonstrate their knowledge.
                      </p>
                      
                      <div className="overflow-hidden rounded-xl border border-slate-200">
                        {renderAssessmentTable()}
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-155 text-xs text-slate-650 leading-relaxed font-sans">
                        <p className="font-bold text-slate-800">Assessment Availability & Conventions:</p>
                        <ul className="list-disc pl-4 space-y-1.5 mt-1 text-[11px]">
                          <li>Exams are available in the June and November series.</li>
                          <li>Exams are also available in the March series in India.</li>
                          <li>Candidates must answer in clean English using correct command guidelines.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                    <span>Assessment Components</span>
                    <span>Page 6 of {totalPages}</span>
                  </div>
                </div>
              )}

              {currentPage === 7 && (
                /* PAGE 7: ASSESSMENT OBJECTIVES (AO) */
                <div className="h-full flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-150 pb-2.5">Assessment objectives</h2>
                    <div className="mt-6 space-y-5">
                      <p className="text-xs text-slate-700 font-serif leading-relaxed">
                        The assessment objectives (AOs) detail what candidates are expected to demonstrate in the examinations. Below are the key AOs and their weightings:
                      </p>
                      
                      <div className="overflow-hidden rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                            <tr>
                              <th className="p-3">Objective</th>
                              <th className="p-3">Description</th>
                              <th className="p-3">Weight</th>
                            </tr>
                          </thead>
                          {renderAssessmentObjectives()}
                        </table>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-155 bg-amber-50/10 text-xs text-slate-655 leading-relaxed">
                        <span className="font-bold text-slate-850 block">Note for Candidates:</span>
                        Weightings indicate the distribution of marks across papers. Practice questions should target higher-weighted objectives to maximize final grade achievements.
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                    <span>Assessment Objectives Weightings</span>
                    <span>Page 7 of {totalPages}</span>
                  </div>
                </div>
              )}

              {currentPage >= 8 && currentPage <= 13 && (
                /* PAGES 8-13: SUBJECT CONTENT GUIDE */
                <div className="h-full flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-150 pb-2.5">3 Subject content guide</h2>
                    <div className="mt-6 space-y-4">
                      {(() => {
                        const pageIdx = currentPage - 8;
                        const pageObjs = getObjectivesForPage(pageIdx);
                        
                        if (pageObjs.length > 0) {
                          return (
                            <div className="space-y-6">
                              {pageObjs.map((obj) => (
                                <div key={obj.id} className="space-y-3">
                                  <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-mono font-bold text-[10px]">
                                      Chapter {obj.code}
                                    </span>
                                    <h3 className="font-bold text-sm text-slate-850">{obj.title}</h3>
                                  </div>
                                  <p className="text-xs text-slate-500 font-serif leading-relaxed italic">{obj.description}</p>
                                  
                                  <div className="overflow-hidden rounded-xl border border-slate-200 mt-2.5">
                                    <table className="w-full text-left text-[11px] font-sans">
                                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                                        <tr>
                                          <th className="p-2 border-r border-slate-200 w-[40%]">Syllabus Outcome</th>
                                          <th className="p-2">Details / Examples</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 bg-white text-slate-655">
                                        {obj.subObjectives && obj.subObjectives.length > 0 ? (
                                          obj.subObjectives.map((so) => (
                                            <tr key={so.id}>
                                              <td className="p-2 border-r border-slate-200 font-bold text-slate-800">
                                                {so.code} {so.title}
                                              </td>
                                              <td className="p-2 font-serif text-[10px] leading-relaxed">
                                                {so.description}
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td className="p-2 border-r border-slate-200 font-bold text-slate-800">
                                              Core Outline
                                            </td>
                                            <td className="p-2 font-serif text-[10px] leading-relaxed">
                                              Candidates should be able to define, outline, compute and evaluate principles of {obj.title}.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          // Review guides for later pages if they exceed actual chapters count
                          return (
                            <div className="space-y-4">
                              <h3 className="font-bold text-sm text-slate-855 flex items-center gap-1.5">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                Syllabus Review & Examination Conventions
                              </h3>
                              <p className="text-xs text-slate-600 font-serif leading-relaxed">
                                Candidates are expected to know the standard notations, units, and formatting conventions for final assessment. Review lists include:
                              </p>

                              <div className="space-y-3 font-sans text-xs mt-3">
                                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                                  <strong className="text-slate-855 block">Command Words Guidelines</strong>
                                  <p className="text-[10px] text-slate-500 mt-1">
                                    Understand verbs like 'Explain' (show reasoning), 'Describe' (provide facts), 'Calculate' (show calculation workings) to prevent losing method marks.
                                  </p>
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                                  <strong className="text-slate-855 block">Standard Conventions</strong>
                                  <p className="text-[10px] text-slate-500 mt-1">
                                    Always write answers to three significant figures unless specified, and state final quantities with their respective SI units clearly.
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                    <span>Syllabus Content Details</span>
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>

      {/* Floating AI Bot Panel in Bottom Right */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[250] flex flex-col items-end max-w-[calc(100vw-1.5rem)] sm:max-w-none">
        {/* Chat Pane */}
        {aiChatOpen && (
          <div className="w-[calc(100vw-1.5rem)] sm:w-96 h-[410px] sm:h-[480px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-slide-up animate-duration-200">
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-purple-600 text-white flex justify-between items-center shrink-0 shadow-md">
              <div className="flex items-center gap-2 min-w-0">
                {qaMode ? <MessageCircleQuestion className="w-5 h-5 shrink-0" /> : <Bot className="w-5 h-5 shrink-0" />}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold leading-none truncate">
                    {qaMode ? "Q&A with Dr. Smith" : `AI Tutor: ${cleanName}`}
                  </h4>
                  <p className="text-[10px] text-white/80 mt-1">
                    {teachingPageNum !== null
                      ? `Teaching Page ${teachingPageNum} of ${totalPages}…`
                      : qaMode
                      ? "Ask anything — Dr. Smith will answer aloud"
                      : `Syllabus Helper — Page ${currentPage}`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAiChatOpen(false)} 
                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Toolbar + Timer */}
            <div className="bg-slate-50 border-b border-slate-100 p-2 flex flex-col gap-1.5 shrink-0">
              <div className="flex gap-2">
                <button 
                  onClick={handleTeachMe}
                  className={`flex-1 py-1.5 px-3 bg-white border border-slate-200 hover:border-primary/30 rounded-xl text-xs font-bold text-slate-700 hover:text-primary flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    audioState === "speaking" ? "ring-2 ring-primary bg-primary/5 text-primary" : ""
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Teach Me This</span>
                </button>
                <button 
                  onClick={handleAiTeach}
                  disabled={audioState === "teaching"}
                  className={`flex-1 py-1.5 px-3 bg-white border border-slate-200 hover:border-purple-400/50 rounded-xl text-xs font-bold text-slate-700 hover:text-purple-700 flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    audioState === "teaching" ? "ring-2 ring-purple-500 bg-purple-50 text-purple-700" : ""
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-purple-500" />
                  <span>{audioState === "teaching" ? "Teaching..." : "AI Teach Session"}</span>
                </button>
              </div>
              {/* 5-minute countdown timer */}
              {teachTimer !== null && (
                <div className="flex items-center justify-between gap-1 bg-purple-50 border border-purple-100 rounded-xl py-1.5 px-2.5">
                  <button
                    onClick={() => adjustTimer(-300)}
                    title="Remove 5 minutes (warning: AIs may rush)"
                    className="w-6 h-6 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    {teachingPageNum !== null && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-md">
                        Pg {teachingPageNum}/{totalPages}
                      </span>
                    )}
                    <span className={`text-[14px] font-black font-mono ${
                      teachTimer <= 60 ? "text-red-600 animate-pulse" : "text-purple-800"
                    }`}>{formatTimer(teachTimer)}</span>
                    <span className="text-[9px] text-purple-400">/ 40:00</span>
                  </div>
                  <button
                    onClick={() => adjustTimer(300)}
                    title="Add 5 minutes"
                    className="w-6 h-6 rounded-lg bg-white border border-green-200 text-green-600 hover:bg-green-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#fcfcfc]">
              {messages.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-[11px] leading-relaxed">
                    Ask a question, click <strong>Teach Me This</strong> for a solo lesson,<br/>
                    or <strong>AI Teach Session</strong> for a full 40-min walkthrough<br/>
                    where Prof. Sophia &amp; Dr. Smith teach every page!
                  </p>
                </div>
              )}
              
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                const isSmith = msg.role === "smith";
                const isJones = msg.role === "jones";
                const isYumna = msg.role === "yumna";
                
                // During teaching mode: hide Sophia/Marcus dialogue bubbles (shown in immersive card)
                // but SHOW Yumna's image cards in the stream
                if (audioState === "teaching" && (isSmith || isJones)) {
                  return null;
                }
                
                let bgClass = "bg-slate-100 text-slate-800";
                let alignClass = "justify-start";
                let label = msg.speaker || "AI Tutor";

                if (isUser) {
                  bgClass = "bg-primary text-white";
                  alignClass = "justify-end";
                  label = "You";
                } else if (isSmith) {
                  bgClass = "bg-blue-50 text-blue-900 border border-blue-100";
                } else if (isJones) {
                  bgClass = "bg-rose-50 text-rose-900 border border-rose-100";
                } else if (isYumna) {
                  bgClass = "bg-purple-50 text-purple-900 border border-purple-200";
                  label = "Yumna Hassan 🎨";
                }

                // Highlight the active turn while speaking
                const isActiveSpeaking = speakingMsgIndex !== null && idx === speakingMsgIndex && (isSmith || isJones);
                const isTutorSpeaking = msg.role === "assistant" && audioState === "speaking" && idx === messages.length - 1;
                const isYumnaActive = isYumna && speakingMsgIndex !== null && idx === speakingMsgIndex;

                return (
                  <div key={idx} className={`flex ${alignClass} items-end gap-2 animate-fade-in`}>
                    <div className="max-w-[87%] min-w-[80px]">
                      <span className="text-[9px] text-slate-400 font-bold block mb-0.5 ml-1">
                        {label} {(isActiveSpeaking || isTutorSpeaking) && <span className="text-amber-500">🗣️</span>}
                      </span>
                      <div className={`px-3 py-2 rounded-2xl text-[11px] leading-[1.55] shadow-sm ${bgClass} ${
                        (isActiveSpeaking || isTutorSpeaking) ? "ring-2 ring-amber-400" :
                        isYumnaActive ? "ring-2 ring-purple-400" : ""
                      }`}>
                        {renderStructuredContent(msg.text)}
                      </div>
                      {/* Inline image if this turn has a visual */}
                      {msg.imageUrl && (
                        <div className={`mt-1.5 rounded-xl overflow-hidden shadow-sm ${
                          isYumna ? "border-2 border-purple-200" : "border border-slate-200"
                        }`}>
                          <img
                            src={msg.imageUrl}
                            alt="Educational diagram"
                            className="w-full object-cover max-h-48"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                          />
                          <p className={`text-[9px] text-center py-1 ${
                            isYumna ? "bg-purple-50 text-purple-500 font-semibold" : "bg-slate-50 text-slate-400"
                          }`}>{isYumna ? "🎨 Yumna's visual diagram" : "AI-generated visual aid"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl text-xs italic">
                    AI is writing response...
                  </div>
                </div>
              )}
              {/* Active Speaker Immersive Card during Teaching */}
              {audioState === "teaching" && speakingMsgIndex !== null && (
                (() => {
                  const activeMsg = messages[speakingMsgIndex];
                  if (!activeMsg) return null;

                  const isYumnaActive = activeMsg.role === "yumna";
                  const isSophia = activeMsg.role === "jones";
                  const isMarcus = activeMsg.role === "smith";

                  return (
                    <div className="mx-3 mb-3 bg-slate-50 border border-slate-200/85 rounded-2xl p-4 flex flex-col gap-4 shadow-sm select-none animate-fade-in">
                      {/* Three Teachers Side-by-Side */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Sophia Jones Card */}
                        <div className={`p-2.5 rounded-xl border transition-all duration-300 flex flex-col items-center text-center ${
                          isSophia
                            ? "bg-white border-rose-400 shadow-md shadow-rose-100 scale-[1.04] ring-1 ring-rose-300"
                            : "bg-slate-100/60 border-slate-200 opacity-55 scale-100"
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm relative ${
                            isSophia ? "bg-rose-500 text-white animate-pulse" : "bg-slate-400 text-white"
                          }`}>
                            SJ
                            {isSophia && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                              </span>
                            )}
                          </div>
                          <h5 className="text-[10px] font-bold text-slate-800 mt-1.5 leading-tight">Prof. Sophia Jones</h5>
                          <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">Analogies</span>
                          {isSophia && (
                            <div className="flex items-center gap-0.5 h-3 px-1 bg-rose-50 rounded-md border border-rose-100 mt-1.5">
                              <span className="w-0.5 bg-rose-500 rounded-full h-1.5" style={{ animation: "wave 1.2s ease-in-out infinite alternate" }} />
                              <span className="w-0.5 bg-rose-500 rounded-full h-2.5" style={{ animation: "wave 0.8s ease-in-out infinite alternate 0.2s" }} />
                              <span className="w-0.5 bg-rose-500 rounded-full h-1" style={{ animation: "wave 1.0s ease-in-out infinite alternate 0.4s" }} />
                            </div>
                          )}
                        </div>

                        {/* Marcus Smith Card */}
                        <div className={`p-2.5 rounded-xl border transition-all duration-300 flex flex-col items-center text-center ${
                          isMarcus
                            ? "bg-white border-blue-400 shadow-md shadow-blue-100 scale-[1.04] ring-1 ring-blue-300"
                            : "bg-slate-100/60 border-slate-200 opacity-55 scale-100"
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm relative ${
                            isMarcus ? "bg-blue-500 text-white animate-pulse" : "bg-slate-400 text-white"
                          }`}>
                            MS
                            {isMarcus && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                              </span>
                            )}
                          </div>
                          <h5 className="text-[10px] font-bold text-slate-800 mt-1.5 leading-tight">Dr. Marcus Smith</h5>
                          <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">Exam Insights</span>
                          {isMarcus && (
                            <div className="flex items-center gap-0.5 h-3 px-1 bg-blue-50 rounded-md border border-blue-100 mt-1.5">
                              <span className="w-0.5 bg-blue-500 rounded-full h-1.5" style={{ animation: "wave 1.2s ease-in-out infinite alternate" }} />
                              <span className="w-0.5 bg-blue-500 rounded-full h-2.5" style={{ animation: "wave 0.8s ease-in-out infinite alternate 0.2s" }} />
                              <span className="w-0.5 bg-blue-500 rounded-full h-1" style={{ animation: "wave 1.0s ease-in-out infinite alternate 0.4s" }} />
                            </div>
                          )}
                        </div>

                        {/* Yumna Hassan Card */}
                        <div className={`p-2.5 rounded-xl border transition-all duration-300 flex flex-col items-center text-center ${
                          isYumnaActive
                            ? "bg-white border-purple-400 shadow-md shadow-purple-100 scale-[1.04] ring-1 ring-purple-300"
                            : "bg-slate-100/60 border-slate-200 opacity-55 scale-100"
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm relative ${
                            isYumnaActive ? "bg-purple-500 text-white animate-pulse" : "bg-slate-400 text-white"
                          }`}>
                            YH
                            {isYumnaActive && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
                              </span>
                            )}
                          </div>
                          <h5 className="text-[10px] font-bold text-slate-800 mt-1.5 leading-tight">Yumna Hassan</h5>
                          <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">Visuals</span>
                          {isYumnaActive && (
                            <div className="flex items-center gap-0.5 h-3 px-1 bg-purple-50 rounded-md border border-purple-100 mt-1.5">
                              <span className="text-[7px] text-purple-500 font-bold">🖼️ gen...</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Persistent Main Active Visual Aid / Diagram */}
                      {(() => {
                        const sessionImages = messages.filter(m => m.imageUrl);
                        const latestImageMsg = sessionImages.at(-1);
                        if (!latestImageMsg) return null;

                        return (
                          <div className="flex flex-col gap-3">
                            <div
                              onClick={() => setLightboxUrl(latestImageMsg.imageUrl!)}
                              className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white animate-scale-up cursor-pointer hover:border-primary/45 transition-colors relative group"
                            >
                              <VisualAidImage src={latestImageMsg.imageUrl!} alt={latestImageMsg.text || "Educational illustration"} />
                              <div className="text-[9px] text-center text-slate-500 py-1.5 bg-slate-50 font-semibold border-t border-slate-100 flex items-center justify-center gap-1.5 group-hover:text-primary transition-colors">
                                <span>{isYumnaActive ? "🎨 Yumna is generating a new visual... — click to expand" : "🔍 Click diagram to expand view"}</span>
                              </div>
                            </div>

                            {/* Horizontal Scrollable Gallery of all generated diagrams so far */}
                            {sessionImages.length > 0 && (
                              <div className="flex flex-col gap-1.5 border-t border-slate-200/60 pt-3">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                  🎨 Yumna's Visual Gallery ({sessionImages.length})
                                </span>
                                <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                                  {sessionImages.map((imgMsg, idx) => {
                                    const isCurrent = imgMsg === latestImageMsg;
                                    return (
                                      <div
                                        key={idx}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setLightboxUrl(imgMsg.imageUrl!);
                                        }}
                                        className={`flex-shrink-0 w-36 rounded-xl overflow-hidden border transition-all duration-200 bg-white cursor-pointer relative group ${
                                          isCurrent ? "border-purple-450 ring-2 ring-purple-100 scale-[0.98]" : "border-slate-200 hover:border-purple-300"
                                        }`}
                                      >
                                        <div className="relative aspect-video bg-slate-50 flex items-center justify-center overflow-hidden">
                                          <img
                                            src={imgMsg.imageUrl}
                                            alt="Visual aid"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                                          />
                                          {isCurrent && (
                                            <div className="absolute inset-0 bg-purple-500/5 flex items-center justify-center">
                                              <span className="bg-purple-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Active</span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="text-[7.5px] text-center text-slate-500 py-1 bg-slate-50 font-semibold border-t border-slate-100 truncate px-2 group-hover:text-primary transition-colors">
                                          {imgMsg.text.slice(0, 30) || "Concept Diagram"}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      <style>{`
                        @keyframes wave {
                          0% { height: 4px; }
                          100% { height: 12px; }
                        }
                      `}</style>
                    </div>
                  );
                })()
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about exam structure or topics..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/5 transition-all text-slate-800"
              />
              {isTyping ? (
                <button
                  type="button"
                  onClick={handleStopChat}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center cursor-pointer animate-pulse"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="p-2 bg-primary hover:bg-primary/95 text-white rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Circular Floating Bubble Trigger */}
        <button
          onClick={() => setAiChatOpen(v => !v)}
          className="w-14 h-14 bg-gradient-to-tr from-primary to-purple-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-50 group border-2 border-white"
          title="Open AI Tutor"
        >
          {aiChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 animate-pulse" />
              {audioState !== "idle" && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* Lightbox Expanded Image Overlay */}
      {lightboxUrl && (
        <div 
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer border border-white/10 z-[110]"
            title="Close expanded view"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxUrl}
              alt="Expanded educational diagram"
              className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl animate-scale-up"
            />
            <p className="text-white/60 text-xs mt-4 tracking-wider uppercase font-semibold">
              Expanded View · click anywhere or close to return
            </p>
          </div>
        </div>
      )}

      {/* Floating Canvas Zoom Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[240] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-xl">
        <button
          onClick={() => setZoom((z) => Math.max(50, z - 10))}
          disabled={zoom === 50}
          className="p-1.5 rounded-full hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-semibold px-2 min-w-[3.2rem] text-center text-white">{zoom}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(250, z + 10))}
          disabled={zoom === 250}
          className="p-1.5 rounded-full hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Syllabus Page Component ──────────────────────────────────────────────
function SyllabusPage() {
  const { subjectId } = Route.useParams();
  const syllabusData = getSyllabusData(subjectId);
  const [activePdf, setActivePdf] = useState<{ yearRange: string; fileName: string } | null>(null);

  if (!syllabusData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
        <Header authed />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-sans text-2xl font-extrabold text-slate-800">Subject Not Found</h1>
            <p className="text-slate-450 text-sm mt-2">
              The syllabus you're looking for doesn't exist.
            </p>
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 mt-5 text-primary font-bold text-xs bg-slate-100 px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Subject Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { subject } = syllabusData;
  const cleanName = cleanSubjectName(subject.name);

  // Hardcoded standard overview bullets for math or generic fallback
  const isMath = subject.code.includes("0580") || subject.name.toLowerCase().includes("math");
  
  const descriptionText = isMath
    ? "Mathematics encourages learners to develop their mathematical ability as a key life skill, and as a strong basis for further study of mathematics or to support skills in other subjects."
    : `${cleanName} encourages learners to develop their knowledge, competency, and understanding of the subject as a key life skill, and as a strong basis for further academic studies.`;

  const bulletPoints = isMath
    ? [
        "develops learners' competency, confidence, and fluency in their use of techniques with and without the use of a calculator, cultivating mathematical understanding.",
        "develops learners’ feel for quantity, patterns, and relationships, encouraging learners’ reasoning and analytical skills.",
        "places a strong emphasis on solving problems in mathematics and real-life contexts.",
        "promotes appropriate presentation and interpretation of results, encouraging learners’ understanding of how to communicate and reason mathematically.",
        "is tiered to allow candidates of all abilities to achieve and progress in their mathematical studies."
      ]
    : [
        "develops learners' knowledge, understanding, and practical skills in the subject domain.",
        "promotes critical thinking, logical reasoning, and analytical skills in real-world contexts.",
        "encourages learners to communicate ideas, facts, and opinions clearly and effectively.",
        "provides a solid foundation for further studies and vocational opportunities."
      ];

  const pdfList = [
    { yearRange: "2025 - 2027", fileName: `${cleanName.replace(/\s+/g, "_")}_2025-2027_Syllabus.pdf`, size: "1MB" },
    { yearRange: "2025 - 2027 update", fileName: `${cleanName.replace(/\s+/g, "_")}_2025-2027_Syllabus_update.pdf`, size: "157KB" },
    { yearRange: "2028 - 2030", fileName: `${cleanName.replace(/\s+/g, "_")}_2028-2030_Syllabus.pdf`, size: "1MB" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA] font-sans">
      <Header authed />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <Link
          to="/subjects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-primary mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </Link>

        {/* Syllabus Hero overview box exactly as screenshot */}
        <div className="bg-amber-50/10 border border-amber-100/50 rounded-[2rem] p-8 md:p-10 mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/5 filter blur-2xl pointer-events-none" />
          
          <p className="text-[10px] text-amber-600 font-extrabold uppercase tracking-widest mb-2">
            IGCSE Syllabus Overview
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {cleanName} ({subject.code})
          </h1>
          
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Syllabus overview
              </h2>
              <p className="text-sm text-slate-600 mt-3.5 leading-relaxed font-serif">
                {descriptionText}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">The syllabus:</p>
              <ul className="mt-3.5 space-y-3.5 pl-5 list-disc text-sm text-slate-600 font-serif leading-relaxed">
                {bulletPoints.map((bullet, idx) => (
                  <li key={idx} className="pl-1">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Syllabuses PDF List section with premium card design */}
        <div className="bg-white border border-slate-150 rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
              <FileText className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                Syllabuses
              </h2>
              <p className="text-xs text-slate-450 mt-0.5">
                The syllabus year refers to the year in which the examination will be taken.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pdfList.map((pdf, idx) => {
              const isUpdate = pdf.yearRange.toLowerCase().includes("update");
              const cleanYear = pdf.yearRange.replace(" update", "");
              
              return (
                <div
                  key={idx}
                  onClick={() => setActivePdf({ yearRange: pdf.yearRange, fileName: pdf.fileName })}
                  className="bg-slate-50/40 border border-slate-150 rounded-2xl p-5 hover:bg-white hover:border-red-250 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                >
                  {/* Top Color Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    {/* Header: Icon and Year Badge */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isUpdate 
                          ? "bg-amber-50 text-amber-700 border border-amber-100" 
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {cleanYear}
                      </span>
                    </div>

                    {/* Clean Title */}
                    <h3 className="font-bold text-slate-850 text-sm tracking-tight leading-tight group-hover:text-primary transition-colors duration-200">
                      {isUpdate ? "Syllabus Update Details" : "Official Syllabus Guide"}
                    </h3>
                    
                    {/* Size and info metadata (hiding raw internal file name) */}
                    <div className="mt-2">
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-serif">
                        <span className="font-sans font-semibold text-[10px] px-1 py-0.2 bg-slate-200/50 rounded text-slate-650 uppercase">PDF</span>
                        <span>{pdf.size} · Official Release</span>
                      </p>
                    </div>
                  </div>

                  {/* Read Link */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary">
                    <span className="group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                      Read Document <span className="font-sans">→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />

      {/* Embedded PDF Reader Modal */}
      {activePdf && (
        <SyllabusPDFReader
          subjectName={subject.name}
          subjectCode={subject.code}
          subjectId={subjectId}
          yearRange={activePdf.yearRange}
          fileName={activePdf.fileName}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}
