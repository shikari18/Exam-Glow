import type { NoteChapter } from "./types";

export const biologyPhotosynthesisNotes: NoteChapter = {
  subject: "Biology",
  title: "Photosynthesis & Respiration",
  pages: [
    {
      section: "4.1 Photosynthesis",
      blocks: [
        {
          kind: "definition",
          term: "Photosynthesis",
          definition: "the process by which green plants use light energy to convert carbon dioxide and water into glucose and oxygen. It occurs in the **chloroplasts**.",
        },
        {
          kind: "video",
          youtubeId: "X81OIkeuHJw",
          title: "Photosynthesis — IGCSE Biology (Cognito)",
          caption: "What photosynthesis is, how it works, limiting factors and uses of glucose",
        },
        {
          kind: "highlight",
          text: "Word equation: **Carbon dioxide + Water → Glucose + Oxygen**\nSymbol equation: **6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂**\n\nLight energy is absorbed by chlorophyll. The reaction occurs inside chloroplasts.",
          color: "green",
        },
        {
          kind: "highlight",
          text: "**Chloroplast structure:**\n• **Thylakoid membranes** — contain chlorophyll; site of the light-dependent reactions (light energy absorbed here)\n• **Granum** — stack of thylakoids (increases surface area for light absorption)\n• **Stroma** — fluid-filled space; site of the Calvin cycle (light-independent reactions)\n• **Double membrane** — outer and inner membranes surrounding the chloroplast",
          color: "green",
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Chlorophyll", value: "the green pigment in chloroplasts that absorbs light energy (mainly red and blue light; reflects green)" },
            { label: "Chloroplast", value: "the organelle where photosynthesis occurs; contains thylakoid membranes and stroma" },
            { label: "Limiting factor", value: "the factor in shortest supply that restricts the rate of photosynthesis at any given moment" },
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Uses of glucose produced by photosynthesis:",
              sub: [
                "Respiration — releases energy (ATP) for cell processes",
                "Making cellulose — for cell walls",
                "Making starch — for storage in leaves, roots, and seeds",
                "Making amino acids — combined with nitrate ions from soil",
                "Making lipids — for storage in seeds",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "4.2 Limiting Factors of Photosynthesis",
      blocks: [
        {
          kind: "intro",
          text: "At any moment, only ONE factor limits the rate of photosynthesis — the one in shortest supply. Increasing any other factor will have no effect until the limiting factor is addressed.",
        },
        {
          kind: "table",
          headers: ["Limiting factor", "Effect of increasing it", "Graph shape"],
          rows: [
            ["Light intensity", "Rate increases linearly, then plateaus when another factor limits", "Rises then levels off"],
            ["CO₂ concentration", "Rate increases, then plateaus — major limiting factor in greenhouses", "Rises then levels off"],
            ["Temperature", "Rate rises until ~40°C, then falls sharply as enzymes denature", "Rises then falls steeply"],
            ["Water", "Rarely limiting outdoors; severe shortage reduces rate significantly", "Gradual decline"],
          ],
        },
        {
          kind: "highlight",
          text: "**Limiting factor graphs — key shapes:**\n• **Light intensity** → rate rises linearly then plateaus (CO₂ or temperature now limiting)\n• **CO₂ concentration** → rate rises then plateaus (light or temperature now limiting)\n• **Temperature** → rate rises to peak (~40°C) then falls sharply (enzymes denature above 40°C)\n\nAt the plateau, increasing that factor has NO further effect until the limiting factor changes.",
          color: "green",
        },
        {
          kind: "tip",
          text: "Exam tip: When a graph plateaus, always state WHICH factor is now limiting and WHY. E.g. 'The rate has plateaued because CO₂ concentration is now the limiting factor — increasing light intensity further will have no effect until CO₂ is increased.'",
        },
        {
          kind: "highlight",
          text: "Greenhouse growers increase CO₂ concentration (by burning propane), temperature (heating), and light intensity (artificial lighting) to maximise crop yield.",
          color: "green",
        },
      ],
    },
    {
      section: "4.3 Aerobic Respiration",
      blocks: [
        {
          kind: "definition",
          term: "Aerobic respiration",
          definition: "the release of energy from glucose using oxygen. It occurs in the **mitochondria** and releases a large amount of ATP.",
        },
        {
          kind: "video",
          youtubeId: "J0KxRX3fyoI",
          title: "Aerobic & Anaerobic Respiration — IGCSE Biology (Cognito)",
          caption: "Respiration equations, oxygen debt, fermentation and exam technique",
        },
        {
          kind: "highlight",
          text: "Word equation: Glucose + Oxygen → Carbon dioxide + Water (+ ATP energy)\nSymbol: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
          color: "blue",
        },
        {
          kind: "highlight",
          text: "**Mitochondria structure:**\n• **Outer membrane** — smooth, surrounds the organelle\n• **Inner membrane** — highly folded into **cristae** → greatly increased surface area for ATP synthesis enzymes\n• **Matrix** — fluid interior; contains enzymes for the Krebs cycle and circular DNA\n• More cristae = more mitochondria activity = more ATP produced (e.g. muscle cells have many mitochondria)",
          color: "blue",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "ATP (adenosine triphosphate) is the energy currency of the cell:",
              sub: [
                "Used for muscle contraction, active transport, protein synthesis, cell division",
                "Released during respiration and immediately available for cell processes",
                "Aerobic respiration produces far more ATP than anaerobic",
              ],
            },
          ],
        },
        {
          kind: "warning",
          text: "Respiration ≠ breathing. Respiration is a chemical process in every living cell releasing energy from glucose. Breathing (ventilation) is the mechanical process of moving air in and out of the lungs. Never confuse these two in an exam.",
        },
      ],
    },
    {
      section: "4.4 Anaerobic Respiration",
      blocks: [
        {
          kind: "definition",
          term: "Anaerobic respiration",
          definition: "the release of energy from glucose WITHOUT oxygen. It produces much less ATP than aerobic respiration.",
        },
        {
          kind: "comparison",
          left: {
            label: "In animals (muscle cells)",
            items: [
              "Glucose → Lactic acid (+ small amount of ATP)",
              "Causes muscle fatigue and cramp",
              "Lactic acid builds up in muscles",
              "Oxygen debt must be repaid after exercise",
              "Lactic acid oxidised to CO₂ + H₂O during recovery",
            ],
          },
          right: {
            label: "In yeast / plants",
            items: [
              "Glucose → Ethanol + Carbon dioxide (+ small amount of ATP)",
              "This is FERMENTATION",
              "Used in bread-making (CO₂ makes dough rise)",
              "Used in brewing (ethanol produced)",
              "Yeast dies when ethanol concentration gets too high",
            ],
          },
        {
          kind: "highlight",
          text: "Oxygen debt: after anaerobic exercise, extra oxygen is needed to oxidise lactic acid back to CO₂ and water. This is why you keep breathing heavily after exercise stops.",
          color: "pink",
        },
        {
          kind: "tip",
          text: "Exam tip: Always state that anaerobic respiration produces LESS energy (ATP) than aerobic. The reason is that glucose is only partially broken down — lactic acid or ethanol still contains chemical energy that hasn't been released.",
        },
      ],
    },
    {
      section: "4.5 Comparing Photosynthesis & Respiration",
      blocks: [
        {
          kind: "comparison",
          left: {
            label: "Photosynthesis",
            items: [
              "Occurs in chloroplasts (plant cells only)",
              "Requires light energy",
              "Takes in CO₂, releases O₂",
              "Builds glucose from CO₂ + H₂O",
              "Only occurs during daylight",
              "Stores energy in glucose",
            ],
          },
          right: {
            label: "Respiration",
            items: [
              "Occurs in mitochondria (all living cells)",
              "No light required",
              "Takes in O₂, releases CO₂",
              "Breaks down glucose to release energy",
              "Occurs continuously, day and night",
              "Releases energy as ATP",
            ],
          },
        {
          kind: "highlight",
          text: "Compensation point: the light intensity at which the rate of photosynthesis exactly equals the rate of respiration — no net gas exchange occurs. Below this point, the plant uses more O₂ than it produces.",
          color: "yellow",
        },
        {
          kind: "table",
          headers: ["Gas exchange", "In light (day)", "In dark (night)"],
          rows: [
            ["CO₂", "Taken in (photosynthesis > respiration)", "Released (respiration only)"],
            ["O₂", "Released (photosynthesis > respiration)", "Taken in (respiration only)"],
            ["Net process", "Photosynthesis dominates", "Respiration only"],
          ],
        },
      ],
    },
  ],
};
