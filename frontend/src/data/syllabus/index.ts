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
import { SyllabusData } from "@/types/syllabus";

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

export function getSyllabusData(subjectId: string): SyllabusData | undefined {
  return syllabusData[subjectId];
}

export function getAllSubjects() {
  return Object.values(syllabusData).map(data => data.subject);
}

