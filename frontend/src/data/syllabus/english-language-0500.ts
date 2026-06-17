import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const englishSubject: Subject = {
  id: "english-language-0500",
  name: "English Language",
  code: "0500",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "English Language – Cambridge IGCSE (0500)",
};

const englishObjectives: SyllabusObjective[] = [
  {
    id: "eng-1", subjectId: "english-language-0500", code: "1",
    title: "Paper 1: Reading", description: "Comprehension, summary writing, writer's effects, and extended evaluation", order: 1,
    subObjectives: [
      { id: "eng-1-1", subjectId: "english-language-0500", code: "1.1", title: "Comprehension Skills", description: "Identify explicit and implicit meanings, select facts, ideas, and opinions from passages", order: 1, parentId: "eng-1" },
      { id: "eng-1-2", subjectId: "english-language-0500", code: "1.2", title: "Summary Writing", description: "Select, synthesise, and structure relevant information to write a concise summary", order: 2, parentId: "eng-1" },
      { id: "eng-1-3", subjectId: "english-language-0500", code: "1.3", title: "Writer's Effects (Language Analysis)", description: "Analyze how writers use language, devices, and vocabulary to create specific effects", order: 3, parentId: "eng-1" },
      { id: "eng-1-4", subjectId: "english-language-0500", code: "1.4", title: "Extended Response and Evaluation", description: "Evaluate viewpoints and compare ideas across texts in an extended analytical format", order: 4, parentId: "eng-1" },
    ],
  },
  {
    id: "eng-2", subjectId: "english-language-0500", code: "2",
    title: "Paper 2: Directed Writing and Composition", description: "Directed writing tasks, descriptive, narrative, and argumentative writing", order: 2,
    subObjectives: [
      { id: "eng-2-1", subjectId: "english-language-0500", code: "2.1", title: "Directed Writing", description: "Write letters, reports, articles, or speeches based on stimulus material, adapting tone/register", order: 1, parentId: "eng-2" },
      { id: "eng-2-2", subjectId: "english-language-0500", code: "2.2", title: "Descriptive Composition", description: "Use vivid sensory details, imagery, and varied sentence structures to describe scenes, people, or events", order: 2, parentId: "eng-2" },
      { id: "eng-2-3", subjectId: "english-language-0500", code: "2.3", title: "Narrative Composition", description: "Develop plot, characterisation, setting, tension, and climax in a narrative structure", order: 3, parentId: "eng-2" },
      { id: "eng-2-4", subjectId: "english-language-0500", code: "2.4", title: "Argumentative and Discursive Writing", description: "Structure clear, persuasive arguments and counter-arguments using rhetorical devices", order: 4, parentId: "eng-2" },
    ],
  },
];

export const english0500Data: SyllabusData = {
  subject: englishSubject,
  objectives: englishObjectives,
  notes: [],
};
