import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { apiFetch } from "@/lib/api-client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, BookOpen, ChevronRight, ChevronDown, ChevronUp,
  Loader2, GraduationCap, Lightbulb, AlertCircle,
  CheckCircle2, List, Image as ImageIcon, Menu, X,
  ExternalLink, Play, RefreshCw,
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
  const [retries, setRetries] = useState(0);
  const [imgSrc, setImgSrc] = useState(src);

  // On error: retry up to 2 times with a fresh seed, then show fallback
  const handleError = () => {
    if (retries < 2) {
      // Append a new random seed to bust cache and retry
      const base = src.replace(/&seed=\d+/, "");
      setImgSrc(`${base}&seed=${Math.floor(Math.random() * 99999)}&retry=${retries + 1}`);
      setRetries(r => r + 1);
      setLoaded(false);
    }
    // After 2 retries just leave imgSrc pointing to the last failed URL — broken-image shown
  };

  const failed = retries >= 2 && !loaded;

  return (
    <figure className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
      <div className="relative min-h-40 flex items-center justify-center bg-slate-100">
        {!loaded && !failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {retries > 0 ? `Retrying diagram… (${retries}/2)` : "Generating diagram…"}
            </span>
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <ImageIcon className="w-8 h-8 text-slate-300" />
            <p className="text-[11px] text-slate-400 text-center">{caption ?? "Diagram unavailable"}</p>
            <button
              onClick={() => { setRetries(0); setImgSrc(`${src}&seed=${Math.floor(Math.random() * 99999)}`); setLoaded(false); }}
              className="flex items-center gap-1 text-[10px] text-primary font-semibold hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}
        {!failed && (
          <img
            key={imgSrc}
            src={imgSrc}
            alt={caption ?? "Diagram"}
            className={`w-full object-contain max-h-80 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={handleError}
          />
        )}
      </div>
      {caption && !failed && (
        <figcaption className="text-center text-[11px] text-slate-500 italic py-2.5 px-4 bg-white border-t border-slate-100">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── YouTube revision videos — thumbnail preview cards ──────────────────────────

const CURATED: Record<string, { id: string; title: string; channel: string }[]> = {
  "cell": [{ id: "S9WtBRNydso", title: "Cell Structure & Function", channel: "Cognito" }, { id: "8IlzKri08kU", title: "Cell Biology Revision", channel: "Free Science Lessons" }],
  "diffusion": [{ id: "7B-1zmImPko", title: "Diffusion & Osmosis IGCSE", channel: "Cognito" }, { id: "m6LNWmRbWMg", title: "Diffusion Explained", channel: "Free Science Lessons" }],
  "osmosis": [{ id: "7B-1zmImPko", title: "Osmosis & Diffusion", channel: "Cognito" }, { id: "m6LNWmRbWMg", title: "Osmosis Explained", channel: "Free Science Lessons" }],
  "photosynthesis": [{ id: "uixA8ZuPzXk", title: "Photosynthesis IGCSE", channel: "Cognito" }, { id: "ljGCKPpBfAo", title: "Photosynthesis Revision", channel: "Free Science Lessons" }],
  "respiration": [{ id: "5_-e-n5FMIY", title: "Respiration IGCSE", channel: "Cognito" }, { id: "kFBCyQ5NjAM", title: "Aerobic Respiration", channel: "Free Science Lessons" }],
  "enzyme": [{ id: "qgVFkRn8f10", title: "Enzymes IGCSE", channel: "Cognito" }, { id: "YzIBgVQhBRw", title: "Enzyme Action & Factors", channel: "Free Science Lessons" }],
  "dna": [{ id: "zwibgNGe4aY", title: "DNA & Protein Synthesis", channel: "Cognito" }, { id: "8kK2zwjRV0M", title: "DNA Structure IGCSE", channel: "Free Science Lessons" }],
  "gene": [{ id: "5i3zB2i9n8o", title: "Genetics & Inheritance", channel: "Cognito" }, { id: "CBezq1fFUEA", title: "Genetic Crosses IGCSE", channel: "Free Science Lessons" }],
  "heart": [{ id: "OHLxPnJCJGo", title: "The Heart & Circulation", channel: "Cognito" }, { id: "XX68_3p3MGk", title: "Heart Structure IGCSE", channel: "Free Science Lessons" }],
  "atom": [{ id: "M2uPlWPETt4", title: "Atomic Structure IGCSE", channel: "Cognito" }, { id: "jTMK9PQa-OI", title: "Atoms & Elements IGCSE", channel: "Free Science Lessons" }],
  "bond": [{ id: "55JkKSJZ9i8", title: "Chemical Bonding IGCSE", channel: "Cognito" }, { id: "TRlS9-kPgcI", title: "Ionic & Covalent Bonds", channel: "Free Science Lessons" }],
  "force": [{ id: "QUEH5uS_fqI", title: "Forces & Motion IGCSE", channel: "Cognito" }, { id: "HVT3Y3_gHGg", title: "Newton's Laws IGCSE", channel: "Free Science Lessons" }],
  "wave": [{ id: "Rbuhdo0AZDU", title: "Waves IGCSE", channel: "Cognito" }, { id: "3VDVm_4sMf0", title: "Wave Properties IGCSE", channel: "Free Science Lessons" }],
  "electricity": [{ id: "AmSaqNOlsRM", title: "Electricity & Circuits", channel: "Cognito" }, { id: "9ckPQBOER9Q", title: "Electric Circuits IGCSE", channel: "Free Science Lessons" }],
  "algebra": [{ id: "NybHckSEQBI", title: "Algebra IGCSE Revision", channel: "Exam Solutions" }, { id: "kn7KCzQHi-4", title: "Algebra Full Revision", channel: "Math Genie" }],
  "probability": [{ id: "eCRG7YJpPCE", title: "Probability IGCSE", channel: "Exam Solutions" }, { id: "JiWyHsKFPSc", title: "Probability Trees", channel: "Corbettmaths" }],
  "accounting": [{ id: "uvTavBFJ59Y", title: "Introduction to Accounting", channel: "Accounting Stuff" }, { id: "7CKXJBTshso", title: "IGCSE Accounting Basics", channel: "Accounting Stuff" }],
  "purpose": [{ id: "uvTavBFJ59Y", title: "Purpose of Accounting", channel: "Accounting Stuff" }, { id: "yYX4bvQSqbo", title: "Why Accounting Matters", channel: "Accounting Stuff" }],
  "balance": [{ id: "lVmQm_bSdos", title: "Balance Sheet Explained", channel: "Accounting Stuff" }, { id: "9l-DfZMqjdI", title: "Trial Balance IGCSE", channel: "Tutor2u" }],
  "supply": [{ id: "ewPNugIqCUM", title: "Supply & Demand Economics", channel: "MRU" }, { id: "LwPSqh0GBwg", title: "Supply & Demand IGCSE", channel: "Tutor2u" }],
  "demand": [{ id: "ewPNugIqCUM", title: "Supply & Demand", channel: "MRU" }, { id: "LwPSqh0GBwg", title: "Demand IGCSE Economics", channel: "Tutor2u" }],
};

function getVideosForTopic(topic: string) {
  const lower = topic.toLowerCase();
  for (const [kw, vids] of Object.entries(CURATED)) {
    if (lower.includes(kw)) return vids;
  }
  return [];
}

// ─── Mini video player modal ────────────────────────────────────────────────────

function VideoPlayerModal({ videoId, title, channel, onClose }: {
  videoId: string; title: string; channel: string; onClose: () => void;
}) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Iframe player */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {/* Footer bar */}
        <div className="bg-slate-900 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{title}</p>
            <p className="text-[11px] text-slate-400">{channel}</p>
          </div>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shrink-0"
          >
            <ExternalLink className="w-3 h-3" /> Open on YouTube
          </a>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ videoId, title, channel }: { videoId: string; title: string; channel: string }) {
  const [open, setOpen] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <>
      {/* Thumbnail card — always stays visible */}
      <button
        onClick={() => setOpen(true)}
        className="group w-full text-left rounded-2xl overflow-hidden border border-slate-200 hover:border-red-300 hover:shadow-md transition-all bg-white"
      >
        <div className="relative w-full bg-slate-900" style={{ paddingBottom: "56.25%" }}>
          <img
            src={thumb}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">{title}</p>
          <p className="text-[11px] text-slate-400 mt-1">{channel}</p>
        </div>
      </button>

      {/* Modal player — appears on top, thumbnail stays underneath */}
      {open && (
        <VideoPlayerModal
          videoId={videoId}
          title={title}
          channel={channel}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function YoutubeSearchEmbed({ topic, subject }: { topic: string; subject: string }) {
  const curated = getVideosForTopic(topic);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} ${subject} IGCSE revision`)}`;

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="bg-red-600 px-4 py-3.5 flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center shrink-0">
          <Play className="w-4 h-4 fill-white text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Revision Videos</p>
          <p className="text-[11px] text-red-200 truncate">{topic} · {subject}</p>
        </div>
        <a href={searchUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-red-200 hover:text-white transition-colors shrink-0">
          <ExternalLink className="w-3 h-3" /> More on YouTube
        </a>
      </div>

      <div className="p-4 bg-white">
        {curated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {curated.map((v) => (
              <VideoCard key={v.id} videoId={v.id} title={v.title} channel={v.channel} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: `${topic} — Full Revision`, q: `${topic} ${subject} IGCSE`, ch: "YouTube" },
              { label: `${topic} — Cognito IGCSE`, q: `${topic} IGCSE Cognito`, ch: "Cognito" },
              { label: `${topic} — Free Science Lessons`, q: `${topic} IGCSE freesciencelessons`, ch: "Free Science Lessons" },
              { label: `${topic} — Exam Tips`, q: `${topic} IGCSE exam tips`, ch: "YouTube" },
            ].map(({ label, q, ch }) => (
              <a key={q} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
                  <Play className="w-4 h-4 text-red-600 fill-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-red-700 truncate">{label}</p>
                  <p className="text-[10px] text-slate-400">{ch}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-400 shrink-0" />
              </a>
            ))}
          </div>
        )}
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
  topicTitle, unitTitle, subjectName, subjectCode, cache, cacheRef, fetchTopic,
}: {
  topicTitle: string;
  unitTitle: string;
  subjectName: string;
  subjectCode: string;
  cache: TopicCache | undefined;
  cacheRef: React.MutableRefObject<CacheMap>;
  fetchTopic: (t: string, u: string) => void;
}) {
  const state = cache?.status ?? "pending";

  return (
    <div className="w-full">
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
            <p className="text-xs text-slate-400 text-center max-w-xs">{cache?.error}</p>
            <button
              onClick={() => {
                cacheRef.current.set(topicTitle, { status: "pending" });
                fetchTopic(topicTitle, unitTitle);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
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

// ─── Sidebar nav — extracted so it can be used in both desktop + mobile drawer ──

interface SyllabusObjectiveItem {
  id: string;
  code: string;
  title: string;
  subObjectives?: { id: string; title: string }[];
}

function SidebarNav({
  objectives, expandedUnits, toggleUnit, activeTopic, selectTopic, cacheRef,
}: {
  objectives: SyllabusObjectiveItem[];
  expandedUnits: Set<string>;
  toggleUnit: (id: string) => void;
  activeTopic: { topicTitle: string; unitTitle: string } | null;
  selectTopic: (t: string, u: string) => void;
  cacheRef: React.MutableRefObject<CacheMap>;
}) {
  return (
    <>
      {objectives.map((obj) => {
        const isExpanded = expandedUnits.has(obj.id);
        const completedCount = (obj.subObjectives ?? []).filter(
          s => cacheRef.current.get(s.title)?.status === "done"
        ).length;
        const total = obj.subObjectives?.length ?? 0;
        return (
          <div key={obj.id} className="mb-1">
            <button
              onClick={() => toggleUnit(obj.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors truncate">
                  Unit {obj.code}: {obj.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{total} topics · {completedCount} ready</p>
              </div>
              {isExpanded
                ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              }
            </button>
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
                        isActive ? "bg-primary text-white font-bold" : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <div className="shrink-0">
                        {cached?.status === "done"
                          ? <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? "text-white/80" : "text-emerald-400"}`} />
                          : cached?.status === "loading"
                          ? <Loader2 className={`w-3.5 h-3.5 animate-spin ${isActive ? "text-white/70" : "text-amber-400"}`} />
                          : cached?.status === "error"
                          ? <AlertCircle className={`w-3.5 h-3.5 ${isActive ? "text-white/70" : "text-red-400"}`} />
                          : <div className={`w-3.5 h-3.5 rounded-full border-2 ${isActive ? "border-white/50" : "border-slate-300"}`} />
                        }
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
    </>
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

  // Fetch notes for a single topic — retries once with simpler request on malformed JSON
  const fetchTopic = useCallback(async (topicTitle: string, unitTitle: string, attempt = 0) => {
    const existing = cacheRef.current.get(topicTitle);
    if (existing && existing.status !== "pending") return;

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
      // Retry once if it's a malformed content error
      if (attempt === 0 && e?.message?.includes("malformed")) {
        cacheRef.current.set(topicTitle, { status: "pending" });
        await new Promise(r => setTimeout(r, 2000));
        return fetchTopic(topicTitle, unitTitle, 1);
      }
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
          <span className="text-xs text-slate-400 font-mono shrink-0 hidden sm:inline">{code}</span>
          <div className="ml-auto flex items-center gap-2">
            {/* Mobile: show sidebar as drawer */}
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500"
              title="Toggle topics"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile sidebar drawer overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 bg-white h-full flex flex-col overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <List className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Revision Notes</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-2">
              <SidebarNav
                objectives={objectives}
                expandedUnits={expandedUnits}
                toggleUnit={toggleUnit}
                activeTopic={activeTopic}
                selectTopic={(t, u) => { selectTopic(t, u); setSidebarOpen(false); }}
                cacheRef={cacheRef}
              />
            </nav>
          </aside>
        </div>
      )}

      {/* ── Desktop: two-column layout ── */}
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">

        {/* Desktop sidebar — always visible on lg+ */}
        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-slate-200 bg-white flex-col self-start sticky top-[49px] max-h-[calc(100vh-49px)] overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <List className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Revision Notes</span>
            </div>
            <Link to="/subjects" className="text-[10px] text-primary font-semibold hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-2.5 h-2.5" />
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-2">
            <SidebarNav
              objectives={objectives}
              expandedUnits={expandedUnits}
              toggleUnit={toggleUnit}
              activeTopic={activeTopic}
              selectTopic={selectTopic}
              cacheRef={cacheRef}
            />
          </nav>
        </aside>

        {/* ── Main notes area — scrolls naturally ── */}
        <main className="flex-1 min-w-0">
          {activeTopic ? (
            <NotesPane
              topicTitle={activeTopic.topicTitle}
              unitTitle={activeTopic.unitTitle}
              subjectName={decodedName}
              subjectCode={code}
              cache={cacheRef.current.get(activeTopic.topicTitle)}
              cacheRef={cacheRef}
              fetchTopic={fetchTopic}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4 p-8">
              <BookOpen className="w-12 h-12 opacity-30" />
              <p className="font-semibold text-center">Select a topic from the menu to start revising</p>
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
