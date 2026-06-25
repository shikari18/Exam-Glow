export type KeyTerm = {
  term: string;
  definition: string;
};

export type NoteBlock =
  | { kind: "intro"; text: string }
  | { kind: "definition"; term: string; definition: string }
  | { kind: "keyterms"; terms: { label: string; value: string }[] }
  | { kind: "bullets"; items: BulletItem[] }
  | { kind: "numbered"; items: string[] }
  | { kind: "equation"; label: string; formula: string; note?: string }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "image"; src: string; caption: string; side?: "right" | "left" | "full" }
  | { kind: "video"; youtubeId: string; title: string; caption?: string }
  | { kind: "tip"; text: string }
  | { kind: "warning"; text: string }
  | { kind: "comparison"; left: { label: string; items: string[] }; right: { label: string; items: string[] } }
  | { kind: "highlight"; text: string; color?: "pink" | "blue" | "green" | "yellow" };

export type BulletItem = {
  text: string;
  sub?: string[];
  bold?: boolean;
};

export type NotePage = {
  section: string;       // e.g. "3.1 General properties of waves"
  blocks: NoteBlock[];
};

export type NoteChapter = {
  subject: string;
  title: string;
  summary?: string;     // optional short description shown on cards
  pages: NotePage[];
};
