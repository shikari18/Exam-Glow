import type { NoteChapter, NoteBlock } from "./types";
import { syllabusData } from "../syllabus";

// Import new consolidated notes
import { biologyNotes } from "./biology-notes";
import { chemistryNotes } from "./chemistry-notes";
import { physicsNotes } from "./physics-notes";
import { mathematicsNotes } from "./mathematics-notes";
import { computerScienceNotes } from "./computer-science-notes";
import { accountingNotes } from "./accounting-notes";
import { economicsNotes } from "./economics-notes";
import { businessStudiesNotes } from "./business-studies-notes";
import { geographyNotes } from "./geography-notes";
import { historyNotes } from "./history-notes";
import { englishLanguageNotes } from "./english-language-notes";

export type { NoteChapter, NotePage, NoteBlock, BulletItem } from "./types";

// Helper to stamp syllabus codes onto chapter arrays so notes are isolated per syllabus
function tagNotes(chapters: NoteChapter[], code: string): NoteChapter[] {
  return chapters.map(c => ({ ...c, code }));
}

export const noteChapters: NoteChapter[] = [
  ...tagNotes(biologyNotes, "0610"),
  ...tagNotes(chemistryNotes, "0620"),
  ...tagNotes(physicsNotes, "0625"),
  ...tagNotes(mathematicsNotes, "0580"),
  ...tagNotes(computerScienceNotes, "0478"),
  ...tagNotes(accountingNotes, "0452"),
  ...tagNotes(economicsNotes, "0455"),
  ...tagNotes(businessStudiesNotes, "0450"),
  ...tagNotes(geographyNotes, "0460"),
  ...tagNotes(historyNotes, "0470"),
  ...tagNotes(englishLanguageNotes, "0500"),
];

const subjectMap: Record<string, string> = {
  "biology": "biology-0610",
  "chemistry": "chemistry-0620",
  "physics": "physics-0625",
  "mathematics": "mathematics-0580",
  "additional mathematics": "mathematics-0580",
  "geography": "geography-0460",
  "computer science": "computer-science-0478",
  "ict/computer science": "computer-science-0478",
  "english language": "english-language-0500",
  "english literature": "english-language-0500",
  "economics": "economics-0455",
  "business studies": "business-studies-0450",
  "accounting": "accounting-0452",
  "history": "history-0470",
};

function getDynamicBlocks(title: string, desc: string, code: string, subject: string, isFirstSection = false): NoteBlock[] {
  const t = title.toLowerCase();
  const s = subject.toLowerCase();

  // ── ACCOUNTING ──────────────────────────────────────────────────────────────
  if (s.includes("accounting") || t.includes("ledger") || t.includes("double entry") || t.includes("trial balance") || t.includes("depreciation") || t.includes("balance sheet") || t.includes("income statement") || t.includes("bookkeeping")) {
    return [
      ...(isFirstSection ? [{ kind: "video" as const, youtubeId: "_HK5gpg39pY", title: `${title} — IGCSE Accounting`, caption: "Understanding financial statements and accounting — Crash Course Entrepreneurship #15" }] : []),
      { kind: "intro", text: `**${title}** — ${desc}. This guide covers the key principles, entries, and financial statement structures required for Cambridge IGCSE Accounting (0452).` },
      { kind: "highlight", text: "**The Accounting Equation:** Assets = Liabilities + Owner's Equity\n\nThis must balance after EVERY transaction. It is the foundation of double entry bookkeeping.", color: "blue" },
      { kind: "table", headers: ["Account type", "Debit (DR) increases", "Credit (CR) increases"], rows: [
        ["Asset (cash, machinery, receivables)", "✓ Yes", "✗ No"],
        ["Liability (loan, payables)", "✗ No", "✓ Yes"],
        ["Capital / Equity", "✗ No", "✓ Yes"],
        ["Revenue / Income", "✗ No", "✓ Yes"],
        ["Expense (wages, rent)", "✓ Yes", "✗ No"],
        ["Drawings", "✓ Yes", "✗ No"],
      ]},
      { kind: "keyterms", terms: [
        { label: "Double Entry", value: "Every transaction has TWO equal and opposite entries — a debit and a credit." },
        { label: "Debit (DR)", value: "Entry on the LEFT side of a T-account. Increases assets and expenses." },
        { label: "Credit (CR)", value: "Entry on the RIGHT side of a T-account. Increases liabilities, equity and income." },
        { label: "Trial Balance", value: "A list of all ledger account balances — total debits must equal total credits." },
        { label: "Depreciation", value: "The systematic reduction in value of a non-current asset over its useful life." },
      ]},
      { kind: "highlight", text: "**The Accounting Equation:** Assets = Liabilities + Owner's Equity\n\nThis must balance after EVERY transaction. It is the foundation of double entry bookkeeping.", color: "blue" },
      { kind: "table", headers: ["Account type", "Debit increases", "Credit increases"], rows: [
        ["Asset (cash, machinery, receivables)", "✓ Yes", "✗ No"],
        ["Liability (loan, payables)", "✗ No", "✓ Yes"],
        ["Capital / Equity", "✗ No", "✓ Yes"],
        ["Revenue / Income", "✗ No", "✓ Yes"],
        ["Expense (wages, rent)", "✓ Yes", "✗ No"],
        ["Drawings", "✓ Yes", "✗ No"],
      ]},
      { kind: "tip", text: `For **${title}**, always show: date, account debited, account credited, and amounts. Use DEAD CLIC: **D**rawings, **E**xpenses, **A**ssets, **D**ebit = increases these. **C**apital, **L**iabilities, **I**ncome, **C**redit = increases these.` },
      { kind: "warning", text: "Common mistake: Confusing capital expenditure (buys an asset — goes on balance sheet) with revenue expenditure (day-to-day expense — goes on income statement). E.g. buying a machine = capital; repairing a machine = revenue." },
    ];
  }

  // ── ECONOMICS ───────────────────────────────────────────────────────────────
  if (s.includes("economics") || t.includes("demand") || t.includes("supply") || t.includes("market") || t.includes("elasticity") || t.includes("gdp") || t.includes("inflation") || t.includes("fiscal") || t.includes("monetary") || t.includes("trade")) {
    return [
      ...(isFirstSection ? [{ kind: "video" as const, youtubeId: "g9aDizJpd_s", title: `${title} — IGCSE Economics`, caption: "Supply and demand explained — Crash Course Economics #4" }] : []),
      { kind: "intro", text: `**${title}** — ${desc}. This note covers the key economic concepts, diagrams and analysis for Cambridge IGCSE Economics (0455).` },
      { kind: "highlight", text: "**Supply & Demand Diagram — Key Points:**\n• D curve slopes downward (higher price → less demanded)\n• S curve slopes upward (higher price → more supplied)\n• Equilibrium E = intersection of S and D curves\n• At P*: Qd = Qs — market clears with no shortage or surplus", color: "blue" },
      { kind: "keyterms", terms: [
        { label: "Demand", value: "The willingness and ability of consumers to purchase a good at various prices in a given time period." },
        { label: "Supply", value: "The willingness and ability of producers to offer a good for sale at various prices in a given time period." },
        { label: "Equilibrium", value: "The price at which quantity demanded equals quantity supplied — the market clears with no shortage or surplus." },
        { label: "PED", value: "Price Elasticity of Demand = % change in Qd ÷ % change in P. Measures responsiveness of demand to price changes." },
        { label: "Inflation", value: "A sustained rise in the general price level, reducing the purchasing power of money." },
        { label: "GDP", value: "Gross Domestic Product — total monetary value of all goods and services produced in a country in a year." },
      ]},
      { kind: "comparison", left: { label: "Shift of demand curve (demand changes)", items: ["Change in consumer income", "Change in price of substitutes or complements", "Change in consumer tastes or fashion", "Change in population size or demographics", "Change in advertising spending"] }, right: { label: "Movement along demand curve", items: ["ONLY caused by a change in the PRICE of the good itself", "Price rises → quantity demanded contracts", "Price falls → quantity demanded extends", "Curve itself does NOT move"] } },
      { kind: "highlight", text: "**PED:** If |PED| > 1 → price elastic (luxury goods, many substitutes)\nIf |PED| < 1 → price inelastic (necessities, few substitutes, habit-forming)\n\n**Tip:** Inelastic demand → raising price increases total revenue.", color: "blue" },
      { kind: "tip", text: `For **${title}** diagrams, always: label axes (Price on Y, Quantity on X), label curves (D, S), show equilibrium point E with price P* and quantity Q*. When a curve shifts, label the new curve (D₂/S₂) and new equilibrium E₂.` },
    ];
  }

  // ── BUSINESS STUDIES ────────────────────────────────────────────────────────
  if (s.includes("business") || t.includes("marketing") || t.includes("stakeholder") || t.includes("cash flow") || t.includes("entrepreneur") || t.includes("human resource") || t.includes("production") || t.includes("profit")) {
    return [
      ...(isFirstSection ? [{ kind: "video" as const, youtubeId: "UWImfFax8Ew", title: `${title} — IGCSE Business Studies`, caption: "Revenue, profits and price — Crash Course Economics #24" }] : []),
      { kind: "intro", text: `**${title}** — ${desc}. This note covers the essential business concepts and frameworks for Cambridge IGCSE Business Studies (0450).` },
      { kind: "keyterms", terms: [
        { label: "Stakeholder", value: "Any person or group with an interest in a business (shareholders, employees, customers, government, community)." },
        { label: "Cash flow", value: "The movement of money into and out of a business. Net cash flow = cash inflows − cash outflows." },
        { label: "Break-even", value: "The output level where total revenue = total costs. Neither profit nor loss is made." },
        { label: "SWOT Analysis", value: "Strengths, Weaknesses, Opportunities, Threats — a strategic planning framework." },
        { label: "Marketing Mix (4Ps)", value: "Product, Price, Place, Promotion — the tools used to market goods/services." },
      ]},
      { kind: "highlight", text: "**Break-even formula:**\n\nBreak-even output = Fixed Costs ÷ (Selling Price − Variable Cost per unit)\n\nThe denominator (Selling Price − Variable Cost per unit) is called **Contribution per unit**.", color: "green" },
      { kind: "comparison", left: { label: "Internal stakeholders", items: ["Shareholders/owners — want profit and dividends", "Managers — want job security, authority, bonuses", "Employees — want fair pay, good conditions, job security"] }, right: { label: "External stakeholders", items: ["Customers — want quality at fair prices", "Suppliers — want regular orders and prompt payment", "Government — wants tax revenue and low unemployment", "Community — wants minimal negative externalities"] } },
      { kind: "tip", text: `For **${title}** questions, always apply your answer to the business context. Generic answers score 1–2 marks; applied answers with specific details from the case study score full marks. Use business terminology throughout.` },
    ];
  }

  // ── GEOGRAPHY ───────────────────────────────────────────────────────────────
  if (s.includes("geography") || t.includes("river") || t.includes("coast") || t.includes("plate") || t.includes("population") || t.includes("urbanisation") || t.includes("climate") || t.includes("ecosystem") || t.includes("tectonic") || t.includes("development")) {
    return [
      ...(isFirstSection ? [{ kind: "video" as const, youtubeId: "X2ZIDALAkXo", title: `${title} — IGCSE Geography`, caption: "Political economies and geography — Crash Course Geography #38" }] : []),
      { kind: "intro", text: `**${title}** — ${desc}. This note covers the key geographical processes, case studies and exam skills for Cambridge IGCSE Geography (0460).` },
      { kind: "highlight", text: "**Tectonic Plate Boundaries:**\n• **Convergent** — plates move toward each other → mountains, volcanoes, deep ocean trenches\n• **Divergent** — plates move apart → mid-ocean ridges, rift valleys\n• **Transform** — plates slide past each other → earthquakes (e.g. San Andreas Fault)", color: "green" },
      { kind: "keyterms", terms: [
        { label: "Erosion", value: "Wearing away of rock by hydraulic action, abrasion, attrition, and solution." },
        { label: "Deposition", value: "Laying down of transported material when energy decreases." },
        { label: "Tectonic plates", value: "Large sections of Earth's crust and upper mantle moving on convection currents." },
        { label: "Urbanisation", value: "Increase in the proportion of people living in urban areas." },
        { label: "Sustainable development", value: "Development meeting present needs without compromising future generations." },
      ]},
      { kind: "bullets", items: [
        { text: "**River erosion processes (HAAS):**", sub: ["**H**ydraulic action — force of water breaks rock apart", "**A**brasion — rocks carried scrape the bed and banks", "**A**ttrition — rocks carried collide and break into smaller pieces", "**S**olution — soluble minerals dissolve in the water"] },
        { text: "**Coastal processes:**", sub: ["Constructive waves — low energy, strong swash → deposition, builds beaches", "Destructive waves — high energy, strong backwash → erosion of cliffs", "Longshore drift — sediment moves along coast in zigzag due to wave angle"] },
      ]},
      { kind: "tip", text: `For **${title}** questions: always name a specific case study with data (figures, dates, locations). Structure answers as: describe → explain → impact → management. Draw and annotate diagrams where relevant.` },
    ];
  }

  // ── HISTORY ──────────────────────────────────────────────────────────────────
  if (s.includes("history") || t.includes("war") || t.includes("versailles") || t.includes("cold war") || t.includes("nazi") || t.includes("revolution") || t.includes("appeasement") || t.includes("league") || t.includes("imperialism")) {
    return [
      ...(isFirstSection ? [{ kind: "video" as const, youtubeId: "y9HjvHZfCUI", title: `${title} — IGCSE History`, caption: "The Cold War explained — Crash Course World History #39" }] : []),
      { kind: "intro", text: `**${title}** — ${desc}. This note covers the key historical events, causes, consequences and significance for Cambridge IGCSE History (0470/0977).` },
      { kind: "keyterms", terms: [
        { label: "Appeasement", value: "Policy of making concessions to an aggressor to avoid war. E.g. Munich Agreement 1938." },
        { label: "Treaty of Versailles (1919)", value: "Peace treaty after WWI. Germany lost 13% territory, paid £6.6bn reparations, army limited to 100,000." },
        { label: "League of Nations", value: "International organisation created 1920 to maintain peace. Weakened by USA not joining, no armed forces." },
        { label: "Cold War", value: "Ideological tension between the USA (capitalism) and USSR (communism) 1947–1991." },
        { label: "Containment", value: "US policy to prevent spread of communism — basis of the Truman Doctrine (1947) and Marshall Plan (1948)." },
      ]},
      { kind: "comparison", left: { label: "Arguments FOR appeasement", items: ["Britain was not militarily ready in 1938", "WWI memories made war very unpopular", "Hitler's demands seemed to be based on self-determination", "Buying time allowed British rearmament"] }, right: { label: "Arguments AGAINST appeasement", items: ["Encouraged Hitler to make further demands", "Failed to stop aggression at an early stage", "Abandoned Czechoslovakia without consultation", "Churchill argued it made war more, not less likely"] } },
      { kind: "tip", text: "For essay questions, use **POINT → EVIDENCE → EXPLANATION → LINK** structure. Always balance both sides before giving a supported conclusion. Examiners reward well-reasoned judgements backed by specific evidence." },
      { kind: "warning", text: "Don't just describe events — EXPLAIN causation and consequence. Phrases like 'This led to...' and 'As a result...' demonstrate analytical thinking and are needed for Level 3 (highest) mark bands." },
    ];
  }

  // ── ENGLISH LANGUAGE / LITERATURE ───────────────────────────────────────────
  if (s.includes("english") || t.includes("narrative") || t.includes("descriptive") || t.includes("reading") || t.includes("writing") || t.includes("poetry") || t.includes("prose")) {
    return [
      ...(isFirstSection ? [{ kind: "video" as const, youtubeId: "MSYw502dJNY", title: `${title} — IGCSE English`, caption: "How and why we read — Crash Course English Literature #1" }] : []),
      { kind: "intro", text: `**${title}** — ${desc}. This guide covers the key skills, language techniques and exam strategies for Cambridge IGCSE English (0500/0475).` },
      { kind: "keyterms", terms: [
        { label: "Simile", value: "A comparison using 'like' or 'as' — e.g. 'as cold as ice'" },
        { label: "Metaphor", value: "A direct comparison stating one thing IS another — e.g. 'The world is a stage'" },
        { label: "Personification", value: "Giving human qualities to non-human things — e.g. 'The wind howled angrily'" },
        { label: "Alliteration", value: "Repetition of consonant sounds at the start of words — creates rhythm and emphasis" },
        { label: "Tone", value: "The attitude/mood conveyed by the writer through word choice and sentence structure" },
      ]},
      { kind: "highlight", text: "**PEEL paragraph structure:**\n**P**oint — Make a clear point about the text\n**E**vidence — Quote directly from the text\n**E**xplain — Analyse the effect of the language/technique\n**L**ink — Connect back to the question/theme", color: "pink" },
      { kind: "comparison", left: { label: "Narrative writing", items: ["Use first or third person consistently", "Create vivid characters and settings", "Build tension through conflict and pace", "Vary sentence length for dramatic effect", "Strong opening hook and satisfying resolution"] }, right: { label: "Descriptive writing", items: ["Focus on all five senses", "Use figurative language throughout", "Create atmosphere through word choice", "Zoom in on specific vivid details", "Present moment — no need for plot or events"] } },
      { kind: "tip", text: "For reading questions: always quote directly from the text and explain the EFFECT on the reader. Don't just identify the technique — say what it makes the reader think or feel and WHY the writer chose it." },
    ];
  }

  // ── COMPUTER SCIENCE / ICT ───────────────────────────────────────────────────
  if (s.includes("computer") || s.includes("ict") || t.includes("binary") || t.includes("algorithm") || t.includes("cpu") || t.includes("database") || t.includes("network") || t.includes("programming") || t.includes("security") || t.includes("logic")) {
    if (t.includes("binary") || t.includes("hexadecimal") || t.includes("number system") || t.includes("data representation")) {
      return [
        { kind: "video", youtubeId: "r1WV68nraoc", title: "Number Systems (Binary & Hex) — IGCSE Computer Science", caption: "Conversion between denary, binary and hexadecimal with worked examples" },
        { kind: "image", src: `https://image.pollinations.ai/prompt/${encodeURIComponent("binary and hexadecimal conversion table simple minimal block diagram")}?width=640&height=400&nologo=true`, caption: "Conversion reference table: Binary, Hexadecimal, and Denary equivalents." },
        { kind: "intro", text: `**${title}** — ${desc}. Covers binary, hexadecimal and denary conversions for Cambridge IGCSE Computer Science (0478).` },
        { kind: "keyterms", terms: [
          { label: "Denary (Base-10)", value: "Standard decimal system using digits 0–9." },
          { label: "Binary (Base-2)", value: "Uses only 0 and 1. Each digit is a bit. 8 bits = 1 byte." },
          { label: "Hexadecimal (Base-16)", value: "Uses digits 0–9 and A–F. 1 hex digit = 4 binary bits (a nibble)." },
        ]},
        { kind: "highlight", text: "**1 Hex digit = 4 binary bits (nibble)**\nBinary → Hex: group bits in fours from the right, convert each group.\nHex → Binary: replace each hex digit with its 4-bit binary equivalent.", color: "blue" },
        { kind: "tip", text: "Show ALL steps in base conversions — method marks are awarded. For binary → denary: write out place values (128, 64, 32, 16, 8, 4, 2, 1) above each bit, then add where there is a 1." },
        { kind: "warning", text: "Hexadecimal A=10, B=11, C=12, D=13, E=14, F=15. Don't forget these when converting — forgetting them is the most common error." },
      ];
    }
    if (t.includes("cpu") || t.includes("architecture") || t.includes("hardware") || t.includes("memory")) {
      return [
        { kind: "video", youtubeId: "TIHW5hEoaAw", title: "CPU Architecture & Fetch-Decode-Execute — IGCSE CS", caption: "Covers CPU components, registers and the FDE cycle with diagrams" },
        { kind: "image", src: `https://image.pollinations.ai/prompt/${encodeURIComponent("CPU fetch decode execute cycle block diagram CPU architecture")}?width=640&height=400&nologo=true`, caption: "Simple block diagram of CPU components and register paths in the FDE cycle." },
        { kind: "intro", text: `**${title}** — ${desc}. This note covers CPU architecture and memory for Cambridge IGCSE Computer Science (0478).` },
        { kind: "keyterms", terms: [
          { label: "ALU", value: "Arithmetic Logic Unit — performs calculations and logical comparisons." },
          { label: "Control Unit", value: "Directs the operation of the processor; manages the FDE cycle." },
          { label: "RAM", value: "Random Access Memory — volatile; loses data when powered off." },
          { label: "ROM", value: "Read-Only Memory — non-volatile; stores boot instructions permanently." },
          { label: "Cache", value: "Very fast memory between CPU and RAM; stores frequently accessed data." },
        ]},
        { kind: "highlight", text: "**Fetch-Decode-Execute Cycle:**\n1. PC holds address of next instruction\n2. Address copied to MAR → instruction fetched to MDR → stored in CIR\n3. Control Unit decodes the instruction\n4. ALU/other components execute it\n5. PC incremented to point to next instruction", color: "blue" },
        { kind: "tip", text: "Name the registers correctly: PC (Program Counter), MAR (Memory Address Register), MDR (Memory Data Register), CIR (Current Instruction Register), ACC (Accumulator). Wrong register names lose marks." },
      ];
    }
    if (t.includes("algorithm") || t.includes("pseudocode") || t.includes("flowchart") || t.includes("problem-solving")) {
      return [
        { kind: "video", youtubeId: "7v2gs8rdQzU", title: "Algorithms & Pseudocode — IGCSE Computer Science", caption: "Covers decomposition, abstraction, trace tables, searching and sorting" },
        { kind: "image", src: `https://image.pollinations.ai/prompt/${encodeURIComponent("flowchart symbols diagram start process decision input output simple minimal")}?width=640&height=400&nologo=true`, caption: "Standard flowchart symbol definitions for algorithm planning." },
        { kind: "intro", text: `**${title}** — ${desc}. Covers algorithmic thinking for Cambridge IGCSE Computer Science (0478).` },
        { kind: "keyterms", terms: [
          { label: "Algorithm", value: "A step-by-step set of instructions to solve a problem." },
          { label: "Decomposition", value: "Breaking a complex problem into smaller, manageable sub-problems." },
          { label: "Abstraction", value: "Removing unnecessary detail to focus on the core logic of a problem." },
          { label: "Trace table", value: "A technique to test an algorithm by tracking variable values step by step." },
        ]},
        { kind: "highlight", text: "**Standard CAIE pseudocode keywords:** DECLARE, INPUT, OUTPUT, IF...THEN...ELSE...ENDIF, FOR...TO...NEXT, WHILE...DO...ENDWHILE, REPEAT...UNTIL\n\nAssignment: variable ← value (use ← not =)", color: "blue" },
        { kind: "tip", text: "In trace tables, create one column per variable plus one for output. Work through each line of the algorithm carefully — don't skip steps. Marks are awarded for correct intermediate values." },
      ];
    }
    if (t.includes("database") || t.includes("sql") || t.includes("query")) {
      return [
        { kind: "video", youtubeId: "5I_1jRGSR9E", title: "Databases & SQL — IGCSE Computer Science", caption: "Covers database concepts, primary/foreign keys, and SQL SELECT queries" },
        { kind: "image", src: `https://image.pollinations.ai/prompt/${encodeURIComponent("relational database table primary key foreign key connection schema")}?width=640&height=400&nologo=true`, caption: "Database table relationship showing Primary Key and Foreign Key links." },
        { kind: "intro", text: `**${title}** — ${desc}. This note covers database design and SQL for Cambridge IGCSE Computer Science (0478).` },
        { kind: "keyterms", terms: [
          { label: "Primary Key", value: "A field that uniquely identifies each record in a table. Cannot be NULL or duplicate." },
          { label: "Foreign Key", value: "A field in one table that references the primary key of another table — creates a relationship." },
          { label: "Query", value: "A request to retrieve specific data from a database using criteria." },
        ]},
        { kind: "highlight", text: "**SQL SELECT structure:**\nSELECT [fields] FROM [table] WHERE [condition] ORDER BY [field] ASC/DESC\n\nExample: SELECT Name, Age FROM Students WHERE Age > 16 ORDER BY Name ASC", color: "blue" },
        { kind: "tip", text: "Put string values in single quotes in WHERE clauses: WHERE Name = 'Smith'\nUse wildcards with LIKE: WHERE Name LIKE 'S%' matches all names starting with S." },
      ];
    }
    // CS fallback
    return [
      { kind: "video", youtubeId: "r1WV68nraoc", title: `${title} — IGCSE Computer Science`, caption: "Waves and physics — Cognito GCSE (general science revision)" },
      { kind: "image", src: `https://image.pollinations.ai/prompt/${encodeURIComponent("computer science network coding simple diagram " + title)}?width=640&height=400&nologo=true`, caption: `Concept diagram for ${title}` },
      { kind: "intro", text: `**${title}** — ${desc}.` },
      { kind: "keyterms", terms: [
        { label: "Data", value: "Raw facts and figures without context." },
        { label: "Information", value: "Data that has been processed to give it meaning." },
        { label: "System", value: "A set of connected components working together to achieve a goal." },
      ]},
      { kind: "tip", text: `For **${title}**: focus on precise definitions, worked examples and applying knowledge to the context given.` },
    ];
  }

  // ── DEFAULT FALLBACK ─────────────────────────────────────────────────────────
  const words = title.split(" ").slice(0, 3);
  return [
    { kind: "video", youtubeId: "VhwZ9t2b3Zk", title: `Cambridge IGCSE ${subject} Guide — ${title}`, caption: "Overview of key syllabus topics, common pitfalls and exam paper tips." },
    { kind: "image", src: `https://image.pollinations.ai/prompt/${encodeURIComponent("simple educational drawing diagram: " + title + " for IGCSE " + subject + " students, basic clean lines")}?width=640&height=400&nologo=true`, caption: `Visual illustration representing ${title} under the IGCSE ${subject} curriculum.` },
    { kind: "intro", text: `**${title}** — ${desc}. This structured guide covers the essential concepts, definitions and exam techniques for Cambridge IGCSE ${subject}.` },
    { kind: "keyterms", terms: [
      { label: words[0] || "Concept", value: `Core definition relating to ${title} under the IGCSE ${subject} curriculum.` },
      { label: words[1] || "Process", value: `Key process involved in the study and application of ${title}.` },
      { label: "Key principle", value: desc || `Fundamental principle of ${title} as required by the Cambridge syllabus.` },
    ]},
    { kind: "tip", text: `For **${title}**: focus on definitions, key diagrams, and step-by-step explanations. Always use subject-specific vocabulary. Apply your answer to any context given in the question.` },
    { kind: "warning", text: "Common mistake: Giving vague answers without applying to the specific context. Always link your answer back to the question using the stimulus material provided." },
    { kind: "highlight", text: `**${title}** is a key topic in IGCSE ${subject}. Focus on: definitions → examples → application → evaluation.`, color: "blue" },
  ];
}

// Maps display subject names → canonical subject names used in noteChapters
const subjectAliasMap: Record<string, string> = {
  "ict/computer science": "Computer Science",
  "computer science": "Computer Science",
  "english literature": "English Language",
  "english language": "English Language",
  "additional mathematics": "Mathematics",
};

const SYLLABUS_CODE_MAP: Record<string, string> = {
  "0970": "0610",
  "0971": "0620",
  "0972": "0625",
  "0980": "0580",
  "0984": "0478",
  "0985": "0452",
  "0987": "0455",
  "0986": "0450",
  "0977": "0470",
  "0990": "0500",
};

export function parseSubjectParam(subjectParam: string) {
  // e.g. "Accounting - 0452" or "Accounting (9-1) - 0985" or "Biology (9-1) - 0970"
  const match = subjectParam.match(/^(.+?)(?:\s*\(9-1\))?\s*-\s*(\d{4})$/i);
  if (match) {
    return {
      baseSubject: match[1].trim(),
      code: match[2].trim(),
      isNineToOne: subjectParam.includes("9-1"),
      fullName: subjectParam
    };
  }
  return {
    baseSubject: subjectParam,
    code: "",
    isNineToOne: false,
    fullName: subjectParam
  };
}

export function getDefaultSubjectWithCode(subjectName: string): string {
  const s = subjectName.toLowerCase().trim();
  if (s === "accounting") return "Accounting - 0452";
  if (s === "biology") return "Biology - 0610";
  if (s === "chemistry") return "Chemistry - 0620";
  if (s === "physics") return "Physics - 0625";
  if (s === "mathematics") return "Mathematics - 0580";
  if (s === "computer science" || s === "computer-science" || s === "ict/computer science") return "Computer Science - 0478";
  if (s === "economics") return "Economics - 0455";
  if (s === "business studies" || s === "business") return "Business Studies - 0450";
  if (s === "geography") return "Geography - 0460";
  if (s === "history") return "History - 0470";
  if (s === "english language" || s === "english") return "English - First Language - 0500";
  if (s === "additional mathematics") return "Additional Mathematics - 0606";
  return subjectName; // fallback
}

function ensurePageImages(chapters: NoteChapter[]): NoteChapter[] {
  return chapters.map(chap => ({
    ...chap,
    pages: chap.pages.map(page => {
      if (!page.blocks.some(b => b.kind === "image")) {
        const newBlocks = [...page.blocks];
        const introIdx = newBlocks.findIndex(b => b.kind === "intro");
        const insertIndex = introIdx !== -1 ? introIdx + 1 : 0;
        
        const cleanSection = page.section.replace(/^\d+(\.\d+)*\s*/, "");
        const diagramPrompt = `clear educational diagram or infographic: ${cleanSection} for IGCSE student revision, clean vector art style, labels, high resolution`;
        
        newBlocks.splice(insertIndex, 0, {
          kind: "image",
          src: `https://image.pollinations.ai/prompt/${encodeURIComponent(diagramPrompt)}?width=640&height=400&nologo=true`,
          caption: `Educational diagram illustrating key concepts of ${cleanSection}.`,
          side: "full"
        });
        return { ...page, blocks: newBlocks };
      }
      return page;
    })
  }));
}

export function getChaptersForSubject(subject: string): NoteChapter[] {
  const { baseSubject, code, fullName } = parseSubjectParam(subject);
  const mappedCode = SYLLABUS_CODE_MAP[code] || code;

  // 1. Try static chapters for the base subject
  // When a code is provided (e.g. "0452"), only match static chapters that either:
  //   a) have no code set (legacy — compatible with any syllabus code of that subject), OR
  //   b) have a matching code (future: per-syllabus-code chapters)
  // When a different code is provided for the same subject name (e.g. "0985"),
  //   we map it to the standard code so it doesn't fall through.
  let staticChapters = noteChapters.filter((c) => {
    const subjectMatch = c.subject === baseSubject;
    if (!subjectMatch) return false;
    // If the chapter has an explicit code, it must match the mapped code
    if (c.code && mappedCode && c.code !== mappedCode) return false;
    return true;
  });
  
  // Try alias resolution for base subject
  if (staticChapters.length === 0) {
    const alias = subjectAliasMap[baseSubject.toLowerCase().trim()];
    if (alias) {
      staticChapters = noteChapters.filter((c) => {
        const subjectMatch = c.subject === alias;
        if (!subjectMatch) return false;
        if (c.code && mappedCode && c.code !== mappedCode) return false;
        return true;
      });
    }
  }

  if (staticChapters.length > 0) {
    const res = staticChapters.map(chap => {
      // Helper to replace syllabus code in text blocks
      const customizedPages = chap.pages.map(page => {
        const customizedBlocks = page.blocks.map(block => {
          if (block.kind === "intro") {
            let text = block.text;
            if (code) {
              text = text.replace(/\b\d{4}\b/g, code);
            }
            return { ...block, text };
          }
          return block;
        });
        return { ...page, blocks: customizedBlocks };
      });

      return {
        ...chap,
        subject: fullName,
        code: code || chap.code,   // stamp code so the reader knows which syllabus these belong to
        pages: customizedPages
      };
    });
    return ensurePageImages(res);
  }

  // 2. Load dynamic chapters from syllabus objectives
  const cleanBase = baseSubject.toLowerCase().replace(/\s+/g, '-');
  const syllabusKey = code ? `${cleanBase}-${code}` : subjectMap[cleanBase];
  if (!syllabusKey) return [];
  
  const syllabus = syllabusData[syllabusKey];
  if (!syllabus) return [];
  
  const dynamicChapters: NoteChapter[] = syllabus.objectives.map((obj) => {
    const pages = (obj.subObjectives ?? []).map((sub, subIdx) => {
      return {
        section: `${sub.code} ${sub.title}`,
        blocks: getDynamicBlocks(sub.title, sub.description, sub.code, syllabus.subject.name, subIdx === 0)
      };
    });
    
    return {
      subject: fullName,
      title: obj.title,
      summary: obj.description,
      pages: pages
    };
  });
  
  return ensurePageImages(dynamicChapters);
}

export function getChapter(subject: string, title: string): NoteChapter | undefined {
  const chapters = getChaptersForSubject(subject);
  return chapters.find((c) => c.title === title);
}

export const subjectsWithNotes = [
  ...new Set([
    ...noteChapters.map((c) => c.subject),
    ...Object.values(syllabusData).map((d) => d.subject.name)
  ])
];

