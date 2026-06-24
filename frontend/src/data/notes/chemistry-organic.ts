import type { NoteChapter } from "./types";

export const chemistryOrganicNotes: NoteChapter = {
  subject: "Chemistry",
  title: "Organic Chemistry",
  pages: [
    {
      section: "6.1 Alkanes",
      blocks: [
        {
          kind: "video",
          youtubeId: "ykIFTtTjoso",
          title: "Alkanes & Hydrocarbons — IGCSE Chemistry (Cognito)",
          caption: "What hydrocarbons are, alkane structure, crude oil and fractional distillation",
        },
        {
          kind: "intro",
          text: "Organic chemistry is the chemistry of carbon compounds. Crude oil is a mixture of hydrocarbons separated by fractional distillation.",
        },
        {
          kind: "highlight",
          text: "General formula for alkanes: CₙH₂ₙ₊₂\nSaturated hydrocarbons — single C-C bonds only",
          color: "blue",
        },
        {
          kind: "table",
          headers: ["Name", "Formula", "State at room temp", "Boiling point"],
          rows: [
            ["Methane", "CH₄", "Gas", "−161°C"],
            ["Ethane", "C₂H₆", "Gas", "−89°C"],
            ["Propane", "C₃H₈", "Gas", "−42°C"],
            ["Butane", "C₄H₁₀", "Gas", "−1°C"],
            ["Pentane", "C₅H₁₂", "Liquid", "36°C"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Combustion of alkanes:",
              sub: [
                "Complete combustion (excess O₂): alkane + O₂ → CO₂ + H₂O",
                "Incomplete combustion (limited O₂): produces CO (toxic) and/or carbon (soot)",
                "Example: CH₄ + 2O₂ → CO₂ + 2H₂O (complete)",
              ],
            },
            {
              text: "Fractional distillation of crude oil — fractions in order of increasing boiling point:",
              sub: [
                "Refinery gases (C₁–C₄): fuels, LPG",
                "Petrol/gasoline (C₅–C₁₀): car fuel",
                "Kerosene/jet fuel (C₁₀–C₁₆): aircraft fuel",
                "Diesel (C₁₄–C₂₀): lorries, trains",
                "Fuel oil (C₂₀–C₅₀): ships, power stations",
                "Bitumen (C₅₀+): road surfacing",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "6.2 Alkenes & Addition Reactions",
      blocks: [
        {
          kind: "highlight",
          text: "General formula for alkenes: CₙH₂ₙ\nUnsaturated — contain at least one C=C double bond",
          color: "pink",
        },
        {
          kind: "definition",
          term: "Test for alkenes",
          definition: "shake with bromine water — decolourises from orange/brown to colourless. The C=C double bond undergoes addition with Br₂. Alkanes do NOT decolourise bromine water.",
        },
        {
          kind: "highlight",
          text: "**Ethene (C₂H₄) — the simplest alkene:**\n• Contains a **C=C double bond** (one sigma + one pi bond)\n• Double bond makes it **unsaturated** and highly reactive\n• General formula for alkenes: **CₙH₂ₙ**\n• Ethene: H₂C=CH₂ — all 6 atoms in a flat (planar) arrangement around the double bond",
          color: "blue",
        },
        {
          kind: "table",
          headers: ["Reaction", "Reagent", "Conditions", "Product"],
          rows: [
            ["Hydrogenation", "H₂", "Ni catalyst, 150°C", "Alkane (e.g. ethane)"],
            ["Addition of Br₂", "Br₂ (bromine water)", "Room temperature", "Dibromoalkane (colourless)"],
            ["Hydration", "H₂O (steam)", "H₃PO₄ catalyst, 300°C", "Alcohol (e.g. ethanol)"],
            ["Polymerisation", "Many alkene monomers", "High pressure, catalyst", "Addition polymer"],
          ],
        },
        {
          kind: "tip",
          text: "Exam tip: For addition reactions, the C=C double bond opens up and the two atoms of the reagent add across it. Draw the structural formula showing the new single bond where the double bond was.",
        },
      ],
    },
    {
      section: "6.3 Polymers",
      blocks: [
        {
          kind: "definition",
          term: "Addition polymerisation",
          definition: "many alkene monomers join together by opening their C=C double bonds to form a long chain polymer. No small molecule is lost.",
        },
        {
          kind: "highlight",
          text: "n(CH₂=CH₂) → (−CH₂−CH₂−)ₙ\nEthene monomers → poly(ethene) / polyethylene",
          color: "blue",
        },
        {
          kind: "comparison",
          left: {
            label: "Addition polymerisation",
            items: [
              "Alkene monomers (C=C double bond)",
              "No small molecule lost",
              "Examples: poly(ethene), poly(propene), PVC",
              "Used in plastic bags, bottles, pipes",
            ],
          },
          right: {
            label: "Condensation polymerisation",
            items: [
              "Two different monomers with two functional groups",
              "Small molecule (H₂O or HCl) lost each time",
              "Examples: polyesters (Terylene), polyamides (nylon)",
              "Used in clothing, ropes, parachutes",
            ],
          },
        {
          kind: "warning",
          text: "Plastics are non-biodegradable — they persist in the environment for hundreds of years. This causes pollution of oceans and land. Solutions include recycling, using biodegradable alternatives, and reducing plastic use.",
        },
      ],
    },
    {
      section: "6.4 Alcohols & Fermentation",
      blocks: [
        {
          kind: "keyterms",
          terms: [
            { label: "Alcohol", value: "organic compound containing the −OH (hydroxyl) functional group. General formula: CₙH₂ₙ₊₁OH" },
            { label: "Ethanol", value: "C₂H₅OH — the alcohol in alcoholic drinks; also used as a biofuel" },
            { label: "Fermentation", value: "the anaerobic breakdown of glucose by yeast to produce ethanol and CO₂" },
          ],
        },
        {
          kind: "highlight",
          text: "Fermentation: Glucose → Ethanol + Carbon dioxide\nC₆H₁₂O₆ → 2C₂H₅OH + 2CO₂\nConditions: yeast, ~37°C, anaerobic (no oxygen)",
          color: "green",
        },
        {
          kind: "comparison",
          left: {
            label: "Fermentation (industrial ethanol)",
            items: [
              "Uses glucose from sugar cane or crops",
              "Renewable — carbon neutral",
              "Slow process",
              "Produces dilute ethanol (~15%)",
              "Requires distillation to purify",
            ],
          },
          right: {
            label: "Hydration of ethene (industrial ethanol)",
            items: [
              "Ethene + steam → ethanol",
              "H₃PO₄ catalyst, 300°C, 60 atm",
              "Uses ethene from crude oil (non-renewable)",
              "Fast, continuous process",
              "Produces pure ethanol directly",
            ],
          },
        {
          kind: "bullets",
          items: [
            {
              text: "Reactions of ethanol:",
              sub: [
                "Combustion: C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O (used as fuel)",
                "Oxidation: ethanol + O₂ → ethanoic acid (vinegar) — wine turning sour",
                "Esterification: ethanol + ethanoic acid → ethyl ethanoate + water (acid catalyst)",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "6.5 Carboxylic Acids & Esters",
      blocks: [
        {
          kind: "keyterms",
          terms: [
            { label: "Carboxylic acid", value: "contains the −COOH functional group. Weak acids — partially ionise in water. Example: ethanoic acid (CH₃COOH)" },
            { label: "Ester", value: "formed by reacting an alcohol with a carboxylic acid. Have fruity smells. Used in perfumes and flavourings." },
          ],
        },
        {
          kind: "highlight",
          text: "Esterification: Alcohol + Carboxylic acid ⇌ Ester + Water\nConditions: concentrated H₂SO₄ catalyst, heat\nReversible reaction — equilibrium mixture formed",
          color: "yellow",
        },
        {
          kind: "table",
          headers: ["Alcohol", "Acid", "Ester name", "Smell"],
          rows: [
            ["Ethanol", "Ethanoic acid", "Ethyl ethanoate", "Pear drops"],
            ["Methanol", "Ethanoic acid", "Methyl ethanoate", "Glue"],
            ["Pentanol", "Ethanoic acid", "Pentyl ethanoate", "Banana"],
          ],
        },
        {
          kind: "tip",
          text: "Ester naming: the first part comes from the alcohol (ethanol → ethyl), the second part from the acid (ethanoic acid → ethanoate). So ethanol + ethanoic acid → ethyl ethanoate.",
        },
      ],
    },
  ],
};
