import type { NoteChapter } from "./types";

export const physicsSpaceNotes: NoteChapter = {
  subject: "Physics",
  title: "Space Physics & Nuclear",
  pages: [
    {
      section: "6.1 The Solar System",
      blocks: [
        {
          kind: "video",
          youtubeId: "7v2gs8rdQzU",
          title: "Space Physics — IGCSE Physics (Cognito)",
          caption: "The solar system, stars, life cycle, nuclear physics and radioactivity",
        },
        {
          kind: "table",
          headers: ["Object", "Description", "Key facts"],
          rows: [
            ["Sun", "Star at centre of solar system", "Powered by nuclear fusion (H → He); surface temp ~5500°C"],
            ["Planets", "Orbit the Sun in elliptical paths", "8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune"],
            ["Moons", "Natural satellites orbiting planets", "Earth has 1 moon; Jupiter has 95+"],
            ["Asteroids", "Rocky bodies orbiting Sun", "Mostly in asteroid belt between Mars and Jupiter"],
            ["Comets", "Icy bodies with highly elliptical orbits", "Develop tails when near Sun (ice vaporises)"],
            ["Dwarf planets", "Smaller than planets, share orbit with other objects", "Pluto, Eris, Ceres"],
          ],
        },
        {
          kind: "highlight",
          text: "Gravitational force keeps planets in orbit. The closer a planet is to the Sun, the faster it orbits (Kepler's third law). Gravity is an attractive force between all masses.",
          color: "blue",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "The life cycle of a star:",
              sub: [
                "Nebula (cloud of gas and dust) → gravity pulls it together",
                "Protostar → nuclear fusion begins (H → He)",
                "Main sequence star (stable for billions of years) — our Sun is here",
                "Red giant (small/medium star) OR Red supergiant (massive star)",
                "Small/medium star: red giant → planetary nebula → white dwarf → black dwarf",
                "Massive star: red supergiant → supernova → neutron star OR black hole",
              ],
            },
          ],
        },
      ],
    },
    {
      section: "6.2 Electromagnetic Radiation & Space",
      blocks: [
        {
          kind: "bullets",
          items: [
            {
              text: "How we observe the universe:",
              sub: [
                "Optical telescopes — detect visible light; limited by atmosphere and light pollution",
                "Radio telescopes — detect radio waves; can operate day/night, through clouds",
                "Space telescopes (e.g. Hubble) — above atmosphere, no distortion, detect all EM wavelengths",
                "Infrared telescopes — detect heat from distant objects",
                "X-ray and gamma-ray telescopes — detect high-energy events (black holes, supernovae)",
              ],
            },
          ],
        },
        {
          kind: "definition",
          term: "Red shift",
          definition: "the increase in wavelength (shift towards red end of spectrum) of light from distant galaxies. Caused by galaxies moving away from us. The further the galaxy, the greater the red shift — evidence that the universe is expanding.",
        },
        {
          kind: "highlight",
          text: "Big Bang Theory: the universe began ~13.8 billion years ago from an extremely hot, dense point. Evidence: (1) all galaxies moving away from each other (red shift), (2) cosmic microwave background radiation (CMB) — the 'afterglow' of the Big Bang.",
          color: "pink",
        },
      ],
    },
    {
      section: "6.3 Nuclear Physics",
      blocks: [
        {
          kind: "table",
          headers: ["Radiation", "Symbol", "Nature", "Charge", "Penetrating power", "Ionising ability"],
          rows: [
            ["Alpha", "α", "2 protons + 2 neutrons (He nucleus)", "+2", "Low — stopped by paper/few cm air", "High"],
            ["Beta (β⁻)", "β⁻", "Fast electron from nucleus", "−1", "Medium — stopped by few mm Al", "Medium"],
            ["Gamma", "γ", "High-frequency EM radiation", "0", "High — reduced by thick lead/concrete", "Low"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Nuclear equations — balancing rules:",
              sub: [
                "Mass number (top) must balance on both sides",
                "Proton number (bottom) must balance on both sides",
                "Alpha decay: mass number −4, proton number −2",
                "Beta decay: mass number unchanged, proton number +1",
                "Gamma emission: no change in mass or proton number",
                "Example: ²³⁸U → ²³⁴Th + ⁴He (alpha decay)",
              ],
            },
          ],
        },
        {
          kind: "definition",
          term: "Half-life",
          definition: "the time for half the radioactive nuclei in a sample to decay. It is constant and unaffected by temperature, pressure, or chemical state.",
        },
        {
          kind: "highlight",
          text: "After n half-lives: N = N₀ × (½)ⁿ\nExample: 800 Bq source, half-life 2 hours. After 6 hours (3 half-lives):\n800 × ½ × ½ × ½ = 100 Bq",
          color: "green",
        },
      ],
    },
    {
      section: "6.4 Nuclear Fission & Fusion",
      blocks: [
        {
          kind: "comparison",
          left: {
            label: "Nuclear fission",
            items: [
              "Heavy nucleus splits into two smaller nuclei",
              "Triggered by neutron absorption",
              "Releases energy + more neutrons",
              "Chain reaction possible",
              "Used in nuclear power stations",
              "Produces radioactive waste",
              "Fuel: uranium-235 or plutonium-239",
            ],
          },
          right: {
            label: "Nuclear fusion",
            items: [
              "Two light nuclei join to form heavier nucleus",
              "Requires extremely high temperature (>10⁷ K)",
              "Releases more energy per kg than fission",
              "Powers the Sun and stars",
              "No long-lived radioactive waste",
              "Not yet achieved commercially",
              "Fuel: hydrogen isotopes (deuterium, tritium)",
            ],
          },
        },
        {
          kind: "highlight",
          text: "Nuclear power station: controlled fission chain reaction heats water → steam → turbine → generator → electricity. Control rods (boron) absorb neutrons to control the rate. Moderator (water/graphite) slows neutrons.",
          color: "blue",
        },
        {
          kind: "tip",
          text: "Fusion is the 'holy grail' of energy — it produces enormous energy with hydrogen as fuel and no long-lived radioactive waste. The challenge is containing plasma at 100 million°C. ITER (International Thermonuclear Experimental Reactor) is the current major fusion project.",
        },
      ],
    },
    {
      section: "6.5 Uses & Dangers of Radiation",
      blocks: [
        {
          kind: "table",
          headers: ["Use", "Type of radiation", "Why this type?"],
          rows: [
            ["Medical tracers (PET scan)", "Gamma (γ)", "Penetrates body; short half-life (safe)"],
            ["Cancer treatment (radiotherapy)", "Gamma (γ)", "Kills cancer cells; focused beam"],
            ["Sterilising medical equipment", "Gamma (γ)", "Kills bacteria without heating"],
            ["Smoke detectors", "Alpha (α)", "Ionises air between plates; smoke absorbs alpha → alarm"],
            ["Thickness gauges (paper/metal)", "Beta (β)", "Partially absorbed; amount absorbed indicates thickness"],
            ["Carbon dating", "Beta (C-14)", "Half-life 5,730 years — suitable for dating organic material"],
          ],
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Dangers of ionising radiation:",
              sub: [
                "Ionises atoms in cells → damages DNA → mutations → cancer",
                "High doses → radiation sickness, death",
                "Alpha most dangerous if INHALED or INGESTED (highly ionising inside body)",
                "Gamma most dangerous externally (penetrates body)",
              ],
            },
            {
              text: "Safety precautions:",
              sub: [
                "Keep sources in lead-lined containers",
                "Use tongs — never handle directly",
                "Minimise time of exposure",
                "Maximise distance from source",
                "Wear dosimeters to monitor exposure",
                "Lead aprons and screens for shielding",
              ],
            },
          ],
        },
      ],
    },
  ],
};
