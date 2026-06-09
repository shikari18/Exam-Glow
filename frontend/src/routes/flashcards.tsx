import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Flame,
  CheckCircle2,
  Timer,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  BookOpen,
  Brain,
  Calendar,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getDecks, getDeckWithCards, getDueCards, updateCardProgress } from "@/api/flashcards";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import type { FlashcardDeck, Flashcard } from "@/api/flashcards";

export const Route = createFileRoute("/flashcards")({
  head: () => ({ meta: [{ title: "Flashcards — ExamGlow" }] }),
  component: Flashcards,
});

function Flashcards() {
  const { user, loading: authLoading } = useAuth();
  const { enrolledSubjects } = useProfile();
  const navigate = useNavigate();
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [srsMode, setSrsMode] = useState(false);
  const [dueCount, setDueCount] = useState<Record<string, number>>({});
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deckLoading, setDeckLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [results, setResults] = useState({ known: 0, learning: 0 });

  useEffect(() => {
    if (!authLoading && !user) { navigate({ to: "/login" as any }); return; }
    if (!authLoading) {
      getDecks().then((d) => { setDecks(d); setLoading(false); });
    }
  }, [user, authLoading]);

  // Timer
  useEffect(() => {
    if (!selectedDeck || sessionDone) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [selectedDeck, sessionDone]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const loadDeck = async (deck: FlashcardDeck) => {
    setDeckLoading(true);
    setFlipped(false);
    setCurrentIndex(0);
    setSessionDone(false);
    setResults({ known: 0, learning: 0 });
    setElapsed(0);

    if (srsMode) {
      const data = await getDueCards(deck.id);
      setCards(data.cards);
      setMasteredCount(0);
    } else {
      const data = await getDeckWithCards(deck.id);
      setCards(data.cards);
      setMasteredCount(data.masteredCount);
    }
    setSelectedDeck(deck);
    setDeckLoading(false);
  };

  const handleShuffle = () => {
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setFlipped(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setSessionDone(false);
    setResults({ known: 0, learning: 0 });
    setElapsed(0);
  };

  const handleAnswer = async (known: boolean, quality?: number) => {
    const card = cards[currentIndex];
    if (user) {
      await updateCardProgress(card.id, known, quality ?? (known ? 4 : 1));
    }
    setResults((r) => ({ known: r.known + (known ? 1 : 0), learning: r.learning + (!known ? 1 : 0) }));
    const next = currentIndex + 1;
    if (next >= cards.length) {
      setSessionDone(true);
      if (user) {
        await api.post('/api/examglow/bookmarks/', {
          resourceType: "Flashcards",
          title: `${selectedDeck?.subject}: ${selectedDeck?.name}`,
          subject: selectedDeck?.subject,
        }).catch(() => {});
      }
    } else {
      setCurrentIndex(next);
      setFlipped(false);
    }
  };

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? Math.round((currentIndex / cards.length) * 100) : 0;

  if (authLoading) return null;

  // Deck selection view
  if (!selectedDeck) {
    const filteredDecks = activeSubject === "All"
      ? decks
      : decks.filter((d) => d.subject === activeSubject);

    const subjectTabs = ["All", ...enrolledSubjects.filter((s) =>
      decks.some((d) => d.subject === s)
    )];

    return (
      <div className="min-h-screen flex flex-col">
        <Header authed />
        <section className="bg-pink-softer/60 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display text-3xl">Flashcard Decks</h1>
                <p className="text-sm text-foreground/60 mt-1">Choose a deck to start reviewing</p>
              </div>
              {/* SRS mode toggle */}
              <button
                onClick={() => setSrsMode((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                  srsMode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <Brain className="w-4 h-4" />
                {srsMode ? "SRS Mode: ON" : "SRS Mode: OFF"}
              </button>
            </div>
            {srsMode && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Spaced repetition mode — only showing cards due for review today. Cards are scheduled based on how well you know them.</span>
              </div>
            )}
          </div>
        </section>
        <main className="max-w-7xl mx-auto w-full px-6 py-8">
          {/* Subject filter tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {subjectTabs.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  activeSubject === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/40 hover:bg-pink-soft/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : filteredDecks.length === 0 ? (
            <div className="text-center py-20 text-foreground/50">
              <p className="font-semibold">No decks found for {activeSubject}</p>
              <p className="text-sm mt-1">Try selecting a different subject or check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredDecks.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => loadDeck(deck)}
                  className="bg-white border border-border rounded-2xl overflow-hidden text-left hover:shadow-lg transition-all hover:border-primary/30 group"
                >
                  {deck.image_url ? (
                    <div className="h-32 w-full overflow-hidden">
                      <img src={deck.image_url} alt={deck.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-pink-soft/40 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-primary/40" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">{deck.subject}</p>
                    <h3 className="font-bold mt-1 leading-tight group-hover:text-primary transition-colors">{deck.name}</h3>
                    <p className="text-xs text-foreground/60 mt-2 line-clamp-2">{deck.description}</p>
                    <p className="text-xs font-semibold text-foreground/50 mt-3">{deck.card_count} cards</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // Session done view
  if (sessionDone) {
    const total = results.known + results.learning;
    const pct = total > 0 ? Math.round((results.known / total) * 100) : 0;
    return (
      <div className="min-h-screen flex flex-col">
        <Header authed />
        <main className="max-w-2xl mx-auto w-full px-6 py-16 text-center">
          <div className="text-6xl mb-6">{pct >= 80 ? "🏆" : pct >= 50 ? "📚" : "💪"}</div>
          <h1 className="font-display text-4xl">Session Complete!</h1>
          <p className="text-foreground/60 mt-2">You reviewed all {cards.length} cards in {formatTime(elapsed)}.</p>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-green-50 rounded-2xl p-6">
              <p className="text-3xl font-bold text-green-600">{results.known}</p>
              <p className="text-sm text-green-700 mt-1">Cards Known ✓</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6">
              <p className="text-3xl font-bold text-orange-500">{results.learning}</p>
              <p className="text-sm text-orange-600 mt-1">Still Learning</p>
            </div>
          </div>
          <div className="mt-6 h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm text-foreground/60 mt-2">{pct}% mastered this session</p>
          <div className="flex gap-3 justify-center mt-8">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
            >
              Retry Deck
            </button>
            <button
              onClick={() => { setSelectedDeck(null); setCards([]); }}
              className="px-6 py-3 rounded-full border border-border font-semibold"
            >
              Back to Decks
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />
      <section className="bg-pink-softer/60 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => { setSelectedDeck(null); setCards([]); }}
              className="text-xs text-foreground/60 mb-1 hover:text-primary flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" /> All Decks
            </button>
            <h1 className="font-display text-3xl">{selectedDeck.name}</h1>
            <p className="text-sm text-foreground/60 mt-1">
              ✿ {cards.length} cards in this deck
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { Icon: Flame, label: "STREAK", val: `${masteredCount > 0 ? "🔥 Active" : "Start!"}`, color: "text-orange-400 bg-orange-50" },
              { Icon: CheckCircle2, label: "MASTERED", val: `${masteredCount}/${cards.length}`, color: "text-green-500 bg-green-50" },
              { Icon: Timer, label: "FOCUS TIME", val: formatTime(elapsed), color: "text-baby-blue bg-baby-blue/20" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl px-5 py-3 flex items-center gap-3 border border-border">
                <span className={`w-9 h-9 rounded-full inline-flex items-center justify-center ${s.color}`}>
                  <s.Icon className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[10px] tracking-wider text-foreground/60">{s.label}</p>
                  <p className="font-bold">{s.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleShuffle}
              className="px-4 py-1.5 rounded-full border border-border text-sm inline-flex items-center gap-1 hover:bg-muted/50"
            >
              <Shuffle className="w-3 h-3" /> Shuffle
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-1.5 rounded-full border border-border text-sm inline-flex items-center gap-1 hover:bg-muted/50"
            >
              <RotateCcw className="w-3 h-3" /> Restart
            </button>
          </div>
          <span className="text-sm text-foreground/60">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs mb-2">
            <span><b>PROGRESS:</b> {currentIndex + 1} / {cards.length}</span>
            <span><b>{progress}%</b> THROUGH DECK</span>
          </div>
          <div className="h-1.5 bg-pink-soft rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {deckLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : currentCard ? (
          <div className="mt-6">
            <div
              className="relative cursor-pointer select-none"
              onClick={() => setFlipped(!flipped)}
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  minHeight: "280px",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-pink-softer rounded-3xl p-8 flex flex-col items-center justify-center text-center backface-hidden border border-pink-soft"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xs tracking-widest text-primary uppercase mb-3">{currentCard.topic ?? "QUESTION"}</p>
                  {currentCard.image_url && (
                    <div className="w-full max-h-40 overflow-hidden rounded-xl mb-4 border border-pink-soft/50">
                      <img src={currentCard.image_url} alt="Diagram" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <h2 className="font-display text-2xl md:text-3xl leading-snug">{currentCard.front}</h2>
                  <p className="text-xs text-foreground/50 mt-6">Click to reveal answer</p>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 bg-lavender-soft rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-lavender/20"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <p className="text-xs tracking-widest text-lavender uppercase mb-3">ANSWER</p>
                  <h2 className="font-display text-xl leading-snug text-foreground">{currentCard.back}</h2>
                </div>
              </div>
            </div>

            {flipped && (
              <div className="mt-6 space-y-3 animate-in fade-in duration-300">
                {srsMode ? (
                  // SRS quality buttons (5-point scale)
                  <div>
                    <p className="text-xs text-center text-foreground/50 mb-3">How well did you know this?</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { q: 0, label: "Blank", color: "bg-red-100 text-red-700 border-red-200" },
                        { q: 1, label: "Wrong", color: "bg-orange-100 text-orange-700 border-orange-200" },
                        { q: 2, label: "Hard", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
                        { q: 3, label: "OK", color: "bg-blue-100 text-blue-700 border-blue-200" },
                        { q: 4, label: "Easy", color: "bg-green-100 text-green-700 border-green-200" },
                      ].map(({ q, label, color }) => (
                        <button
                          key={q}
                          onClick={() => handleAnswer(q >= 3, q)}
                          className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-colors hover:opacity-80 ${color}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-center text-foreground/40 mt-2">
                      Cards rated OK/Easy will be shown less often. Wrong/Hard cards come back sooner.
                    </p>
                  </div>
                ) : (
                  // Simple binary buttons
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleAnswer(false, 1)}
                      className="flex-1 max-w-[180px] py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-600 font-semibold flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" /> Still Learning
                    </button>
                    <button
                      onClick={() => handleAnswer(true, 4)}
                      className="flex-1 max-w-[180px] py-3 rounded-2xl border-2 border-green-200 bg-green-50 text-green-600 font-semibold flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" /> Got It!
                    </button>
                  </div>
                )}
              </div>
            )}

            {!flipped && (
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); }}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-full border border-border text-sm flex items-center gap-1 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3 h-3" /> Previous
                </button>
                <button
                  onClick={() => { setCurrentIndex(Math.min(cards.length - 1, currentIndex + 1)); setFlipped(false); }}
                  disabled={currentIndex === cards.length - 1}
                  className="px-4 py-2 rounded-full border border-border text-sm flex items-center gap-1 disabled:opacity-40"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-14 rounded-2xl bg-lavender-soft p-8 grid md:grid-cols-[1fr_180px] gap-6 items-center">
          <div>
            <h3 className="font-display text-2xl">Ready to test your knowledge?</h3>
            <p className="text-sm text-foreground/70 mt-2">
              Take a quiz based on {selectedDeck.subject} to solidify what you've learned!
            </p>
            <button
              onClick={() => navigate({ to: "/quizzes" as any })}
              className="mt-4 px-5 py-2.5 rounded-full bg-lavender text-white text-sm font-semibold"
            >
              Start Topic Quiz
            </button>
          </div>
          <div className="text-6xl text-center">🏆</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
