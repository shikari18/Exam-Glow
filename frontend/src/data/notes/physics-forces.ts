import type { NoteChapter } from "./types";

export const physicsForcesNotes: NoteChapter = {
  subject: "Physics",
  title: "Forces & Motion",
  pages: [
    {
      section: "1.1 Scalars & Vectors",
      blocks: [
        {
          kind: "video",
          youtubeId: "JGwcDCeYRYo",
          title: "Forces & Motion — IGCSE Physics (Cognito)",
          caption: "Energy stores, scalars vs vectors, motion graphs and Newton's laws",
        },
        {
          kind: "comparison",
          left: {
            label: "Scalar quantities (magnitude only)",
            items: ["Speed", "Distance", "Mass", "Temperature", "Time", "Energy"],
          },
          right: {
            label: "Vector quantities (magnitude + direction)",
            items: ["Velocity", "Displacement", "Acceleration", "Force", "Momentum", "Weight"],
          },
        {
          kind: "keyterms",
          terms: [
            { label: "Speed", value: "distance travelled per unit time. v = d/t. Scalar." },
            { label: "Velocity", value: "displacement per unit time in a specified direction. Vector." },
            { label: "Acceleration", value: "rate of change of velocity. a = (v−u)/t. Vector." },
            { label: "Displacement", value: "distance in a specified direction from a reference point. Vector." },
          ],
        },
        {
          kind: "highlight",
          text: "Distance-time graph: gradient = speed\nVelocity-time graph: gradient = acceleration; area under graph = displacement",
          color: "blue",
        },
        {
          kind: "highlight",
          text: "**Velocity-time graph shapes:**\n• Horizontal line → constant velocity (zero acceleration)\n• Straight line with positive gradient → uniform acceleration\n• Curved line with decreasing gradient → decreasing acceleration\n• Area under the graph = displacement (count squares or use ½ base × height for triangles)",
          color: "pink",
        },
      ],
    },
    {
      section: "1.2 SUVAT Equations",
      blocks: [
        {
          kind: "intro",
          text: "The SUVAT equations apply to uniform (constant) acceleration only. Always list your known variables before choosing an equation.",
        },
        {
          kind: "table",
          headers: ["Equation", "Variables used", "When to use"],
          rows: [
            ["v = u + at", "v, u, a, t", "When displacement (s) is not needed"],
            ["s = ½(u+v)t", "s, u, v, t", "When acceleration (a) is not needed"],
            ["s = ut + ½at²", "s, u, a, t", "When final velocity (v) is not needed"],
            ["v² = u² + 2as", "v, u, a, s", "When time (t) is not needed"],
          ],
        },
        {
          kind: "highlight",
          text: "s = displacement (m) | u = initial velocity (m/s) | v = final velocity (m/s) | a = acceleration (m/s²) | t = time (s)",
          color: "pink",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Worked example: A car accelerates from 10 m/s to 30 m/s in 5 s. Find displacement.",
              sub: [
                "Known: u=10, v=30, t=5. Need: s.",
                "Use s = ½(u+v)t = ½(10+30)×5 = ½×40×5 = 100 m",
              ],
            },
            {
              text: "Worked example: A ball is dropped from rest and falls for 3 s. Find velocity. (g = 10 m/s²)",
              sub: [
                "Known: u=0, a=10, t=3. Need: v.",
                "Use v = u + at = 0 + 10×3 = 30 m/s",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "Always define positive direction first. For objects falling, take downward as positive and use g = 10 m/s². For objects thrown upward, take upward as positive and use a = −10 m/s².",
        },
      ],
    },
    {
      section: "1.3 Newton's Laws of Motion",
      blocks: [
        {
          kind: "table",
          headers: ["Law", "Statement", "Key implication"],
          rows: [
            ["First Law", "An object remains at rest or moves at constant velocity unless a resultant force acts on it", "Inertia — objects resist changes in motion"],
            ["Second Law", "Resultant force = mass × acceleration: F = ma", "Larger force → greater acceleration; larger mass → smaller acceleration"],
            ["Third Law", "Every action has an equal and opposite reaction on the OTHER object", "Forces always come in pairs acting on different objects"],
          ],
        },
        {
          kind: "highlight",
          text: "**Free body diagram rules:**\n• Draw the object as a box or dot\n• Draw ALL forces as arrows FROM the object\n• Arrow length represents magnitude\n• Label each force (Weight W↓, Normal reaction N↑, Friction f←, Applied force F→)\n• Resultant force = vector sum of all forces",
          color: "blue",
        },
        {
          kind: "highlight",
          text: "Weight (N) = mass (kg) × gravitational field strength (N/kg)\nW = mg\nOn Earth: g = 10 N/kg. On Moon: g = 1.6 N/kg",
          color: "blue",
        },
        {
          kind: "warning",
          text: "Newton's Third Law pairs act on DIFFERENT objects. The weight of a book (Earth pulling book down) and the normal reaction (table pushing book up) are NOT a Newton's Third Law pair — they act on the same object. The Third Law pair of the book's weight is the book pulling the Earth upward.",
        },
      ],
    },
    {
      section: "1.4 Terminal Velocity",
      blocks: [
        {
          kind: "intro",
          text: "When an object falls through a fluid (air or liquid), it experiences a drag force that increases with speed.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Sequence of events for a falling skydiver:",
              sub: [
                "1. Jumps from plane — weight > drag, resultant force downward, accelerates",
                "2. Speed increases — drag increases, resultant force decreases, still accelerates but more slowly",
                "3. Drag = weight — resultant force = 0, acceleration = 0, constant velocity (terminal velocity)",
                "4. Opens parachute — drag suddenly increases greatly, drag > weight, decelerates",
                "5. Slows down — drag decreases until drag = weight again at new (lower) terminal velocity",
                "6. Lands safely at low terminal velocity",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "**Skydiver velocity-time graph:**\n1. Steep curve upward → high acceleration (weight >> drag)\n2. Curve flattens → decreasing acceleration (drag increasing)\n3. Horizontal line → terminal velocity (weight = drag)\n4. Sharp drop → parachute opens (drag >> weight, decelerates)\n5. Lower horizontal line → new lower terminal velocity",
          color: "green",
        },
        {
          kind: "highlight",
          text: "At terminal velocity: Weight = Drag force. Resultant force = 0. Acceleration = 0. Velocity is constant (not zero).",
          color: "green",
        },
      ],
    },
    {
      section: "1.5 Momentum & Impulse",
      blocks: [
        {
          kind: "definition",
          term: "Momentum",
          definition: "p = mv. The product of mass and velocity. A vector quantity measured in kg m/s.",
        },
        {
          kind: "highlight",
          text: "Conservation of momentum: In a closed system (no external forces), total momentum before = total momentum after a collision.",
          color: "pink",
        },
        {
          kind: "comparison",
          left: {
            label: "Elastic collision",
            items: [
              "Kinetic energy IS conserved",
              "Total KE before = total KE after",
              "Example: ideal gas molecules",
              "Objects bounce off each other",
            ],
          },
          right: {
            label: "Inelastic collision",
            items: [
              "Kinetic energy is NOT conserved",
              "KE converted to heat, sound, deformation",
              "Example: car crash, clay hitting wall",
              "Momentum is still conserved",
            ],
          },
        {
          kind: "keyterms",
          terms: [
            { label: "Impulse", value: "change in momentum = F × t (Newton-seconds, N·s). Equal to the area under a force-time graph." },
          ],
        },
        {
          kind: "tip",
          text: "For momentum calculations: always define positive direction, include signs for direction, and check that total momentum before = total momentum after. Show all working clearly.",
        },
      ],
    },
  ],
};
