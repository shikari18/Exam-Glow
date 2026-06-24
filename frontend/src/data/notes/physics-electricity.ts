import type { NoteChapter } from "./types";

export const physicsElectricityNotes: NoteChapter = {
  subject: "Physics",
  title: "Electricity & Circuits",
  pages: [
    {
      section: "4.1 Current, Voltage & Resistance",
      blocks: [
        {
          kind: "video",
          youtubeId: "TIHW5hEoaAw",
          title: "Electricity & Circuits — IGCSE Physics (Cognito)",
          caption: "Charge, current, voltage, resistance, Ohm's law and circuit calculations",
        },
        {
          kind: "keyterms",
          terms: [
            { label: "Current (I)", value: "rate of flow of electric charge. I = Q/t. Measured in amperes (A). Conventional current flows from + to −." },
            { label: "Voltage / p.d. (V)", value: "energy transferred per unit charge. V = W/Q. Measured in volts (V)." },
            { label: "Resistance (R)", value: "opposition to current flow. R = V/I. Measured in ohms (Ω)." },
          ],
        },
        {
          kind: "highlight",
          text: "Ohm's Law: V = IR\nValid for ohmic conductors at constant temperature.\nGradient of V-I graph = resistance",
          color: "blue",
        },
        {
          kind: "highlight",
          text: "**Ohm's Law I-V graph shapes:**\n• **Ohmic resistor** — straight line through origin (constant resistance)\n• **Filament bulb** — S-shaped curve (resistance increases as temperature increases)\n• **Diode** — no current in reverse; current flows only above ~0.6V forward\n• Gradient of I-V graph = 1/R (steeper = lower resistance)",
          color: "blue",
        },
        {
          kind: "table",
          headers: ["Component", "I-V graph shape", "Resistance behaviour"],
          rows: [
            ["Ohmic resistor", "Straight line through origin", "Constant at constant temperature"],
            ["Filament bulb", "Curve — gradient decreases", "Increases as temperature rises"],
            ["Diode", "Near-zero then sudden rise", "Very high in reverse; low in forward"],
            ["Thermistor", "Varies with temperature", "Decreases as temperature increases"],
            ["LDR", "Varies with light", "Decreases as light intensity increases"],
          ],
        },
      ],
    },
    {
      section: "4.2 Series & Parallel Circuits",
      blocks: [
        {
          kind: "comparison",
          left: {
            label: "Series circuit",
            items: [
              "Current is the SAME throughout: I₁ = I₂ = I₃",
              "Voltages ADD UP: V = V₁ + V₂ + V₃",
              "Total resistance = R₁ + R₂ + R₃ (increases)",
              "If one component fails, whole circuit breaks",
              "Used in: fairy lights (old style), fuses",
            ],
          },
          right: {
            label: "Parallel circuit",
            items: [
              "Voltage is the SAME across each branch",
              "Currents ADD UP: I = I₁ + I₂ + I₃",
              "1/R_total = 1/R₁ + 1/R₂ (total R less than smallest)",
              "If one branch fails, others still work",
              "Used in: household wiring, most electronics",
            ],
          },
        {
          kind: "highlight",
          text: "Worked example: 4Ω and 6Ω in parallel.\n1/R = 1/4 + 1/6 = 3/12 + 2/12 = 5/12\nR = 12/5 = 2.4Ω\nNote: always less than the smallest (4Ω).",
          color: "green",
        },
        {
          kind: "tip",
          text: "Voltmeter: connected in PARALLEL (high resistance — takes negligible current). Ammeter: connected in SERIES (low resistance — minimal voltage drop). Getting these wrong is a very common exam mistake.",
        },
      ],
    },
    {
      section: "4.3 Electrical Power & Energy",
      blocks: [
        {
          kind: "table",
          headers: ["Formula", "Variables", "Units"],
          rows: [
            ["P = IV", "Power, current, voltage", "W = A × V"],
            ["P = I²R", "Power, current, resistance", "W = A² × Ω"],
            ["P = V²/R", "Power, voltage, resistance", "W = V²/Ω"],
            ["E = Pt", "Energy, power, time", "J = W × s"],
            ["E = VIt", "Energy, voltage, current, time", "J = V × A × s"],
            ["Q = It", "Charge, current, time", "C = A × s"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Worked example: A 60W bulb is on for 2 hours. Calculate energy used.",
              sub: [
                "E = Pt = 60 × (2 × 3600) = 60 × 7200 = 432,000 J",
                "Always convert time to seconds (1 hour = 3600 s)",
              ],
            },
            {
              text: "Worked example: A kettle draws 8A from a 230V supply. Calculate power.",
              sub: [
                "P = IV = 8 × 230 = 1840 W = 1.84 kW",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Fuse rating: choose the fuse just above the normal operating current. P = IV → I = P/V. A 1000W appliance on 230V draws I = 1000/230 ≈ 4.3A → use a 5A fuse.",
          color: "yellow",
        },
      ],
    },
    {
      section: "4.4 Magnetism & Electromagnetism",
      blocks: [
        {
          kind: "bullets",
          items: [
            {
              text: "Magnetic field rules:",
              sub: [
                "Field lines go from North to South outside the magnet",
                "Closer field lines = stronger field",
                "Field lines never cross",
                "Right-hand rule for solenoid: curl fingers in direction of current, thumb points to North pole",
              ],
            },
            {
              text: "The motor effect (force on a current-carrying conductor in a magnetic field):",
              sub: [
                "F = BIL (force = magnetic flux density × current × length)",
                "Fleming's Left-Hand Rule: thumb = force (motion), index = field, middle = current",
                "Force is maximum when current is perpendicular to field",
                "Force is zero when current is parallel to field",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "**Magnetic field lines around a bar magnet:**\n• Lines go from **North pole** to **South pole** outside the magnet\n• Closer lines = stronger field (denser near the poles)\n• Lines never cross each other\n• Inside the magnet, lines go from South to North\n• A compass needle aligns with field lines — North end points in the field direction",
          color: "blue",
        },
        {
          kind: "comparison",
          left: {
            label: "DC motor",
            items: [
              "Uses split-ring commutator",
              "Reverses current every half turn",
              "Keeps rotation in same direction",
              "Uses Fleming's Left-Hand Rule",
            ],
          },
          right: {
            label: "AC generator",
            items: [
              "Uses slip rings",
              "Coil rotates in magnetic field",
              "Produces alternating current",
              "Uses Fleming's Right-Hand Rule",
            ],
          },
      ],
    },
    {
      section: "4.5 Electromagnetic Induction & Transformers",
      blocks: [
        {
          kind: "definition",
          term: "Electromagnetic induction",
          definition: "when a conductor moves through a magnetic field (or the field changes), an EMF (voltage) is induced. If the circuit is complete, a current flows.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Ways to increase induced EMF:",
              sub: [
                "Move the conductor faster",
                "Use a stronger magnet",
                "Use more turns of wire",
                "Use a larger area coil",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Transformer equation: Vₚ/Vₛ = Nₚ/Nₛ\nStep-up transformer: Nₛ > Nₚ → Vₛ > Vₚ\nStep-down transformer: Nₛ < Nₚ → Vₛ < Vₚ\nFor 100% efficiency: VₚIₚ = VₛIₛ",
          color: "blue",
        },
        {
          kind: "tip",
          text: "Transformers only work with AC (alternating current) — the changing magnetic field induces an EMF in the secondary coil. DC produces a constant field and no induction. The National Grid uses step-up transformers to transmit at high voltage (low current → less energy lost as heat in cables).",
        },
      ],
    },
  ],
};
