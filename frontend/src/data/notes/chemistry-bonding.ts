import type { NoteChapter } from "./types";

export const chemistryBondingNotes: NoteChapter = {
  subject: "Chemistry",
  title: "Atomic Structure & Bonding",
  pages: [
    {
      section: "2.1 Atomic Structure",
      blocks: [
        {
          kind: "video",
          youtubeId: "5I_1jRGSR9E",
          title: "Atomic Structure & Bonding — IGCSE Chemistry (Cognito)",
          caption: "Atomic structure, ionic bonding, covalent bonding and metallic bonding",
        },
        {
          kind: "intro",
          text: "An atom consists of a central nucleus containing protons and neutrons, surrounded by electrons in shells (energy levels).",
        },
        {
          kind: "highlight",
          text: "**Bohr model — electron shells:**\n• Shell 1: max **2** electrons | Shell 2: max **8** | Shell 3: max **8** (IGCSE)\n\nExamples: Na (2,8,1) | Cl (2,8,7) | Ca (2,8,8,2) | O (2,6) | Mg (2,8,2)",
          color: "blue",
        },
        {
          kind: "table",
          headers: ["Particle", "Relative charge", "Relative mass", "Location"],
          rows: [
            ["Proton", "+1", "1", "Nucleus"],
            ["Neutron", "0", "1", "Nucleus"],
            ["Electron", "−1", "~1/1840", "Shells around nucleus"],
          ],
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Atomic number (Z)", value: "number of protons in the nucleus = number of electrons in a neutral atom" },
            { label: "Mass number (A)", value: "total number of protons + neutrons in the nucleus" },
            { label: "Isotopes", value: "atoms of the same element with the same proton number but different neutron numbers" },
            { label: "Relative atomic mass (Ar)", value: "weighted average mass of an atom relative to 1/12 the mass of carbon-12" },
          ],
        },
        {
          kind: "highlight",
          text: "Electronic configuration: Shell 1 holds max 2 electrons. Shell 2 holds max 8. Shell 3 holds max 8 (at IGCSE level). Fill from the inside out.",
          color: "blue",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Examples of electronic configurations:",
              sub: [
                "Hydrogen (Z=1): 1",
                "Carbon (Z=6): 2, 4",
                "Sodium (Z=11): 2, 8, 1",
                "Chlorine (Z=17): 2, 8, 7",
                "Calcium (Z=20): 2, 8, 8, 2",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "2.2 Ionic Bonding",
      blocks: [
        {
          kind: "definition",
          term: "Ionic bonding",
          definition: "the electrostatic attraction between oppositely charged ions. A metal loses electrons to form a positive ion (cation); a non-metal gains electrons to form a negative ion (anion).",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sodium-chloride-3D-ionic.png/640px-Sodium-chloride-3D-ionic.png",
          caption: "NaCl ionic lattice — Na⁺ (small purple) and Cl⁻ (large green) ions in a regular 3D arrangement held by strong electrostatic forces.",
          side: "full",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Properties of ionic compounds:",
              sub: [
                "High melting and boiling points — strong electrostatic forces require lots of energy to break",
                "Conduct electricity when molten or dissolved (ions free to move) — NOT as a solid (ions fixed in lattice)",
                "Often soluble in water — water molecules surround and separate the ions",
                "Form giant ionic lattice structures",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "3-mark ionic bonding answer: (1) Metal loses electrons / non-metal gains electrons. (2) Oppositely charged ions formed. (3) Strong electrostatic attraction between ions in all directions in a giant lattice.",
        },
      ],
    },
    {
      section: "2.3 Covalent Bonding",
      blocks: [
        {
          kind: "definition",
          term: "Covalent bonding",
          definition: "the sharing of pairs of electrons between non-metal atoms. Each shared pair counts as one covalent bond. Atoms share electrons to achieve a full outer shell.",
        },
        {
          kind: "highlight",
          text: "**Dot-and-cross diagrams:**\n• H₂O — O shares 1 pair with each H (2 single bonds, 2 lone pairs on O)\n• CO₂ — C shares 2 pairs with each O (2 double bonds, linear)\n• NH₃ — N shares 1 pair with each H (3 single bonds, 1 lone pair on N)\n• CH₄ — C shares 1 pair with each H (4 single bonds, tetrahedral)",
          color: "blue",
        },
        {
          kind: "comparison",
          left: {
            label: "Simple molecular (e.g. H₂O, CO₂, CH₄)",
            items: [
              "Low melting/boiling points",
              "Weak intermolecular forces between molecules",
              "Do NOT conduct electricity",
              "Often gases or liquids at room temperature",
            ],
          },
          right: {
            label: "Giant covalent (e.g. diamond, graphite, SiO₂)",
            items: [
              "Very high melting/boiling points",
              "Millions of strong covalent bonds throughout",
              "Diamond: does NOT conduct (no free electrons)",
              "Graphite: DOES conduct (delocalised electrons between layers)",
            ],
          },
        },
        {
          kind: "highlight",
          text: "Diamond: each C bonded to 4 others (tetrahedral) — hardest natural substance. Graphite: each C bonded to 3 others in layers — layers can slide (lubricant), delocalised electrons conduct electricity.",
          color: "yellow",
        },
      ],
    },
    {
      section: "2.4 Metallic Bonding",
      blocks: [
        {
          kind: "definition",
          term: "Metallic bonding",
          definition: "positive metal ions arranged in a lattice, surrounded by a 'sea' of delocalised electrons that are free to move throughout the structure.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Properties explained by metallic bonding:",
              sub: [
                "Good conductors of electricity — delocalised electrons carry charge",
                "Good conductors of heat — delocalised electrons transfer kinetic energy",
                "Malleable and ductile — layers of ions can slide over each other without breaking bonds",
                "High melting points — strong attraction between positive ions and electron sea",
                "Shiny — delocalised electrons reflect light",
              ],
            },
          ],
        },
        {
          kind: "warning",
          text: "Common mistake: Do NOT say metals conduct because 'electrons are free to move between atoms'. Say 'delocalised electrons can move throughout the metallic lattice, carrying charge'. The electrons are not attached to specific atoms.",
        },
      ],
    },
    {
      section: "2.5 The Periodic Table — Groups & Trends",
      blocks: [
        {
          kind: "intro",
          text: "The Periodic Table arranges elements in order of increasing atomic number. Elements in the same group have the same number of outer electrons and similar chemical properties.",
        },
        {
          kind: "table",
          headers: ["Group", "Name", "Outer electrons", "Key trend"],
          rows: [
            ["Group 1", "Alkali metals", "1", "Reactivity increases DOWN (outer e⁻ further from nucleus, more easily lost)"],
            ["Group 7", "Halogens", "7", "Reactivity decreases DOWN (incoming e⁻ further from nucleus, less strongly attracted)"],
            ["Group 0", "Noble gases", "8 (full)", "Very unreactive — full outer shell, no tendency to gain/lose electrons"],
            ["Groups 3-12", "Transition metals", "Variable", "Hard, high mp, coloured compounds, variable oxidation states, catalysts"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Group 1 reactions with water:",
              sub: [
                "Metal + water → metal hydroxide + hydrogen gas",
                "2Na + 2H₂O → 2NaOH + H₂",
                "Reactivity order: Li < Na < K < Rb < Cs",
                "Potassium burns with a lilac flame; sodium with an orange flame",
              ],
            },
            {
              text: "Group 7 displacement reactions:",
              sub: [
                "A more reactive halogen displaces a less reactive one from its salt solution",
                "Cl₂ + 2KBr → 2KCl + Br₂ (chlorine displaces bromine)",
                "Reactivity order: F > Cl > Br > I",
              ],
            },
          ],
        },
      ],
    },
  ],
};
