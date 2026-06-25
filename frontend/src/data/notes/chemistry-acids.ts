import type { NoteChapter } from "./types";

export const chemistryAcidsNotes: NoteChapter = {
  subject: "Chemistry",
  title: "Acids, Bases & Salts",
  pages: [
    {
      section: "4.1 Acids & Bases",
      blocks: [
        {
          kind: "video",
          youtubeId: "vt8fB3MFzLk",
          title: "Acids, Bases & Salts — IGCSE Chemistry (Cognito)",
          caption: "pH scale, neutralisation reactions, indicators and making salts",
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Acid", value: "a substance that produces H⁺ ions in aqueous solution. pH < 7." },
            { label: "Base", value: "a substance that neutralises an acid. Metal oxides, metal hydroxides, and ammonia are bases." },
            { label: "Alkali", value: "a soluble base that produces OH⁻ ions in aqueous solution. pH > 7." },
            { label: "Neutralisation", value: "acid + base → salt + water. H⁺ + OH⁻ → H₂O" },
          ],
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/PH_scale_with_everyday_objects.svg/800px-PH_scale_with_everyday_objects.svg.png",
          caption: "The pH scale from 0 to 14, showing the acidity and alkalinity of common everyday objects.",
          side: "right"
        },
        {
          kind: "table",
          headers: ["pH", "Description", "Examples"],
          rows: [
            ["0–2", "Strongly acidic", "HCl, H₂SO₄, HNO₃"],
            ["3–6", "Weakly acidic", "Ethanoic acid, carbonic acid, citric acid"],
            ["7", "Neutral", "Pure water"],
            ["8–10", "Weakly alkaline", "Sodium bicarbonate, seawater"],
            ["11–14", "Strongly alkaline", "NaOH, KOH, Ca(OH)₂"],
          ],
        },
        {
          kind: "comparison",
          left: {
            label: "Strong acids (fully ionise)",
            items: [
              "HCl — hydrochloric acid",
              "H₂SO₄ — sulfuric acid",
              "HNO₃ — nitric acid",
              "HCl → H⁺ + Cl⁻ (complete)",
              "Lower pH for same concentration",
            ],
          },
          right: {
            label: "Weak acids (partially ionise)",
            items: [
              "CH₃COOH — ethanoic acid",
              "H₂CO₃ — carbonic acid",
              "H₃PO₄ — phosphoric acid",
              "CH₃COOH ⇌ H⁺ + CH₃COO⁻ (partial)",
              "Higher pH for same concentration",
            ],
          },
        },
        {
          kind: "tip",
          text: "Universal indicator gives a colour range (red → purple). A pH probe gives a precise numerical value. For exam questions about measuring pH accurately, always recommend a pH probe over universal indicator.",
        },
      ],
    },
    {
      section: "4.2 Making Salts",
      blocks: [
        {
          kind: "intro",
          text: "The name of a salt depends on the acid used: HCl → chloride salts; H₂SO₄ → sulfate salts; HNO₃ → nitrate salts; H₃PO₄ → phosphate salts.",
        },
        {
          kind: "table",
          headers: ["Method", "Reaction", "Example", "When to use"],
          rows: [
            ["Acid + reactive metal", "Acid + metal → salt + H₂↑", "Zn + H₂SO₄ → ZnSO₄ + H₂", "Metal above H in reactivity series"],
            ["Acid + metal oxide", "Acid + metal oxide → salt + H₂O", "CuO + H₂SO₄ → CuSO₄ + H₂O", "Insoluble base — add excess, filter"],
            ["Acid + metal hydroxide", "Acid + alkali → salt + H₂O", "NaOH + HCl → NaCl + H₂O", "Titration method"],
            ["Acid + carbonate", "Acid + carbonate → salt + H₂O + CO₂↑", "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂", "Effervescence — CO₂ turns limewater milky"],
            ["Precipitation", "Two solutions mixed → insoluble salt forms", "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl", "Making insoluble salts"],
          ],
        },
        {
          kind: "highlight",
          text: "Titration method (acid + alkali):\n1. Use indicator to find endpoint (colour change)\n2. Record exact volumes\n3. Repeat WITHOUT indicator using same volumes\n4. Evaporate carefully to crystallise the salt",
          color: "blue",
        },
        {
          kind: "warning",
          text: "For acid + metal oxide: add EXCESS solid to ensure all acid is used up. Filter off excess solid. Evaporate filtrate to get crystals. If you don't add excess, some acid remains and the salt will be contaminated.",
        },
      ],
    },
    {
      section: "4.3 Reactivity Series",
      blocks: [
        {
          kind: "highlight",
          text: "Reactivity series (most → least reactive):\nK > Na > Ca > Mg > Al > Zn > Fe > Sn > Pb > H > Cu > Ag > Au\nMnemonic: 'King Solomon Can Make A Zinc Fence, Surely He Can Always'",
          color: "pink",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Uses of the reactivity series:",
              sub: [
                "Predicting displacement reactions: more reactive metal displaces less reactive metal from its salt solution",
                "Example: Fe + CuSO₄ → FeSO₄ + Cu (iron displaces copper)",
                "Predicting which metals react with acids (only metals above H)",
                "Predicting extraction method: very reactive metals (K, Na, Ca, Mg, Al) extracted by electrolysis; less reactive by reduction with carbon",
              ],
            },
          ],
        },
        {
          kind: "table",
          headers: ["Metal", "Reaction with water", "Reaction with dilute acid"],
          rows: [
            ["Potassium", "Vigorous — burns with lilac flame", "Explosive"],
            ["Sodium", "Vigorous — melts, moves around", "Explosive"],
            ["Calcium", "Moderate — fizzes steadily", "Vigorous"],
            ["Magnesium", "Very slow with cold water; fast with steam", "Fast — vigorous fizzing"],
            ["Zinc", "No reaction with cold water", "Moderate fizzing"],
            ["Iron", "No reaction with cold water", "Slow fizzing"],
            ["Copper", "No reaction", "No reaction"],
          ],
        },
      ],
    },
    {
      section: "4.4 Identifying Ions",
      blocks: [
        {
          kind: "intro",
          text: "Flame tests and precipitation reactions are used to identify ions in solution.",
        },
        {
          kind: "table",
          headers: ["Ion", "Test", "Positive result"],
          rows: [
            ["Li⁺", "Flame test", "Crimson/red flame"],
            ["Na⁺", "Flame test", "Yellow/orange flame"],
            ["K⁺", "Flame test", "Lilac/violet flame"],
            ["Ca²⁺", "Flame test", "Brick red flame"],
            ["Cu²⁺", "Flame test", "Blue-green flame"],
            ["Fe²⁺", "Add NaOH solution", "Green precipitate"],
            ["Fe³⁺", "Add NaOH solution", "Brown/rust precipitate"],
            ["Cu²⁺", "Add NaOH solution", "Blue precipitate"],
            ["Al³⁺", "Add NaOH solution", "White precipitate (dissolves in excess NaOH)"],
            ["NH₄⁺", "Add NaOH, warm", "Ammonia gas (turns damp red litmus blue)"],
            ["CO₃²⁻", "Add dilute acid", "CO₂ gas (turns limewater milky)"],
            ["Cl⁻", "Add AgNO₃ (acidified)", "White precipitate (AgCl)"],
            ["Br⁻", "Add AgNO₃ (acidified)", "Cream precipitate (AgBr)"],
            ["I⁻", "Add AgNO₃ (acidified)", "Yellow precipitate (AgI)"],
            ["SO₄²⁻", "Add BaCl₂ (acidified)", "White precipitate (BaSO₄)"],
          ],
        },
        {
          kind: "tip",
          text: "For precipitation tests, always acidify first (with dilute HNO₃ for halides, dilute HCl for sulfates) to remove interfering ions like CO₃²⁻ that would also give precipitates with the test reagent.",
        },
      ],
    },
  ],
};
