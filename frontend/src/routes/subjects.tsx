import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useMemo } from "react";
import {
  Search,
  X,
  BookOpen,
  FlaskConical,
  Atom,
  Calculator,
  Globe,
  Cpu,
  Type,
  TrendingUp,
  Briefcase,
  Scroll,
  Plus,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/subjects")({
  head: () => ({ meta: [{ title: "Cambridge IGCSE Syllabus Directory — ExamGlow" }] }),
  component: Subjects,
});

export const SUBJECT_LIST = [
  "Accounting - 0452",
  "Accounting (9-1) - 0985",
  "Afrikaans - Second Language - 0548",
  "Agriculture - 0600",
  "Arabic - First Language - 0508",
  "Arabic - First Language (9-1) - 7184",
  "Arabic - Foreign Language - 0544",
  "Arabic (9-1) - 7180",
  "Art & Design - 0400",
  "Art & Design (9-1) - 0989",
  "Bahasa Indonesia - 0538",
  "Biology - 0610",
  "Biology (9-1) - 0970",
  "Business - 0264",
  "Business (9-1) - 0774",
  "Business Studies - 0450",
  "Business Studies (9-1) - 0986",
  "Chemistry - 0620",
  "Chemistry (9-1) - 0971",
  "Chinese - First Language - 0509",
  "Chinese - Second Language - 0523",
  "Chinese (Mandarin) - Foreign Language - 0547",
  "Commerce - 0715",
  "Computer Science - 0478",
  "Computer Science (9-1) - 0984",
  "Design & Technology - 0445",
  "Design & Technology (9-1) - 0979",
  "Drama - 0411",
  "Drama (9-1) - 0994",
  "Economics - 0455",
  "Economics (9-1) - 0987",
  "English - First Language - 0500",
  "English - First Language (9-1) - 0990",
  "English - First Language (US) - 0524",
  "English - Literature in English - 0475",
  "English - Literature in English (9-1) - 0992",
  "English (as an Additional Language) - 0472",
  "English (as an Additional Language) (9-1) - 0772",
  "English (Core) as a Second Language (Egypt) - 0465",
  "English as a Second Language (Count-in speaking) - 0511",
  "English as a Second Language (Count-in Speaking) (9-1) - 0991",
  "English as a Second Language (Speaking endorsement) - 0510",
  "English as a Second Language (Speaking Endorsement) (9-1) - 0993",
  "Enterprise - 0454",
  "Environmental Management - 0680",
  "Food & Nutrition - 0648",
  "French - First Language - 0501",
  "French - Foreign Language - 0520",
  "French (9-1) - 7156",
  "Geography - 0460",
  "Geography (9-1) - 0976",
  "German - First Language - 0505",
  "German - Foreign Language - 0525",
  "German (9-1) - 7159",
  "Global Perspectives - 0457",
  "Hindi as a Second Language - 0549",
  "History - 0470",
  "History - American (US) - 0409",
  "History (9-1) - 0977",
  "Information and Communication Technology - 0417",
  "Information and Communication Technology (9-1) - 0983",
  "IsiZulu as a Second Language - 0531",
  "Islamiyat - 0493",
  "Italian - Foreign Language - 0535",
  "Latin - 0480",
  "Malay - First Language - 0696",
  "Malay - Foreign Language - 0546",
  "Marine Science - 0697",
  "Mathematics - 0580",
  "Mathematics - Additional - 0606",
  "Mathematics - International - 0607",
  "Mathematics (9-1) - 0980",
  "Mathematics (US) - 0444",
  "Music - 0410",
  "Music (9-1) - 0978",
  "Pakistan Studies - 0448",
  "Physical Education - 0413",
  "Physical Education (9-1) - 0995",
  "Physical Science - 0652",
  "Physics - 0625",
  "Physics (9-1) - 0972",
  "Portuguese - First Language - 0504",
  "Psychology - 0266",
  "Religious Studies - 0490",
  "Sanskrit - 0499",
  "Science - Combined - 0653",
  "Sciences - Co-ordinated (9-1) - 0973",
  "Sciences - Co-ordinated (Double) - 0654",
  "Setswana - First Language - 0698",
  "Sociology - 0495",
  "Spanish - First Language - 0502",
  "Spanish - Foreign Language - 0530",
  "Spanish - Literature in Spanish - 0474",
  "Spanish (9-1) - 7160",
  "Statistics - 0479",
  "Swahili - 0262",
  "Thai - First Language - 0518",
  "Travel & Tourism - 0471",
  "Turkish - First Language - 0513",
  "Urdu as a Second Language - 0539",
  "Vietnamese - First Language - 0695",
  "World Literature - 0408"
];

function getSubjectId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/&/g, "and")
    .replace(/--/g, "-")
    .replace(/^-+|-+$/g, "");
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
  "border-t-emerald-500",
  "border-t-blue-500",
  "border-t-amber-500",
  "border-t-violet-500",
  "border-t-teal-500",
  "border-t-pink-500",
  "border-t-orange-500",
  "border-t-indigo-500",
  "border-t-rose-500",
];

const getNotesSubjectName = (name: string): string => {
  // Extract code from name like "Accounting - 0452" → "0452"
  const codeMatch = name.match(/\s*-\s*(\d{4})$/);
  const code = codeMatch ? codeMatch[1] : "";
  const clean = name.replace(/\s*-\s*\d{4}/g, "").replace(/\s*\(9-1\)\s*/g, "").trim();
  if (clean.includes("Information and Communication Technology") || clean.includes("Computer Science")) {
    return code ? `ICT/Computer Science - ${code}` : "ICT/Computer Science";
  }
  // Preserve the code so notes are isolated per syllabus (e.g. "Accounting - 0452")
  return code ? `${clean} - ${code}` : clean;
};

function Subjects() {
  const [searchQuery, setSearchQuery] = useState("");

  const parsedSubjects = useMemo(() => {
    return SUBJECT_LIST.map((name, index) => {
      const subjectId = getSubjectId(name);
      const firstLetter = name.charAt(0).toUpperCase();
      const Icon = getSubjectIcon(name);
      const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
      return { name, subjectId, firstLetter, Icon, accent };
    });
  }, []);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const matches = parsedSubjects.filter((s) => s.name.toLowerCase().includes(query));

    const groups: Record<string, typeof matches> = {};
    matches.forEach((s) => {
      if (!groups[s.firstLetter]) {
        groups[s.firstLetter] = [];
      }
      groups[s.firstLetter].push(s);
    });

    return Object.keys(groups)
      .sort()
      .reduce<Record<string, typeof matches>>((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {});
  }, [searchQuery, parsedSubjects]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const availableLetters = Object.keys(filteredGroups);

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA]">
      <Header authed />
      
      <section className="bg-pink-soft text-center py-16 px-6 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary/10 filter blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/10 filter blur-3xl" />

        <span className="inline-block px-3.5 py-1 rounded-full bg-white text-xs font-bold text-primary shadow-sm tracking-wide">
          Syllabus Catalog
        </span>
        <h1 className="font-sans text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Cambridge IGCSE Syllabus Directory
        </h1>
        <p className="text-slate-500 mt-2.5 max-w-xl mx-auto text-sm leading-relaxed">
          Access the complete list of 80+ Cambridge IGCSE subjects. Review exact curriculum learning objectives, topics, and structures.
        </p>

        <div className="mt-8 max-w-xl mx-auto relative flex items-center">
          <Search className="absolute left-4.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects or syllabus codes (e.g. Italian, 0452)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-12 text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        <div className="mb-10 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3.5 text-center md:text-left">
            Quick Jump (A - Z)
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && scrollToLetter(letter)}
                  disabled={!isAvailable}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    isAvailable
                      ? "bg-slate-50 border border-slate-200/50 text-slate-800 hover:bg-primary hover:text-white hover:border-primary shadow-sm cursor-pointer"
                      : "text-slate-300 bg-slate-50/30 border border-slate-100/50 cursor-not-allowed"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {availableLetters.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-800">No subjects match your search</h3>
            <p className="text-slate-455 text-sm mt-2">
              Try adjusting your keywords or search term.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {availableLetters.map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-6">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-100/70 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                    {letter}
                  </div>
                  <h2 className="font-sans text-xl font-bold text-slate-800">
                    IGCSE Subjects ({filteredGroups[letter].length})
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredGroups[letter].map((subject) => (
                    <div
                      key={subject.name}
                      className={`bg-white border border-slate-150 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between border-t-4 ${subject.accent} hover:scale-[1.01]`}
                    >
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              <subject.Icon className="w-5 h-5 text-slate-500" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-450 bg-slate-50 border border-slate-100/50 rounded-full px-2.5 py-0.5 shrink-0">
                              Cambridge IGCSE
                            </span>
                          </div>
                          <h3 className="font-sans font-bold text-sm text-slate-800 mt-4 leading-tight">
                            {subject.name}
                          </h3>
                        </div>

                        <div className="mt-5 border-t border-slate-50 pt-4 flex gap-2">
                          <Link
                            to="/syllabus/$subjectId"
                            params={{ subjectId: subject.subjectId }}
                            className="flex-1 py-2 rounded-xl border border-slate-200/80 text-[10px] font-bold inline-flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600 bg-white cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                            <span>View Syllabus</span>
                          </Link>
                          <Link
                            to="/subject-notes/$subject"
                            params={{ subject: getNotesSubjectName(subject.name) }}
                            className="flex-1 py-2 rounded-xl border border-slate-200/80 text-[10px] font-bold inline-flex items-center justify-center gap-1.5 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all text-slate-600 bg-white cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span>View Notes</span>
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

        <div className="mt-16 bg-white border border-slate-100 rounded-3xl p-8 grid md:grid-cols-2 gap-6 items-center shadow-sm">
          <div>
            <h3 className="font-sans text-2xl font-extrabold text-slate-800">
              Interactive Exam Preparations
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Use our smart study tools to master key syllabus terminology, practice actual past exam papers, and review flashcards.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Link
                to="/past-papers"
                className="flex-1 min-w-[170px] border border-slate-200/60 rounded-2xl px-4 py-3.5 text-sm flex items-center gap-3.5 hover:border-primary/30 transition-all hover:bg-slate-50/30"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-xs">Past Paper Bank</div>
                  <div className="text-[10px] text-slate-400">Practice real exam scripts</div>
                </div>
              </Link>
              <Link
                to="/flashcards"
                className="flex-1 min-w-[170px] border border-slate-200/60 rounded-2xl px-4 py-3.5 text-sm flex items-center gap-3.5 bg-lavender-soft/30 hover:bg-lavender-soft/50 transition-all"
              >
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
    </div>
  );
}
