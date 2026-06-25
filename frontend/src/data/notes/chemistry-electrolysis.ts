import type { NoteChapter } from "./types";

export const chemistryElectrolysisNotes: NoteChapter = {
  subject: "Chemistry",
  title: "Electrolysis & Electrochemistry",
  pages: [
    {
      section: "7.1 Electrolysis Basics",
      blocks: [
        {
          kind: "video",
          youtubeId: "ilNOpROacf0",
          title: "Electrolysis Basics — IGCSE Chemistry (Cognito)",
          caption: "Electrolysis of molten and aqueous compounds, electrode reactions and examples",
        },
        {
          kind: "definition",
          term: "Electrolysis",
          definition: "the decomposition of an ionic compound (electrolyte) using electricity. Requires a molten or dissolved ionic compound and two electrodes connected to a DC power supply.",
        },
        {
          kind: "highlight",
          text: "**Electrolysis setup:**\n• **Cathode** (−) → attracts cations → REDUCTION (gain electrons) — OILRIG\n• **Anode** (+) → attracts anions → OXIDATION (lose electrons)\n• Electrolyte must be molten or dissolved so ions can move\n• Memory: **OIL RIG** — Oxidation Is Loss, Reduction Is Gain",
          color: "blue",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Electrolysis_of_water_plain.svg/500px-Electrolysis_of_water_plain.svg.png",
          caption: "An electrolysis cell setup: showing the anode (+), cathode (-), DC power supply, and electrolyte solution.",
          side: "right"
        },
        {
          kind: "comparison",
          left: {
            label: "Cathode (negative electrode)",
            items: [
              "Attracts positive ions (cations)",
              "Cations GAIN electrons",
              "REDUCTION occurs (RIG)",
              "Metals or hydrogen deposited",
              "Cu²⁺ + 2e⁻ → Cu",
              "2H⁺ + 2e⁻ → H₂",
            ],
          },
          right: {
            label: "Anode (positive electrode)",
            items: [
              "Attracts negative ions (anions)",
              "Anions LOSE electrons",
              "OXIDATION occurs (OIL)",
              "Non-metals released as gas",
              "2Cl⁻ → Cl₂ + 2e⁻",
              "2O²⁻ → O₂ + 4e⁻",
            ],
          },
        },
        {
          kind: "highlight",
          text: "OILRIG: Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons)\nCathode = Reduction = Gain of electrons\nAnode = Oxidation = Loss of electrons",
          color: "blue",
        },
      ],
    },
    {
      section: "7.2 Electrolysis of Aqueous Solutions",
      blocks: [
        {
          kind: "intro",
          text: "When an aqueous solution is electrolysed, water also ionises (H₂O ⇌ H⁺ + OH⁻), so there is competition between ions at each electrode.",
        },
        {
          kind: "table",
          headers: ["At cathode", "Rule", "Example"],
          rows: [
            ["Metal or H₂?", "If metal is BELOW H in reactivity series → metal deposited", "Cu²⁺ → Cu deposited (copper below H)"],
            ["", "If metal is ABOVE H in reactivity series → H₂ produced", "Na⁺ → H₂ produced (sodium above H)"],
          ],
        },
        {
          kind: "table",
          headers: ["At anode", "Rule", "Example"],
          rows: [
            ["Halogen or O₂?", "If halide ions (Cl⁻, Br⁻, I⁻) present in HIGH concentration → halogen gas", "Concentrated NaCl → Cl₂ at anode"],
            ["", "If halide ions absent or dilute → O₂ produced from water", "Dilute H₂SO₄ → O₂ at anode"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Electrolysis of brine (concentrated NaCl solution):",
              sub: [
                "Cathode: 2H⁺ + 2e⁻ → H₂ (hydrogen gas)",
                "Anode: 2Cl⁻ → Cl₂ + 2e⁻ (chlorine gas)",
                "Remaining solution: NaOH (sodium hydroxide)",
                "Products: H₂ (fuel, margarine), Cl₂ (bleach, PVC), NaOH (soap, paper)",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "Half equations: always balance atoms first, then add electrons to balance charge. Cathode: Cu²⁺ + 2e⁻ → Cu. Anode: 2Cl⁻ → Cl₂ + 2e⁻. Check: charge must balance on both sides.",
        },
      ],
    },
    {
      section: "7.3 Industrial Applications",
      blocks: [
        {
          kind: "table",
          headers: ["Process", "Electrolyte", "Cathode product", "Anode product", "Use"],
          rows: [
            ["Extraction of aluminium", "Molten Al₂O₃ (bauxite) in cryolite", "Aluminium metal", "Oxygen (burns carbon anode)", "Aircraft, cans, foil"],
            ["Purification of copper", "CuSO₄ solution", "Pure copper deposited", "Impure copper dissolves", "Electrical wiring"],
            ["Electroplating", "Salt of plating metal", "Object coated with metal", "Plating metal dissolves", "Jewellery, cutlery, corrosion protection"],
            ["Chlor-alkali (brine)", "Concentrated NaCl", "Hydrogen gas", "Chlorine gas", "Bleach, PVC, NaOH"],
          ],
        },
        {
          kind: "highlight",
          text: "Aluminium extraction: Al₂O₃ is dissolved in molten cryolite (Na₃AlF₆) to lower the melting point from 2050°C to ~950°C — this saves enormous amounts of energy and makes the process economically viable.",
          color: "yellow",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Electroplating — how it works:",
              sub: [
                "Object to be plated = cathode",
                "Plating metal = anode",
                "Electrolyte = solution of plating metal salt",
                "Metal ions from anode dissolve into solution",
                "Metal ions from solution deposit onto cathode (object)",
                "Example: silver plating cutlery — silver anode, cutlery cathode, silver nitrate solution",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "7.4 Energy Changes in Reactions",
      blocks: [
        {
          kind: "comparison",
          left: {
            label: "Exothermic reactions",
            items: [
              "Release energy to surroundings",
              "Temperature of surroundings INCREASES",
              "ΔH is NEGATIVE",
              "Products have less energy than reactants",
              "Examples: combustion, neutralisation, respiration, oxidation of metals",
            ],
          },
          right: {
            label: "Endothermic reactions",
            items: [
              "Absorb energy from surroundings",
              "Temperature of surroundings DECREASES",
              "ΔH is POSITIVE",
              "Products have more energy than reactants",
              "Examples: thermal decomposition, photosynthesis, dissolving ammonium nitrate",
            ],
          },
        },
        {
          kind: "highlight",
          text: "**Energy profile diagrams:**\n• **Exothermic** — products LOWER than reactants, ΔH negative, energy released\n• **Endothermic** — products HIGHER than reactants, ΔH positive, energy absorbed\n• **Activation energy (Ea)** = energy barrier from reactants to peak\n• A **catalyst** lowers Ea WITHOUT changing ΔH or the energy of reactants/products",
          color: "blue",
        },
        {
          kind: "tip",
          text: "Bond breaking is ENDOTHERMIC (energy absorbed). Bond forming is EXOTHERMIC (energy released). Overall ΔH = energy to break bonds − energy released forming bonds. If more energy released than absorbed → exothermic (ΔH negative).",
        },
      ],
    },
  ],
};
