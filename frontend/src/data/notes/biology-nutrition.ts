import type { NoteChapter } from "./types";

export const biologyNutritionNotes: NoteChapter = {
  subject: "Biology",
  title: "Nutrition & Digestion",
  pages: [
    {
      section: "3.1 Nutrients & Their Functions",
      blocks: [
        {
          kind: "video",
          youtubeId: "vMI46qGQMDw",
          title: "Digestive System — IGCSE Biology (Cognito)",
          caption: "Nutrients, digestion, enzymes and absorption in the human digestive system",
        },
        {
          kind: "table",
          headers: ["Nutrient", "Function", "Sources", "Deficiency"],
          rows: [
            ["Carbohydrates", "Energy source; glucose for respiration", "Bread, rice, pasta, sugar", "Fatigue, weight loss"],
            ["Proteins", "Growth, repair, enzymes, antibodies", "Meat, fish, eggs, beans", "Kwashiorkor (muscle wasting)"],
            ["Lipids (fats/oils)", "Energy store, insulation, cell membranes", "Butter, oil, nuts, avocado", "Deficiency rare; excess → heart disease"],
            ["Vitamins", "Various metabolic functions (see below)", "Fruit, vegetables, dairy", "Various deficiency diseases"],
            ["Minerals", "Structural and metabolic roles", "Varied diet", "Various deficiency diseases"],
            ["Water", "Solvent, transport, temperature regulation", "Drinks, food", "Dehydration"],
            ["Dietary fibre", "Prevents constipation, feeds gut bacteria", "Vegetables, wholegrain", "Constipation, bowel disease"],
          ],
        },
        {
          kind: "highlight",
          text: "Key vitamins: Vitamin C (ascorbic acid) — prevents scurvy; needed for collagen synthesis.\nVitamin D — prevents rickets; needed for calcium absorption.\nKey minerals: Iron — needed for haemoglobin (oxygen transport). Calcium — needed for bones, teeth, and muscle contraction.",
          color: "blue",
        },
        {
          kind: "tip",
          text: "Exam tip: For a 'balanced diet' question, name the nutrient, state its function, and give a food source. Three marks = three separate points. Don't just list foods — explain WHY each nutrient is needed.",
        },
      ],
    },
    {
      section: "3.2 The Digestive System",
      blocks: [
        {
          kind: "definition",
          term: "Digestion",
          definition: "the breakdown of large, insoluble food molecules into small, soluble molecules that can be absorbed into the blood. Physical digestion increases surface area; chemical digestion uses enzymes.",
        },
        {
          kind: "highlight",
          text: "**Digestive system pathway:**\nMouth → Oesophagus → Stomach → Small intestine (duodenum → ileum) → Large intestine → Rectum → Anus\n\n• Absorption in small intestine (villi increase surface area)\n• Water reabsorption in large intestine\n• Liver produces bile (emulsifies fats); pancreas produces amylase, trypsin, lipase",
          color: "blue",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_edit.svg/600px-Digestive_system_diagram_edit.svg.png",
          caption: "The human digestive system: from the mouth, down the oesophagus, through the stomach, and into the small and large intestines.",
          side: "right"
        },
        {
          kind: "table",
          headers: ["Organ", "Role", "Enzymes produced"],
          rows: [
            ["Mouth", "Mechanical digestion (teeth); chemical digestion begins", "Salivary amylase (starch → maltose)"],
            ["Oesophagus", "Peristalsis moves food bolus to stomach", "None"],
            ["Stomach", "Churns food; HCl kills bacteria; activates pepsin", "Pepsin (protein → peptides)"],
            ["Pancreas", "Produces digestive enzymes; secretes NaHCO₃", "Amylase, trypsin, lipase"],
            ["Small intestine (ileum)", "Final digestion + absorption", "Maltase, peptidases, lipase"],
            ["Large intestine (colon)", "Absorbs water; compacts faeces", "None"],
            ["Liver", "Produces bile; detoxifies; stores glycogen", "None"],
          ],
        },
        {
          kind: "highlight",
          text: "Bile: produced in liver, stored in gall bladder, released into small intestine.\nEmulsifies fats → breaks large fat droplets into smaller ones → increases surface area for lipase.\nBile is NOT an enzyme — it does not chemically digest fats.",
          color: "yellow",
        },
      ],
    },
    {
      section: "3.3 Enzymes in Digestion",
      blocks: [
        {
          kind: "table",
          headers: ["Enzyme", "Substrate", "Product", "Where produced", "Where acts"],
          rows: [
            ["Amylase", "Starch", "Maltose", "Salivary glands, pancreas", "Mouth, small intestine"],
            ["Protease (pepsin)", "Proteins", "Peptides", "Stomach", "Stomach (pH 2)"],
            ["Protease (trypsin)", "Proteins/peptides", "Amino acids", "Pancreas", "Small intestine"],
            ["Lipase", "Lipids (fats)", "Fatty acids + glycerol", "Pancreas", "Small intestine"],
            ["Maltase", "Maltose", "Glucose", "Small intestine wall", "Small intestine"],
          ],
        },
        {
          kind: "warning",
          text: "Common mistake: Saying bile 'digests' fats. Bile EMULSIFIES fats (physical process — breaks into droplets) but does NOT chemically digest them. Lipase is the enzyme that chemically digests fats into fatty acids and glycerol.",
        },
        {
          kind: "tip",
          text: "For enzyme questions: always state (1) the substrate, (2) the product, (3) where it acts, and (4) the optimum pH. Pepsin works at pH 2 (stomach acid). Trypsin and lipase work at pH 7-8 (alkaline, due to bile neutralising stomach acid).",
        },
      ],
    },
    {
      section: "3.4 Absorption in the Small Intestine",
      blocks: [
        {
          kind: "definition",
          term: "Villi",
          definition: "finger-like projections lining the small intestine that massively increase the surface area for absorption. Each villus is covered in microvilli (brush border) for even greater surface area.",
        },
        {
          kind: "highlight",
          text: "**Villus adaptations:**\n• **Single epithelial cell layer** → very short diffusion distance\n• **Microvilli** → massively increased surface area\n• **Blood capillaries** → absorb glucose and amino acids; maintain steep concentration gradient\n• **Lacteal** (lymph vessel) → absorbs fatty acids and glycerol",
          color: "green",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Adaptations of villi for absorption:",
              sub: [
                "Large number of villi and microvilli → very large surface area",
                "Single layer of epithelial cells → short diffusion distance",
                "Rich blood supply (capillaries) → steep concentration gradient maintained",
                "Lacteals (lymph vessels) → absorb fatty acids and glycerol",
                "Glucose and amino acids → absorbed into blood capillaries by diffusion and active transport",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Glucose and amino acids → absorbed into blood capillaries → transported to liver via hepatic portal vein.\nFatty acids + glycerol → absorbed into lacteals → enter lymphatic system → eventually enter bloodstream.",
          color: "green",
        },
      ],
    },
    {
      section: "3.5 Assimilation & Egestion",
      blocks: [
        {
          kind: "keyterms",
          terms: [
            { label: "Assimilation", value: "the use of absorbed nutrients by cells for metabolic processes (e.g. glucose for respiration, amino acids for protein synthesis)" },
            { label: "Egestion", value: "the removal of undigested food (faeces) from the body through the anus. NOT the same as excretion." },
            { label: "Excretion", value: "removal of metabolic waste products (CO₂, urea, excess water) produced inside cells" },
          ],
        },
        {
          kind: "comparison",
          left: {
            label: "Egestion",
            items: [
              "Removal of undigested food",
              "Food was never absorbed into cells",
              "Occurs at the anus",
              "Faeces = undigested food + dead bacteria + bile pigments",
            ],
          },
          right: {
            label: "Excretion",
            items: [
              "Removal of metabolic waste",
              "Waste was produced inside cells",
              "Occurs at kidneys (urea), lungs (CO₂), skin (sweat)",
              "Products of metabolism that must be removed",
            ],
          },
        },
        {
          kind: "warning",
          text: "Never confuse egestion and excretion. Faeces is NOT excretion — it is egestion. Urine IS excretion (contains urea, a metabolic waste product). CO₂ breathed out IS excretion. This distinction is worth marks in every exam.",
        },
      ],
    },
  ],
};
