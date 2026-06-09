import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NoteRenderer } from "@/components/NoteRenderer";
import { getChaptersForSubject, noteChapters } from "@/data/notes/index";
import { ArrowLeft, BookOpen, Bookmark, Share2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toggleBookmark, checkBookmark } from "@/api/user";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export const Route = createFileRoute("/subject-notes/$subject")({
  head: ({ params }) => ({
    meta: [{ title: `${params.subject} Notes — ExamGlow` }],
  }),
  component: SubjectNotes,
});

const SUBJECT_COLORS: Record<string, string> = {
  Biology: "from-emerald-500 to-teal-400",
  Chemistry: "from-blue-500 to-indigo-400",
  Physics: "from-amber-500 to-orange-400",
  Mathematics: "from-violet-500 to-purple-400",
};

const ALL_SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "Geography", "English", "ICT/CS"];

function SubjectNotes() {
  const { subject } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const chapters = getChaptersForSubject(subject);
  const activeChapter = chapters[activeChapterIndex];
  const gradient = SUBJECT_COLORS[subject] ?? "from-primary to-purple-500";

  useEffect(() => {
    if (!user || !activeChapter) return;
    checkBookmark("Note", `${subject}: ${activeChapter.title}`)
      .then((r) => setBookmarked(r.bookmarked));
    api.post('/api/examglow/bookmarks/', {
      resourceType: "Notes", title: `${subject}: ${activeChapter?.title ?? subject}`, subject
    }).catch(() => {});
  }, [user, subject, activeChapterIndex]);

  const handleBookmark = async () => {
    if (!user || !activeChapter) { toast.info("Sign in to bookmark"); return; }
    setBookmarkLoading(true);
    const res = await toggleBookmark({
      resourceType: "Note", title: `${subject}: ${activeChapter.title}`, subject, url: `/subject-notes/${subject}`,
    });
    setBookmarked(res.bookmarked);
    setBookmarkLoading(false);
    toast.success(res.bookmarked ? "Bookmarked!" : "Bookmark removed");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/subject-notes/${encodeURIComponent(subject)}`;
    if (navigator.share) {
      await navigator.share({ title: `${subject} Notes — ExamGlow`, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Link copied!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header authed />

      {/* Subject hero */}
      <div className={`bg-gradient-to-r ${gradient} text-white px-6 py-8`}>
        <div className="max-w-5xl mx-auto">
          <Link to="/notes" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Subjects
          </Link>
          <h1 className="font-display text-3xl font-bold">{subject}</h1>
          <p className="text-white/80 text-sm mt-1">
            {chapters.length > 0
              ? `${chapters.length} chapter${chapters.length !== 1 ? "s" : ""} · ${chapters.reduce((a, c) => a + c.pages.length, 0)} pages`
              : "Revision notes"}
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 py-8 flex-1">
        {chapters.length === 0 ? (
          // No structured notes yet — show the legacy notes
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h2 className="font-bold text-lg">Structured notes coming soon for {subject}</h2>
            <p className="text-foreground/60 text-sm mt-2">
              In the meantime, browse our comprehensive revision notes below.
            </p>
            <Link
              to="/notes"
              className="mt-4 inline-block px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              View All Notes
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[200px_1fr] gap-6">
            {/* Chapter sidebar */}
            <aside className="space-y-1">
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 hidden md:block">Chapters</p>
              {/* Mobile: horizontal scroll tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
                {chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveChapterIndex(i)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      i === activeChapterIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border bg-white"
                    }`}
                  >
                    {ch.title}
                  </button>
                ))}
              </div>
              {/* Desktop: vertical list */}
              <div className="hidden md:block space-y-1">
                {chapters.map((ch, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveChapterIndex(i)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      i === activeChapterIndex
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-foreground/70"
                    }`}
                  >
                    <p className="font-semibold leading-tight">{ch.title}</p>
                    <p className={`text-xs mt-0.5 ${i === activeChapterIndex ? "text-white/70" : "text-foreground/50"}`}>
                      {ch.pages.length} page{ch.pages.length !== 1 ? "s" : ""}
                    </p>
                  </button>
                ))}
                {/* Subject switcher */}
                <div className="pt-4 border-t border-border mt-4">
                  <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Other Subjects</p>
                  {ALL_SUBJECTS.filter((s) => s !== subject).map((s) => (
                    <Link
                      key={s}
                      to="/subject-notes/$subject"
                      params={{ subject: s }}
                      className="block px-3 py-2 rounded-xl text-sm text-foreground/60 hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Note content */}
            <div className="space-y-4">
              {/* Action bar */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                      bookmarked ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {bookmarkLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-primary" : ""}`} />}
                    {bookmarked ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm hover:border-primary/40 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/quizzes"
                    className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
                  >
                    Take Quiz
                  </Link>
                  <Link
                    to="/flashcards"
                    className="px-3 py-1.5 rounded-full border border-border text-sm font-semibold hover:bg-muted/40"
                  >
                    Flashcards
                  </Link>
                </div>
              </div>

              {/* The note renderer */}
              {activeChapter && <NoteRenderer chapter={activeChapter} />}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
