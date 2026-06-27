import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, X, BookOpen, FlaskConical, Atom, Calculator, Globe, Cpu,
  Type, TrendingUp, Briefcase, Scroll, Plus, GraduationCap, Sparkles,
  FileText, ExternalLink, Loader2, Bot, Send, Hand, Square, ChevronLeft,
  ChevronRight, ImageIcon, MessageCircle, ArrowLeft,
} from "lucide-react";
import { API_BASE } from "@/lib/api-client";
import { groqAsk } from "@/lib/groq-client";
import {
  speakSingleTurn, stopAllSpeech,
  playSpeechConversation, playSpeechConversationChained, type SpeechTurn,
} from "@/lib/speech-utils";

export const Route = createFileRoute("/subjects")({
  head: () => ({ meta: [{ title: "Cambridge IGCSE Syllabus Directory — ExamGlow" }] }),
  component: Subjects,
});

export const SUBJECT_LIST = [
  "Accounting - 0452","Accounting (9-1) - 0985","Afrikaans - Second Language - 0548",
  "Agriculture - 0600","Arabic - First Language - 0508","Arabic - First Language (9-1) - 7184",
  "Arabic - Foreign Language - 0544","Arabic (9-1) - 7180","Art & Design - 0400",
  "Art & Design (9-1) - 0989","Bahasa Indonesia - 0538","Biology - 0610",
  "Biology (9-1) - 0970","Business - 0264","Business (9-1) - 0774",
  "Business Studies - 0450","Business Studies (9-1) - 0986","Chemistry - 0620",
  "Chemistry (9-1) - 0971","Chinese - First Language - 0509","Chinese - Second Language - 0523",
  "Chinese (Mandarin) - Foreign Language - 0547","Commerce - 0715","Computer Science - 0478",
  "Computer Science (9-1) - 0984","Design & Technology - 0445","Design & Technology (9-1) - 0979",
  "Drama - 0411","Drama (9-1) - 0994","Economics - 0455","Economics (9-1) - 0987",
  "English - First Language - 0500","English - First Language (9-1) - 0990",
  "English - First Language (US) - 0524","English - Literature in English - 0475",
  "English - Literature in English (9-1) - 0992","English (as an Additional Language) - 0472",
  "English (as an Additional Language) (9-1) - 0772",
  "English (Core) as a Second Language (Egypt) - 0465",
  "English as a Second Language (Count-in speaking) - 0511",
  "English as a Second Language (Count-in Speaking) (9-1) - 0991",
  "English as a Second Language (Speaking endorsement) - 0510",
  "English as a Second Language (Speaking Endorsement) (9-1) - 0993",
  "Enterprise - 0454","Environmental Management - 0680","Food & Nutrition - 0648",
  "French - First Language - 0501","French - Foreign Language - 0520","French (9-1) - 7156",
  "Geography - 0460","Geography (9-1) - 0976","German - First Language - 0505",
  "German - Foreign Language - 0525","German (9-1) - 7159","Global Perspectives - 0457",
  "Hindi as a Second Language - 0549","History - 0470","History - American (US) - 0409",
  "History (9-1) - 0977","Information and Communication Technology - 0417",
  "Information and Communication Technology (9-1) - 0983","IsiZulu as a Second Language - 0531",
  "Islamiyat - 0493","Italian - Foreign Language - 0535","Latin - 0480",
  "Malay - First Language - 0696","Malay - Foreign Language - 0546","Marine Science - 0697",
  "Mathematics - 0580","Mathematics - Additional - 0606","Mathematics - International - 0607",
  "Mathematics (9-1) - 0980","Mathematics (US) - 0444","Music - 0410","Music (9-1) - 0978",
  "Pakistan Studies - 0448","Physical Education - 0413","Physical Education (9-1) - 0995",
  "Physical Science - 0652","Physics - 0625","Physics (9-1) - 0972",
  "Portuguese - First Language - 0504","Psychology - 0266","Religious Studies - 0490",
  "Sanskrit - 0499","Science - Combined - 0653","Sciences - Co-ordinated (9-1) - 0973",
  "Sciences - Co-ordinated (Double) - 0654","Setswana - First Language - 0698",
  "Sociology - 0495","Spanish - First Language - 0502","Spanish - Foreign Language - 0530",
  "Spanish - Literature in Spanish - 0474","Spanish (9-1) - 7160","Statistics - 0479",
  "Swahili - 0262","Thai - First Language - 0518","Travel & Tourism - 0471",
  "Turkish - First Language - 0513","Urdu as a Second Language - 0539",
  "Vietnamese - First Language - 0695","World Literature - 0408",
];

function getSubjectId(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g,"-").replace(/[()]/g,"")
    .replace(/&/g,"and").replace(/--/g,"-").replace(/^-+|-+$/g,"");
}
function getSubjectIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("biology")) return FlaskConical;
  if (n.includes("chemistry")) return FlaskConical;
  if (n.includes("physics") || n.includes("science")) return Atom;
  if (n.includes("mathematics") || n.includes("statistics")) return Calculator;
  if (n.includes("language") || n.includes("literature") || n.includes("english")) return Type;
  if (n.includes("history")) return Scroll;
  if (n.includes("geography")) return Globe;
  if (n.includes("computer") || n.includes("technology") || n.includes("ict")) return Cpu;
  if (n.includes("business") || n.includes("economics") || n.includes("accounting") || n.includes("commerce")) return TrendingUp;
  if (n.includes("enterprise") || n.includes("tourism")) return Briefcase;
  return BookOpen;
}
const ACCENT_COLORS = [
  "border-t-emerald-500","border-t-blue-500","border-t-amber-500","border-t-violet-500",
  "border-t-teal-500","border-t-pink-500","border-t-orange-500","border-t-indigo-500","border-t-rose-500",
];
const getNotesSubjectName = (name: string): string => {
  const codeMatch = name.match(/\s*-\s*(\d{4})$/);
  const code = codeMatch ? codeMatch[1] : "";
  const clean = name.replace(/\s*-\s*\d{4}/g,"").replace(/\s*\(9-1\)\s*/g,"").trim();
  if (clean.includes("Information and Communication Technology") || clean.includes("Computer Science"))
    return code ? `ICT/Computer Science - ${code}` : "ICT/Computer Science";
  return code ? `${clean} - ${code}` : clean;
};

// ── Types ────────────────────────────────────────────────────────────────────
interface SyllabusViewerState { subjectName: string; subjectCode: string; }

type ChatMsg = {
  role: "user" | "sophia" | "marcus" | "system";
  text: string;
  imageUrl?: string;
  imageReason?: string;
};

type TeachTurn = SpeechTurn & {
  imagePrompt?: string;
  imageReason?: string;
};

// Total "virtual pages" in a 1-hour class (6 segments × 10 min)
const TOTAL_PAGES = 6;

function buildImageUrl(topic: string): string {
  const prompt = encodeURIComponent(
    `Simple clear educational diagram: ${topic}. Plain white background, minimal labels, easy to understand for IGCSE students.`
  );
  return `https://image.pollinations.ai/prompt/${prompt}?width=640&height=400&nologo=true&seed=${Math.floor(Math.random()*9999)}`;
}

// ── AI script generator for one 10-min teaching segment ─────────────────────
async function generateSegmentScript(
  subjectName: string,
  subjectCode: string,
  segmentIndex: number,
  totalSegments: number
): Promise<TeachTurn[]> {
  const segments = [
    "Introduction & Overview — what the subject is, why it matters, key themes",
    "Core Concepts Part 1 — foundational theory and key definitions",
    "Core Concepts Part 2 — deeper principles and real-world connections",
    "Exam Structure & Assessment — paper types, weightings, command words",
    "Key Topics Deep Dive — most heavily tested areas and worked examples",
    "Exam Tips & Revision Strategy — common mistakes, time management, final advice",
  ];
  const topic = segments[segmentIndex] ?? `Part ${segmentIndex + 1}`;

  const system = `You are writing a natural educational podcast script for two professors teaching IGCSE ${subjectName} (${subjectCode}) to a student. Never mention AI, Gemini, Google, or model names.
Prof. Sophia Jones (female) — warm, uses real-world analogies.
Dr. Marcus Smith (male) — analytical, focused on exam technique.
Rules:
- Write 8 turns total alternating Sophia/Marcus.
- One turn (turn 5 or 6) must include an image request where the speaker says exactly: "Let me show you an image of [specific visual topic]" and the field imagePrompt contains the exact topic.
- The imageReason field for that turn explains in 1 sentence WHY this image helps.
- Output ONLY a raw JSON array, no markdown, no backticks.`;

  const user = `Write 8 teaching turns for Segment ${segmentIndex + 1} of ${totalSegments}: "${topic}" of IGCSE ${subjectName}.
JSON format (output array only):
[{"speaker":"Prof. Sophia Jones","gender":"female","text":"..."},
 {"speaker":"Dr. Marcus Smith","gender":"male","text":"..."},
 ...
 {"speaker":"Prof. Sophia Jones","gender":"female","text":"Let me show you an image of [topic].","imagePrompt":"[topic]","imageReason":"[why this image helps]"},
 ...]`;

  try {
    const raw = await groqAsk(system, user, { max_tokens: 2000, temperature: 0.72 });
    let json = raw.trim().replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    const s = json.indexOf("["); const e = json.lastIndexOf("]");
    if (s !== -1 && e > s) json = json.slice(s, e + 1);
    json = json.replace(/,\s*([\]}])/g, "$1");
    return JSON.parse(json) as TeachTurn[];
  } catch {
    // Fallback 4-turn script
    return [
      { speaker: "Prof. Sophia Jones", gender: "female", text: `Welcome to segment ${segmentIndex + 1}! Today we cover ${topic} for IGCSE ${subjectName}. This is one of the most important areas in your exam preparation.` },
      { speaker: "Dr. Marcus Smith", gender: "male", text: `Absolutely Sophia. Understanding ${topic} is fundamental to scoring top marks. Let me break down the core principles the examiner expects you to know.` },
      { speaker: "Prof. Sophia Jones", gender: "female", text: `Let me show you an image of ${topic} key concepts diagram to help visualise this.`, imagePrompt: `${topic} ${subjectName} key concepts`, imageReason: `This diagram maps out the main ideas so you can see how they connect at a glance.` },
      { speaker: "Dr. Marcus Smith", gender: "male", text: `That image perfectly captures the relationships between the concepts. Make sure you can reproduce these connections in your exam answers. Let us move on to the next section.` },
    ];
  }
}

// ── Main Syllabus Viewer ─────────────────────────────────────────────────────
function SyllabusInlineViewer({ subject, onClose }: { subject: SyllabusViewerState; onClose: () => void }) {
  const codeMatch = subject.subjectCode.match(/\d{4}/);
  const code = codeMatch ? codeMatch[0] : subject.subjectCode;
  const pdfUrl = `${API_BASE}/api/examglow/syllabus/pdf/?code=${code}`;

  // PDF state
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  // Pre-check: hit the endpoint with a HEAD-style fetch to catch 404 before iframe
  useEffect(() => {
    setPdfLoading(true);
    setPdfError(false);
    fetch(pdfUrl, { method: "GET", signal: AbortSignal.timeout(12000) })
      .then(res => {
        if (!res.ok) { setPdfError(true); setPdfLoading(false); }
        // If ok, let iframe handle the display — just cancel the fetch body
        else res.body?.cancel();
      })
      .catch(() => { setPdfError(true); setPdfLoading(false); });
  }, [pdfUrl]);

  // Bot panel state
  const [botOpen, setBotOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Teaching session state
  const [teaching, setTeaching] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [teachProgress, setTeachProgress] = useState(0); // 0-100
  const [activeSpeaker, setActiveSpeaker] = useState<"sophia" | "marcus" | null>(null);
  const sessionRef = useRef(0);
  const audioCtrlRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0); // seconds

  // Escape key closes viewer
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Auto-scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleClose = () => {
    sessionRef.current++;
    audioCtrlRef.current?.stop();
    stopAllSpeech();
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  // ── Elapsed timer ────────────────────────────────────────────────────────
  const startTimer = () => {
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };
  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  const fmtTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // ── Stop teaching ────────────────────────────────────────────────────────
  const stopTeaching = (interrupted = false) => {
    sessionRef.current++;
    audioCtrlRef.current?.stop();
    audioCtrlRef.current = null;
    stopAllSpeech();
    stopTimer();
    setTeaching(false);
    setActiveSpeaker(null);
    if (interrupted) {
      setInterrupted(true);
      setMessages(prev => [...prev, {
        role: "system",
        text: "✋ Teaching paused. Ask your question below and I'll answer, then you can resume.",
      }]);
    }
  };

  // ── Hand / interrupt button ───────────────────────────────────────────────
  const handleInterrupt = () => { if (teaching) stopTeaching(true); };

  // ── Resume teaching after Q&A ────────────────────────────────────────────
  const handleResume = () => {
    setInterrupted(false);
    startTeachSession(currentSegment);
  };

  // ── Full 1-hour teach session ─────────────────────────────────────────────
  const startTeachSession = async (startFrom = 0) => {
    const mySession = ++sessionRef.current;
    setTeaching(true);
    setInterrupted(false);
    setActiveSpeaker(null);
    setBotOpen(true);
    startTimer();

    if (startFrom === 0) {
      setMessages([{ role: "system", text: `🎓 1-Hour AI Class starting for **${subject.subjectName}**. Prof. Sophia Jones & Dr. Marcus Smith will teach all 6 segments. Use the ✋ button to interrupt and ask questions anytime.` }]);
      setCurrentSegment(0);
      setTeachProgress(0);
    }

    for (let seg = startFrom; seg < TOTAL_PAGES; seg++) {
      if (sessionRef.current !== mySession) return;
      setCurrentSegment(seg);
      setTeachProgress(Math.round((seg / TOTAL_PAGES) * 100));

      setMessages(prev => [...prev, { role: "system", text: `📖 **Segment ${seg + 1} of ${TOTAL_PAGES}**` }]);

      // Generate script (may take a moment)
      let turns: TeachTurn[] = [];
      try {
        turns = await generateSegmentScript(subject.subjectName, code, seg, TOTAL_PAGES);
      } catch {
        turns = [
          { speaker: "Prof. Sophia Jones", gender: "female", text: `Let us continue with segment ${seg + 1} of ${subject.subjectName}. Stay focused!` },
          { speaker: "Dr. Marcus Smith", gender: "male", text: "Excellent point, Sophia. Let me add the exam technique perspective here." },
        ];
      }
      if (sessionRef.current !== mySession) return;

      // Play turns sequentially
      await new Promise<void>((resolve) => {
        const fn = seg === startFrom ? playSpeechConversation : playSpeechConversationChained;
        const ctrl = fn(
          turns as SpeechTurn[],
          (idx) => {
            if (sessionRef.current !== mySession) { ctrl.stop(); return; }
            const t = turns[idx];
            const role: "sophia" | "marcus" = t.gender === "female" ? "sophia" : "marcus";
            setActiveSpeaker(role);

            const msg: ChatMsg = { role, text: t.text };
            // Image turn
            if ((t as TeachTurn).imagePrompt) {
              const ip = (t as TeachTurn).imagePrompt!;
              const ir = (t as TeachTurn).imageReason ?? "Visual aid to reinforce understanding.";
              msg.imageUrl = buildImageUrl(ip);
              msg.imageReason = ir;
            }
            setMessages(prev => [...prev, msg]);
          },
          () => resolve()
        );
        audioCtrlRef.current = { stop: () => { ctrl.stop(); resolve(); } };
      });

      setActiveSpeaker(null);
      if (sessionRef.current !== mySession) return;
      await new Promise(r => setTimeout(r, 400));
    }

    if (sessionRef.current !== mySession) return;
    stopTimer();
    setTeaching(false);
    setTeachProgress(100);
    setMessages(prev => [...prev, { role: "system", text: "✅ **Class complete!** You've covered all 6 segments. Ask any follow-up questions below." }]);
  };

  // ── Q&A chat send ────────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setIsTyping(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const answer = await groqAsk(
        `You are Dr. Marcus Smith, an IGCSE ${subject.subjectName} professor. Answer the student's question clearly and concisely. No markdown headers.`,
        q,
        { max_tokens: 500, temperature: 0.65, signal: ctrl.signal }
      );
      if (ctrl.signal.aborted) return;
      setMessages(prev => [...prev, { role: "marcus", text: answer }]);
      speakSingleTurn(answer, "male", () => {}, () => {});
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages(prev => [...prev, { role: "system", text: "Could not reach AI. Please try again." }]);
    } finally { setIsTyping(false); abortRef.current = null; }
  };

  const handleStopChat = () => { abortRef.current?.abort(); setIsTyping(false); };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">

      {/* ── Top bar (always visible) ── */}
      <div className="bg-black/90 backdrop-blur-md px-4 py-2.5 flex items-center gap-3 border-b border-white/10 shrink-0 z-10">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-white truncate">{subject.subjectName} — Syllabus</p>
          <p className="text-[11px] text-white/50">Official Cambridge PDF</p>
        </div>

        {/* Progress bar when teaching */}
        {teaching && (
          <div className="flex items-center gap-2 mr-2">
            <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${teachProgress}%` }} />
            </div>
            <span className="text-[10px] text-violet-300 font-mono font-bold">{fmtTime(elapsed)}</span>
          </div>
        )}

        <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white" title="Open in new tab">
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Back to subjects button */}
        <button onClick={handleClose}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-all border border-white/20">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      {/* ── PDF iframe ── */}
      <div className="flex-1 relative">
        {pdfLoading && !pdfError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-4 z-10">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
            </div>
            <p className="font-semibold text-sm text-white">Loading syllabus PDF…</p>
            <p className="text-xs text-white/40">Fetching from Cambridge official archive</p>
          </div>
        )}
        {pdfError ? (
          <div className="flex-1 h-full flex flex-col items-center justify-center bg-slate-900 gap-5 p-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-8 h-8 text-amber-400" />
            </div>
            <div className="text-center max-w-sm">
              <h3 className="font-bold text-white text-base">Syllabus PDF Not Available</h3>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                The official Cambridge syllabus PDF for <strong className="text-white/80">{subject.subjectName}</strong> could not be found in the archive right now.
              </p>
              <p className="text-white/30 text-xs mt-3">
                You can still use the AI Class below to learn about this subject.
              </p>
            </div>
            <a
              href={`https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-${subject.subjectName.toLowerCase().replace(/\s+/g,"-")}-${code}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl border border-white/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Try Cambridge website
            </a>
          </div>
        ) : (
          <iframe
            key={pdfUrl}
            src={pdfUrl}
            className="w-full h-full border-0 block"
            title={`${subject.subjectName} Syllabus`}
            onLoad={(e) => {
              // Detect if iframe loaded the DRF browsable API or an error page instead of a PDF
              setPdfLoading(false);
              try {
                const doc = (e.currentTarget as HTMLIFrameElement).contentDocument;
                if (doc && doc.contentType && !doc.contentType.includes("pdf")) {
                  setPdfError(true);
                }
              } catch {
                // cross-origin — assume OK if we got here
              }
            }}
            onError={() => { setPdfLoading(false); setPdfError(true); }}
          />
        )}
      </div>

      {/* ── ✋ Interrupt button (only while teaching) ── */}
      {teaching && (
        <button
          onClick={handleInterrupt}
          className="fixed bottom-28 right-6 z-[300] w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center shadow-2xl border-2 border-amber-300 transition-all hover:scale-110 active:scale-95"
          title="Raise hand — interrupt and ask a question"
        >
          <Hand className="w-6 h-6" />
        </button>
      )}

      {/* ── Active speaker indicator strip ── */}
      {teaching && activeSpeaker && (
        <div className="fixed bottom-[6.5rem] left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 pointer-events-none">
          <div className={`w-2 h-2 rounded-full animate-pulse ${activeSpeaker === "sophia" ? "bg-rose-400" : "bg-blue-400"}`} />
          <span className="text-xs font-bold text-white">
            {activeSpeaker === "sophia" ? "Prof. Sophia Jones" : "Dr. Marcus Smith"} is speaking…
          </span>
        </div>
      )}

      {/* ── Bot panel (slide up when open) ── */}
      {botOpen && (
        <div className="fixed bottom-24 right-6 z-[290] w-[22rem] max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ height: "480px" }}>

          {/* Panel header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-3 flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">AI Class</p>
              <p className="text-[10px] text-white/70 mt-0.5 truncate">{subject.subjectName}</p>
            </div>
            {teaching && (
              <span className="text-[9px] font-black text-white bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                LIVE
              </span>
            )}
            <button onClick={() => setBotOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Teach Me This button */}
          {!teaching && !interrupted && (
            <div className="px-4 pt-3 pb-2 shrink-0 border-b border-slate-100">
              <button
                onClick={() => startTeachSession(0)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
              >
                <Bot className="w-4 h-4" />
                Teach Me This — 1 Hour Class
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                Sophia &amp; Marcus teach all 6 segments with images
              </p>
            </div>
          )}

          {/* Resume button after interrupt */}
          {interrupted && !teaching && (
            <div className="px-4 pt-3 pb-2 shrink-0 border-b border-slate-100">
              <button
                onClick={handleResume}
                className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                ▶ Resume Class from Segment {currentSegment + 1}
              </button>
            </div>
          )}

          {/* Message stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
            {messages.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <Bot className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs leading-relaxed">
                  Click <strong>Teach Me This</strong> to start a full<br/>
                  1-hour AI class on this syllabus.
                </p>
              </div>
            )}
            {messages.map((msg, i) => {
              const isSophia = msg.role === "sophia";
              const isMarcus = msg.role === "marcus";
              const isUser = msg.role === "user";
              const isSystem = msg.role === "system";

              if (isSystem) return (
                <div key={i} className="text-center">
                  <span className="inline-block text-[10px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                    {msg.text}
                  </span>
                </div>
              );

              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
                  {!isUser && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0 mt-0.5 ${isSophia ? "bg-rose-500" : "bg-blue-600"}`}>
                      {isSophia ? "SJ" : "MS"}
                    </div>
                  )}
                  <div className="max-w-[85%]">
                    {!isUser && (
                      <p className={`text-[9px] font-bold mb-0.5 ${isSophia ? "text-rose-500" : "text-blue-600"}`}>
                        {isSophia ? "Prof. Sophia Jones" : "Dr. Marcus Smith"}
                      </p>
                    )}
                    <div className={`px-3 py-2 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                      isUser ? "bg-violet-600 text-white rounded-br-sm"
                      : isSophia ? "bg-rose-50 text-rose-900 border border-rose-100 rounded-bl-sm"
                      : "bg-blue-50 text-blue-900 border border-blue-100 rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    {/* Image card */}
                    {msg.imageUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-purple-200 bg-white shadow-sm">
                        <img src={msg.imageUrl} alt="Visual aid" className="w-full object-cover max-h-40"
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        <div className="px-2.5 py-1.5 bg-purple-50 border-t border-purple-100">
                          <p className="text-[9px] text-purple-600 font-bold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Why this image?
                          </p>
                          <p className="text-[10px] text-purple-700 mt-0.5 leading-snug">{msg.imageReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">MS</div>
                <div className="bg-blue-50 border border-blue-100 px-3 py-2 rounded-2xl text-xs text-blue-400 italic">Thinking…</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={teaching ? "Class in progress — raise ✋ to ask…" : "Ask about this syllabus…"}
              disabled={teaching}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isTyping ? (
              <button type="button" onClick={handleStopChat}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shrink-0">
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={teaching || !input.trim()}
                className="p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl transition-all shrink-0">
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* ── Floating bot bubble ── */}
      <button
        onClick={() => setBotOpen(v => !v)}
        className={`fixed bottom-6 right-6 z-[290] w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl border-2 transition-all hover:scale-110 active:scale-95 ${
          teaching
            ? "bg-gradient-to-tr from-violet-600 to-purple-400 border-purple-300 animate-pulse"
            : "bg-gradient-to-tr from-violet-600 to-purple-500 border-purple-300"
        }`}
        title={botOpen ? "Close AI tutor" : "Open AI tutor"}
      >
        {botOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        {teaching && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
          </span>
        )}
      </button>

    </div>
  );
}

// ── Subjects page ─────────────────────────────────────────────────────────
function Subjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSyllabus, setOpenSyllabus] = useState<SyllabusViewerState | null>(null);

  const parsedSubjects = useMemo(() => SUBJECT_LIST.map((name, index) => ({
    name,
    subjectId: getSubjectId(name),
    firstLetter: name.charAt(0).toUpperCase(),
    Icon: getSubjectIcon(name),
    accent: ACCENT_COLORS[index % ACCENT_COLORS.length],
  })), []);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const matches = parsedSubjects.filter(s => s.name.toLowerCase().includes(q));
    const groups: Record<string, typeof matches> = {};
    matches.forEach(s => { if (!groups[s.firstLetter]) groups[s.firstLetter] = []; groups[s.firstLetter].push(s); });
    return Object.keys(groups).sort().reduce<Record<string, typeof matches>>((acc, k) => { acc[k] = groups[k]; return acc; }, {});
  }, [searchQuery, parsedSubjects]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const availableLetters = Object.keys(filteredGroups);
  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Header authed />

      <section className="bg-pink-soft text-center py-16 px-6 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary/10 filter blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/10 filter blur-3xl" />
        <span className="inline-block px-3.5 py-1 rounded-full bg-white text-xs font-bold text-primary shadow-sm tracking-wide">Syllabus Catalog</span>
        <h1 className="font-sans text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">Cambridge IGCSE Syllabus Directory</h1>
        <p className="text-slate-500 mt-2.5 max-w-xl mx-auto text-sm leading-relaxed">
          Access the complete list of 80+ Cambridge IGCSE subjects. Review exact curriculum learning objectives, topics, and structures.
        </p>
        <div className="mt-8 max-w-xl mx-auto relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search subjects or syllabus codes (e.g. Italian, 0452)..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-12 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        {/* A-Z jump */}
        <div className="mb-10 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3.5 text-center md:text-left">Quick Jump (A - Z)</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {alphabet.map(letter => {
              const isAvailable = availableLetters.includes(letter);
              return (
                <button key={letter} onClick={() => isAvailable && scrollToLetter(letter)} disabled={!isAvailable}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    isAvailable ? "bg-slate-50 border border-slate-200/50 text-slate-800 hover:bg-primary hover:text-white hover:border-primary shadow-sm cursor-pointer"
                    : "text-slate-300 bg-slate-50/30 border border-slate-100/50 cursor-not-allowed"
                  }`}>{letter}
                </button>
              );
            })}
          </div>
        </div>

        {availableLetters.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-800">No subjects match your search</h3>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your keywords or search term.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {availableLetters.map(letter => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-6">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-100/70 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-sm">{letter}</div>
                  <h2 className="font-sans text-xl font-bold text-slate-800">IGCSE Subjects ({filteredGroups[letter].length})</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredGroups[letter].map(subject => (
                    <div key={subject.name} className={`bg-white border border-slate-150 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between border-t-4 ${subject.accent} hover:scale-[1.01]`}>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              <subject.Icon className="w-5 h-5 text-slate-500" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-450 bg-slate-50 border border-slate-100/50 rounded-full px-2.5 py-0.5 shrink-0">Cambridge IGCSE</span>
                          </div>
                          <h3 className="font-sans font-bold text-sm text-slate-800 mt-4 leading-tight">{subject.name}</h3>
                        </div>
                        <div className="mt-5 border-t border-slate-50 pt-4 flex gap-2">
                          <button
                            onClick={() => {
                              const m = subject.name.match(/\s*-\s*(\d{4})(?:\s|$)/);
                              const c = m ? m[1] : subject.subjectId;
                              setOpenSyllabus({ subjectName: subject.name.replace(/\s*-\s*\d{4}$/, "").trim(), subjectCode: c });
                            }}
                            className="flex-1 py-2 rounded-xl border border-slate-200/80 text-[10px] font-bold inline-flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600 bg-white cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                            View Syllabus
                          </button>
                          <Link to="/subject-notes/$subject" params={{ subject: getNotesSubjectName(subject.name) }}
                            className="flex-1 py-2 rounded-xl border border-slate-200/80 text-[10px] font-bold inline-flex items-center justify-center gap-1.5 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all text-slate-600 bg-white cursor-pointer">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            View Notes
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom promo section */}
        <div className="mt-16 bg-white border border-slate-100 rounded-3xl p-8 grid md:grid-cols-2 gap-6 items-center shadow-sm">
          <div>
            <h3 className="font-sans text-2xl font-extrabold text-slate-800">Interactive Exam Preparations</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Use our smart study tools to master key syllabus terminology, practice actual past exam papers, and review flashcards.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Link to="/past-papers"
                className="flex-1 min-w-[170px] border border-slate-200/60 rounded-2xl px-4 py-3.5 text-sm flex items-center gap-3.5 hover:border-primary/30 transition-all hover:bg-slate-50/30">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">Past Paper Bank</div>
                  <div className="text-[10px] text-slate-400">Practice real exam scripts</div>
                </div>
              </Link>
              <Link to="/flashcards"
                className="flex-1 min-w-[170px] border border-slate-200/60 rounded-2xl px-4 py-3.5 text-sm flex items-center gap-3.5 bg-lavender-soft/30 hover:bg-lavender-soft/50 transition-all">
                <div className="w-9 h-9 rounded-xl bg-lavender-soft/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-lavender" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">Flashcard Decks</div>
                  <div className="text-[10px] text-slate-400">Recall critical concepts</div>
                </div>
              </Link>
            </div>
          </div>
          <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-lavender-soft to-pink-soft flex items-center justify-center text-7xl select-none">
            📚
          </div>
        </div>
      </main>

      <Footer />

      {/* Inline Syllabus PDF Viewer */}
      {openSyllabus && (
        <SyllabusInlineViewer
          subject={openSyllabus}
          onClose={() => setOpenSyllabus(null)}
        />
      )}
    </div>
  );
}
