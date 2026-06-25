import type { NoteChapter } from "./types";

export const mathematicsGeometryNotes: NoteChapter = {
  subject: "Mathematics",
  title: "Geometry & Trigonometry",
  pages: [
    {
      section: "3.1 Circle Theorems",
      blocks: [
        {
          kind: "video",
          youtubeId: "n4m5y99Uj5E",
          title: "Circle Theorems — GCSE & IGCSE Maths (Cognito)",
          caption: "Comprehensive walkthrough of all 7 circle theorems with proofs and examples"
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Alternate_segment_theorem.svg/500px-Alternate_segment_theorem.svg.png",
          caption: "The Alternate Segment Theorem: The angle between a tangent and a chord is equal to the angle subtended by the chord in the alternate segment.",
          side: "right"
        },
        {
          kind: "intro",
          text: "Circle theorems describe angle relationships in circles. You must state the theorem used in every proof.",
        },
        {
          kind: "highlight",
          text: "**Circle parts:**\n• **Radius** — centre to circumference | **Diameter** — 2 × radius\n• **Chord** — line joining two points on circumference\n• **Arc** — part of the circumference | **Sector** — pizza-slice region (2 radii + arc)\n• **Segment** — region between a chord and an arc\n• **Tangent** — touches circle at exactly one point (perpendicular to radius at that point)",
          color: "blue",
        },
        {
          kind: "table",
          headers: ["Theorem", "Statement", "Key phrase to use"],
          rows: [
            ["1", "Angle at centre = 2 × angle at circumference (same arc)", "'angle at centre is twice the angle at circumference'"],
            ["2", "Angles in the same segment are equal", "'angles in the same segment'"],
            ["3", "Angle in a semicircle = 90°", "'angle in a semicircle is 90°'"],
            ["4", "Opposite angles in a cyclic quadrilateral add up to 180°", "'opposite angles in a cyclic quadrilateral'"],
            ["5", "Tangent is perpendicular to radius at point of contact", "'tangent is perpendicular to radius'"],
            ["6", "Two tangents from an external point are equal in length", "'tangents from an external point are equal'"],
            ["7", "Alternate segment theorem: angle between tangent and chord = angle in alternate segment", "'alternate segment theorem'"],
          ],
        },
        {
          kind: "tip",
          text: "In circle theorem proofs, always give a reason for EVERY step. Write the theorem name in full. Examiners will not award marks for steps without reasons.",
        },
      ],
    },
    {
      section: "3.2 Pythagoras & Trigonometry",
      blocks: [
        {
          kind: "video",
          youtubeId: "15p8L3n9D4g",
          title: "Trigonometry & Pythagoras — GCSE & IGCSE Maths (Cognito)",
          caption: "How to use Pythagoras' theorem, SOHCAHTOA, Sine Rule, Cosine Rule and Area of a Triangle"
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Trigonometry_triangle_definitions.svg/600px-Trigonometry_triangle_definitions.svg.png",
          caption: "Right-angled triangle definitions for sine, cosine, and tangent relative to angle θ.",
          side: "right"
        },
        {
          kind: "highlight",
          text: "Pythagoras: a² + b² = c² (right-angled triangles only, c = hypotenuse)\nSOHCAHTOA: Sin=Opp/Hyp, Cos=Adj/Hyp, Tan=Opp/Adj",
          color: "blue",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "When to use each rule:",
              sub: [
                "Pythagoras: right-angled triangle, find a side",
                "SOHCAHTOA: right-angled triangle, find an angle or side",
                "Sine rule: any triangle, 2 angles + 1 side, OR 2 sides + non-included angle",
                "Cosine rule: any triangle, 2 sides + included angle, OR 3 sides",
                "Area = ½ab sinC: any triangle, 2 sides + included angle",
              ],
            },
          ],
        },
        {
          kind: "table",
          headers: ["Rule", "Formula", "Use when"],
          rows: [
            ["Sine rule", "a/sinA = b/sinB = c/sinC", "2 angles + 1 side, or 2 sides + non-included angle"],
            ["Cosine rule", "a² = b² + c² − 2bc cosA", "2 sides + included angle, or 3 sides"],
            ["Area of triangle", "Area = ½ab sinC", "2 sides + included angle"],
          ],
        },
        {
          kind: "warning",
          text: "The sine rule can give an ambiguous case — two possible triangles. When finding an angle using the sine rule, check if the obtuse angle (180° − answer) also gives a valid triangle.",
        },
      ],
    },
    {
      section: "3.3 Areas & Volumes",
      blocks: [
        {
          kind: "table",
          headers: ["Shape", "Area formula", "Volume formula"],
          rows: [
            ["Circle", "πr²", "—"],
            ["Sector", "(θ/360) × πr²", "—"],
            ["Triangle", "½bh or ½ab sinC", "—"],
            ["Trapezium", "½(a+b)h", "—"],
            ["Cylinder", "2πrh + 2πr² (total SA)", "πr²h"],
            ["Cone", "πrl (curved SA)", "⅓πr²h"],
            ["Sphere", "4πr² (SA)", "⁴⁄₃πr³"],
            ["Pyramid", "base area + triangular faces", "⅓ × base area × h"],
          ],
        },
        {
          kind: "highlight",
          text: "Arc length = (θ/360) × 2πr\nSector area = (θ/360) × πr²\nWhere θ is the angle in degrees.",
          color: "green",
        },
        {
          kind: "tip",
          text: "For compound shapes: split into simpler shapes, calculate each area/volume separately, then add or subtract. Always show your working clearly and include units in your final answer.",
        },
      ],
    },
    {
      section: "3.4 Vectors",
      blocks: [
        {
          kind: "definition",
          term: "Vector",
          definition: "a quantity with both magnitude and direction. Represented as a column vector, bold letter, or with an arrow. Vectors can be added, subtracted, and multiplied by a scalar.",
        },
        {
          kind: "table",
          headers: ["Operation", "Method", "Example"],
          rows: [
            ["Addition", "Add components: (a,b) + (c,d) = (a+c, b+d)", "(3,2) + (1,4) = (4,6)"],
            ["Subtraction", "Subtract components: (a,b) − (c,d) = (a−c, b−d)", "(5,3) − (2,1) = (3,2)"],
            ["Scalar multiplication", "k(a,b) = (ka, kb)", "3(2,1) = (6,3)"],
            ["Magnitude", "|v| = √(a² + b²)", "|(3,4)| = √(9+16) = 5"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Vector geometry — finding paths:",
              sub: [
                "To go from A to B: find vector AB = OB − OA (position vectors)",
                "Midpoint M of AB: OM = OA + ½AB",
                "If AB = kCD, then AB is parallel to CD (and k times as long)",
                "Collinear points: if AB = kAC, then A, B, C are on the same straight line",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "3.5 Transformations",
      blocks: [
        {
          kind: "table",
          headers: ["Transformation", "Description needed", "Key property"],
          rows: [
            ["Translation", "Column vector (x, y)", "Shape and size unchanged; orientation unchanged"],
            ["Reflection", "Equation of mirror line", "Shape and size unchanged; orientation reversed"],
            ["Rotation", "Centre, angle, direction (CW/CCW)", "Shape and size unchanged; orientation changed"],
            ["Enlargement", "Centre and scale factor k", "Shape unchanged; size changes by factor k; area by k²"],
          ],
        },
        {
          kind: "highlight",
          text: "Similarity: if two shapes are similar, corresponding lengths are in ratio k, areas in ratio k², volumes in ratio k³.",
          color: "yellow",
        },
        {
          kind: "warning",
          text: "Negative scale factor in enlargement: the image is on the opposite side of the centre and rotated 180°. Scale factor −2 means the image is twice as large AND on the other side of the centre.",
        },
      ],
    },
  ],
};
