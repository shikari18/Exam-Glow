import type { NoteChapter } from "./types";

export const mathematicsAlgebraNotes: NoteChapter = {
  subject: "Mathematics",
  title: "Algebra & Graphs",
  pages: [
    {
      section: "5.1 Expanding & Factorising",
      blocks: [
        {
          kind: "video",
          youtubeId: "dstRL5xB0Sk",
          title: "Algebra & Graphs — IGCSE Maths (Cognito)",
          caption: "Expanding brackets, factorising, quadratics and graph sketching",
        },
        {
          kind: "intro",
          text: "Algebra is the language of mathematics — it allows us to express general rules and solve problems with unknown values.",
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Expanding", value: "multiplying out brackets to remove them: a(b+c) = ab + ac" },
            { label: "Factorising", value: "writing an expression as a product of its factors (the reverse of expanding)" },
            { label: "Quadratic", value: "an expression of the form ax² + bx + c where a ≠ 0" },
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Expanding double brackets: (x + a)(x + b) = x² + (a+b)x + ab",
              sub: [
                "Example: (x + 3)(x + 5) = x² + 8x + 15",
                "Use FOIL: First, Outer, Inner, Last",
                "Example: (2x − 1)(x + 4) = 2x² + 8x − x − 4 = 2x² + 7x − 4",
              ],
            },
            {
              text: "Factorising a quadratic x² + bx + c:",
              sub: [
                "Find two numbers that MULTIPLY to c and ADD to b",
                "Example: x² + 7x + 12 → find numbers that multiply to 12 and add to 7 → 3 and 4",
                "Answer: (x + 3)(x + 4)",
                "Always check by expanding back",
              ],
            },
            {
              text: "Difference of two squares: a² − b² = (a+b)(a−b)",
              sub: [
                "Example: x² − 25 = (x+5)(x−5)",
                "Example: 4x² − 9 = (2x+3)(2x−3)",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "Always check your factorisation by expanding back. If you get the original expression, you're correct.",
        },
      ],
    },
    {
      section: "5.2 Solving Quadratic Equations",
      blocks: [
        {
          kind: "intro",
          text: "A quadratic equation has the form ax² + bx + c = 0. There are three methods to solve it.",
        },
        {
          kind: "numbered",
          items: [
            "Factorising: write as (x + p)(x + q) = 0, then x = −p or x = −q",
            "Completing the square: write as (x + b/2)² − (b/2)² + c = 0, then solve",
            "Quadratic formula: x = (−b ± √(b²−4ac)) / 2a — works for ALL quadratics",
          ],
        },
        {
          kind: "highlight",
          text: "Quadratic formula: x = (−b ± √(b²−4ac)) / 2a\nThe discriminant b²−4ac tells you:\n• > 0: two distinct real roots\n• = 0: one repeated root\n• < 0: no real roots",
          color: "blue",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Parabola_with_roots.svg/500px-Parabola_with_roots.svg.png",
          caption: "A quadratic graph (parabola) y = ax² + bx + c, showing the two roots (x-intercepts) where ax² + bx + c = 0.",
          side: "right"
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Completing the square for x² + 6x + 2:",
              sub: [
                "Step 1: (x + 3)² − 9 + 2",
                "Step 2: (x + 3)² − 7",
                "To solve: (x + 3)² = 7 → x + 3 = ±√7 → x = −3 ± √7",
              ],
            },
          ],
        },
        {
          kind: "warning",
          text: "When using the quadratic formula, always substitute carefully. Write out a, b, c first. Remember the ± means you get TWO answers. If the discriminant is negative, write 'no real solutions'.",
        },
      ],
    },
    {
      section: "5.3 Simultaneous Equations",
      blocks: [
        {
          kind: "intro",
          text: "Simultaneous equations are two equations with two unknowns that must both be satisfied at the same time.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Method 1 — Elimination:",
              sub: [
                "Multiply equations to make one coefficient equal",
                "Add or subtract to eliminate that variable",
                "Solve for the remaining variable",
                "Substitute back to find the other",
                "Check in BOTH original equations",
              ],
            },
            {
              text: "Method 2 — Substitution:",
              sub: [
                "Rearrange one equation to make x (or y) the subject",
                "Substitute into the other equation",
                "Solve the resulting single-variable equation",
                "Substitute back to find the other variable",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Example: x + y = 7 and x − y = 3\nAdd: 2x = 10 → x = 5\nSubstitute: 5 + y = 7 → y = 2\nCheck: 5 − 2 = 3 ✓",
          color: "green",
        },
        {
          kind: "tip",
          text: "For simultaneous equations where one is quadratic, use substitution. Rearrange the linear equation for x or y, substitute into the quadratic, and solve the resulting quadratic.",
        },
      ],
    },
    {
      section: "5.4 Indices & Surds",
      blocks: [
        {
          kind: "table",
          headers: ["Rule", "Example"],
          rows: [
            ["aᵐ × aⁿ = aᵐ⁺ⁿ", "x³ × x⁴ = x⁷"],
            ["aᵐ ÷ aⁿ = aᵐ⁻ⁿ", "x⁶ ÷ x² = x⁴"],
            ["(aᵐ)ⁿ = aᵐⁿ", "(x²)³ = x⁶"],
            ["a⁰ = 1", "5⁰ = 1"],
            ["a⁻ⁿ = 1/aⁿ", "x⁻² = 1/x²"],
            ["a^(1/n) = ⁿ√a", "8^(1/3) = ∛8 = 2"],
            ["a^(m/n) = (ⁿ√a)ᵐ", "8^(2/3) = (∛8)² = 4"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Simplifying surds:",
              sub: [
                "Find the largest perfect square factor",
                "√50 = √(25×2) = 5√2",
                "√72 = √(36×2) = 6√2",
                "√(a×b) = √a × √b",
              ],
            },
            {
              text: "Rationalising the denominator:",
              sub: [
                "Multiply numerator and denominator by the surd",
                "6/√3 = (6×√3)/(√3×√3) = 6√3/3 = 2√3",
                "For (a+√b) in denominator, multiply by (a−√b) — the conjugate",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "5.5 Graph Transformations",
      blocks: [
        {
          kind: "intro",
          text: "Graph transformations describe how the graph of y = f(x) changes when the function is modified.",
        },
        {
          kind: "table",
          headers: ["Transformation", "Effect on graph", "Example"],
          rows: [
            ["y = f(x) + a", "Shift UP by a units", "y = x² + 3 shifts y = x² up 3"],
            ["y = f(x) − a", "Shift DOWN by a units", "y = x² − 2 shifts y = x² down 2"],
            ["y = f(x + a)", "Shift LEFT by a units", "y = (x+3)² shifts y = x² left 3"],
            ["y = f(x − a)", "Shift RIGHT by a units", "y = (x−4)² shifts y = x² right 4"],
            ["y = af(x)", "Stretch vertically by factor a", "y = 3x² stretches y = x² by 3"],
            ["y = f(ax)", "Stretch horizontally by factor 1/a", "y = (2x)² squashes y = x²"],
            ["y = −f(x)", "Reflect in the x-axis", "y = −x² flips y = x²"],
            ["y = f(−x)", "Reflect in the y-axis", "y = (−x)² same as y = x²"],
          ],
        },
        {
          kind: "warning",
          text: "Common mistake: y = f(x+a) shifts LEFT (not right). Think of it as: to get the same y-value, you need a smaller x. So the graph moves left. y = f(x−a) shifts RIGHT.",
        },
        {
          kind: "tip",
          text: "For transformations, always describe them in words: 'translation by vector (0, 3)' or 'reflection in the x-axis' or 'stretch parallel to the y-axis by scale factor 2'. Examiners want precise mathematical language.",
        },
      ],
    },
  ],
};
