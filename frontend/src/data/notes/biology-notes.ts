import type { NoteChapter } from './types';
import { biologyCellsNotes } from "./biology-cells";
import { biologyNutritionNotes } from "./biology-nutrition";
import { biologyPhotosynthesisNotes } from "./biology-photosynthesis";
import { biologyGeneticsNotes } from "./biology-genetics";
import { biologyNervousNotes } from "./biology-nervous";
import { biologyEcologyNotes } from "./biology-ecology";

export const biologyNotes: NoteChapter[] = [
  biologyCellsNotes,
  biologyNutritionNotes,
  biologyPhotosynthesisNotes,
  biologyGeneticsNotes,
  biologyNervousNotes,
  biologyEcologyNotes,
];

