import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSyllabusData } from "@/data/syllabus";
import { 
  ArrowLeft, FileText, ChevronLeft, ChevronRight, X, 
  Download, Printer, ZoomIn, ZoomOut, Trophy 
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/syllabus/$subjectId")({
  component: SyllabusPage,
});

// Helper to clean "Cambridge" out of the name
function cleanSubjectName(name: string): string {
  return name.replace(/^Cambridge\s+/i, "").replace(/^IGCSE\s+/i, "");
}

// ── Syllabus PDF Reader Component ──────────────────────────────────────────────
interface PDFReaderProps {
  subjectName: string;
  subjectCode: string;
  yearRange: string;
  fileName: string;
  onClose: () => void;
}

function SyllabusPDFReader({ subjectName, subjectCode, yearRange, fileName, onClose }: PDFReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 6;
  const cleanName = cleanSubjectName(subjectName);

  // Close reader on Escape key press
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
    // Generate simple text-based data URL to simulate downloading PDF
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

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/95 flex flex-col animate-fade-in font-sans">
      {/* Top Controls Toolbar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-5 h-5 text-red-400 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{fileName}</h3>
            <p className="text-[10px] text-slate-400">Page {currentPage} of {totalPages}</p>
          </div>
        </div>

        {/* Toolbar Middle: Navigation & Zoom */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-900/60 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-2.5 font-mono min-w-[3rem] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/60 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setZoom((z) => Math.max(70, z - 10))}
              disabled={zoom === 70}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs px-1 font-mono min-w-[3rem] text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              disabled={zoom === 150}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar Right: Actions & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded hover:bg-slate-700 transition-colors hidden md:block"
            title="Print Document"
          >
            <Printer className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-slate-700 transition-colors hidden md:block"
            title="Download PDF"
          >
            <Download className="w-4.5 h-4.5" />
          </button>
          <div className="h-6 w-px bg-slate-700 mx-1 hidden md:block" />
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-800">
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
          <div className="p-12 flex-1 flex flex-col justify-between text-slate-800">
            {currentPage === 1 && (
              /* COVER PAGE */
              <div className="h-full flex flex-col justify-between relative flex-1">
                {/* Header Logo section */}
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      EG
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">Assessment</h4>
                      <p className="text-[9px] text-slate-450 uppercase tracking-wider leading-none mt-0.5">International Education</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IGCSE</span>
                </div>

                {/* Main Curved Orange Cover Section */}
                <div className="my-auto relative p-10 border-4 border-amber-500 rounded-br-[120px] rounded-tl-[120px] bg-amber-50/5 flex flex-col justify-center min-h-[500px]">
                  <h1 className="text-2xl font-semibold text-slate-500 tracking-wide uppercase">Syllabus</h1>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight mt-2 leading-none">
                    IGCSE™
                  </h2>
                  <h3 className="text-4xl font-extrabold text-amber-600 mt-2 leading-tight">
                    {cleanName} {subjectCode}
                  </h3>
                  <p className="text-sm text-slate-650 mt-6 max-w-md leading-relaxed">
                    Use this syllabus for exams in {yearRange}.<br />
                    Exams are available in the June and November series.<br />
                    Exams are also available in the March series in India.
                  </p>

                  {/* Math cluster number graphics (only for math, otherwise general decoration) */}
                  <div className="absolute bottom-6 right-6 w-48 h-48 rounded-full border border-slate-100/50 flex items-center justify-center bg-white/40 shadow-inner">
                    {cleanName.toLowerCase().includes("math") ? (
                      <div className="relative w-full h-full text-slate-800 font-sans font-bold">
                        <span className="absolute top-[20%] left-[30%] text-emerald-500 text-3xl font-extrabold">2</span>
                        <span className="absolute top-[30%] left-[10%] text-cyan-600 text-2xl">√6</span>
                        <span className="absolute top-[35%] left-[40%] text-yellow-500 text-4xl">0</span>
                        <span className="absolute top-[18%] left-[60%] text-pink-500 text-3xl">5</span>
                        <span className="absolute top-[28%] left-[75%] text-purple-600 text-2xl">+</span>
                        <span className="absolute bottom-[35%] left-[25%] text-indigo-500 text-3xl">4</span>
                        <span className="absolute bottom-[28%] left-[50%] text-emerald-600 text-4xl">3</span>
                        <span className="absolute bottom-[40%] left-[65%] text-amber-500 text-2xl">8</span>
                        <span className="absolute bottom-[20%] left-[80%] text-red-500 text-3xl">%</span>
                        <span className="absolute bottom-[10%] left-[45%] text-amber-600 text-3xl">2</span>
                        <span className="absolute bottom-[12%] left-[15%] text-cyan-500 text-2xl">9</span>
                        <span className="absolute bottom-[15%] left-[32%] text-indigo-400 text-2xl">÷</span>
                      </div>
                    ) : (
                      <div className="text-slate-300 text-5xl">📚</div>
                    )}
                  </div>
                </div>

                {/* Footer section */}
                <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Version 3</span>
                  <span>ExamGlow Study Portal</span>
                </div>
              </div>
            )}

            {currentPage === 2 && (
              /* PAGE 2: WHY CHOOSE */
              <div className="h-full flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-amber-600 border-b border-slate-150 pb-2.5">Why choose international education?</h2>
                  <div className="mt-6 space-y-5 text-sm text-slate-700 leading-relaxed font-serif">
                    <p>
                      International programmes prepare school students for life, helping them develop an informed curiosity and a lasting passion for learning. They offer a globally trusted and flexible framework for education.
                    </p>
                    <h3 className="font-sans font-bold text-slate-900 mt-6 text-base">Key benefits of this syllabus</h3>
                    <p>
                      Our programmes balance a thorough knowledge and understanding of a subject and help to develop the skills learners need for their next steps in education or employment.
                    </p>
                    <p>
                      The curriculum encourages learners to be:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 font-sans text-xs">
                      <li><strong>confident</strong> in using language and techniques to ask questions, explore ideas and communicate</li>
                      <li><strong>responsible</strong> by taking ownership of their learning, and applying their knowledge and skills</li>
                      <li><strong>reflective</strong> by making connections across subjects, and in evaluating methods and checking solutions</li>
                      <li><strong>innovative</strong> by applying their knowledge and understanding to solve unfamiliar problems</li>
                      <li><strong>engaged</strong> by the beauty and structure of the subject, becoming curious to learn more.</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                  <span>Page 2</span>
                  <span>Syllabus for exams in {yearRange}</span>
                </div>
              </div>
            )}

            {currentPage === 3 && (
              /* PAGE 3: CONTENTS */
              <div className="h-full flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-amber-600 border-b border-slate-150 pb-2.5">Contents</h2>
                  <div className="mt-8 space-y-4 font-sans text-sm">
                    <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-1">
                      <button onClick={() => setCurrentPage(2)} className="font-semibold hover:text-amber-600 text-left">Why choose this syllabus?</button>
                      <span className="font-mono text-slate-400">2</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-1">
                      <button onClick={() => setCurrentPage(4)} className="font-semibold hover:text-amber-600 text-left">1 Syllabus overview</button>
                      <span className="font-mono text-slate-400">4</span>
                    </div>
                    <div className="pl-6 flex justify-between items-end border-b border-dashed border-slate-100 pb-1 text-slate-650 text-xs">
                      <span>Aims & Objectives</span>
                      <span className="font-mono text-slate-400">4</span>
                    </div>
                    <div className="pl-6 flex justify-between items-end border-b border-dashed border-slate-100 pb-1 text-slate-650 text-xs">
                      <span>Content overview</span>
                      <span className="font-mono text-slate-400">5</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-1">
                      <button onClick={() => setCurrentPage(5)} className="font-semibold hover:text-amber-600 text-left">2 Details of the assessment</button>
                      <span className="font-mono text-slate-400">7</span>
                    </div>
                    <div className="pl-6 flex justify-between items-end border-b border-dashed border-slate-100 pb-1 text-slate-650 text-xs">
                      <span>Assessment components</span>
                      <span className="font-mono text-slate-400">7</span>
                    </div>
                    <div className="pl-6 flex justify-between items-end border-b border-dashed border-slate-100 pb-1 text-slate-650 text-xs">
                      <span>Assessment objectives</span>
                      <span className="font-mono text-slate-400">8</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-1">
                      <button onClick={() => setCurrentPage(6)} className="font-semibold hover:text-amber-600 text-left">3 Subject content</button>
                      <span className="font-mono text-slate-400">9</span>
                    </div>
                    <div className="pl-6 flex justify-between items-end border-b border-dashed border-slate-100 pb-1 text-slate-650 text-xs">
                      <span>Core curriculum guide</span>
                      <span className="font-mono text-slate-400">9</span>
                    </div>
                    <div className="pl-6 flex justify-between items-end border-b border-dashed border-slate-100 pb-1 text-slate-650 text-xs">
                      <span>Extended curriculum guide</span>
                      <span className="font-mono text-slate-400">12</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                  <span>Page 3</span>
                  <span>Syllabus for exams in {yearRange}</span>
                </div>
              </div>
            )}

            {currentPage === 4 && (
              /* PAGE 4: SYLLABUS OVERVIEW */
              <div className="h-full flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-amber-600 border-b border-slate-150 pb-2.5">1 Syllabus overview</h2>
                  <div className="mt-6 space-y-6 text-sm text-slate-700 leading-relaxed font-serif">
                    <div>
                      <h3 className="font-sans font-bold text-slate-900 text-base mb-1.5">Aims</h3>
                      <p>
                        The aims describe the purposes of a course based on this syllabus. The aims are to enable students to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mt-2 font-sans text-xs">
                        <li>develop a positive attitude towards the subject in a way that encourages enjoyment, confidence and enquiry</li>
                        <li>apply their knowledge and skills to their own lives and the world around them</li>
                        <li>use creativity and resilience to analyse and solve problems</li>
                        <li>communicate concepts clearly and reason logically, making inferences and drawing conclusions</li>
                        <li>acquire a foundation for further study in the subject and other disciplines.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-slate-900 text-base mb-1.5">Assessment objectives (AOs)</h3>
                      <ul className="list-none space-y-3 font-sans text-xs">
                        <li>
                          <strong>AO1: Knowledge and understanding</strong>
                          <p className="text-slate-500 font-serif text-[11px] mt-0.5">Candidates should be able to recall, apply, and use terminology, notation, facts, laws, and techniques in everyday situations.</p>
                        </li>
                        <li>
                          <strong>AO2: Analyse, interpret and communicate</strong>
                          <p className="text-slate-500 font-serif text-[11px] mt-0.5">Candidates should be able to analyse a problem and identify a suitable strategy to solve it, communicate methods clearly, and draw logical conclusions.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                  <span>Page 4</span>
                  <span>Syllabus for exams in {yearRange}</span>
                </div>
              </div>
            )}

            {currentPage === 5 && (
              /* PAGE 5: DETAILS OF THE ASSESSMENT */
              <div className="h-full flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-amber-600 border-b border-slate-150 pb-2.5">2 Details of the assessment</h2>
                  <div className="mt-6 space-y-6">
                    <p className="text-sm text-slate-700 font-serif leading-relaxed">
                      All candidates take two components. Assessment is tiered (Core and Extended) to provide appropriate differentiation.
                    </p>
                    
                    <div className="overflow-hidden rounded-xl border border-slate-200">
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
                            <td className="px-4 py-3"><strong>Paper 1:</strong> Non-calculator (Core)</td>
                            <td className="px-4 py-3">1h 30m</td>
                            <td className="px-4 py-3">80</td>
                            <td className="px-4 py-3">50%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3"><strong>Paper 2:</strong> Non-calculator (Extended)</td>
                            <td className="px-4 py-3">2h 00m</td>
                            <td className="px-4 py-3">100</td>
                            <td className="px-4 py-3">50%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3"><strong>Paper 3:</strong> Calculator (Core)</td>
                            <td className="px-4 py-3">1h 30m</td>
                            <td className="px-4 py-3">80</td>
                            <td className="px-4 py-3">50%</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3"><strong>Paper 4:</strong> Calculator (Extended)</td>
                            <td className="px-4 py-3">2h 00m</td>
                            <td className="px-4 py-3">100</td>
                            <td className="px-4 py-3">50%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
                      <p className="font-bold text-slate-800">Calculator Usage:</p>
                      <p className="mt-1">
                        Candidates should have a scientific calculator for Paper 3 and Paper 4. Calculators are <strong>not allowed</strong> for Paper 1 and Paper 2.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                  <span>Page 5</span>
                  <span>Syllabus for exams in {yearRange}</span>
                </div>
              </div>
            )}

            {currentPage === 6 && (
              /* PAGE 6: SUBJECT CONTENT */
              <div className="h-full flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-amber-600 border-b border-slate-150 pb-2.5">3 Subject content directory</h2>
                  <div className="mt-6 space-y-4">
                    <p className="text-xs text-slate-700 font-serif leading-relaxed mb-4">
                      The curriculum chapters and learning outcomes of the IGCSE {cleanName} ({subjectCode}) syllabus:
                    </p>

                    <div className="space-y-3 font-sans text-xs">
                      {/* Dynamically query first 6 objectives of the syllabus data */}
                      {getSyllabusData(subjectCode.toLowerCase() === "0580" ? "mathematics-0580" : `fallback-${subjectCode}`)?.objectives.map((obj, i) => (
                        <div key={obj.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                            {obj.code}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">{obj.title}</p>
                            <p className="text-[11px] text-slate-450 mt-0.5">{obj.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                  <span>Page 6</span>
                  <span>Syllabus for exams in {yearRange}</span>
                </div>
              </div>
            )}
          </div>
        </div>
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
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-300 transition-all text-left group hover:scale-[1.005]"
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
          yearRange={activePdf.yearRange}
          fileName={activePdf.fileName}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}
