import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { 
  ArrowLeft, FileText, ChevronLeft, ChevronRight, X, 
  Download, Printer, ZoomIn, ZoomOut, Trophy,
  Bot, Sparkles, Volume2, VolumeX, Play, Pause, Send, HelpCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { playSpeechConversation, stopAllSpeech, speakSingleTurn, type SpeechTurn } from "@/lib/speech-utils";
import { apiFetch } from "@/lib/api-client";

export const Route = createFileRoute("/syllabus/$subjectId")({
  component: SyllabusPage,
});

// Helper to clean "Cambridge" out of the name
function cleanSubjectName(name: string): string {
  return name.replace(/^Cambridge\s+/i, "").replace(/^IGCSE\s+/i);
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
  
  // AI Chat States
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant" | "smith" | "jones"; text: string; speaker?: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [audioState, setAudioState] = useState<"idle" | "speaking" | "debate">("idle");
  const [speakingTurnIndex, setSpeakingTurnIndex] = useState<number | null>(null);
  
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
    };
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, speakingTurnIndex]);

  // Clean reader on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
    setSpeakingTurnIndex(null);

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
      const prompt = `You are a warm, expert IGCSE tutor teaching a student the syllabus details. Please generate a highly comprehensive, detailed, and thorough explanation covering everything on Page ${currentPage} ("${activePageTitle}") of the IGCSE ${clean} (${subjectCode}) syllabus.
Here is the context of this page:
${contentSummary}

Write a detailed, thorough explanation teaching every single term, concept, exam structure, aim, or sub-objective on this page. Cover all details and provide examples where relevant. Make the explanation long, comprehensive, and complete (not a brief summary). Avoid headers or bullet points. Start speaking immediately without intro filler.`;

      const data = await apiFetch<{ answer: string }>("/api/ai/ask/", {
        method: "POST",
        body: JSON.stringify({ question: prompt })
      });

      const explanationText = data.answer.trim();
      setIsTyping(false);
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `🌸 **AI Tutor Lesson (Page ${currentPage})**:\n\n${explanationText}` }
      ]);

      setAudioState("speaking");
      audioControllerRef.current = speakSingleTurn(
        explanationText,
        "male", // Male voice (maps to Fenrir deep voice)
        () => {},
        () => {
          setAudioState("idle");
        }
      );
    } catch (err) {
      console.error("Teach Me generation failed", err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Sorry, I had trouble reaching the AI tutor to generate a custom lesson. Please check your connection." }
      ]);
    }
  };

  // ── AI Debate Battle Turn Generator ──
  const handleAiBattle = async () => {
    // Stop active speech first
    if (audioControllerRef.current) {
      audioControllerRef.current.stop();
      audioControllerRef.current = null;
    }
    setAudioState("idle");
    setSpeakingTurnIndex(null);

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
      const prompt = `You are a script writer. Write a turn-by-turn academic debate script between Dr. AI Smith (academic, theoretical, male) and Prof. AI Jones (practical, application-focused, female) discussing the concepts on Page ${currentPage} ("${activePageTitle}") of the IGCSE ${clean} (${subjectCode}) syllabus.
Here is the context of this page:
${contentSummary}

Write exactly 4 turns, alternating between Dr. AI Smith (male) and Prof. AI Jones (female), starting with Dr. AI Smith. Make their arguments professional, educational, and engaging.
Return ONLY a valid JSON array matching this exact schema, without any backticks, markdown, or text outside the JSON block:
[
  { "speaker": "Dr. AI Smith", "gender": "male", "text": "turn text" },
  { "speaker": "Prof. AI Jones", "gender": "female", "text": "turn text" },
  { "speaker": "Dr. AI Smith", "gender": "male", "text": "turn text" },
  { "speaker": "Prof. AI Jones", "gender": "female", "text": "turn text" }
]`;

      const data = await apiFetch<{ answer: string }>("/api/ai/ask/", {
        method: "POST",
        body: JSON.stringify({ question: prompt })
      });

      setIsTyping(false);

      // Clean up markdown code block fences if any
      let rawJson = data.answer.trim();
      if (rawJson.startsWith("```")) {
        rawJson = rawJson.replace(/^```(json)?/, "").replace(/```$/, "").trim();
      }

      let turns: SpeechTurn[];
      try {
        turns = JSON.parse(rawJson);
      } catch (e) {
        console.warn("AI returned invalid JSON array for debate, parsing as text turns", e);
        const paragraphs = rawJson.split("\n\n").filter(p => p.trim());
        turns = paragraphs.map((p, i) => ({
          speaker: i % 2 === 0 ? "Dr. AI Smith" : "Prof. AI Jones",
          gender: i % 2 === 0 ? "male" : "female",
          text: p.replace(/^(Dr\.\s*Smith|Prof\.\s*Jones|Dr\.\s*AI\s*Smith|Prof\.\s*AI\s*Jones|Smith|Jones):\s*/i, "").trim()
        })).slice(0, 4);
      }
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `⚔️ **AI Debate Battle (Page ${currentPage})**:\n*A friendly academic debate between Dr. Smith (Academic/Theory) and Prof. Jones (Applied/Practice) has started!*` }
      ]);

      setAudioState("debate");

      audioControllerRef.current = playSpeechConversation(
        turns,
        (idx) => {
          setSpeakingTurnIndex(idx);
          const turn = turns[idx];
          setMessages(prev => [
            ...prev,
            { 
              role: turn.gender === "male" ? "smith" : "jones", 
              text: turn.text,
              speaker: turn.speaker 
            }
          ]);
        },
        () => {
          setAudioState("idle");
          setSpeakingTurnIndex(null);
        }
      );
    } catch (err) {
      console.error("AI Debate script generation failed", err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Sorry, I had trouble reaching the AI to generate a custom debate script. Please check your connection." }
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInputText("");
    setIsTyping(true);

    // Query AI assistant QuickAskView backend, fallback to mock response if error
    try {
      const data = await apiFetch<{ answer: string }>("/api/ai/ask/", {
        method: "POST",
        body: JSON.stringify({
          question: `For IGCSE ${cleanName} (${subjectCode}) syllabus, Page ${currentPage} (${getPageTitle(currentPage)}): ${userMsg}`
        })
      });
      setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
      setIsTyping(false);
      return;
    } catch (err) {
      console.error("AI chat failed, falling back to offline tutor", err);
    }

    setTimeout(() => {
      let reply = "";
      const q = userMsg.toLowerCase();
      if (q.includes("exam") || q.includes("paper") || q.includes("weight") || q.includes("mark")) {
        reply = `For IGCSE ${cleanName} (${subjectCode}), the assessment details on Page 6 outline the paper weightings. Standard candidates take Paper 1/2 and Paper 3/4. Core papers contribute 50% and Extended papers contribute 50% or 65% depending on the tier. Make sure to check the marks and timing details listed on Page 6 for maximum preparation!`;
      } else if (q.includes("calculator")) {
        reply = `According to the syllabus conventions, calculators are permitted in specific calculator papers (e.g. Paper 3 and Paper 4 for Mathematics, or general science papers). However, they are strictly prohibited in non-calculator components (like Paper 1 and Paper 2). Always check the cover guidelines of your practice papers!`;
      } else if (q.includes("aim") || q.includes("objective") || q.includes("ao1") || q.includes("ao2")) {
        reply = `The Assessment Objectives (AOs) detailed on Page 7 specify candidate expectations. AO1: Knowledge and understanding typically accounts for 40-60% of the marks, while AO2: Analysis and Application accounts for the rest. Check Page 7's tables for details!`;
      } else {
        reply = `That is an excellent question regarding the IGCSE ${cleanName} syllabus. Page ${currentPage} details the key outcomes and sub-topics for this section. I recommend focusing on the specific vocabulary, standard practical procedures, and using active retrieval to memorize these definitions for your exams!`;
      }
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleStopAudio = () => {
    if (audioControllerRef.current) {
      audioControllerRef.current.stop();
      audioControllerRef.current = null;
    }
    setAudioState("idle");
    setSpeakingTurnIndex(null);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/95 flex flex-col animate-fade-in font-sans">
      {/* Top Controls Toolbar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-5 h-5 text-red-400 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{fileName}</h3>
            <p className="text-[10px] text-slate-400">
              Page {currentPage} of {totalPages} ({getPageTitle(currentPage)})
            </p>
          </div>
        </div>

        {/* Toolbar Middle: Navigation & Zoom */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-900/60 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-2.5 font-mono min-w-[3.5rem] text-center">
              P. {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/60 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.max(70, z - 10))}
              disabled={zoom === 70}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs px-1 font-mono min-w-[3rem] text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              disabled={zoom === 150}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar Action / Close */}
        <div className="flex items-center gap-2">
          {audioState !== "idle" && (
            <button
              onClick={handleStopAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Stop speech"
            >
              <VolumeX className="w-4 h-4 animate-pulse" />
              <span>Stop Audio</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="p-2 rounded hover:bg-slate-700 transition-colors hidden md:block cursor-pointer"
            title="Print Document"
          >
            <Printer className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-slate-700 transition-colors hidden md:block cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-4.5 h-4.5" />
          </button>
          <div className="h-6 w-px bg-slate-700 mx-1 hidden md:block" />
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-800 relative">
        <div 
          className="bg-white shadow-2xl relative select-text transition-all duration-300 origin-top flex flex-col justify-between"
          style={{ 
            width: "800px", 
            minHeight: "1100px",
            transform: `scale(${zoom / 100})`,
            marginBottom: `${Math.max(0, (zoom / 100 - 1) * 1100) + 32}px`,
            marginTop: "8px"
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

      {/* Floating AI Bot Panel in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-[250] flex flex-col items-end">
        {/* Chat Pane */}
        {aiChatOpen && (
          <div className="w-96 h-[480px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-slide-up animate-duration-200">
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-purple-600 text-white flex justify-between items-center shrink-0 shadow-md">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <h4 className="text-sm font-bold leading-none">AI Tutor: {cleanName}</h4>
                  <p className="text-[10px] text-white/80 mt-1">Syllabus Helper — Page {currentPage}</p>
                </div>
              </div>
              <button 
                onClick={() => setAiChatOpen(false)} 
                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Toolbar */}
            <div className="bg-slate-50 border-b border-slate-100 p-2 flex gap-2 justify-center shrink-0">
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
                onClick={handleAiBattle}
                className={`flex-1 py-1.5 px-3 bg-white border border-slate-200 hover:border-primary/30 rounded-xl text-xs font-bold text-slate-700 hover:text-primary flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  audioState === "debate" ? "ring-2 ring-primary bg-primary/5 text-primary" : ""
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-red-500" />
                <span>AI Debate Battle</span>
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fcfcfc]">
              {messages.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Ask a question about the IGCSE {cleanName} syllabus, or click 'Teach Me This' or 'AI Debate Battle' to hear dynamic audio explanations!</p>
                </div>
              )}
              
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                const isSmith = msg.role === "smith";
                const isJones = msg.role === "jones";
                
                // Determine styling based on role
                let bgClass = "bg-slate-100 text-slate-800";
                let alignClass = "justify-start";
                let avatarColor = "bg-purple-100 text-purple-700";
                let label = msg.speaker || "AI Tutor";

                if (isUser) {
                  bgClass = "bg-primary text-primary-foreground";
                  alignClass = "justify-end";
                  label = "Student";
                } else if (isSmith) {
                  bgClass = "bg-blue-50 text-blue-900 border border-blue-100";
                  avatarColor = "bg-blue-100 text-blue-700";
                } else if (isJones) {
                  bgClass = "bg-pink-50 text-pink-900 border border-pink-100";
                  avatarColor = "bg-pink-100 text-pink-700";
                }

                const isActiveSpeaking = speakingTurnIndex !== null && 
                  ((isSmith && speakingTurnIndex === idx) || (isJones && speakingTurnIndex === idx) || (msg.role === "assistant" && audioState === "speaking" && idx === messages.length - 1));

                return (
                  <div key={idx} className={`flex ${alignClass} items-start gap-2 animate-fade-in`}>
                    {!isUser && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${avatarColor}`}>
                        {isSmith ? "S" : isJones ? "J" : "T"}
                      </div>
                    )}
                    <div className="max-w-[75%] min-w-[100px]">
                      <span className="text-[9px] text-slate-400 font-bold block mb-0.5 ml-1">
                        {label} {isActiveSpeaking && "🗣️"}
                      </span>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${bgClass} ${
                        isActiveSpeaking ? "ring-2 ring-amber-500 animate-pulse" : ""
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold animate-bounce">
                    T
                  </div>
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl text-xs italic">
                    AI is writing response...
                  </div>
                </div>
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
              <button 
                type="submit"
                className="p-2 bg-primary hover:bg-primary/95 text-white rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
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

        {/* Syllabuses PDF List section exactly as screenshot */}
        <div className="bg-white border border-slate-150 rounded-[2rem] p-8 md:p-10 shadow-sm">
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

          <div className="space-y-4">
            {pdfList.map((pdf, idx) => (
              <button
                key={idx}
                onClick={() => setActivePdf({ yearRange: pdf.yearRange, fileName: pdf.fileName })}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-300 transition-all text-left group hover:scale-[1.005] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center text-red-650 shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                    {pdf.yearRange} Syllabus
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {pdf.fileName} (PDF, {pdf.size})
                  </p>
                </div>
                <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  Open Document →
                </span>
              </button>
            ))}
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
