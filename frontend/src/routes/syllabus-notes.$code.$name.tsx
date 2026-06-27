import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { apiFetch } from "@/lib/api-client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, BookOpen, ChevronRight, ChevronDown, ChevronUp,
  Loader2, FileText, GraduationCap, Lightbulb, AlertCircle,
  CheckCircle2, List, Youtube, Image as ImageIcon, Menu, X,
  ExternalLink, Play,
} from "lucide-react";

export const Route = createFileRoute("/syllabus-notes/$code/$name")({
  head: ({ params }) => ({
    meta: [{ title: `${decodeURIComponent(params.name)} — Revision Notes — ExamGlow` }],
  }),
  component: SyllabusNotes,
});

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BulletItem { text: string; bold?: boolean; sub?: string[] }

interface NoteBlock {
  kind: "intro" | "bullets" | "definition" | "table" | "tip" | "image" | "video" | "warning" | "heading";
  text?: string;
  items?: BulletItem[];
  term?: string;
  definition?: string;
  headers?: string[];
  rows?: string[][];
  prompt?: string;
  src?: string;
  caption?: string;
  side?: string;
  youtubeId?: string;
  title?: string;
}

interface NotePage { section: string; blocks: NoteBlock[] }

interface NotesData {
  subject: string;
  title: string;
  summary: string;
  pages: NotePage[];
}

interface TopicCache {
  status: "pending" | "loading" | "done" | "error";
  data?: NotesData;
  error?: string;
}

type CacheMap = Map<string, TopicCache>;

// ─── Inline bold parser ─────────────────────────────────────────────────────────

function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} className="font-bold text-slate-900">{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ─── Image block with lazy load + spinner ──────────────────────────────────────

function NoteImage({ src, caption }: { src: string; caption?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <figure className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
      <div className="relative min-h-40 flex items-center justify-center bg-slate-100">
        {!loaded && !err && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Generating diagram…</span>
          </div>
        )}
        {err && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-slate-300" />
          </div>
        )}
        {!err && (
          <img
            src={src}
            alt={caption ?? "Diagram"}
            className={`w-full object-contain max-h-80 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setErr(true)}
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-center text-[11px] text-slate-500 italic py-2.5 px-4 bg-white border-t border-slate-100">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── YouTube search embed ───────────────────────────────────────────────────────
// Uses YouTube's search URL as embed src — shows search results for the topic.

function YoutubeSearchEmbed({ topic, subject }: { topic: string; subject: string }) {
  const query = encodeURIComponent(`${topic} ${subject} IGCSE revision`);
  const searchUrl = `https://www.youtube.com/results?search_query=${query}`;
  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="bg-red-600 px-4 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center shrink-0">
          <Play className="w-3.5 h-3.5 fill-white text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">Revision Videos</p>
          <p className="text-[10px] text-red-200">{topic} · {subject}</p>
        </div>
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-[10px] text-red-200 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> Open on YouTube
        </a>
      </div>
      <div className="relative w-full bg-slate-900" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(`${topic} ${subject} IGCSE`)}&rel=0&modestbranding=1`}
          title={`${topic} revision videos`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// ─── Block renderer ─────────────────────────────────────────────────────────────

function BlockRenderer({ block }: { block: NoteBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <h3 className="text-xl font-extrabold text-slate-900 mt-10 mb-4 pb-2 border-b-2 border-primary/30">
          {block.text}
        </h3>
      );

    case "intro":
      return (
        <p className="text-[15px] text-slate-700 leading-relaxed my-3">
          {block.text ? <Bold text={block.text} /> : null}
        </p>
      );

    case "bullets":
      return (
        <ul className="my-4 space-y-2.5 pl-1">
          {(block.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-2 w-2 h-2 rounded-full bg-primary/70 shrink-0" />
              <span className={`text-[14px] text-slate-700 leading-relaxed ${item.bold ? "font-bold" : ""}`}>
                <Bold text={item.text} />
                {item.sub && item.sub.length > 0 && (
                  <ul className="mt-1.5 ml-4 space-y-1">
                    {item.sub.map((s, j) => (
                      <li key={j} className="flex items-start gap-2 text-[13px] text-slate-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        <Bold text={s} />
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </li>
          ))}
        </ul>
      );

    case "definition":
      return (
        <div className="my-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl px-5 py-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Definition</p>
          <p className="text-[15px] font-bold text-slate-900">{block.term}</p>
          <p className="text-[14px] text-slate-700 mt-1 leading-relaxed">{block.definition}</p>
        </div>
      );

    case "table":
      if (!block.headers || !block.rows) return null;
      return (
        <div className="my-5 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-5 py-3 font-bold text-slate-800 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {block.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-5 py-3 text-[13px] leading-relaxed ${ci === 0 ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                        <Bold text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "tip":
      return (
        <div className="my-5 flex gap-3.5 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Exam Tip</p>
            <p className="text-[14px] text-amber-900 leading-relaxed">
              {block.text ? <Bold text={block.text} /> : null}
            </p>
          </div>
        </div>
      );

    case "warning":
      return (
        <div className="my-5 flex gap-3.5 bg-rose-50 border border-rose-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-1">Common Mistake</p>
            <p className="text-[14px] text-rose-900 leading-relaxed">
              {block.text ? <Bold text={block.text} /> : null}
            </p>
          </div>
        </div>
      );

    case "image":
      return block.src ? <NoteImage src={block.src} caption={block.caption} /> : null;

    default:
      return null;
  }
}

// ─── Notes content pane ─────────────────────────────────────────────────────────

function NotesPane({
  topicTitle, unitTitle, subjectName, subjectCode, cache,
}: {
  topicTitle: string;
  unitTitle: string;
  subjectName: string;
  subjectCode: string;
  cache: TopicCache | undefined;
}) {
  const state = cache?.status ?? "pending";

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Breadcrumb */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
        <GraduationCap className="w-3.5 h-3.5 text-primary" />
        <span className="text-primary font-semibold">{subjectName}</span>
        <ChevronRight className="w-3 h-3" />
        <span>{unitTitle}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-semibold">{topicTitle}</span>
      </div>

      <div className="px-6 pb-10">
        {/* Topic title */}
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3 mb-1 tracking-tight">{topicTitle}</h1>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            {subjectCode}
          </span>
          <span className="text-xs text-slate-400">{unitTitle}</span>
        </div>

        {/* Loading */}
        {(state === "pending" || state === "loading") && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Generating full notes for "{topicTitle}"…</p>
            <p className="text-xs text-slate-400">Building comprehensive revision content from the syllabus</p>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <AlertCircle className="w-10 h-10 text-rose-300" />
            <p className="text-sm font-semibold text-slate-600">Failed to load notes</p>
            <p className="text-xs text-slate-400">{cache?.error}</p>
          </div>
        )}

        {/* Content */}
        {state === "done" && cache?.data && (
          <>
            {/* Summary box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Overview</p>
              <p className="text-[15px] text-slate-700 leading-relaxed">{cache.data.summary}</p>
            </div>

            {/* All pages/sections rendered inline (no tabs — full document) */}
            {cache.data.pages.map((page, pi) => (
              <section key={pi} className="mb-10">
                <h2 className="text-2xl font-extrabold text-slate-900 mt-8 mb-5 pb-3 border-b-2 border-primary/20">
                  {page.section}
                </h2>
                {page.blocks.map((block, bi) => (
                  <BlockRenderer key={bi} block={block} />
                ))}
              </section>
            ))}

            {/* YouTube section */}
            <section className="mt-10 border-t border-slate-100 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center shrink-0">
                  <Play className="w-3 h-3 fill-white text-white" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Revision Videos</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Watch curated revision videos for <strong>{topicTitle}</strong> to reinforce your understanding.
              </p>
              <YoutubeSearchEmbed topic={topicTitle} subject={subjectName} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

function SyllabusNotes() {
  const { code, name } = Route.useParams();
  const decodedName = decodeURIComponent(name);

  const subjectId = findSubjectId(code, decodedName);
  const syllabusData = getSyllabusData(subjectId);
  const objectives = syllabusData?.objectives ?? [];

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (objectives.length > 0) s.add(objectives[0].id);
    return s;
  });

  // Active topic
  const [activeTopic, setActiveTopic] = useState<{
    topicTitle: string; unitTitle: string;
  } | null>(() => {
    const firstUnit = objectives[0];
    const firstSub = firstUnit?.subObjectives?.[0];
    if (firstUnit && firstSub) {
      return { topicTitle: firstSub.title, unitTitle: `Unit ${firstUnit.code}: ${firstUnit.title}` };
    }
    return null;
  });

  // Notes cache keyed by topicTitle
  const cacheRef = useRef<CacheMap>(new Map());
  const [, forceUpdate] = useState(0);
  const triggerRender = useCallback(() => forceUpdate(n => n + 1), []);

  // Fetch notes for a single topic
  const fetchTopic = useCallback(async (topicTitle: string, unitTitle: string) => {
    const existing = cacheRef.current.get(topicTitle);
    if (existing && existing.status !== "pending") return; // already fetching/done

    cacheRef.current.set(topicTitle, { status: "loading" });
    triggerRender();

    try {
      const result = await apiFetch<NotesData>("/api/ai/generate-notes/", {
        method: "POST",
        body: JSON.stringify({
          topic: topicTitle,
          subject: `${decodedName} (${code}) — ${unitTitle}`,
        }),
      });
      cacheRef.current.set(topicTitle, { status: "done", data: result });
    } catch (e: any) {
      cacheRef.current.set(topicTitle, {
        status: "error",
        error: e?.message ?? "Failed to load notes.",
      });
    }
    triggerRender();
  }, [decodedName, code, triggerRender]);

  // On mount — prefetch ALL topics in background, sequentially to avoid hammering the API
  useEffect(() => {
    if (objectives.length === 0) return;
    const allTopics: { topicTitle: string; unitTitle: string }[] = [];
    for (const obj of objectives) {
      for (const sub of obj.subObjectives ?? []) {
        allTopics.push({
          topicTitle: sub.title,
          unitTitle: `Unit ${obj.code}: ${obj.title}`,
        });
      }
    }
    // Mark all as pending immediately
    for (const t of allTopics) {
      if (!cacheRef.current.has(t.topicTitle)) {
        cacheRef.current.set(t.topicTitle, { status: "pending" });
      }
    }
    // Sequential prefetch — one at a time to avoid rate limits
    (async () => {
      for (const t of allTopics) {
        await fetchTopic(t.topicTitle, t.unitTitle);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const toggleUnit = (id: string) =>
    setExpandedUnits(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectTopic = (topicTitle: string, unitTitle: string) => {
    setActiveTopic({ topicTitle, unitTitle });
    // Ensure it's being fetched (might not have started yet if user is fast)
    fetchTopic(topicTitle, unitTitle);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header authed />

      {/* ── Sticky sub-header ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link
            to="/subjects"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Subjects
          </Link>
          <div className="w-px h-4 bg-slate-200 shrink-0" />
          <BookOpen className="w-4 h-4 text-primary shrink-0" />
          <span className="font-bold text-slate-900 text-sm truncate">{decodedName}</span>
          <span className="text-xs text-slate-400 font-mono shrink-0">{code}</span>
          <div className="ml-auto">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500"
              title="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside className="w-64 xl:w-72 shrink-0 border-r border-slate-200 bg-white flex flex-col sticky top-[49px] h-[calc(100vh-49px)] overflow-y-auto">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Revision Notes</span>
              </div>
              <Link to="/subjects" className="text-[10px] text-primary font-semibold hover:underline flex items-center gap-0.5">
                View all topics <ChevronRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            <nav className="flex-1 px-2 py-2">
              {objectives.map((obj) => {
                const isExpanded = expandedUnits.has(obj.id);
                const completedCount = (obj.subObjectives ?? []).filter(
                  s => cacheRef.current.get(s.title)?.status === "done"
                ).length;
                const total = obj.subObjectives?.length ?? 0;
                return (
                  <div key={obj.id} className="mb-1">
                    {/* Unit row */}
                    <button
                      onClick={() => toggleUnit(obj.id)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors truncate">
                          Unit {obj.code}: {obj.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {total} topics · {completedCount} ready
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Topic rows */}
                    {isExpanded && (
                      <div className="ml-3 pl-3 border-l-2 border-slate-100 mb-2 space-y-0.5">
                        {(obj.subObjectives ?? []).map((sub) => {
                          const cached = cacheRef.current.get(sub.title);
                          const isActive = activeTopic?.topicTitle === sub.title;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => selectTopic(sub.title, `Unit ${obj.code}: ${obj.title}`)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                                isActive
                                  ? "bg-primary text-white font-bold"
                                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              <div className="shrink-0">
                                {cached?.status === "done" ? (
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? "text-white/80" : "text-emerald-400"}`} />
                                ) : cached?.status === "loading" ? (
                                  <Loader2 className={`w-3.5 h-3.5 animate-spin ${isActive ? "text-white/70" : "text-amber-400"}`} />
                                ) : cached?.status === "error" ? (
                                  <AlertCircle className={`w-3.5 h-3.5 ${isActive ? "text-white/70" : "text-red-400"}`} />
                                ) : (
                                  <div className={`w-3.5 h-3.5 rounded-full border-2 ${isActive ? "border-white/50" : "border-slate-300"}`} />
                                )}
                              </div>
                              <span className="text-[12px] leading-snug truncate">{sub.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>
        )}

        {/* ── Main notes area ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {activeTopic ? (
            <NotesPane
              topicTitle={activeTopic.topicTitle}
              unitTitle={activeTopic.unitTitle}
              subjectName={decodedName}
              subjectCode={code}
              cache={cacheRef.current.get(activeTopic.topicTitle)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-slate-400 gap-4">
              <BookOpen className="w-12 h-12 opacity-30" />
              <p className="font-semibold">Select a topic from the sidebar to start revising</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function findSubjectId(code: string, name: string): string {
  const slugName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const candidates = [`${slugName}-${code}`, slugName];
  for (const id of candidates) {
    if (getSyllabusData(id)) return id;
  }

  const CODE_MAP: Record<string, string> = {
    "0610": "biology-0610",
    "0620": "chemistry-0620",
    "0625": "physics-0625",
    "0580": "mathematics-0580",
    "0606": "mathematics-0580",
    "0478": "computer-science-0478",
    "0455": "economics-0455",
    "0470": "history-0470",
    "0460": "geography-0460",
    "0500": "english-language-0500",
    "0450": "business-studies-0450",
    "0452": "accounting-0452",
  };
  if (CODE_MAP[code]) return CODE_MAP[code];
  return `${slugName}-${code}`;
}
