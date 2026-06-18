import { physics0625Data } from "./physics-0625";
import { mathematics0580Data } from "./mathematics-0580";
import { chemistry0620Data } from "./chemistry-0620";
import { biology0610Data } from "./biology-0610";
import { cs0478Data } from "./computer-science-0478";
import { economics0455Data } from "./economics-0455";
import { history0470Data } from "./history-0470";
import { geography0460Data } from "./geography-0460";
import { english0500Data } from "./english-language-0500";
import { business0450Data } from "./business-studies-0450";
import { accounting0452Data } from "./accounting-0452";
import { physics0625Data } from "./physics-0625";
import { mathematics0580Data } from "./mathematics-0580";
import { chemistry0620Data } from "./chemistry-0620";
import { biology0610Data } from "./biology-0610";
import { cs0478Data } from "./computer-science-0478";
import { economics0455Data } from "./economics-0455";
import { history0470Data } from "./history-0470";
import { geography0460Data } from "./geography-0460";
import { english0500Data } from "./english-language-0500";
import { business0450Data } from "./business-studies-0450";
import { accounting0452Data } from "./accounting-0452";
import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

export const syllabusData: Record<string, SyllabusData> = {
  "physics-0625": physics0625Data,
  "mathematics-0580": mathematics0580Data,
  "chemistry-0620": chemistry0620Data,
  "biology-0610": biology0610Data,
  "computer-science-0478": cs0478Data,
  "economics-0455": economics0455Data,
  "history-0470": history0470Data,
  "geography-0460": geography0460Data,
  "english-language-0500": english0500Data,
  "business-studies-0450": business0450Data,
  "accounting-0452": accounting0452Data,
};

function parseSubjectId(subjectId: string) {
  const parts = subjectId.split("-");
  const code = parts[parts.length - 1] || "0000";
  const nameParts = parts.slice(0, parts.length - 1).map(p => {
    if (p === "and" || p === "or" || p === "as" || p === "in" || p === "a" || p === "to") return p;
    return p.charAt(0).toUpperCase() + p.slice(1);
  });
  
  let name = nameParts.join(" ");
  if (name.toLowerCase().includes("foreign language")) {
    name = name.replace(/Foreign Language/gi, "- Foreign Language");
  } else if (name.toLowerCase().includes("first language")) {
    name = name.replace(/First Language/gi, "- First Language");
  } else if (name.toLowerCase().includes("second language")) {
    name = name.replace(/Second Language/gi, "- Second Language");
  } else if (name.toLowerCase().includes("literature in english")) {
    name = name.replace(/Literature In English/gi, "- Literature in English");
  } else if (name.toLowerCase().includes("as a second language")) {
    name = name.replace(/As A Second Language/gi, "as a Second Language");
  } else if (name.toLowerCase().includes("as an additional language")) {
    name = name.replace(/As An Additional Language/gi, "as an Additional Language");
  }
  
  return {
    name,
    code,
    displayName: `${name} – Cambridge IGCSE (${code})`
  };
}

function getFallbackObjectives(subjectId: string, name: string): SyllabusObjective[] {
  const nameLower = name.toLowerCase();
  
  if (
    nameLower.includes("language") || 
    nameLower.includes("literature") || 
    nameLower.includes("afrikaans") || 
    nameLower.includes("bahasa") || 
    nameLower.includes("isizulu") || 
    nameLower.includes("swahili") ||
    nameLower.includes("turkish") ||
    nameLower.includes("urdu") ||
    nameLower.includes("vietnamese") ||
    nameLower.includes("thai") ||
    nameLower.includes("sanskrit") ||
    nameLower.includes("setswana") ||
    nameLower.includes("portuguese") ||
    nameLower.includes("latin") ||
    nameLower.includes("malay") ||
    nameLower.includes("chinese")
  ) {
    return [
      {
        id: `${subjectId}-obj-1`, subjectId, code: "1",
        title: "Reading and Comprehension", description: "Understand and analyze written texts", order: 1,
        subObjectives: [
          { id: `${subjectId}-obj-1-1`, subjectId, code: "1.1", title: "Explicit Meanings", description: "Identify and retrieve facts, ideas, and opinions from texts", order: 1, parentId: `${subjectId}-obj-1` },
          { id: `${subjectId}-obj-1-2`, subjectId, code: "1.2", title: "Implicit Meanings", description: "Understand vocabulary in context; identify subtle attitudes and viewpoints", order: 2, parentId: `${subjectId}-obj-1` },
        ]
      },
      {
        id: `${subjectId}-obj-2`, subjectId, code: "2",
        title: "Writing and Composition", description: "Express ideas clearly and accurately in written form", order: 2,
        subObjectives: [
          { id: `${subjectId}-obj-2-1`, subjectId, code: "2.1", title: "Form and Content", description: "Structure writing appropriately for audience, purpose, and text type", order: 1, parentId: `${subjectId}-obj-2` },
          { id: `${subjectId}-obj-2-2`, subjectId, code: "2.2", title: "Vocabulary and Grammar", description: "Apply a range of grammatical structures, vocabulary, spelling, and punctuation accurately", order: 2, parentId: `${subjectId}-obj-2` },
        ]
      },
      {
        id: `${subjectId}-obj-3`, subjectId, code: "3",
        title: "Listening and Speaking", description: "Oral communication and comprehension", order: 3,
        subObjectives: [
          { id: `${subjectId}-obj-3-1`, subjectId, code: "3.1", title: "Listening Comprehension", description: "Identify main points and detail in spoken recordings", order: 1, parentId: `${subjectId}-obj-3` },
          { id: `${subjectId}-obj-3-2`, subjectId, code: "3.2", title: "Oral Presentation and Conversation", description: "Participate in spontaneous conversation; express opinions clearly", order: 2, parentId: `${subjectId}-obj-3` },
        ]
      }
    ];
  } else if (
    nameLower.includes("science") || 
    nameLower.includes("biology") || 
    nameLower.includes("chemistry") || 
    nameLower.includes("physics") || 
    nameLower.includes("agriculture") || 
    nameLower.includes("marine")
  ) {
    return [
      {
        id: `${subjectId}-obj-1`, subjectId, code: "1",
        title: "Knowledge with Understanding", description: "Scientific phenomena, laws, definitions, and concepts", order: 1,
        subObjectives: [
          { id: `${subjectId}-obj-1-1`, subjectId, code: "1.1", title: "Phenomena, Facts, Laws and Theories", description: "State, explain, and recall scientific principles and relationships", order: 1, parentId: `${subjectId}-obj-1` },
          { id: `${subjectId}-obj-1-2`, subjectId, code: "1.2", title: "Terminology and Conventions", description: "Use appropriate scientific vocabulary, symbols, quantities, and units", order: 2, parentId: `${subjectId}-obj-1` },
        ]
      },
      {
        id: `${subjectId}-obj-2`, subjectId, code: "2",
        title: "Handling Information and Problem Solving", description: "Process data, perform calculations, and evaluate evidence", order: 2,
        subObjectives: [
          { id: `${subjectId}-obj-2-1`, subjectId, code: "2.1", title: "Data Manipulation and Calculations", description: "Extract, organize, and translate information from text, tables, or graphs", order: 1, parentId: `${subjectId}-obj-2` },
          { id: `${subjectId}-obj-2-2`, subjectId, code: "2.2", title: "Hypotheses and Evaluations", description: "Formulate explanations and propose patterns; draw valid conclusions", order: 2, parentId: `${subjectId}-obj-2` },
        ]
      },
      {
        id: `${subjectId}-obj-3`, subjectId, code: "3",
        title: "Experimental Skills and Investigations", description: "Practical skills and laboratory methods", order: 3,
        subObjectives: [
          { id: `${subjectId}-obj-3-1`, subjectId, code: "3.1", title: "Planning and Carrying Out Investigations", description: "Demonstrate safety; select suitable apparatus; record observations accurately", order: 1, parentId: `${subjectId}-obj-3` },
          { id: `${subjectId}-obj-3-2`, subjectId, code: "3.2", title: "Evaluating Practical Procedures", description: "Identify sources of error; suggest modifications and improvements", order: 2, parentId: `${subjectId}-obj-3` },
        ]
      }
    ];
  } else {
    return [
      {
        id: `${subjectId}-obj-1`, subjectId, code: "1",
        title: "Knowledge and Understanding", description: "Core facts, concepts, principles, and vocabulary", order: 1,
        subObjectives: [
          { id: `${subjectId}-obj-1-1`, subjectId, code: "1.1", title: "Core Terminology and Concepts", description: "Describe and explain the primary principles and structures of the subject", order: 1, parentId: `${subjectId}-obj-1` },
          { id: `${subjectId}-obj-1-2`, subjectId, code: "1.2", title: "Context and Application", description: "Apply key concepts to different scenarios and contexts", order: 2, parentId: `${subjectId}-obj-1` },
        ]
      },
      {
        id: `${subjectId}-obj-2`, subjectId, code: "2",
        title: "Analysis and Evaluation", description: "Interpret evidence, evaluate arguments, and structure responses", order: 2,
        subObjectives: [
          { id: `${subjectId}-obj-2-1`, subjectId, code: "2.1", title: "Critical Analysis", description: "Examine sources, data, and viewpoints critically; identify assumptions", order: 1, parentId: `${subjectId}-obj-2` },
          { id: `${subjectId}-obj-2-2`, subjectId, code: "2.2", title: "Constructing Arguments", description: "Present coherent, balanced arguments using evidence and proper reasoning", order: 2, parentId: `${subjectId}-obj-2` },
        ]
      },
      {
        id: `${subjectId}-obj-3`, subjectId, code: "3",
        title: "Decision Making and Application", description: "Formulate recommendations and conclusions", order: 3,
        subObjectives: [
          { id: `${subjectId}-obj-3-1`, subjectId, code: "3.1", title: "Formulating Conclusions", description: "Synthesise ideas and draw reasoned, supported judgments", order: 1, parentId: `${subjectId}-obj-3` },
        ]
      }
    ];
  }
}

export function getSyllabusData(subjectId: string): SyllabusData | undefined {
  const staticSyllabus = syllabusData[subjectId];
  if (staticSyllabus) return staticSyllabus;
  
  try {
    const { name, code, displayName } = parseSubjectId(subjectId);
    const subject: Subject = {
      id: subjectId,
      name,
      code,
      examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
      displayName
    };
    
    return {
      subject,
      objectives: getFallbackObjectives(subjectId, name),
      notes: []
    };
  } catch (e) {
    return undefined;
  }
}

export function getAllSubjects() {
  return Object.values(syllabusData).map(data => data.subject);
}


