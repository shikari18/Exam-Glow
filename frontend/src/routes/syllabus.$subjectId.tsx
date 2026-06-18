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
  
  const isMath0580Syllabus = subjectCode === "0580" && yearRange.includes("2025");
  const totalPages = isMath0580Syllabus ? 13 : 6;
  const pageMap = [1, 2, 3, 4, 7, 8, 9, 12, 13, 14, 15, 16, 17];
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
            <p className="text-[10px] text-slate-400">
              {isMath0580Syllabus 
                ? `Page ${pageMap[currentPage - 1]} of 68 (Syllabus Preview)` 
                : `Page ${currentPage} of ${totalPages}`}
            </p>
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
            <span className="text-xs px-2.5 font-mono min-w-[3.5rem] text-center">
              {isMath0580Syllabus ? `P. ${pageMap[currentPage - 1]}` : currentPage} / {isMath0580Syllabus ? "68" : totalPages}
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
          <div className="p-12 flex-1 flex flex-col justify-between text-slate-850">
            {isMath0580Syllabus ? (
              /* ── MATHEMATICS 0580 SYLLABUS PAGES ── */
              <>
                {currentPage === 1 && (
                  /* COVER PAGE */
                  <div className="h-full flex flex-col justify-between relative flex-1 text-slate-800">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                          M
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">IGCSE</h4>
                          <p className="text-[9px] text-slate-450 uppercase tracking-wider leading-none mt-0.5">Mathematics 0580</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Syllabus 2025-2027</span>
                    </div>

                    <div className="my-auto relative p-10 border-4 border-amber-500 rounded-br-[120px] rounded-tl-[120px] bg-amber-50/5 flex flex-col justify-center min-h-[500px]">
                      <h1 className="text-2xl font-semibold text-slate-500 tracking-wide uppercase">Syllabus</h1>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tight mt-2 leading-none">
                        Cambridge IGCSE™
                      </h2>
                      <h3 className="text-4xl font-extrabold text-amber-600 mt-2 leading-tight">
                        Mathematics 0580
                      </h3>
                      <p className="text-sm font-semibold text-slate-700 mt-6 max-w-md leading-relaxed font-serif">
                        Use this syllabus for exams in 2025, 2026 and 2027.<br />
                        Exams are available in the June and November series.<br />
                        Exams are also available in the March series in India.
                      </p>
                      <p className="text-xs text-slate-450 mt-4">
                        Syllabus Version 3 (Published May 2024)
                      </p>

                      {/* Math decorations */}
                      <div className="absolute bottom-6 right-6 w-48 h-48 rounded-full border border-slate-100/50 flex items-center justify-center bg-white/45 shadow-inner">
                        <div className="relative w-full h-full text-slate-800 font-sans font-bold">
                          <span className="absolute top-[20%] left-[30%] text-emerald-500 text-3xl font-extrabold">2</span>
                          <span className="absolute top-[30%] left-[10%] text-cyan-600 text-2xl">√6</span>
                          <span className="absolute top-[35%] left-[40%] text-amber-500 text-4xl">0</span>
                          <span className="absolute top-[18%] left-[60%] text-pink-500 text-3xl">5</span>
                          <span className="absolute top-[28%] left-[75%] text-purple-650 text-2xl">+</span>
                          <span className="absolute bottom-[35%] left-[25%] text-indigo-500 text-3xl">4</span>
                          <span className="absolute bottom-[28%] left-[50%] text-emerald-600 text-4xl">3</span>
                          <span className="absolute bottom-[40%] left-[65%] text-amber-500 text-2xl">8</span>
                          <span className="absolute bottom-[20%] left-[80%] text-red-500 text-3xl">%</span>
                          <span className="absolute bottom-[10%] left-[45%] text-amber-650 text-3xl">2</span>
                          <span className="absolute bottom-[12%] left-[15%] text-cyan-500 text-2xl">9</span>
                          <span className="absolute bottom-[15%] left-[32%] text-indigo-400 text-2xl">÷</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Version 3 (May 2024)</span>
                      <span>Page 1 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 2 && (
                  /* PAGE 2: WHY CHOOSE CAMBRIDGE INTERNATIONAL */
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
                        <p>
                          Every year, nearly a million Cambridge students from 10000 schools in 160 countries prepare for their future with the Cambridge Pathway.
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
                            Our quality management system for the provision of international qualifications and education programmes for students aged 5 to 19 is independently certified as meeting the internationally recognised standard, <strong>ISO 9001:2015</strong>. Learn more at <span className="text-amber-600 underline">www.cambridgeinternational.org/ISO9001</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>© Cambridge University Press & Assessment September 2022</span>
                      <span>Page 2 of 68</span>
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
                          { title: "Why choose Cambridge International?", page: 2, target: 2 },
                          { title: "1 Why choose this syllabus?", page: 4, target: 4 },
                          { title: "2 Syllabus overview", page: 7, target: 5 },
                          { title: "   • Aims", page: 7, target: 5 },
                          { title: "   • Content overview", page: 8, target: 6 },
                          { title: "   • Assessment overview", page: 9, target: 7 },
                          { title: "   • Assessment objectives", page: 10, target: 7 },
                          { title: "3 Subject content", page: 12, target: 8 },
                          { title: "   • Core subject content (1 Number, C1.1 - C1.16)", page: 12, target: 8 },
                          { title: "   • 2 Algebra and graphs (C2.1 - C2.5)", page: 17, target: 13 },
                          { title: "   • Extended subject content", page: 32, target: 13 },
                          { title: "4 Details of the assessment", page: 57, target: 7 },
                          { title: "   • List of formulas - Core (Paper 1 & Paper 3)", page: 60, target: 8 },
                          { title: "   • List of formulas - Extended (Paper 2 & Paper 4)", page: 61, target: 13 },
                          { title: "   • Mathematical conventions", page: 62, target: 13 },
                          { title: "   • Command words", page: 64, target: 13 },
                          { title: "5 What else you need to know", page: 65, target: 13 }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-end group">
                            <button 
                              onClick={() => setCurrentPage(item.target)}
                              className={`text-left hover:text-amber-600 transition-colors ${item.title.startsWith(" ") ? "pl-4 text-slate-500 text-[11px]" : "font-bold text-slate-800"}`}
                            >
                              {item.title}
                            </button>
                            <div className="flex-1 border-b border-dotted border-slate-200 mx-2 h-1 group-hover:border-slate-400 transition-colors" />
                            <span className="font-mono text-slate-450 group-hover:text-amber-600 font-bold">{item.page}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027.</span>
                      <span>Page 3 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 4 && (
                  /* PAGE 4: 1 WHY CHOOSE THIS SYLLABUS */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-150 pb-2">1 Why choose this syllabus?</h2>
                      
                      <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed font-serif">
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Key benefits</h3>
                        <p>
                          Cambridge IGCSE is the world’s most popular international qualification for 14 to 16 year olds, although it can be taken by students of other ages. It is tried, tested and trusted.
                        </p>
                        <p>
                          Cambridge IGCSE Mathematics supports learners in building competency, confidence and fluency in their use of techniques and mathematical understanding. Learners develop a feel for quantity, patterns and relationships, as well as developing reasoning, problem-solving and analytical skills in a variety of abstract and real-life contexts.
                        </p>
                        <p>
                          Our approach in Cambridge IGCSE Mathematics encourages learners to be:
                        </p>
                        
                        <div className="space-y-2.5 mt-2 font-sans">
                          <div className="p-3 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl">
                            <strong className="text-slate-800">confident</strong>
                            <p className="text-[11px] text-slate-650 mt-0.5 font-serif">in using mathematical language and techniques to ask questions, explore ideas and communicate</p>
                          </div>
                          <div className="p-3 bg-slate-50 border-l-4 border-emerald-500 rounded-r-xl">
                            <strong className="text-slate-800">responsible</strong>
                            <p className="text-[11px] text-slate-650 mt-0.5 font-serif">by taking ownership of their learning, and applying their mathematical knowledge and skills so that they can reason, problem solve and work collaboratively</p>
                          </div>
                          <div className="p-3 bg-slate-50 border-l-4 border-blue-500 rounded-r-xl">
                            <strong className="text-slate-800">reflective</strong>
                            <p className="text-[11px] text-slate-650 mt-0.5 font-serif">by making connections within mathematics and across other subjects, and in evaluating methods and checking solutions</p>
                          </div>
                          <div className="p-3 bg-slate-50 border-l-4 border-purple-500 rounded-r-xl">
                            <strong className="text-slate-800">innovative</strong>
                            <p className="text-[11px] text-slate-650 mt-0.5 font-serif">by applying their knowledge and understanding to solve unfamiliar problems creatively, flexibly and efficiently</p>
                          </div>
                          <div className="p-3 bg-slate-50 border-l-4 border-pink-500 rounded-r-xl">
                            <strong className="text-slate-800">engaged</strong>
                            <p className="text-[11px] text-slate-650 mt-0.5 font-serif">by the beauty, patterns and structure of mathematics, becoming curious to learn about its many applications in society and the economy</p>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 font-sans italic text-slate-600 mt-4">
                          "The strength of Cambridge IGCSE qualifications is internationally recognised and has provided an international pathway for our students to continue their studies around the world."
                          <div className="text-[9px] font-bold text-slate-450 mt-1 not-italic">
                            — Gary Tan, Head of Schools and CEO, Raffles International Group of Schools, Indonesia
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Why choose this syllabus?</span>
                      <span>Page 4 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 5 && (
                  /* PAGE 5: SYLLABUS OVERVIEW - AIMS */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-150 pb-2">2 Syllabus overview</h2>
                      <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed font-serif">
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Aims</h3>
                        <p>
                          The aims describe the purposes of a course based on this syllabus. The aims are to enable students to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2.5 font-sans text-xs text-slate-750">
                          <li>develop a positive attitude towards mathematics in a way that encourages enjoyment, establishes confidence and promotes enquiry and further learning</li>
                          <li>develop a feel for number and understand the significance of the results obtained</li>
                          <li>apply their mathematical knowledge and skills to their own lives and the world around them</li>
                          <li>use creativity and resilience to analyse and solve problems</li>
                          <li>communicate mathematics clearly</li>
                          <li>develop the ability to reason logically, make inferences and draw conclusions</li>
                          <li>develop fluency so that they can appreciate the interdependence of, and connections between, different areas of mathematics</li>
                          <li>acquire a foundation for further study in mathematics and other subjects.</li>
                        </ul>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-6 text-[10px] text-slate-500 font-sans">
                          <p className="font-bold text-slate-700">Political Neutrality Statement:</p>
                          <p className="mt-1">
                            Cambridge Assessment International Education is an education organisation and politically neutral. The contents of this syllabus, examination papers and associated materials do not endorse any political view. We endeavour to treat all aspects of the exam process neutrally.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Syllabus overview</span>
                      <span>Page 7 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 6 && (
                  /* PAGE 6: CONTENT OVERVIEW */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-150 pb-2">Syllabus overview (continued)</h2>
                      <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed font-serif">
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Content overview</h3>
                        <p>
                          All candidates study the following topics:
                        </p>
                        
                        <div className="grid grid-cols-3 gap-3 my-4 font-sans text-xs">
                          {[
                            "1 Number",
                            "2 Algebra and graphs",
                            "3 Coordinate geometry",
                            "4 Geometry",
                            "5 Mensuration",
                            "6 Trigonometry",
                            "7 Transformations and vectors",
                            "8 Probability",
                            "9 Statistics"
                          ].map((topic, i) => (
                            <div key={i} className="p-3 bg-slate-50/80 rounded-xl border border-slate-150 text-slate-805 font-bold flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-650 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                                {i + 1}
                              </span>
                              <span className="truncate">{topic.substring(2)}</span>
                            </div>
                          ))}
                        </div>

                        <p className="mt-4">
                          Cambridge IGCSE Mathematics is tiered to enable effective differentiation for learners.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-1">
                          <li>
                            <strong>Core subject content</strong> is intended for learners targeting grades C–G.
                          </li>
                          <li>
                            <strong>Extended subject content</strong> is intended for learners targeting grades A*–C. The Extended subject content contains the Core subject content as well as additional content.
                          </li>
                        </ul>
                        <p className="mt-3">
                          The subject content is organised by topic and is not presented in a teaching order. This content structure and the use of tiering allows flexibility for teachers to plan delivery in a way that is appropriate for their learners.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Syllabus overview</span>
                      <span>Page 8 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 7 && (
                  /* PAGE 7: ASSESSMENT OVERVIEW */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-150 pb-2">Syllabus overview (continued)</h2>
                      <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed font-serif">
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Assessment overview</h3>
                        <p>
                          All candidates take two components. Core candidates take Paper 1 and Paper 3. Extended candidates take Paper 2 and Paper 4.
                        </p>
                        
                        <div className="space-y-4 my-4 font-sans text-xs">
                          {/* Core Block */}
                          <div className="p-4 rounded-xl border border-amber-250 bg-amber-50/10">
                            <h4 className="font-extrabold text-amber-700 text-xs uppercase tracking-wider mb-2">Core Assessment (Grades C–G)</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-900">Paper 1 (Non-calculator)</span>
                                <ul className="text-[10px] text-slate-500 mt-1 space-y-0.5 list-disc pl-3">
                                  <li>1 hour 30 minutes</li>
                                  <li>80 marks</li>
                                  <li>50% of the IGCSE</li>
                                  <li>Short-answer & structured questions</li>
                                </ul>
                              </div>
                              <div className="bg-white p-3 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-900">Paper 3 (Calculator)</span>
                                <ul className="text-[10px] text-slate-500 mt-1 space-y-0.5 list-disc pl-3">
                                  <li>1 hour 30 minutes</li>
                                  <li>80 marks</li>
                                  <li>50% of the IGCSE</li>
                                  <li>Scientific calculator required</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Extended Block */}
                          <div className="p-4 rounded-xl border border-purple-250 bg-purple-50/10">
                            <h4 className="font-extrabold text-purple-700 text-xs uppercase tracking-wider mb-2">Extended Assessment (Grades A*–E)</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-900">Paper 2 (Non-calculator)</span>
                                <ul className="text-[10px] text-slate-500 mt-1 space-y-0.5 list-disc pl-3">
                                  <li>2 hours</li>
                                  <li>100 marks</li>
                                  <li>50% of the IGCSE</li>
                                  <li>Short-answer & structured questions</li>
                                </ul>
                              </div>
                              <div className="bg-white p-3 rounded-lg border border-slate-100">
                                <span className="font-bold text-slate-900">Paper 4 (Calculator)</span>
                                <ul className="text-[10px] text-slate-500 mt-1 space-y-0.5 list-disc pl-3">
                                  <li>2 hours</li>
                                  <li>100 marks</li>
                                  <li>50% of the IGCSE</li>
                                  <li>Scientific calculator required</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-[11px] italic bg-slate-50 p-2.5 rounded-lg text-slate-650 font-sans border border-slate-150">
                          <strong>Calculator Policy:</strong> Calculators are <strong>not allowed</strong> for Paper 1 and Paper 2. A scientific calculator is required for Paper 3 and Paper 4.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Syllabus overview</span>
                      <span>Page 9 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 8 && (
                  /* PAGE 8: CORE SUBJECT CONTENT C1.1 */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h2 className="text-lg font-bold text-slate-900">3 Subject content</h2>
                        <span className="text-xs uppercase tracking-widest text-slate-450 font-bold font-sans bg-slate-100 px-2 py-0.5 rounded">Core</span>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <h3 className="font-sans font-bold text-slate-800 text-sm">1 Number</h3>
                        
                        <div className="overflow-hidden rounded-xl border border-slate-200 mt-2">
                          <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-250">
                                <th className="w-1/2 p-3 border-r border-slate-200">Core subject content</th>
                                <th className="w-1/2 p-3">Notes and examples</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 align-top text-[11px] text-slate-650">
                              <tr>
                                <td className="p-3 border-r border-slate-200 space-y-2">
                                  <span className="font-bold text-slate-900">C1.1 Types of number</span>
                                  <p className="font-serif leading-relaxed">
                                    Identify and use:
                                  </p>
                                  <ul className="list-disc pl-4 space-y-1 font-sans text-[10px]">
                                    <li>natural numbers</li>
                                    <li>integers (positive, zero and negative)</li>
                                    <li>prime numbers</li>
                                    <li>square numbers</li>
                                    <li>cube numbers</li>
                                    <li>common factors</li>
                                    <li>common multiples</li>
                                    <li>rational and irrational numbers</li>
                                    <li>reciprocals</li>
                                  </ul>
                                </td>
                                <td className="p-3 font-serif leading-relaxed space-y-2">
                                  <p>Example tasks include:</p>
                                  <ul className="list-disc pl-4 space-y-1">
                                    <li>convert between numbers and words, e.g. <br /><em>six billion is 6000000000</em>, <br /><em>10007 is ten thousand and seven</em></li>
                                    <li>express 72 as a product of its prime factors</li>
                                    <li>find the highest common factor (HCF) of two numbers</li>
                                    <li>find the lowest common multiple (LCM) of two numbers</li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Subject content</span>
                      <span>Page 12 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 9 && (
                  /* PAGE 9: C1.2 - C1.5 */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h2 className="text-base font-bold text-slate-950 font-sans">1 Number (continued)</h2>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-sans">Core Content</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-200">
                                <th className="w-1/2 p-2.5 border-r border-slate-200">Core subject content</th>
                                <th className="w-1/2 p-2.5">Notes and examples</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 align-top text-[11px] text-slate-650">
                              {/* C1.2 Sets */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.2 Sets</span>
                                  <p className="font-serif">
                                    Understand and use set language, notation and Venn diagrams to describe sets.
                                  </p>
                                  <p className="font-semibold text-[10px] text-slate-500 mt-1">Venn diagrams are limited to two sets.</p>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p>The following set notation will be used:</p>
                                  <ul className="list-disc pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li><strong>n(A)</strong> Number of elements in set A</li>
                                    <li><strong>A′</strong> Complement of set A</li>
                                    <li><strong>ℰ</strong> Universal set</li>
                                    <li><strong>A ∪ B</strong> Union of A and B</li>
                                    <li><strong>A ∩ B</strong> Intersection of A and B</li>
                                  </ul>
                                  <p className="text-[10px] mt-1">Example definition of sets:<br />
                                    A = {"{x: x is a natural number}"}<br />
                                    B = {"{a, b, c, …}"}<br />
                                    C = {"{x: a ⩽ x ⩽ b}"}
                                  </p>
                                </td>
                              </tr>

                              {/* C1.3 Powers and roots */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.3 Powers and roots</span>
                                  <p className="font-serif">
                                    Calculate with the following:
                                  </p>
                                  <ul className="list-disc pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>squares and square roots</li>
                                    <li>cubes and cube roots</li>
                                    <li>other powers and roots of numbers</li>
                                  </ul>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p>Includes recall of squares and roots from 1 to 15, and cubes and roots of 1, 2, 3, 4, 5 and 10.</p>
                                  <p className="text-[10px] text-slate-500 font-sans mt-1">Examples:</p>
                                  <ul className="list-disc pl-4 space-y-0.5 text-[10px] font-sans">
                                    <li>Write down the value of √169.</li>
                                    <li>Work out 5³ or 8²ᐟ³.</li>
                                  </ul>
                                </td>
                              </tr>

                              {/* C1.4 Fractions, decimals and percentages */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.4 Fractions, decimals and percentages</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Use the language of proper/improper fractions, mixed numbers, decimals, percentages.</li>
                                    <li>Recognise equivalence and convert between forms.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p>Candidates are expected to write fractions in their simplest form.</p>
                                  <p className="text-[10px] text-slate-500 font-sans"><strong>Note:</strong> Recurring decimal notation is not expected, nor is converting recurring decimals to fractions.</p>
                                </td>
                              </tr>

                              {/* C1.5 Ordering */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.5 Ordering</span>
                                  <p className="font-serif">
                                    Order quantities by magnitude and demonstrate familiarity with the symbols =, ≠, &gt;, &lt;, ⩾ and ⩽.
                                  </p>
                                </td>
                                <td className="p-2.5 font-serif text-slate-450 italic">
                                  No specific notes.
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Subject content</span>
                      <span>Page 13 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 10 && (
                  /* PAGE 10: C1.6 - C1.10 */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h2 className="text-base font-bold text-slate-955 font-sans">1 Number (continued)</h2>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-sans">Core Content</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-200">
                                <th className="w-1/2 p-2.5 border-r border-slate-200">Core subject content</th>
                                <th className="w-1/2 p-2.5">Notes and examples</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 align-top text-[11px] text-slate-650">
                              {/* C1.6 The four operations */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.6 The four operations</span>
                                  <p className="font-serif">
                                    Use the four operations for calculations with integers, fractions and decimals, including correct ordering of operations and use of brackets.
                                  </p>
                                </td>
                                <td className="p-2.5 font-serif space-y-0.5">
                                  <p>Includes:</p>
                                  <ul className="list-disc pl-4 text-[10px]">
                                    <li>negative numbers</li>
                                    <li>improper fractions and mixed numbers</li>
                                    <li>practical situations, e.g. temperature changes</li>
                                  </ul>
                                </td>
                              </tr>

                              {/* C1.7 Indices I */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.7 Indices I</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Understand and use indices (positive, zero and negative integers).</li>
                                    <li>Understand and use the rules of indices.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p className="text-[10px]">e.g. find the value of 7⁻².<br />
                                    e.g. find the value of 2⁻³ × 2⁴, (2³)², 2³ ÷ 2⁴.
                                  </p>
                                </td>
                              </tr>

                              {/* C1.8 Standard form */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.8 Standard form</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Use standard form A × 10ⁿ where n is a positive/negative integer and 1 ⩽ A &lt; 10.</li>
                                    <li>Convert numbers into and out of standard form.</li>
                                    <li>Calculate with values in standard form.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif">
                                  <p className="text-[10px] font-semibold text-slate-500">Core candidates are expected to calculate with standard form only on Paper 3.</p>
                                </td>
                              </tr>

                              {/* C1.9 Estimation */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.9 Estimation</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Round values to a specified degree of accuracy.</li>
                                    <li>Make estimates for calculations.</li>
                                    <li>Round answers to a reasonable degree of accuracy in context.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p>Includes decimal places and significant figures.</p>
                                  <p className="text-[10px] text-slate-550">e.g. write 5764 correct to the nearest thousand.<br />
                                    e.g. estimate the value of (97.9 - 7.65) / (4.1 × 3) by rounding each number to 1 significant figure.
                                  </p>
                                </td>
                              </tr>

                              {/* C1.10 Limits of accuracy */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.10 Limits of accuracy</span>
                                  <p className="font-serif">
                                    Give upper and lower bounds for data rounded to a specified accuracy.
                                  </p>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p className="text-[10px]">e.g. write down the upper bound of a length measured correct to the nearest metre.</p>
                                  <p className="text-[10px] text-slate-500 font-sans font-semibold">Candidates are not expected to calculate with bounds of results.</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Subject content</span>
                      <span>Page 14 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 11 && (
                  /* PAGE 11: C1.11 - C1.13 */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h2 className="text-base font-bold text-slate-955 font-sans">1 Number (continued)</h2>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-sans">Core Content</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-200">
                                <th className="w-1/2 p-2.5 border-r border-slate-200">Core subject content</th>
                                <th className="w-1/2 p-2.5">Notes and examples</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 align-top text-[11px] text-slate-650">
                              {/* C1.11 Ratio and proportion */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.11 Ratio and proportion</span>
                                  <p className="font-serif">
                                    Understand and use ratio and proportion to:
                                  </p>
                                  <ul className="list-disc pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>give ratios in simplest form</li>
                                    <li>divide a quantity in a given ratio</li>
                                    <li>use proportional reasoning and ratios in context</li>
                                  </ul>
                                </td>
                                <td className="p-2.5 font-serif space-y-0.5">
                                  <p>e.g. 20:30:40 in simplest form is 2:3:4.</p>
                                  <p>e.g. adapt recipes; use map scales; determine best value.</p>
                                </td>
                              </tr>

                              {/* C1.12 Rates */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.12 Rates</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Use common measures of rate.</li>
                                    <li>Apply other measures of rate.</li>
                                    <li>Solve problems involving average speed.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p className="text-[10px]">e.g. calculate with: hourly pay, exchange rates, flow rates, fuel consumption, pressure, density, population density.</p>
                                  <p className="text-[10px] text-slate-500 font-semibold font-sans">Speed/distance/time formula knowledge is required. Required formulas (like density) will be given in questions.</p>
                                  <p className="text-[10px] italic">Notation: m/s, g/cm³.</p>
                                </td>
                              </tr>

                              {/* C1.13 Percentages */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.13 Percentages</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Calculate a percentage of a quantity.</li>
                                    <li>Express one quantity as a percentage of another.</li>
                                    <li>Calculate percentage increase/decrease.</li>
                                    <li>Calculate with simple and compound interest.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p className="font-bold text-amber-600 text-[10px]">Formulas are not given.</p>
                                  <p className="text-[10px]">Percentage calculations may include: deposit, discount, profit and loss, earnings, percentages over 100%.</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Subject content</span>
                      <span>Page 15 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 12 && (
                  /* PAGE 12: C1.14 - C1.16 */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h2 className="text-base font-bold text-slate-955 font-sans">1 Number (continued)</h2>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-sans">Core Content</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-200">
                                <th className="w-1/2 p-2.5 border-r border-slate-200">Core subject content</th>
                                <th className="w-1/2 p-2.5">Notes and examples</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 align-top text-[11px] text-slate-650">
                              {/* C1.14 Using a calculator */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.14 Using a calculator</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Use a calculator efficiently.</li>
                                    <li>Enter values appropriately on a calculator.</li>
                                    <li>Interpret the calculator display appropriately.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <ul className="list-disc pl-4 text-[10px]">
                                    <li>know not to round values within a calculation and to only round the final answer</li>
                                    <li>enter 2 hours 30 minutes as 2.5 hours or 2° 30' 0"</li>
                                    <li>in money 4.8 means $4.80; in time 3.25 means 3 hours 15 minutes</li>
                                  </ul>
                                </td>
                              </tr>

                              {/* C1.15 Time */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.15 Time</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Calculate with time: s, min, h, days, weeks, months, years.</li>
                                    <li>Calculate times in terms of 24-hour and 12-hour clock.</li>
                                    <li>Read clocks and timetables.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-0.5">
                                  <p>1 year = 365 days.</p>
                                  <p>In 24-hour clock, e.g. 3.15 a.m. will be denoted by 0315 and 3.15 p.m. by 1515.</p>
                                  <p className="text-[10px]">Includes problems involving time zones, local times and time differences.</p>
                                </td>
                              </tr>

                              {/* C1.16 Money */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C1.16 Money</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Calculate with money.</li>
                                    <li>Convert from one currency to another.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif text-slate-450 italic">
                                  No specific notes.
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Subject content</span>
                      <span>Page 16 of 68</span>
                    </div>
                  </div>
                )}

                {currentPage === 13 && (
                  /* PAGE 13: 2 ALGEBRA AND GRAPHS */
                  <div className="h-full flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h2 className="text-base font-bold text-slate-955 font-sans">2 Algebra and graphs</h2>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-sans">Core Content</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <table className="w-full text-left font-sans text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold tracking-wider text-slate-500 uppercase border-b border-slate-200">
                                <th className="w-1/2 p-2.5 border-r border-slate-200">Core subject content</th>
                                <th className="w-1/2 p-2.5">Notes and examples</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 align-top text-[11px] text-slate-650">
                              {/* C2.1 Introduction to algebra */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C2.1 Introduction to algebra</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Know that letters can be used to represent generalised numbers.</li>
                                    <li>Substitute numbers into expressions and formulas.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif text-slate-450 italic">
                                  No specific notes.
                                </td>
                              </tr>

                              {/* C2.2 Algebraic manipulation */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C2.2 Algebraic manipulation</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Simplify expressions by collecting like terms.</li>
                                    <li>Expand products of algebraic expressions.</li>
                                    <li>Factorise by extracting common factors.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p>Simplify means give in simplest form:<br />
                                    e.g. 2a + 3b + 5a – 9b = 7a – 6b.
                                  </p>
                                  <p>e.g. expand 3x(2x – 4y).</p>
                                  <p>Includes products of two brackets involving one variable, e.g. expand (2x + 1)(x – 4).</p>
                                  <p>Factorise means factorise fully, e.g. 9x² + 15xy = 3x(3x + 5y).</p>
                                </td>
                              </tr>

                              {/* C2.4 Indices II */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C2.4 Indices II</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Understand and use indices (positive, zero and negative).</li>
                                    <li>Understand and use the rules of indices.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p>e.g. 2ˣ = 32. Find the value of x.</p>
                                  <p>e.g. simplify: (5x³)² , 12a⁵ ÷ 3a⁻² , 6x⁷y⁴ × 5x⁻⁵y.</p>
                                  <p className="text-[10px] text-slate-500 font-sans">Knowledge of logarithms is not required.</p>
                                </td>
                              </tr>

                              {/* C2.5 Equations */}
                              <tr>
                                <td className="p-2.5 border-r border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block">C2.5 Equations</span>
                                  <ol className="list-decimal pl-4 space-y-0.5 font-sans text-[10px]">
                                    <li>Construct simple expressions, equations and formulas.</li>
                                    <li>Solve linear equations in one unknown.</li>
                                    <li>Solve simultaneous linear equations in two unknowns.</li>
                                    <li>Change the subject of simple formulas.</li>
                                  </ol>
                                </td>
                                <td className="p-2.5 font-serif space-y-1">
                                  <p>e.g. write an expression for a number that is 2 more than n.</p>
                                  <p>Includes constructing linear simultaneous equations.</p>
                                  <p>Examples: 3x + 4 = 10, 5 – 2x = 3(x + 7).</p>
                                  <p>Change the subject where the subject appears once and there is not a power/root of the subject.</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-[9px] text-slate-400 font-sans">
                      <span>Cambridge IGCSE Mathematics 0580 syllabus for 2025, 2026 and 2027. Subject content</span>
                      <span>Page 17 of 68</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ── GENERAL FALLBACK SYLLABUS PAGES ── */
              <>
                {currentPage === 1 && (
                  /* COVER PAGE */
                  <div className="h-full flex flex-col justify-between relative flex-1 text-slate-800">
                    {/* Header Logo section */}
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          EG
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none">Assessment</h4>
                          <p className="text-[9px] text-slate-455 uppercase tracking-wider leading-none mt-0.5">International Education</p>
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

                      <div className="absolute bottom-6 right-6 w-48 h-48 rounded-full border border-slate-100/50 flex items-center justify-center bg-white/40 shadow-inner">
                        <div className="text-slate-300 text-5xl">📚</div>
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

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-650 leading-relaxed font-sans">
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
                              <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-650 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {obj.code}
                              </span>
                              <div>
                                <p className="font-bold text-slate-850">{obj.title}</p>
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
              </>
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
