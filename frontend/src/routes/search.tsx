import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Search,
  Filter,
  FileText,
  Layers,
  HelpCircle,
  BookOpen,
  TrendingUp,
  Clock,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { z } from "zod";

export const Route = createFileRoute("/search")({
  validateSearch: (search) =>
    z.object({ q: z.string().optional() }).parse(search),
  head: () => ({ meta: [{ title: "Search — ExamGlow" }] }),
  component: SearchPage,
});

// ─── Static searchable content index ────────────────────────────────────────
type ResultItem = {
  type: "Note" | "Quiz" | "Flashcard" | "Past Paper";
  subject: string;
  title: string;
  desc: string;
  to: string;
  tags: string[];
};

const CONTENT_INDEX: ResultItem[] = [
  // Biology notes
  { type: "Note", subject: "Biology", title: "Cells & Organisation", desc: "Cell structure, organelles, tissues, organs and organ systems.", to: "/subject-notes/Biology", tags: ["cell", "nucleus", "mitochondria", "organelle", "tissue", "organ", "biology"] },
  { type: "Note", subject: "Biology", title: "Transport in Cells", desc: "Diffusion, osmosis, and active transport — mechanisms, factors, and exam definitions.", to: "/subject-notes/Biology", tags: ["diffusion", "osmosis", "active transport", "concentration", "membrane", "biology"] },
  { type: "Note", subject: "Biology", title: "Nutrition & Digestion", desc: "Digestive system, enzymes (amylase, protease, lipase), villi, and absorption.", to: "/subject-notes/Biology", tags: ["digestion", "enzyme", "amylase", "protease", "lipase", "villi", "stomach", "biology"] },
  { type: "Note", subject: "Biology", title: "Photosynthesis", desc: "Light and dark reactions, limiting factors, chlorophyll, and the word/symbol equations.", to: "/subject-notes/Biology", tags: ["photosynthesis", "chlorophyll", "light", "co2", "glucose", "biology"] },
  { type: "Note", subject: "Biology", title: "Respiration", desc: "Aerobic and anaerobic respiration, ATP, lactic acid, fermentation, and oxygen debt.", to: "/subject-notes/Biology", tags: ["respiration", "aerobic", "anaerobic", "atp", "lactic acid", "fermentation", "biology"] },
  { type: "Note", subject: "Biology", title: "Nervous System", desc: "Neurones, reflex arcs, synapses, hormones vs nerves, adrenaline, insulin, glucagon.", to: "/subject-notes/Biology", tags: ["nervous", "neurone", "reflex", "synapse", "hormone", "insulin", "adrenaline", "biology"] },
  { type: "Note", subject: "Biology", title: "Genetics & Inheritance", desc: "DNA, chromosomes, alleles, Punnett squares, dominant/recessive, codominance.", to: "/subject-notes/Biology", tags: ["genetics", "dna", "chromosome", "allele", "punnett", "dominant", "recessive", "biology"] },
  { type: "Note", subject: "Biology", title: "Ecology & Environment", desc: "Food chains, food webs, biomass pyramids, human impacts, eutrophication, deforestation.", to: "/subject-notes/Biology", tags: ["ecology", "food chain", "food web", "biomass", "deforestation", "eutrophication", "biology"] },
  // Chemistry notes
  { type: "Note", subject: "Chemistry", title: "Atomic Structure", desc: "Protons, neutrons, electrons, isotopes, electronic configuration, relative atomic mass.", to: "/subject-notes/Chemistry", tags: ["atom", "proton", "neutron", "electron", "isotope", "atomic", "chemistry"] },
  { type: "Note", subject: "Chemistry", title: "Chemical Bonding", desc: "Ionic, covalent, and metallic bonding — structures, properties, and comparisons.", to: "/subject-notes/Chemistry", tags: ["bonding", "ionic", "covalent", "metallic", "lattice", "chemistry"] },
  { type: "Note", subject: "Chemistry", title: "The Periodic Table", desc: "Groups, periods, alkali metals, halogens, noble gases, transition metals, trends.", to: "/subject-notes/Chemistry", tags: ["periodic table", "group", "period", "halogen", "alkali", "noble gas", "chemistry"] },
  { type: "Note", subject: "Chemistry", title: "Acids, Bases & Salts", desc: "pH scale, neutralisation, making salts, strong vs weak acids, titration.", to: "/subject-notes/Chemistry", tags: ["acid", "base", "salt", "ph", "neutralisation", "titration", "chemistry"] },
  { type: "Note", subject: "Chemistry", title: "Rates of Reaction", desc: "Collision theory, activation energy, catalysts, temperature, concentration, surface area.", to: "/subject-notes/Chemistry", tags: ["rate", "reaction", "collision", "catalyst", "activation energy", "chemistry"] },
  { type: "Note", subject: "Chemistry", title: "Organic Chemistry", desc: "Alkanes, alkenes, combustion, addition reactions, polymers, fermentation, esterification.", to: "/subject-notes/Chemistry", tags: ["organic", "alkane", "alkene", "polymer", "combustion", "fermentation", "chemistry"] },
  { type: "Note", subject: "Chemistry", title: "Electrolysis", desc: "Electrolytes, cathode/anode reactions, half equations, industrial applications.", to: "/subject-notes/Chemistry", tags: ["electrolysis", "cathode", "anode", "electrode", "oxidation", "reduction", "chemistry"] },
  // Physics notes
  { type: "Note", subject: "Physics", title: "Forces & Motion", desc: "Scalars, vectors, SUVAT equations, Newton's laws, velocity-time graphs.", to: "/subject-notes/Physics", tags: ["force", "motion", "newton", "velocity", "acceleration", "suvat", "physics"] },
  { type: "Note", subject: "Physics", title: "Momentum & Energy", desc: "Conservation of momentum, kinetic energy, work done, power, efficiency.", to: "/subject-notes/Physics", tags: ["momentum", "energy", "kinetic", "work", "power", "efficiency", "physics"] },
  { type: "Note", subject: "Physics", title: "Waves", desc: "Transverse and longitudinal waves, reflection, refraction, diffraction, electromagnetic spectrum.", to: "/subject-notes/Physics", tags: ["wave", "transverse", "longitudinal", "reflection", "refraction", "electromagnetic", "physics"] },
  { type: "Note", subject: "Physics", title: "Electricity", desc: "Current, voltage, resistance, Ohm's law, series and parallel circuits, power.", to: "/subject-notes/Physics", tags: ["electricity", "current", "voltage", "resistance", "ohm", "circuit", "physics"] },
  { type: "Note", subject: "Physics", title: "Thermal Physics", desc: "Specific heat capacity, latent heat, gas laws, kinetic theory, conduction, convection, radiation.", to: "/subject-notes/Physics", tags: ["thermal", "heat", "temperature", "gas", "kinetic", "conduction", "convection", "physics"] },
  // Mathematics notes
  { type: "Note", subject: "Mathematics", title: "Algebra", desc: "Expanding brackets, factorising, solving equations, simultaneous equations, inequalities.", to: "/subject-notes/Mathematics", tags: ["algebra", "equation", "factorising", "quadratic", "simultaneous", "mathematics"] },
  { type: "Note", subject: "Mathematics", title: "Geometry & Trigonometry", desc: "Pythagoras, SOHCAHTOA, circle theorems, area, volume, transformations.", to: "/subject-notes/Mathematics", tags: ["geometry", "trigonometry", "pythagoras", "sohcahtoa", "circle", "area", "volume", "mathematics"] },
  { type: "Note", subject: "Mathematics", title: "Statistics & Probability", desc: "Mean, median, mode, cumulative frequency, histograms, probability trees.", to: "/subject-notes/Mathematics", tags: ["statistics", "probability", "mean", "median", "mode", "histogram", "mathematics"] },
  { type: "Note", subject: "Mathematics", title: "Number & Sequences", desc: "Fractions, percentages, standard form, sequences, nth term, surds.", to: "/subject-notes/Mathematics", tags: ["number", "fraction", "percentage", "standard form", "sequence", "surd", "mathematics"] },
  // Quizzes
  { type: "Quiz", subject: "Biology", title: "Cell Biology Quiz", desc: "10 questions on cell structure, organelles, and transport mechanisms.", to: "/quizzes", tags: ["cell", "biology", "quiz", "organelle"] },
  { type: "Quiz", subject: "Chemistry", title: "Atomic Structure Quiz", desc: "Test your knowledge of atoms, isotopes, and electronic configuration.", to: "/quizzes", tags: ["atom", "chemistry", "quiz", "isotope"] },
  { type: "Quiz", subject: "Physics", title: "Forces & Motion Quiz", desc: "SUVAT equations, Newton's laws, and velocity-time graph questions.", to: "/quizzes", tags: ["force", "physics", "quiz", "newton"] },
  { type: "Quiz", subject: "Mathematics", title: "Algebra Mastery Quiz", desc: "Quadratics, simultaneous equations, and algebraic manipulation.", to: "/quizzes", tags: ["algebra", "mathematics", "quiz", "quadratic"] },
  // Flashcards
  { type: "Flashcard", subject: "Biology", title: "Biology Key Terms Deck", desc: "Essential definitions for IGCSE Biology — cells, genetics, ecology and more.", to: "/flashcards", tags: ["biology", "flashcard", "definition", "terms"] },
  { type: "Flashcard", subject: "Chemistry", title: "Chemistry Equations Deck", desc: "Word and symbol equations for all key reactions in IGCSE Chemistry.", to: "/flashcards", tags: ["chemistry", "flashcard", "equation", "reaction"] },
  { type: "Flashcard", subject: "Physics", title: "Physics Formulae Deck", desc: "All the formulae you need for IGCSE Physics, with worked examples.", to: "/flashcards", tags: ["physics", "flashcard", "formula", "equation"] },
  { type: "Flashcard", subject: "Mathematics", title: "Maths Vocabulary Deck", desc: "Key mathematical terms, theorems, and identities for IGCSE Maths.", to: "/flashcards", tags: ["mathematics", "flashcard", "theorem", "formula"] },
  // Past papers
  { type: "Past Paper", subject: "Biology", title: "Biology Paper 4 — May/June 2023", desc: "Extended theory paper covering all IGCSE Biology topics.", to: "/past-papers", tags: ["biology", "past paper", "2023", "paper 4"] },
  { type: "Past Paper", subject: "Chemistry", title: "Chemistry Paper 4 — May/June 2023", desc: "Extended theory paper covering all IGCSE Chemistry topics.", to: "/past-papers", tags: ["chemistry", "past paper", "2023", "paper 4"] },
  { type: "Past Paper", subject: "Physics", title: "Physics Paper 4 — May/June 2023", desc: "Extended theory paper covering all IGCSE Physics topics.", to: "/past-papers", tags: ["physics", "past paper", "2023", "paper 4"] },
  { type: "Past Paper", subject: "Mathematics", title: "Mathematics Paper 4 — May/June 2023", desc: "Extended paper covering all IGCSE Mathematics topics.", to: "/past-papers", tags: ["mathematics", "past paper", "2023", "paper 4"] },
];

const TRENDING = ["Photosynthesis", "Electrolysis", "Organic Chemistry", "Calculus", "Newton's Laws", "Genetics", "Waves", "Quadratics"];

const TYPE_ICONS: Record<string, React.ElementType> = {
  Note: BookOpen,
  Quiz: HelpCircle,
  Flashcard: Layers,
  "Past Paper": FileText,
};

const TYPE_COLORS: Record<string, string> = {
  Note: "bg-pink-soft text-primary",
  Quiz: "bg-lavender-soft text-lavender",
  Flashcard: "bg-yellow-50 text-yellow-700",
  "Past Paper": "bg-green-50 text-green-700",
};

const SUBJECTS = [
  "Biology", "Chemistry", "Physics", "Mathematics", "Additional Mathematics",
  "Geography", "English Language", "English Literature", "ICT/Computer Science", "History",
  "Economics", "Business Studies", "Accounting", "Sociology", "Psychology",
  "Art & Design", "Music", "French", "Spanish", "Arabic",
  "German", "Global Perspectives", "Environmental Management", "Physical Education", "Drama",
  "Design & Technology", "Enterprise", "Marine Science", "Food & Nutrition", "Travel & Tourism"
];
const TYPES = ["Note", "Quiz", "Flashcard", "Past Paper"] as const;

function SearchPage() {
  const { q: initialQ } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQ ?? "");
  const [activeType, setActiveType] = useState<string>("All");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync URL param → input
  useEffect(() => {
    if (initialQ) setQuery(initialQ);
  }, [initialQ]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return CONTENT_INDEX;
    return CONTENT_INDEX.filter((item) => {
      const haystack = [item.title, item.desc, item.subject, ...item.tags].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const filtered = useMemo(() => {
    return results.filter((r) => {
      if (activeType !== "All" && r.type !== activeType) return false;
      if (selectedSubjects.length > 0 && !selectedSubjects.includes(r.subject)) return false;
      return true;
    });
  }, [results, activeType, selectedSubjects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search" as any, search: { q: query } });
  };

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header authed />
      <section className="bg-pink-soft text-center py-14 px-6">
        <h1 className="font-display text-4xl">
          Discover Your Next <span className="accent-italic text-primary">Breakthrough</span>
        </h1>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6 bg-white rounded-full p-2 flex items-center gap-2">
          <Search className="w-4 h-4 ml-3 text-foreground/40 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm py-2"
            placeholder="Search topics, notes, quizzes… (e.g. Photosynthesis)"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="p-1 text-foreground/40 hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <button type="submit" className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
            Search
          </button>
        </form>
        <div className="inline-flex mt-5 bg-white/60 rounded-full p-1 text-sm gap-1 flex-wrap justify-center">
          {["All", ...TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-5 py-1.5 rounded-full transition-colors ${activeType === t ? "bg-primary text-primary-foreground" : "hover:bg-white/80"}`}
            >
              {t === "Past Paper" ? "Papers" : t === "Flashcard" ? "Cards" : t}
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 grid md:grid-cols-[220px_1fr_240px] gap-8">
        {/* Left filters */}
        <aside>
          <h3 className="font-bold flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" /> Filters
          </h3>
          <div className="mt-5">
            <p className="font-semibold text-sm">Subjects</p>
            <div className="mt-2 space-y-1.5 text-sm">
              {SUBJECTS.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(s)}
                    onChange={() => toggleSubject(s)}
                    className="accent-pink-400"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
          {selectedSubjects.length > 0 && (
            <button
              onClick={() => setSelectedSubjects([])}
              className="mt-4 w-full py-2 rounded-full bg-pink-softer text-primary text-sm"
            >
              Reset Filters
            </button>
          )}
        </aside>

        {/* Results */}
        <section>
          <div className="flex justify-between text-sm items-center">
            <span>
              {query ? (
                <>Showing <b>{filtered.length}</b> result{filtered.length !== 1 ? "s" : ""} for <i>"{query}"</i></>
              ) : (
                <>Showing all <b>{filtered.length}</b> resources</>
              )}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-12 text-center py-16 text-foreground/40">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold">No results found</p>
              <p className="text-sm mt-1">Try a different search term or remove some filters.</p>
              <button
                onClick={() => { setQuery(""); setSelectedSubjects([]); setActiveType("All"); }}
                className="mt-4 px-4 py-2 rounded-full border border-border text-sm hover:bg-muted"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {filtered.map((r, i) => {
                const Icon = TYPE_ICONS[r.type] ?? BookOpen;
                const colorClass = TYPE_COLORS[r.type] ?? "bg-muted text-foreground/60";
                return (
                  <Link
                    key={i}
                    to={r.to as any}
                    className="block rounded-2xl p-5 bg-white border border-border hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full ${colorClass}`}>
                        <Icon className="w-3 h-3" /> {r.type}
                      </span>
                      <span className="text-foreground/50">•</span>
                      <span className="text-foreground/60">{r.subject}</span>
                    </div>
                    <h3 className="font-bold mt-2">{r.title}</h3>
                    <p className="text-sm text-foreground/70 mt-1">{r.desc}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="space-y-4">
          <div className="border border-border rounded-2xl p-5">
            <p className="font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending Topics
            </p>
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="px-3 py-1 rounded-full border border-border hover:bg-pink-soft hover:border-primary/30 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-pink-softer rounded-2xl p-5">
            <p className="font-bold text-primary">Can't find it?</p>
            <p className="text-sm text-foreground/70 mt-2">
              Browse all subjects or try the AI tutor for instant explanations.
            </p>
            <div className="flex flex-col gap-2 mt-3">
              <Link
                to="/subjects"
                className="px-4 py-2 rounded-full bg-white border border-border text-sm text-center font-medium hover:bg-muted/40"
              >
                Browse Subjects
              </Link>
              <Link
                to="/notes"
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm text-center font-medium"
              >
                All Notes
              </Link>
            </div>
          </div>
        </aside>
      </main>

      <section className="bg-lavender-soft py-16 text-center px-6">
        <h2 className="font-display text-3xl">Keep the Glow Growing</h2>
        <p className="text-sm text-foreground/70 mt-2 max-w-xl mx-auto">
          Join 15,000+ students who use ExamGlow's curated resources to ace their IGCSEs.
        </p>
        <div className="flex justify-center gap-3 mt-5">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
          >
            Create Free Account
          </Link>
          <Link
            to="/subjects"
            className="px-5 py-2.5 rounded-full bg-white text-sm font-semibold border border-border"
          >
            Browse All Subjects
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
