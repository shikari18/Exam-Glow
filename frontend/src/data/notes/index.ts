import type { NoteChapter, NoteBlock } from "./types";
import { syllabusData } from "../syllabus";

// Biology
import { biologyCellsNotes } from "./biology-cells";
import { biologyPhotosynthesisNotes } from "./biology-photosynthesis";
import { biologyGeneticsNotes } from "./biology-genetics";
import { biologyNutritionNotes } from "./biology-nutrition";
import { biologyNervousNotes } from "./biology-nervous";
import { biologyEcologyNotes } from "./biology-ecology";

// Chemistry
import { chemistryBondingNotes } from "./chemistry-bonding";
import { chemistryOrganicNotes } from "./chemistry-organic";
import { chemistryRatesNotes } from "./chemistry-rates";
import { chemistryAcidsNotes } from "./chemistry-acids";
import { chemistryElectrolysisNotes } from "./chemistry-electrolysis";

// Physics
import { physicsForcesNotes } from "./physics-forces";
import { physicsElectricityNotes } from "./physics-electricity";
import { physicsWavesNotes } from "./physics-waves";
import { physicsThermalNotes } from "./physics-thermal";
import { physicsSpaceNotes } from "./physics-space";

// Mathematics
import { mathematicsAlgebraNotes } from "./mathematics-algebra";
import { mathematicsGeometryNotes } from "./mathematics-geometry";
import { mathematicsStatisticsNotes } from "./mathematics-statistics";

export type { NoteChapter, NotePage, NoteBlock, BulletItem } from "./types";

export const noteChapters: NoteChapter[] = [
  // Biology — 6 chapters, 30 pages
  biologyCellsNotes,
  biologyPhotosynthesisNotes,
  biologyGeneticsNotes,
  biologyNutritionNotes,
  biologyNervousNotes,
  biologyEcologyNotes,
  // Chemistry — 5 chapters, 20 pages
  chemistryBondingNotes,
  chemistryOrganicNotes,
  chemistryRatesNotes,
  chemistryAcidsNotes,
  chemistryElectrolysisNotes,
  // Physics — 5 chapters, 25 pages
  physicsForcesNotes,
  physicsElectricityNotes,
  physicsWavesNotes,
  physicsThermalNotes,
  physicsSpaceNotes,
  // Mathematics — 3 chapters, 15 pages
  mathematicsAlgebraNotes,
  mathematicsGeometryNotes,
  mathematicsStatisticsNotes,
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

function getDynamicBlocks(title: string, desc: string, code: string, subject: string): NoteBlock[] {
  const t = title.toLowerCase();
  
  let keyTerms: { label: string; value: string }[] = [];
  let examTip = "";
  let highlightText = "";
  
  if (t.includes("binary") || t.includes("hexadecimal") || t.includes("number system") || t.includes("data representation")) {
    keyTerms = [
      { label: "Denary (Base-10)", value: "Standard decimal number system using digits 0-9." },
      { label: "Binary (Base-2)", value: "Base system representing numbers using only two digits: 0 and 1." },
      { label: "Hexadecimal (Base-16)", value: "Number system using 16 symbols (0-9 and A-F), offering a human-friendly representation of binary values." }
    ];
    examTip = "Show all steps in base conversions. Method marks are frequently awarded for correct intermediate divisions or place-value columns.";
    highlightText = "1 Hexadecimal digit represents exactly 4 binary bits (a nibble). This makes conversion between binary and hex straightforward by grouping bits in fours.";
  } else if (t.includes("transmission") || t.includes("packet") || t.includes("network")) {
    keyTerms = [
      { label: "Packet", value: "A unit of data routed between an origin and a destination on the Internet." },
      { label: "Simplex", value: "Data transmission in one direction only (e.g., radio broadcast)." },
      { label: "Duplex", value: "Data transmission in both directions simultaneously (e.g., telephone call)." }
    ];
    examTip = "Be clear on the distinction between half-duplex and full-duplex. Half-duplex is bidirectional but only one direction at a time.";
    highlightText = "Packet switching breaks data into packets that travel independently across the network and are reassembled at the destination.";
  } else if (t.includes("cpu") || t.includes("architecture") || t.includes("hardware") || t.includes("memory")) {
    keyTerms = [
      { label: "ALU", value: "Arithmetic Logic Unit, processes mathematical and logical operations." },
      { label: "Control Unit", value: "Directs the operations of the processor and manages instruction flows." },
      { label: "RAM", value: "Random Access Memory, volatile memory used for active programs and data." }
    ];
    examTip = "Describe the Fetch-Decode-Execute cycle step-by-step. Remember that PC holds the address of the next instruction, MAR holds current memory address, and MDR holds data.";
    highlightText = "RAM is volatile (loses data when powered off), whereas ROM is non-volatile and holds boot-up instructions (BIOS).";
  } else if (t.includes("operating system") || t.includes("software") || t.includes("translator")) {
    keyTerms = [
      { label: "Operating System (OS)", value: "Core software managing files, memory, processes, and peripheral devices." },
      { label: "Compiler", value: "Translates high-level source code into machine code all at once before execution." },
      { label: "Interpreter", value: "Translates and executes code line-by-line, useful for debugging." }
    ];
    examTip = "Understand the tradeoffs of compilers vs interpreters. Compilers produce faster executable files, but interpreters are easier for finding bugs during development.";
    highlightText = "Compilers compile the entire code into a standalone executable, whereas interpreters translate line-by-line during runtime.";
  } else if (t.includes("internet") || t.includes("security") || t.includes("encryption") || t.includes("cybersecurity")) {
    keyTerms = [
      { label: "Symmetric Encryption", value: "Uses the same key to encrypt and decrypt data." },
      { label: "Asymmetric Encryption", value: "Uses a public key to encrypt and a private key to decrypt data." },
      { label: "Firewall", value: "Monitors incoming and outgoing network traffic based on security rules." }
    ];
    examTip = "Don't confuse encryption with security against viruses. Encryption prevents data from being understood if intercepted, but it does not block malware.";
    highlightText = "HTTPS uses SSL/TLS encryption to establish a secure channel over an insecure network.";
  } else if (t.includes("algorithm") || t.includes("pseudocode") || t.includes("flowchart") || t.includes("problem-solving")) {
    keyTerms = [
      { label: "Decomposition", value: "Breaking down a complex problem into smaller, manageable sub-problems." },
      { label: "Abstraction", value: "Filtering out unnecessary details to focus on core logic." },
      { label: "Trace Table", value: "A technique used to test algorithms and track variable values step-by-step." }
    ];
    examTip = "In pseudocode, pay close attention to loop boundaries and assignment operators. Use standard CAIE keywords like DECLARE, INPUT, OUTPUT, IF, THEN, ELSE.";
    highlightText = "Dry running using a trace table is the most reliable way to identify logic errors in your algorithm.";
  } else if (t.includes("database") || t.includes("sql") || t.includes("query")) {
    keyTerms = [
      { label: "Primary Key", value: "A field that uniquely identifies each record in a database table." },
      { label: "Foreign Key", value: "A link between two tables, referencing the primary key of another table." },
      { label: "SQL Query", value: "A command sent to a database to retrieve specific records." }
    ];
    examTip = "Remember the order of SQL commands: SELECT, FROM, WHERE, ORDER BY. Ensure string literals in WHERE clauses are in single quotes.";
    highlightText = "Validation checks if data is sensible and realistic, whereas verification checks if it matches the original source exactly.";
  } else if (t.includes("logic") || t.includes("gate") || t.includes("boolean")) {
    keyTerms = [
      { label: "AND Gate", value: "Outputs true only if all inputs are true." },
      { label: "OR Gate", value: "Outputs true if at least one input is true." },
      { label: "NOT Gate", value: "Inverts the input signal (true becomes false, and vice versa)." }
    ];
    examTip = "Construct truth tables systematically. With two inputs A and B, order rows as 00, 01, 10, 11 to avoid missing combinations.";
    highlightText = "A NAND gate is a universal gate; any boolean expression can be constructed using only NAND gates.";
  } else if (t.includes("demand") || t.includes("supply") || t.includes("market") || t.includes("price")) {
    keyTerms = [
      { label: "Demand", value: "The willingness and ability of consumers to purchase a good at a given price." },
      { label: "Supply", value: "The willingness and ability of producers to sell a good at a given price." },
      { label: "Equilibrium Price", value: "The price at which quantity demanded equals quantity supplied." }
    ];
    examTip = "Clearly distinguish between a change in demand (shift of the curve) and a change in quantity demanded (movement along the curve).";
    highlightText = "Price elasticity of demand (PED) measures the responsiveness of quantity demanded to a change in price.";
  } else if (t.includes("policy") || t.includes("government") || t.includes("fiscal") || t.includes("monetary") || t.includes("inflation")) {
    keyTerms = [
      { label: "Fiscal Policy", value: "The use of government spending and taxation to influence economic activity." },
      { label: "Monetary Policy", value: "The use of interest rates and money supply to manage the economy." },
      { label: "GDP", value: "Gross Domestic Product, the total value of goods and services produced in a country in a year." }
    ];
    examTip = "When discussing expansionary policies, remember that lowering interest rates increases disposable income and investment, shifting aggregate demand right.";
    highlightText = "Inflation is a sustained increase in the general price level, reducing the purchasing power of money.";
  } else if (t.includes("versailles") || t.includes("league") || t.includes("treaty") || t.includes("peace")) {
    keyTerms = [
      { label: "Appeasement", value: "The policy of making concessions to dictatorial powers to avoid conflict." },
      { label: "Treaty of Versailles", value: "The peace treaty signed in 1919 that imposed heavy reparations and military limits on Germany." },
      { label: "League of Nations", value: "An international organization created after WWI to resolve disputes peacefully." }
    ];
    examTip = "When writing essay answers, always provide a balanced argument with points supporting both sides before making a reasoned conclusion.";
    highlightText = "The failure of the League of Nations in the Manchurian and Abyssinian crises exposed its lack of enforcement power.";
  } else if (t.includes("cold war") || t.includes("soviet") || t.includes("communist")) {
    keyTerms = [
      { label: "Containment", value: "The US foreign policy designed to prevent the spread of communism." },
      { label: "Marshall Plan", value: "A US program providing economic aid to rebuild Western European economies after WWII." },
      { label: "Détente", value: "A period of easing tensions between the US and USSR in the 1970s." }
    ];
    examTip = "Make sure you can explain why both superpowers shared blame for the origins of the Cold War, balancing actions in Eastern Europe with Western containment policies.";
    highlightText = "The Cuban Missile Crisis of 1962 brought the world to the brink of nuclear war, leading to a hot line and arms treaties.";
  } else if (t.includes("river") || t.includes("coast") || t.includes("earthquake") || t.includes("plate") || t.includes("population")) {
    keyTerms = [
      { label: "Drainage Basin", value: "The area of land drained by a river and its tributaries." },
      { label: "Longshore Drift", value: "The movement of sand and pebbles along the coast by wave action." },
      { label: "Ecosystem", value: "A community of living organisms interacting with their physical environment." }
    ];
    examTip = "Always state constructive/destructive processes clearly. For example, explain how abrasion, hydraulic action, attrition, and solution erode river beds.";
    highlightText = "Constructive waves deposit sediment, building up beaches, while destructive waves erode the coast.";
  } else if (t.includes("double entry") || t.includes("ledger") || t.includes("balance") || t.includes("depreciation")) {
    keyTerms = [
      { label: "Double Entry", value: "The bookkeeping system where every transaction has a corresponding debit and credit entry." },
      { label: "Trial Balance", value: "A list of ledger balances extracted to check the mathematical accuracy of bookkeeping." },
      { label: "Depreciation", value: "The systematic allocation of the cost of a non-current asset over its useful life." }
    ];
    examTip = "Remember: Debit what comes in or increases assets/expenses; Credit what goes out or increases liabilities/equity/revenue (DEAD CLIC).";
    highlightText = "The accounting equation (Assets = Liabilities + Owner's Equity) must balance after every transaction.";
  } else {
    const words = title.split(" ").slice(0, 3);
    keyTerms = [
      { label: words[0] || "Concept", value: `Core definition relating to ${title} under the IGCSE curriculum.` },
      { label: words[1] || "Process", value: `Key process involved in the study and application of ${title}.` }
    ];
    examTip = `For questions on ${title}, focus on definitions, key diagrams, and step-by-step explanations. Refer to official syllabus guidelines.`;
    highlightText = `${title} is a key topic in IGCSE ${subject}. Mastering its core aspects is essential for the exam.`;
  }
  
  return [
    {
      kind: "intro",
      text: `Welcome to your revision on **${title}**. ${desc}. This structured guide details the essential concepts, equations, and structures required for the Cambridge IGCSE syllabus.`
    },
    {
      kind: "keyterms",
      terms: keyTerms
    },
    {
      kind: "tip",
      text: examTip
    },
    {
      kind: "highlight",
      text: highlightText,
      color: "blue"
    }
  ];
}

export function getChaptersForSubject(subject: string): NoteChapter[] {
  const staticChapters = noteChapters.filter((c) => c.subject === subject);
  if (staticChapters.length > 0) {
    return staticChapters;
  }
  
  const cleanSubject = subject.toLowerCase().trim();
  const syllabusKey = subjectMap[cleanSubject];
  if (!syllabusKey) return [];
  
  const syllabus = syllabusData[syllabusKey];
  if (!syllabus) return [];
  
  const dynamicChapters: NoteChapter[] = syllabus.objectives.map((obj) => {
    const pages = (obj.subObjectives ?? []).map((sub) => {
      return {
        section: `${sub.code} ${sub.title}`,
        blocks: getDynamicBlocks(sub.title, sub.description, sub.code, syllabus.subject.name)
      };
    });
    
    return {
      subject: subject,
      title: obj.title,
      summary: obj.description,
      pages: pages
    };
  });
  
  return dynamicChapters;
}

export function getChapter(subject: string, title: string): NoteChapter | undefined {
  const staticChapter = noteChapters.find((c) => c.subject === subject && c.title === title);
  if (staticChapter) return staticChapter;
  
  const chapters = getChaptersForSubject(subject);
  return chapters.find((c) => c.title === title);
}

export const subjectsWithNotes = [
  ...new Set([
    ...noteChapters.map((c) => c.subject),
    ...Object.values(syllabusData).map((d) => d.subject.name)
  ])
];

