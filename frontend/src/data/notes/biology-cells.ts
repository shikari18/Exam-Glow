import type { NoteChapter } from "./types";

export const biologyCellsNotes: NoteChapter = {
  subject: "Biology",
  title: "Cells & Organisation",
  pages: [
    {
      section: "1.1 Cell Structure",
      blocks: [
        {
          kind: "intro",
          text: "All living organisms are made of cells — the fundamental unit of life. Cells contain structures called **organelles**, each with a specific function. Understanding how structure relates to function is the most important skill for this topic.",
        },
        {
          kind: "video",
          youtubeId: "RHyZVmbiA78",
          title: "Cell Cycles & Biology — IGCSE Biology (Cognito)",
          caption: "Cell structure, chromosomes, mitosis and cell organisation",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Animal_cell_structure_en.svg/800px-Animal_cell_structure_en.svg.png",
          caption: "Labeled animal cell — nucleus, mitochondria, ribosomes, cell membrane. No cell wall or chloroplasts.",
          side: "full",
        },
        {
          kind: "table",
          headers: ["Organelle", "Function", "Plant?", "Animal?"],
          rows: [
            ["Nucleus", "Contains DNA; controls cell activities", "✓", "✓"],
            ["Cell membrane", "Controls entry/exit of substances by selective permeability", "✓", "✓"],
            ["Cytoplasm", "Fluid medium; site of many metabolic reactions", "✓", "✓"],
            ["Mitochondria", "Site of aerobic respiration; produces ATP energy", "✓", "✓"],
            ["Ribosomes", "Site of protein synthesis (translation)", "✓", "✓"],
            ["Cell wall (cellulose)", "Rigid structural support; prevents over-expansion", "✓", "✗"],
            ["Chloroplasts", "Contain chlorophyll; site of photosynthesis", "✓", "✗"],
            ["Vacuole (large, permanent)", "Filled with cell sap; maintains turgor pressure", "✓", "✗"],
          ],
        },
        {
          kind: "tip",
          text: "Link structure to function. Don't just name the organelle — say WHY its structure suits its function. E.g. 'Mitochondria have a folded inner membrane (cristae) which increases surface area for the enzymes of aerobic respiration, maximising ATP production.'",
        },
        {
          kind: "warning",
          text: "Common mistake: Students confuse cell membrane with cell wall. The cell membrane is a thin, flexible phospholipid bilayer present in ALL cells. The cell wall is rigid, made of cellulose, and found ONLY in plant cells.",
        },
      ],
    },
    {
      section: "1.2 Organisation of Living Things",
      blocks: [
        {
          kind: "intro",
          text: "Living organisms are organised in a hierarchy from cells to the whole organism. Each level is more complex than the one below it.",
        },
        {
          kind: "highlight",
          text: "**Cell → Tissue → Organ → Organ System → Organism**",
          color: "pink",
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Cell", value: "the smallest unit of life; carries out all basic life processes independently" },
            { label: "Tissue", value: "a group of similar cells working together (e.g. muscle tissue, xylem, phloem)" },
            { label: "Organ", value: "a structure made of different tissues working together (e.g. heart, leaf, kidney)" },
            { label: "Organ system", value: "a group of organs working together for a major function (e.g. circulatory, digestive, respiratory)" },
            { label: "Organism", value: "a complete living thing — composed of multiple organ systems working in coordination" },
          ],
        },
        {
          kind: "comparison",
          left: {
            label: "Prokaryotic cells (bacteria)",
            items: [
              "No nucleus — DNA is free in cytoplasm (nucleoid region)",
              "No membrane-bound organelles",
              "Smaller (1–10 μm)",
              "Has cell wall (peptidoglycan, not cellulose)",
              "May have plasmids (small circular DNA)",
            ],
          },
          right: {
            label: "Eukaryotic cells (plants, animals, fungi)",
            items: [
              "Has a true nucleus with nuclear envelope",
              "Has membrane-bound organelles (mitochondria, etc.)",
              "Larger (10–100 μm)",
              "Plant cells have cellulose cell wall",
              "More complex internal organisation",
            ],
          },
        },
        {
          kind: "tip",
          text: "Remember the 5-level hierarchy: **Cell → Tissue → Organ → Organ System → Organism**. This hierarchy is often worth 1 mark per correctly ordered level in exam answers.",
        },
      ],
    },
    {
      section: "1.3 Diffusion",
      blocks: [
        {
          kind: "definition",
          term: "Diffusion",
          definition: "the **net movement** of particles from a region of **higher concentration** to a region of **lower concentration**, down the concentration gradient. It is **passive** — no ATP (energy) is required.",
        },
        {
          kind: "video",
          youtubeId: "4Eq8rO3fABM",
          title: "Osmosis — IGCSE Biology (Cognito)",
          caption: "Diffusion, osmosis and active transport with clear animated diagrams",
        },        {
          kind: "bullets",
          items: [
            {
              text: "**Factors that increase the rate of diffusion:**",
              sub: [
                "Steeper concentration gradient (bigger difference in concentration)",
                "Larger surface area (e.g. alveoli, villi, root hair cells have folded/extended surfaces)",
                "Higher temperature (particles have more kinetic energy → move faster)",
                "Shorter diffusion distance (thinner membrane = faster crossing)",
                "Smaller molecule size (smaller molecules diffuse faster)",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Examples of diffusion in biology:\n• **O₂ and CO₂ exchange** in alveoli (lungs)\n• **Glucose absorption** in the small intestine villi\n• **Gas exchange** in leaves through stomata\n• **Urea** moving from liver cells into the blood",
          color: "green",
        },
        {
          kind: "tip",
          text: "The surface area to volume ratio (SA:V) is critical. Smaller organisms/cells have a higher SA:V ratio and can rely on diffusion alone. Larger organisms need specialised exchange surfaces (lungs, gills, intestines) to increase effective surface area.",
        },
      ],
    },
    {
      section: "1.4 Osmosis",
      blocks: [
        {
          kind: "definition",
          term: "Osmosis",
          definition: "the **net movement of water molecules** from a region of **higher water potential** to a region of **lower water potential**, across a **partially permeable membrane**. It is passive — no ATP required.",
        },
        {
          kind: "warning",
          text: "Common mistake: Never say 'particles move' in osmosis — only **WATER MOLECULES** move. Always include 'partially permeable membrane' and 'water potential' in your definition to score full marks.",
        },
        {
          kind: "highlight",
          text: "**Osmosis effects on cells:**\n• **Hypotonic** (dilute) → water enters → animal cell bursts / plant cell becomes turgid\n• **Isotonic** → no net movement → cell unchanged\n• **Hypertonic** (concentrated) → water leaves → animal cell shrinks (crenation) / plant cell undergoes plasmolysis",
          color: "blue",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Plant_cell_structure_svg.svg/800px-Plant_cell_structure_svg.svg.png",
          caption: "Plant cell — has cell wall (cellulose), chloroplasts, and large permanent vacuole absent in animal cells.",
          side: "full",
        },
        {
          kind: "comparison",
          left: {
            label: "Animal cell in hypotonic solution (dilute)",
            items: [
              "Water potential outside > inside",
              "Water enters by osmosis",
              "Cell swells and may burst (lysis / haemolysis in RBCs)",
            ],
          },
          right: {
            label: "Animal cell in hypertonic solution (concentrated)",
            items: [
              "Water potential inside > outside",
              "Water leaves by osmosis",
              "Cell shrinks (crenation)",
            ],
          },
        },
        {
          kind: "bullets",
          items: [
            {
              text: "**Plant cells in hypertonic solution:**",
              sub: [
                "Water leaves vacuole by osmosis",
                "Cell membrane pulls away from cell wall → **plasmolysis**",
                "Cell becomes flaccid; plant wilts if severe",
              ],
            },
            {
              text: "**Plant cells in hypotonic solution:**",
              sub: [
                "Water enters vacuole by osmosis",
                "Cell becomes **turgid** — cell wall prevents bursting",
                "**Turgor pressure** supports non-woody plants",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "**Key difference:** Animal cells burst in hypotonic solution (no cell wall). Plant cells become turgid but do NOT burst — the cellulose cell wall provides structural support.",
          color: "blue",
        },
      ],
    },
    {
      section: "1.5 Active Transport",
      blocks: [
        {
          kind: "definition",
          term: "Active transport",
          definition: "the movement of molecules or ions across a membrane **against their concentration gradient** (from low to high concentration), using **energy (ATP)** and **carrier proteins**.",
        },
        {
          kind: "comparison",
          left: {
            label: "Active transport",
            items: [
              "Against concentration gradient (low → high)",
              "Requires ATP — stopped by metabolic poisons/lack of O₂",
              "Uses specific carrier proteins",
              "Examples: mineral ion uptake by root hair cells; glucose reabsorption in kidney; Na⁺/K⁺ pump in nerve cells",
            ],
          },
          right: {
            label: "Diffusion / Osmosis",
            items: [
              "Down concentration gradient (high → low)",
              "No ATP required — passive process",
              "No carrier proteins needed (simple diffusion)",
              "Examples: O₂/CO₂ in alveoli; water movement in osmosis; glucose from gut into blood",
            ],
          },
        },
        {
          kind: "tip",
          text: "Active transport is used when cells need to absorb substances already at higher concentration inside than outside — e.g. root hair cells absorbing NO₃⁻ and K⁺ ions from dilute soil water.",
        },
        {
          kind: "warning",
          text: "If a question states a cell is treated with a respiratory inhibitor (e.g. cyanide) or placed in anaerobic conditions, active transport STOPS (no ATP produced). Diffusion and osmosis are unaffected — they require no energy.",
        },
      ],
    },
  ],
};
