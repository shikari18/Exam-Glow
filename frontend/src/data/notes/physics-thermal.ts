import type { NoteChapter } from "./types";

export const physicsThermalNotes: NoteChapter = {
  subject: "Physics",
  title: "Thermal Physics & Radioactivity",
  pages: [
    {
      section: "5.1 Specific Heat Capacity",
      blocks: [
        {
          kind: "video",
          youtubeId: "OTksau0_VoI",
          title: "Thermal Physics — IGCSE Physics (Cognito)",
          caption: "Particle theory, states of matter, specific heat capacity and latent heat",
        },
        {
          kind: "definition",
          term: "Specific heat capacity (c)",
          definition: "the energy required to raise the temperature of 1 kg of a substance by 1°C (or 1 K). Units: J/(kg·°C).",
        },
        {
          kind: "highlight",
          text: "Q = mcΔT\nQ = energy transferred (J)\nm = mass (kg)\nc = specific heat capacity (J/kg°C)\nΔT = temperature change (°C)",
          color: "blue",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Worked example: How much energy to heat 2 kg of water from 20°C to 100°C? (c_water = 4200 J/kg°C)",
              sub: [
                "ΔT = 100 − 20 = 80°C",
                "Q = mcΔT = 2 × 4200 × 80 = 672,000 J = 672 kJ",
              ],
            },
            {
              text: "Why water has a high specific heat capacity:",
              sub: [
                "Water requires a lot of energy to raise its temperature",
                "Makes it ideal as a coolant (car radiators, body temperature regulation)",
                "Oceans moderate coastal climates — slow to heat up and cool down",
              ],
            },
          ],
        },
        {
          kind: "definition",
          term: "Latent heat",
          definition: "the energy absorbed or released during a change of state at constant temperature. Q = mL, where L is the specific latent heat.",
        },
        {
          kind: "comparison",
          left: {
            label: "Specific latent heat of fusion (melting)",
            items: [
              "Energy to melt 1 kg of solid at its melting point",
              "Water: L_f = 334,000 J/kg",
              "Temperature stays constant during melting",
              "Energy breaks intermolecular bonds",
            ],
          },
          right: {
            label: "Specific latent heat of vaporisation (boiling)",
            items: [
              "Energy to boil 1 kg of liquid at its boiling point",
              "Water: L_v = 2,260,000 J/kg",
              "Temperature stays constant during boiling",
              "Much larger than fusion (bonds fully broken)",
            ],
          },
        },
      ],
    },
    {
      section: "5.2 Heat Transfer",
      blocks: [
        {
          kind: "table",
          headers: ["Method", "How it works", "Medium needed?", "Example"],
          rows: [
            ["Conduction", "Vibrating particles pass energy to neighbours; free electrons in metals", "Yes (solid/liquid)", "Metal spoon in hot soup"],
            ["Convection", "Heated fluid rises (less dense), cooler fluid sinks — creates currents", "Yes (fluid)", "Radiator heating a room"],
            ["Radiation", "Infrared electromagnetic waves emitted by all objects above 0 K", "No (vacuum OK)", "Sun warming Earth"],
          ],
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Heat_transfer.svg/600px-Heat_transfer.svg.png",
          caption: "The three main methods of heat transfer: conduction, convection, and radiation.",
          side: "right"
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Factors affecting radiation:",
              sub: [
                "Dark matt surfaces: best absorbers AND best emitters of infrared",
                "Shiny light surfaces: poor absorbers AND poor emitters (good reflectors)",
                "All objects above absolute zero emit radiation",
                "Hotter objects emit more radiation and at shorter wavelengths",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Vacuum flask (Thermos): silvered walls (reduce radiation), vacuum between walls (no conduction or convection), tight stopper (no convection at top). Keeps hot things hot and cold things cold.",
          color: "green",
        },
      ],
    },
    {
      section: "5.3 Gas Laws",
      blocks: [
        {
          kind: "table",
          headers: ["Law", "Variables", "Formula", "Condition"],
          rows: [
            ["Boyle's Law", "Pressure & Volume", "P₁V₁ = P₂V₂", "Constant temperature"],
            ["Charles's Law", "Volume & Temperature", "V₁/T₁ = V₂/T₂", "Constant pressure"],
            ["Gay-Lussac's Law", "Pressure & Temperature", "P₁/T₁ = P₂/T₂", "Constant volume"],
            ["Combined Gas Law", "P, V, T", "P₁V₁/T₁ = P₂V₂/T₂", "Fixed mass of gas"],
          ],
        },
        {
          kind: "warning",
          text: "Always use KELVIN (K) for temperature in gas law calculations. K = °C + 273. Never use Celsius directly — it will give wrong answers. Absolute zero = 0 K = −273°C.",
        },
        {
          kind: "highlight",
          text: "Kinetic theory explanation: increasing temperature → particles move faster → hit walls more often and with greater force → pressure increases (at constant volume).",
          color: "blue",
        },
      ],
    },
    {
      section: "5.4 Radioactivity",
      blocks: [
        {
          kind: "table",
          headers: ["Radiation", "Nature", "Charge", "Penetrating power", "Stopped by"],
          rows: [
            ["Alpha (α)", "2 protons + 2 neutrons (helium nucleus)", "+2", "Low — most ionising", "Paper or a few cm of air"],
            ["Beta (β⁻)", "Fast electron from nucleus", "−1", "Medium", "Few mm of aluminium"],
            ["Gamma (γ)", "High-frequency EM radiation", "0", "High — least ionising", "Thick lead or concrete"],
          ],
        },
        {
          kind: "definition",
          term: "Half-life (t₁/₂)",
          definition: "the time for half the radioactive nuclei in a sample to decay. It is constant and cannot be changed by temperature, pressure, or chemical state.",
        },
        {
          kind: "highlight",
          text: "After n half-lives: amount remaining = N₀ × (½)ⁿ\nExample: after 3 half-lives → (½)³ = 1/8 of original remains\nActivity also halves every half-life.",
          color: "pink",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Uses of radioactivity:",
              sub: [
                "Medical tracers: gamma emitters with short half-life (e.g. technetium-99m) — track blood flow",
                "Cancer treatment: focused gamma rays kill tumour cells",
                "Sterilisation: gamma rays kill bacteria on medical equipment and food",
                "Smoke detectors: alpha source (americium-241) ionises air; smoke absorbs alpha → alarm triggers",
                "Carbon dating: uses carbon-14 (half-life 5,730 years) to date organic materials",
              ],
            },
          ],
        },
        {
          kind: "warning",
          text: "Half-life calculation mistake: do NOT subtract half-lives — multiply by (½)ⁿ. After 3 half-lives of a 800 Bq source: 800 × ½ × ½ × ½ = 100 Bq. NOT 800 − 3×400.",
        },
      ],
    },
    {
      section: "5.5 Nuclear Reactions",
      blocks: [
        {
          kind: "comparison",
          left: {
            label: "Nuclear fission",
            items: [
              "Heavy nucleus splits into two smaller nuclei",
              "Triggered by neutron absorption (U-235)",
              "Releases large amount of energy + more neutrons",
              "Chain reaction if enough neutrons cause further fissions",
              "Used in nuclear power stations and atomic bombs",
            ],
          },
          right: {
            label: "Nuclear fusion",
            items: [
              "Two light nuclei join to form a heavier nucleus",
              "Requires extremely high temperature (>10⁷ K)",
              "Releases even more energy per kg than fission",
              "Powers the Sun and stars",
              "Not yet achieved commercially on Earth",
            ],
          },
        },
        {
          kind: "highlight",
          text: "Nuclear equations must balance: total proton number (Z) and total mass number (A) must be equal on both sides.\nExample: ²³⁵U + ¹n → ¹⁴¹Ba + ⁹²Kr + 3¹n",
          color: "blue",
        },
        {
          kind: "tip",
          text: "For alpha decay: mass number decreases by 4, proton number decreases by 2.\nFor beta decay: mass number unchanged, proton number increases by 1 (a neutron becomes a proton + electron).\nFor gamma emission: no change in mass number or proton number — just energy released.",
        },
      ],
    },
  ],
};
