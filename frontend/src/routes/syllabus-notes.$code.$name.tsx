import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { getChaptersForSubject, getDynamicChapter } from "@/data/notes/index";
import type { NoteBlock, NotePage, BulletItem } from "@/data/notes/index";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, BookOpen, ChevronRight, ChevronDown, ChevronUp,
  List, Menu, X, Lightbulb, AlertTriangle, Send, Bot,
  CheckCircle2, ExternalLink, Play,
} from "lucide-react";
import { groqAsk } from "@/lib/groq-client";

export const Route = createFileRoute("/syllabus-notes/$code/$name")({
  head: ({ params }) => ({
    meta: [{ title: `${decodeURIComponent(params.name)} — Revision Notes — ExamGlow` }],
  }),
  component: SyllabusNotes,
});

// ─── Inline text parser (shared with subject-notes) ────────────────────────────

function parseInlineText(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function parseMarkdownContent(text: string): React.ReactNode {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    return <p key={i} className="text-sm text-slate-700 leading-relaxed mb-1.5">{parseInlineText(line)}</p>;
  });
}

// ─── Block renderer ─────────────────────────────────────────────────────────────

function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul className="my-3 space-y-2 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
          <span className="text-sm text-slate-700 leading-relaxed">
            {parseInlineText(item.text)}
            {item.sub && item.sub.length > 0 && (
              <ul className="ml-4 mt-1.5 space-y-1">
                {item.sub.map((s, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-2 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                    <span>{parseInlineText(s)}</span>
                  </li>
                ))}
              </ul>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function VideoCard({ videoId, title, caption }: { videoId: string; title: string; caption?: string }) {
  const [open, setOpen] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group w-full text-left rounded-xl overflow-hidden border border-slate-200 hover:border-red-300 hover:shadow-md transition-all bg-white my-4"
      >
        <div className="relative w-full bg-slate-900" style={{ paddingBottom: "56.25%" }}>
          <img src={thumb} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 group-hover:text-red-700 transition-colors">{title}</p>
          {caption && <p className="text-[10px] text-slate-400 mt-0.5">{caption}</p>}
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="bg-slate-900 px-4 py-3 flex items-center gap-3">
              <p className="text-sm font-semibold text-white truncate flex-1">{title}</p>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shrink-0">
                <ExternalLink className="w-3 h-3" /> YouTube
              </a>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BlockRenderer({ block }: { block: NoteBlock }) {
  switch (block.kind) {
    case "intro":
      return <div className="my-3">{parseMarkdownContent(block.text)}</div>;

    case "definition":
      return (
        <div className="my-4 border-l-4 border-primary/40 bg-primary/5 pl-4 pr-4 py-3 rounded-r-lg">
          <p className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider mb-1">Definition</p>
          <p className="text-sm font-semibold text-slate-900 mb-0.5">{parseInlineText(block.term)}</p>
          <p className="text-sm text-slate-600 leading-relaxed">{parseInlineText(block.definition)}</p>
        </div>
      );

    case "keyterms":
      return (
        <div className="my-4 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Terms</p>
          {block.terms.map((t, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="font-semibold text-primary shrink-0">• {t.label}:</span>
              <span className="text-slate-700 leading-relaxed">{parseInlineText(t.value)}</span>
            </div>
          ))}
        </div>
      );

    case "bullets":
      return <BulletList items={block.items} />;

    case "numbered":
      return (
        <ol className="my-3 space-y-1.5 list-decimal list-inside pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="text-sm text-slate-700 leading-relaxed">{parseInlineText(item)}</li>
          ))}
        </ol>
      );

    case "equation":
      return (
        <div className="my-4 bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
          <p className="text-[10px] text-violet-600 font-semibold uppercase tracking-wider mb-2">{block.label}</p>
          <p className="font-mono text-base font-bold text-violet-900 my-1 inline-block px-4 py-1.5 rounded-lg bg-white border border-violet-100">{block.formula}</p>
          {block.note && <p className="text-xs text-slate-500 mt-2">{parseInlineText(block.note)}</p>}
        </div>
      );

    case "table":
      return (
        <div className="my-4 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{block.headers.map((h, i) => <th key={i} className="px-4 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {block.rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50/60">
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-2.5 text-sm ${ci === 0 ? "font-medium text-slate-800" : "text-slate-600"}`}>
                      {parseInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "video":
      return <VideoCard videoId={block.youtubeId} title={block.title} caption={block.caption} />;

    case "image":
      return block.src ? (
        <figure className="my-4 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <img src={block.src} alt={block.caption ?? "Diagram"} className="w-full object-contain max-h-72" />
          {block.caption && <figcaption className="text-center text-xs text-slate-500 italic py-2 px-4 bg-white border-t border-slate-100">{block.caption}</figcaption>}
        </figure>
      ) : null;

    case "tip":
      return (
        <div className="my-4 flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-1">Exam Tip</p>
            <div className="text-sm text-amber-900 leading-relaxed">{parseMarkdownContent(block.text)}</div>
          </div>
        </div>
      );

    case "warning":
      return (
        <div className="my-4 flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wider mb-1">Common Mistake</p>
            <div className="text-sm text-red-900 leading-relaxed">{parseMarkdownContent(block.text)}</div>
          </div>
        </div>
      );

    case "comparison":
      return (
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">{block.left.label}</p>
            <ul className="space-y-1.5">
              {block.left.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>{parseInlineText(item)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <p className="text-xs font-bold text-pink-700 mb-2 uppercase tracking-wide">{block.right.label}</p>
            <ul className="space-y-1.5">
              {block.right.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-pink-900">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                  <span>{parseInlineText(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "highlight": {
      const cls: Record<string, string> = {
        pink: "bg-primary/5 border-primary/20 text-slate-800",
        blue: "bg-blue-50 border-blue-200 text-blue-900",
        green: "bg-emerald-50 border-emerald-200 text-emerald-900",
        yellow: "bg-amber-50 border-amber-200 text-amber-900",
      };
      return (
        <div className={`my-4 border rounded-lg px-4 py-3 text-sm leading-relaxed ${cls[block.color ?? "pink"]}`}>
          {parseMarkdownContent(block.text)}
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── AI Chatbot ────────────────────────────────────────────────────────────────

interface ChatMsg { role: "user" | "assistant"; text: string }

function AiChatBot({ subjectName, topicTitle }: { subjectName: string; topicTitle: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs(prev => [...prev, { role: "user", text: q }]);
    setLoading(true);
    try {
      const system = `You are an expert IGCSE ${subjectName} tutor. The student is currently studying "${topicTitle}". Answer their question clearly, accurately and concisely. Use bullet points where helpful. Be encouraging.`;
      const history = msgs.slice(-6).map(m => `${m.role === "user" ? "Student" : "Tutor"}: ${m.text}`).join("\n");
      const reply = await groqAsk(system, history ? `${history}\nStudent: ${q}` : q, { max_tokens: 600, temperature: 0.5 });
      setMsgs(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", text: "Sorry, I couldn't connect. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 sm:w-96 h-[440px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-purple-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-white" />
              <p className="text-sm font-bold text-white">AI Tutor — {subjectName}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
            {msgs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
                <Bot className="w-8 h-8 text-slate-300" />
                <p className="text-xs text-slate-500 leading-relaxed">Ask me anything about <strong className="text-slate-700">{topicTitle}</strong></p>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  m.role === "user" ? "bg-primary text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-xl rounded-bl-sm px-3 py-2 text-xs text-slate-400 italic">Thinking…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask about ${topicTitle}…`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 text-slate-800"
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-13 h-13 w-12 h-12 bg-gradient-to-tr from-primary to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-white"
        title="AI Tutor"
      >
        {open ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </button>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

function SyllabusNotes() {
  const { code, name } = Route.useParams();
  const decodedName = decodeURIComponent(name);

  // Get pre-written chapters — instant, no loading
  const subjectWithCode = `${decodedName} - ${code}`;
  const chapters = getChaptersForSubject(subjectWithCode);

  // Also get syllabus objectives for sidebar structure
  const subjectId = findSubjectId(code, decodedName);
  const syllabusData = getSyllabusData(subjectId);
  const objectives = syllabusData?.objectives ?? [];

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (objectives.length > 0) s.add(objectives[0].id);
    return s;
  });

  // Active topic — default to first page of first chapter
  const firstChapter = chapters[0];
  const firstPage = firstChapter?.pages[0];

  const [activeTopic, setActiveTopic] = useState<{
    chapterTitle: string;
    pageSection: string;
    unitTitle: string;
  } | null>(firstPage ? {
    chapterTitle: firstChapter.title,
    pageSection: firstPage.section,
    unitTitle: firstChapter.title,
  } : null);

  const toggleUnit = (id: string) =>
    setExpandedUnits(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Find the active page to display
  const activeChapter = chapters.find(c => c.title === activeTopic?.chapterTitle);
  const activePage = activeChapter?.pages.find(p => p.section === activeTopic?.pageSection)
    ?? activeChapter?.pages[0];

  // Find previous/next for navigation
  const allPages: { chapterTitle: string; pageSection: string; unitTitle: string }[] = [];
  for (const ch of chapters) {
    for (const pg of ch.pages) {
      allPages.push({ chapterTitle: ch.title, pageSection: pg.section, unitTitle: ch.title });
    }
  }
  const activeIdx = allPages.findIndex(p => p.chapterTitle === activeTopic?.chapterTitle && p.pageSection === activeTopic?.pageSection);
  const prevPage = activeIdx > 0 ? allPages[activeIdx - 1] : null;
  const nextPage = activeIdx >= 0 && activeIdx < allPages.length - 1 ? allPages[activeIdx + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header authed />

      {/* Sub-header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link to="/subjects" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" /> Subjects
          </Link>
          <div className="w-px h-4 bg-slate-200 shrink-0" />
          <BookOpen className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-slate-900 text-sm truncate">{decodedName}</span>
          <span className="text-xs text-slate-400 font-mono shrink-0 hidden sm:inline">{code}</span>
          <div className="ml-auto">
            <button onClick={() => setSidebarOpen(v => !v)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 lg:hidden">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <List className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Topics</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-2">
              <SidebarContent chapters={chapters} objectives={objectives} expandedUnits={expandedUnits}
                toggleUnit={toggleUnit} activeTopic={activeTopic}
                onSelect={(t) => { setActiveTopic(t); setSidebarOpen(false); }} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full" style={{ height: "calc(100vh - 49px)" }}>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-slate-200 bg-white flex-col self-start sticky top-[49px] max-h-[calc(100vh-49px)] overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-100 shrink-0 flex items-center gap-2">
            <List className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Revision Notes</span>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-2">
            <SidebarContent chapters={chapters} objectives={objectives} expandedUnits={expandedUnits}
              toggleUnit={toggleUnit} activeTopic={activeTopic} onSelect={setActiveTopic} />
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {activeTopic && activeChapter && activePage ? (
            <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
                <span>{decodedName}</span>
                <ChevronRight className="w-3 h-3" />
                <span>{activeChapter.title}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-600 font-medium">{activePage.section}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{activePage.section}</h1>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{code}</span>
                <span className="text-[11px] text-slate-400">{activeChapter.title}</span>
              </div>

              {/* Blocks */}
              <div className="space-y-1">
                {activePage.blocks.map((block, i) => (
                  <BlockRenderer key={i} block={block} />
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 gap-4">
                {prevPage ? (
                  <button onClick={() => setActiveTopic(prevPage)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors text-left">
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{prevPage.pageSection}</span>
                  </button>
                ) : <div />}
                {nextPage ? (
                  <button onClick={() => setActiveTopic(nextPage)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors text-right ml-auto">
                    <span className="line-clamp-1">{nextPage.pageSection}</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                ) : <div />}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4 p-8">
              <BookOpen className="w-10 h-10 opacity-30" />
              <p className="text-sm text-center">Select a topic from the sidebar to start revising</p>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* AI Chatbot */}
      <AiChatBot
        subjectName={decodedName}
        topicTitle={activeTopic?.pageSection ?? decodedName}
      />
    </div>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

interface ActiveTopic { chapterTitle: string; pageSection: string; unitTitle: string }
interface SyllabusObj { id: string; code: string; title: string; subObjectives?: { id: string; title: string }[] }

function SidebarContent({
  chapters, objectives, expandedUnits, toggleUnit, activeTopic, onSelect,
}: {
  chapters: ReturnType<typeof getChaptersForSubject>;
  objectives: SyllabusObj[];
  expandedUnits: Set<string>;
  toggleUnit: (id: string) => void;
  activeTopic: ActiveTopic | null;
  onSelect: (t: ActiveTopic) => void;
}) {
  // Use chapters directly for sidebar (each chapter = unit, each page = topic)
  return (
    <>
      {chapters.map((ch, ci) => {
        const unitId = `ch-${ci}`;
        const isExpanded = expandedUnits.has(unitId);
        return (
          <div key={unitId} className="mb-1">
            <button onClick={() => toggleUnit(unitId)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 group-hover:text-primary truncate">{ch.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{ch.pages.length} topics</p>
              </div>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>
            {isExpanded && (
              <div className="ml-3 pl-3 border-l-2 border-slate-100 mb-2 space-y-0.5">
                {ch.pages.map((pg, pi) => {
                  const isActive = activeTopic?.chapterTitle === ch.title && activeTopic?.pageSection === pg.section;
                  return (
                    <button key={pi} onClick={() => onSelect({ chapterTitle: ch.title, pageSection: pg.section, unitTitle: ch.title })}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                        isActive ? "bg-primary text-white" : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                      }`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white/70" : "text-emerald-400"}`} />
                      <span className="text-[12px] leading-snug truncate">{pg.section}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findSubjectId(code: string, name: string): string {
  const slugName = name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
  const CODE_MAP: Record<string, string> = {
    "0610": "biology-0610", "0620": "chemistry-0620", "0625": "physics-0625",
    "0580": "mathematics-0580", "0606": "mathematics-0580", "0478": "computer-science-0478",
    "0455": "economics-0455", "0470": "history-0470", "0460": "geography-0460",
    "0500": "english-language-0500", "0450": "business-studies-0450", "0452": "accounting-0452",
  };
  if (CODE_MAP[code]) return CODE_MAP[code];
  const candidates = [`${slugName}-${code}`, slugName];
  for (const id of candidates) { if (getSyllabusData(id)) return id; }
  return `${slugName}-${code}`;
}
