import type { NoteChapter } from './types';
import { chemistryAcidsNotes } from "./chemistry-acids";
import { chemistryBondingNotes } from "./chemistry-bonding";
import { chemistryElectrolysisNotes } from "./chemistry-electrolysis";
import { chemistryOrganicNotes } from "./chemistry-organic";
import { chemistryRatesNotes } from "./chemistry-rates";

export const chemistryNotes: NoteChapter[] = [
  chemistryBondingNotes,
  chemistryElectrolysisNotes,
  chemistryRatesNotes,
  chemistryAcidsNotes,
  chemistryOrganicNotes,
];

