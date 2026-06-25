import type { NoteChapter } from "./types";

export const biologyGeneticsNotes: NoteChapter = {
  subject: "Biology",
  title: "Genetics & Inheritance",
  pages: [
    {
      section: "7.1 DNA & Chromosomes",
      blocks: [
        {
          kind: "video",
          youtubeId: "mvWy5lbUoHA",
          title: "Genetic Diagrams — IGCSE Biology (Cognito)",
          caption: "DNA, chromosomes, inheritance and Punnett squares explained",
        },
        {
          kind: "definition",
          term: "DNA (deoxyribonucleic acid)",
          definition: "a double helix polymer made of nucleotide monomers. Each nucleotide contains a phosphate group, deoxyribose sugar, and one of four bases.",
        },
        {
          kind: "highlight",
          text: "**DNA double helix:**\n• Two strands wound in a double helix held by complementary base pairs\n• **A pairs with T** (2 hydrogen bonds) | **C pairs with G** (3 hydrogen bonds)\n• Strands are antiparallel (run 3'→5' and 5'→3')\n• Sugar-phosphate backbone on the outside; bases on the inside",
          color: "blue",
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Gene", value: "a section of DNA that codes for a specific protein (sequence of amino acids)" },
            { label: "Chromosome", value: "a coiled strand of DNA. Human body cells have 46 chromosomes (23 pairs)" },
            { label: "Allele", value: "a version of a gene. Different alleles produce different forms of a characteristic" },
            { label: "Genome", value: "the complete set of genetic information in an organism" },
          ],
        },
        {
          kind: "highlight",
          text: "Complementary base pairing: A pairs with T (Adenine-Thymine)\nC pairs with G (Cytosine-Guanine)\nThis is the basis of DNA replication and protein synthesis.",
          color: "blue",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Human chromosome numbers:",
              sub: [
                "Body cells (somatic): 46 chromosomes (23 pairs) — diploid (2n)",
                "Gametes (sperm and eggs): 23 chromosomes — haploid (n)",
                "After fertilisation: 46 chromosomes restored in zygote",
                "Sex chromosomes: females XX, males XY",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "7.2 Inheritance Terminology",
      blocks: [
        {
          kind: "table",
          headers: ["Term", "Definition", "Example"],
          rows: [
            ["Dominant", "Allele always expressed when present (one or two copies)", "B (brown eyes)"],
            ["Recessive", "Only expressed when two copies present (homozygous)", "b (blue eyes)"],
            ["Homozygous", "Two identical alleles", "BB or bb"],
            ["Heterozygous", "Two different alleles", "Bb"],
            ["Genotype", "The alleles present", "Bb"],
            ["Phenotype", "The observable characteristic", "Brown eyes"],
            ["Carrier", "Heterozygous for a recessive condition — unaffected but can pass it on", "Ff (cystic fibrosis carrier)"],
          ],
        },
        {
          kind: "highlight",
          text: "Codominance: both alleles are expressed equally. Neither is dominant.\nExample: Blood type AB — both I^A and I^B alleles expressed, producing both A and B antigens.",
          color: "pink",
        },
        {
          kind: "tip",
          text: "Always use capital letters for dominant alleles and lowercase for recessive. Use the SAME letter for both alleles of a gene (e.g. B and b, not B and r). This makes it clear they are alleles of the same gene.",
        },
      ],
    },
    {
      section: "7.3 Punnett Squares",
      blocks: [
        {
          kind: "intro",
          text: "A Punnett square shows all possible offspring genotypes from a cross between two parents.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "How to draw a Punnett square:",
              sub: [
                "1. Write parents' genotypes (P)",
                "2. Write gametes (G) — one allele each",
                "3. Draw 2×2 grid with gametes on top and side",
                "4. Fill in offspring genotypes",
                "5. State phenotype ratio (e.g. 3:1)",
                "6. State probability (e.g. 25% chance of bb)",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Monohybrid cross: Bb × Bb\nGametes: B, b × B, b\nOffspring: BB, Bb, Bb, bb\nPhenotype ratio: 3 dominant : 1 recessive\nProbability of recessive: 1/4 = 25%",
          color: "green",
        },
        {
          kind: "highlight",
          text: "**Punnett square — Tt × Tt cross:**\n\n|   | **T** | **t** |\n|---|---|---|\n| **T** | TT | Tt |\n| **t** | Tt | tt |\n\nGenotype ratio: 1 TT : 2 Tt : 1 tt\nPhenotype ratio: **3 dominant : 1 recessive**",
          color: "green",
        },
      ],
    },
    {
      section: "7.4 Genetic Diseases",
      blocks: [
        {
          kind: "comparison",
          left: {
            label: "Cystic fibrosis (recessive)",
            items: [
              "Caused by recessive allele (f)",
              "Affected individuals: ff (homozygous recessive)",
              "Carriers: Ff (heterozygous — unaffected)",
              "Both parents must carry 'f' for child to be affected",
              "Ff × Ff → 25% chance of ff (affected)",
              "Symptoms: thick mucus in lungs and digestive system",
            ],
          },
          right: {
            label: "Huntington's disease (dominant)",
            items: [
              "Caused by dominant allele (H)",
              "Only ONE copy needed to cause disease",
              "Affected individuals: Hh or HH",
              "Hh × hh → 50% chance of affected child",
              "Late onset — symptoms appear in 30s-40s",
              "Symptoms: progressive nervous system degeneration",
            ],
          },
        },
        {
          kind: "warning",
          text: "Common mistake: Students often say 'if both parents are carriers, all children will be carriers'. This is wrong. Ff × Ff gives: 25% FF (unaffected, not carrier), 50% Ff (carriers), 25% ff (affected). Always draw the Punnett square.",
        },
      ],
    },
    {
      section: "7.5 Sex Determination & Mutations",
      blocks: [
        {
          kind: "highlight",
          text: "Sex determination:\nFemales: XX | Males: XY\nAll eggs carry X. Sperm carry X or Y.\nIf Y sperm fertilises egg → XY (male)\nIf X sperm fertilises egg → XX (female)\n50:50 probability each pregnancy.",
          color: "blue",
        },
        {
          kind: "definition",
          term: "Mutation",
          definition: "a change in the sequence of DNA bases. Can be caused by radiation (UV, X-rays, gamma rays), certain chemicals (mutagens), or errors during DNA replication.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Types of mutation:",
              sub: [
                "Substitution: one base replaced by another — may change one amino acid",
                "Deletion: one base removed — shifts the reading frame, affects all subsequent amino acids",
                "Insertion: extra base added — also shifts reading frame",
                "Most mutations are neutral (no effect on protein function)",
                "Some are harmful (e.g. cause cancer or genetic disease)",
                "Very rarely, mutations are beneficial (basis of natural selection)",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "Exam tip: When asked about mutations, always state that they are RANDOM and UNPREDICTABLE. The rate of mutation can be increased by mutagens (radiation, certain chemicals) but the specific mutation that occurs cannot be controlled.",
        },
      ],
    },
  ],
};
