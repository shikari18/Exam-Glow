import type { NoteChapter } from "./types";

export const chemistryRatesNotes: NoteChapter = {
  subject: "Chemistry",
  title: "Rates of Reaction & Equilibrium",
  pages: [
    {
      section: "5.1 Collision Theory",
      blocks: [
        {
          kind: "video",
          youtubeId: "SPXanyy3-hU",
          title: "Rates of Reaction — IGCSE Chemistry (Cognito)",
          caption: "Collision theory, factors affecting rate, and catalysts explained",
        },
        {
          kind: "definition",
          term: "Rate of reaction",
          definition: "the change in amount of reactants or products per unit time. Can be measured by change in mass, volume of gas produced, or change in colour/turbidity.",
        },
        {
          kind: "highlight",
          text: "For a reaction to occur, particles must:\n1. Collide with each other\n2. Have energy ≥ activation energy (Ea)\n3. Have the correct orientation",
          color: "blue",
        },
        {
          kind: "highlight",
          text: "**Energy profile diagram:**\n• **Reactants** on left, **Products** on right\n• **Activation energy (Ea)** = height from reactants to the peak\n• **Exothermic** → products lower than reactants (ΔH negative)\n• **Catalyst** lowers the Ea peak WITHOUT changing reactant/product energy levels",
          color: "blue",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Activation_energy.svg/600px-Activation_energy.svg.png",
          caption: "Activation energy profile diagram: showing how the activation energy (Ea) barrier is lowered by the presence of a catalyst.",
          side: "right"
        },
        {
          kind: "table",
          headers: ["Factor", "Effect on rate", "Explanation"],
          rows: [
            ["Temperature ↑", "Rate increases", "More KE → more frequent collisions AND more collisions exceed Ea"],
            ["Concentration ↑", "Rate increases", "More particles per unit volume → more frequent collisions"],
            ["Pressure ↑ (gases)", "Rate increases", "Same as concentration — particles closer together"],
            ["Surface area ↑", "Rate increases", "More particles exposed → more frequent collisions"],
            ["Catalyst added", "Rate increases", "Provides lower Ea pathway → more successful collisions"],
          ],
        },
      ],
    },
    {
      section: "5.2 Catalysts",
      blocks: [
        {
          kind: "definition",
          term: "Catalyst",
          definition: "a substance that increases the rate of reaction by providing an alternative reaction pathway with lower activation energy. It is NOT used up in the reaction and can be recovered unchanged.",
        },
        {
          kind: "comparison",
          left: {
            label: "Without catalyst",
            items: [
              "Higher activation energy",
              "Fewer particles have enough energy",
              "Slower rate",
              "Same products formed",
              "Same ΔH (energy change)",
            ],
          },
          right: {
            label: "With catalyst",
            items: [
              "Lower activation energy",
              "More particles have enough energy",
              "Faster rate",
              "Same products formed",
              "Same ΔH (energy change)",
            ],
          },
        },
        {
          kind: "table",
          headers: ["Industrial process", "Catalyst", "Reaction"],
          rows: [
            ["Haber process", "Iron (Fe)", "N₂ + 3H₂ ⇌ 2NH₃"],
            ["Contact process", "Vanadium(V) oxide (V₂O₅)", "2SO₂ + O₂ ⇌ 2SO₃"],
            ["Hydrogenation", "Nickel (Ni)", "Alkene + H₂ → alkane"],
            ["Catalytic converter", "Platinum/Rhodium", "CO + NOₓ → CO₂ + N₂"],
          ],
        },
        {
          kind: "warning",
          text: "A catalyst does NOT change the overall energy change (ΔH) of a reaction — only the activation energy. Do NOT say a catalyst 'makes particles collide more' — it lowers the energy barrier, not the collision frequency.",
        },
      ],
    },
    {
      section: "5.3 Measuring Rate of Reaction",
      blocks: [
        {
          kind: "bullets",
          items: [
            {
              text: "Methods to measure rate:",
              sub: [
                "Mass loss: place flask on balance, record mass as gas escapes (e.g. CaCO₃ + HCl → CO₂)",
                "Gas volume: collect gas in syringe or over water, record volume over time",
                "Colour change: use colorimeter to measure absorbance (e.g. bromine decolourising)",
                "Turbidity: measure how quickly a precipitate forms (e.g. sodium thiosulfate + HCl → sulfur)",
                "Titration: remove samples at intervals, quench reaction, titrate to find concentration",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Rate = gradient of tangent to the concentration-time graph at that point.\nInitial rate = gradient of tangent at t = 0 (steepest part of curve).\nRate decreases over time as reactants are used up.",
          color: "green",
        },
        {
          kind: "tip",
          text: "When drawing a rate graph: the curve starts steep (fast rate) and levels off (rate = 0 when reaction is complete). The plateau shows a reactant has been used up. The final amount of product is the same regardless of rate — only the time taken changes.",
        },
      ],
    },
    {
      section: "5.4 Reversible Reactions & Equilibrium",
      blocks: [
        {
          kind: "definition",
          term: "Reversible reaction",
          definition: "a reaction that can proceed in both directions. Shown by the ⇌ symbol. At equilibrium, the forward and reverse rates are equal and concentrations remain constant.",
        },
        {
          kind: "highlight",
          text: "Le Chatelier's Principle: if a system at equilibrium is disturbed, it will shift to oppose the change and restore equilibrium.",
          color: "pink",
        },
        {
          kind: "table",
          headers: ["Change", "Equilibrium shifts", "Effect on yield"],
          rows: [
            ["Temperature ↑", "Towards endothermic reaction", "Depends on which direction is endothermic"],
            ["Temperature ↓", "Towards exothermic reaction", "Depends on which direction is exothermic"],
            ["Pressure ↑ (gases)", "Towards fewer moles of gas", "Increases yield of side with fewer gas moles"],
            ["Concentration of reactant ↑", "Towards products", "Increases yield of products"],
            ["Catalyst added", "No shift — both rates increase equally", "No change in yield, only rate"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Haber process compromise conditions (N₂ + 3H₂ ⇌ 2NH₃, ΔH = −92 kJ/mol):",
              sub: [
                "Temperature: 450°C — lower temperature gives higher yield but too slow; 450°C is a compromise",
                "Pressure: 200 atm — higher pressure gives higher yield (fewer moles of gas on right) but expensive",
                "Catalyst: iron — speeds up reaction without affecting equilibrium position",
                "Unreacted N₂ and H₂ are recycled to improve overall yield",
              ],
            },
          ],
        },
      ],
    },
  ],
};
