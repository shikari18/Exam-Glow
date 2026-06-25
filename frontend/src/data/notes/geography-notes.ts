import type { NoteChapter } from "./types";

export const geographyPopulationNotes: NoteChapter = {
  subject: "Geography",
  title: "Population and Settlement",
  pages: [
    {
      section: "1.1 Population Growth and Distribution",
      blocks: [
        { kind: "video", youtubeId: "X2ZIDALAkXo", title: "Population Geography — IGCSE Geography (Cognito)", caption: "Population growth, distribution, birth and death rates, demographic transition model and migration" },
        { kind: "intro", text: "The world's population has grown from 1 billion in 1800 to over 8 billion today. Growth is NOT uniform — it varies significantly between and within countries based on birth rates, death rates, and migration." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/World_population_growth_rate_1950%E2%80%932050.svg/800px-World_population_growth_rate_1950%E2%80%932050.svg.png", caption: "World population growth rate 1950–2050: growth peaked in the late 1960s and has been declining as development spreads. Most future growth will occur in Africa and South Asia.", side: "full" },
        { kind: "highlight", text: "**Key population equations:**\nNatural increase = Birth rate − Death rate\nPopulation change = Natural increase + Net migration\nNet migration = Immigration − Emigration\n\n**Birth rate** = live births per 1,000 population per year\n**Death rate** = deaths per 1,000 population per year", color: "blue" },
        { kind: "keyterms", terms: [
          { label: "Birth rate", value: "Live births per 1,000 people per year. Influenced by education, access to contraception, cultural values, infant mortality." },
          { label: "Death rate", value: "Deaths per 1,000 people per year. Influenced by healthcare quality, nutrition, clean water, disease, lifestyle." },
          { label: "Natural increase", value: "Birth rate minus death rate. Positive = population grows; negative = population shrinks." },
          { label: "Infant mortality rate", value: "Deaths of children under 1 year per 1,000 live births. A key development indicator." },
          { label: "Life expectancy", value: "Average age a person born today is expected to reach. Reflects healthcare, nutrition and living standards." },
          { label: "Dependency ratio", value: "Ratio of dependants (under 15 + over 65) to working population (15–64). Higher ratio = greater economic burden." },
        ]},
        { kind: "comparison", left: { label: "High-income countries (HICs)", items: ["Low birth rate (access to contraception, high female education)", "Low death rate (good healthcare, clean water, nutrition)", "Ageing population (large % over 65)", "Low or negative natural increase", "Immigration may boost population"] }, right: { label: "Low/middle-income countries (LMICs)", items: ["High birth rate (less education, cultural values, lack of contraception)", "Falling death rate (improving healthcare)", "Young population (large % under 15)", "High natural increase → rapid population growth", "May experience emigration of skilled workers ('brain drain')"] } },
      ],
    },
    {
      section: "1.2 Demographic Transition Model (DTM)",
      blocks: [
        { kind: "video", youtubeId: "QsBT5EQt348", title: "Demographic Transition Model — IGCSE Geography", caption: "The 5 stages of the DTM explained with birth rates, death rates and real country examples" },
        { kind: "intro", text: "The **Demographic Transition Model (DTM)** shows how birth rates and death rates change as a country develops economically, and what this means for population size." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/DTM_original.svg/800px-DTM_original.svg.png", caption: "The Demographic Transition Model: Stage 1 (high BR/DR, stable); Stage 2 (DR falls, rapid growth); Stage 3 (BR falls, slowing growth); Stage 4 (low BR/DR, stable); Stage 5 (BR below DR, population decline).", side: "full" },
        { kind: "table", headers: ["Stage", "Birth rate", "Death rate", "Population change", "Example"], rows: [
          ["1", "High (~40‰)", "High (~40‰)", "Low and stable", "Remote tribal communities"],
          ["2", "High (stays high)", "Falls rapidly", "Rapid increase", "Many parts of Sub-Saharan Africa"],
          ["3", "Falling", "Low and stable", "Growth slowing", "Brazil, Mexico, India"],
          ["4", "Low (~12‰)", "Low (~12‰)", "High and stable/slow growth", "USA, Australia, China"],
          ["5", "Very low (below DR)", "Low", "Declining", "Germany, Japan, Italy"],
        ]},
        { kind: "tip", text: "In exams, describe the trend (use data from the graph), explain the reason for the trend, and link it to the DTM stage. Do NOT just label stages without explanation — describe what is happening to birth and death rates and WHY." },
      ],
    },
    {
      section: "1.3 Migration",
      blocks: [
        { kind: "video", youtubeId: "ager0dMGwnE", title: "Migration — IGCSE Geography (Push and Pull Factors)", caption: "Types of migration, push and pull factors, and the effects of migration on both source and destination countries" },
        { kind: "intro", text: "**Migration** is the movement of people from one place to another. It can be internal (within a country) or international (between countries), and voluntary or forced." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Global_Migration_Flows.jpg/800px-Global_Migration_Flows.jpg", caption: "Global migration flows: major corridors include South Asia → Middle East (labour migration), Central America → USA, and Africa → Europe. Colour shows origin region, line thickness shows volume.", side: "full" },
        { kind: "comparison", left: { label: "Push factors (reasons to LEAVE)", items: ["Poverty and lack of economic opportunity", "War, conflict, and political persecution", "Natural disasters (earthquakes, floods, drought)", "Environmental degradation", "Lack of healthcare or education facilities"] }, right: { label: "Pull factors (reasons to MOVE TO)", items: ["Higher wages and employment opportunities", "Better healthcare, education, and housing", "Political stability and freedom", "Family connections already in destination country", "Better climate or physical environment"] } },
        { kind: "bullets", items: [
          { text: "**Effects on SOURCE country:**", sub: ["✓ Reduces unemployment pressure on limited jobs", "✓ Remittances sent home boost family incomes and local economy", "✗ 'Brain drain' — loss of skilled and educated workers", "✗ Ageing population left behind; family separation"] },
          { text: "**Effects on DESTINATION country:**", sub: ["✓ Fills labour shortages in key sectors (agriculture, construction, healthcare)", "✓ Cultural diversity and innovation", "✗ Pressure on housing, schools, hospitals", "✗ Social tensions; language barriers; cost of integration"] },
        ]},
        { kind: "tip", text: "Always give a BALANCED answer on migration — benefits AND problems for BOTH source AND destination country. Case studies: Syrian refugee crisis (2015), Polish migration to UK (post-2004), rural-urban migration in China (300 million internal migrants)." },
      ],
    },
  ],
};

export const geographyPhysicalNotes: NoteChapter = {
  subject: "Geography",
  title: "River and Coastal Environments",
  pages: [
    {
      section: "2.1 River Processes and Landforms",
      blocks: [
        { kind: "video", youtubeId: "LKGQ4Xtummc", title: "River Processes and Landforms — IGCSE Geography (Cognito)", caption: "Erosion (HAAS), transportation, deposition, and landforms from upper to lower course — waterfalls, meanders, oxbow lakes, deltas" },
        { kind: "intro", text: "Rivers shape landscapes through **erosion**, **transportation**, and **deposition**. The dominant process changes from source (upper course) to mouth (lower course)." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/River_channel_types.jpg/800px-River_channel_types.jpg", caption: "River channel changes from source to mouth: upper course — narrow, steep, V-shaped valley; middle course — wider, meandering; lower course — very wide, flat floodplain, broad meanders and possible delta at mouth.", side: "full" },
        { kind: "highlight", text: "**Four types of river erosion (HAAS):**\n• **H**ydraulic action — force of water breaks and loosens rock from bed and banks\n• **A**brasion — rocks carried scrape and wear away the bed and banks (like sandpaper)\n• **A**ttrition — rocks carried collide with each other → break into smaller, rounder particles\n• **S**olution — soluble minerals in rock dissolve in slightly acidic river water", color: "blue" },
        { kind: "table", headers: ["Transport process", "How sediment moves", "Where common"], rows: [
          ["Traction", "Large boulders roll along river bed", "Upper course — fast flow, coarse material"],
          ["Saltation", "Pebbles bounce along bed in leaping motion", "Middle course"],
          ["Suspension", "Fine particles (silt, clay) carried within water", "Middle/lower course"],
          ["Solution", "Dissolved minerals carried invisibly in water", "All courses — especially in limestone areas"],
        ]},
        { kind: "bullets", items: [
          { text: "**Upper course landforms:**", sub: ["V-shaped valley — rapid downward erosion, steep sides", "Waterfalls — hard rock overlies soft rock; undercutting forms plunge pool; overhang collapses; retreats upstream forming gorge", "Gorges — steep, narrow valleys left as waterfall retreats"] },
          { text: "**Middle/lower course landforms:**", sub: ["Meanders — lateral erosion on outside (river cliff/undercut bank), deposition inside (slip-off slope/point bar)", "Oxbow lakes — meander cut off when river breaks through narrow neck during flood; loop abandoned", "Flood plains — flat, fertile land built up by repeated deposition when river floods its banks", "Deltas — triangular deposits of sediment at river mouth where velocity suddenly drops (e.g. Nile Delta)"] },
        ]},
        { kind: "tip", text: "For waterfall formation, learn this sequence: hard rock overlies soft rock → soft rock erodes faster → undercutting creates overhang → overhang collapses into plunge pool → waterfall retreats upstream → gorge forms. State EACH step for full marks." },
      ],
    },
    {
      section: "2.2 Coastal Processes and Landforms",
      blocks: [
        { kind: "video", youtubeId: "YKJABFxVEMs", title: "Coastal Processes and Landforms — IGCSE Geography", caption: "Constructive and destructive waves, longshore drift, headlands, bays, spits, arches and stacks explained" },
        { kind: "intro", text: "Coastal environments are shaped by wave energy. **Constructive waves** build beaches; **destructive waves** erode headlands and cliffs." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Sea_arch.jpg/800px-Sea_arch.jpg", caption: "Sea arch formed by differential erosion: waves attacked weaknesses (joints/cracks) in the headland → cave → arch. When the arch roof collapses, a stack is left isolated in the sea.", side: "right" },
        { kind: "comparison", left: { label: "Constructive waves", items: ["Long wavelength, low frequency (~6–8 per minute)", "Gentle, spilling waves", "Strong swash, weak backwash → deposits sediment", "Build beaches and spits", "Common on sheltered, low-energy coasts"] }, right: { label: "Destructive waves", items: ["Short wavelength, high frequency (~10–14 per minute)", "Steep, plunging waves", "Weak swash, strong backwash → removes sediment", "Erode cliffs and headlands", "Common on exposed, high-energy coasts"] } },
        { kind: "highlight", text: "**Longshore drift:**\nWaves approach coast at an angle → swash moves sediment up the beach at that angle → backwash pulls sediment STRAIGHT back down (gravity) → net movement of sediment along the coast\n\n**This creates:** beaches, spits (ridges extending across a bay mouth), bars (spits crossing a bay), tombolos (connecting an island to the mainland)\n\n**Groynes** are wooden barriers built perpendicular to the coast to interrupt longshore drift and trap sediment on one side.", color: "green" },
        { kind: "bullets", items: [
          { text: "**Headland and bay formation → cave → arch → stack → stump:**", sub: ["Alternating hard and soft rock bands meet the sea", "Soft rock erodes faster → bays form; hard rock protrudes → headlands", "Waves attack weaknesses (joints, bedding planes) in headland → cave forms", "Cave deepens through headland → arch forms", "Arch roof weakens and collapses → isolated pillar (stack) left in sea", "Stack erodes at base → stump left at low tide"] },
          { text: "**Coastal management strategies:**", sub: ["Hard engineering: sea walls (concrete barriers), groynes (trap sand), rock armour/rip rap, offshore breakwaters", "Soft engineering: beach nourishment (add sand), dune stabilisation, managed retreat (allow natural flooding)"] },
        ]},
        { kind: "tip", text: "Case study: Holderness Coast, East Yorkshire — fastest eroding coastline in Europe (~2m/year). Causes: glacial till (soft rock), destructive North Sea waves, longshore drift removes beach protection. Easington gas terminal protected with rock armour; Mappleton village protected with rock groynes — but this accelerated erosion south of Mappleton." },
      ],
    },
  ],
};

export const geographyHazardsNotes: NoteChapter = {
  subject: "Geography",
  title: "Tectonic Hazards and Climate",
  pages: [
    {
      section: "3.1 Tectonic Hazards",
      blocks: [
        { kind: "video", youtubeId: "dK3o4qf_a7I", title: "Plate Tectonics, Earthquakes and Volcanoes — IGCSE Geography", caption: "Types of plate boundaries, why earthquakes and volcanoes occur, their effects and management" },
        { kind: "intro", text: "**Tectonic hazards** occur because Earth's crust is divided into plates that move due to convection currents in the mantle. Earthquakes and volcanoes are concentrated at plate boundaries." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tectonic_plates.png/800px-Tectonic_plates.png", caption: "The major tectonic plates of the world. Earthquakes and volcanoes are concentrated at plate boundaries — particularly around the Pacific 'Ring of Fire' where the Pacific Plate meets surrounding plates.", side: "full" },
        { kind: "table", headers: ["Boundary type", "Plate movement", "Hazards", "Landforms"], rows: [
          ["Constructive (divergent)", "Plates move APART", "Volcanoes (basic lava, effusive), mild earthquakes", "Mid-ocean ridges, rift valleys (e.g. East African Rift)"],
          ["Destructive (convergent)", "Plates together; oceanic subducted under continental", "Powerful earthquakes, violent volcanoes, tsunamis", "Fold mountains, ocean trenches, island arcs"],
          ["Collision", "Two continental plates collide", "Very powerful earthquakes (no subduction = no volcanoes)", "Fold mountain ranges (Himalayas, Alps)"],
          ["Conservative (transform)", "Plates slide PAST each other", "Severe earthquakes (no magma → no volcanoes)", "Fault lines (San Andreas Fault, California)"],
        ]},
        { kind: "comparison", left: { label: "Earthquake impacts — LICs", items: ["Higher death tolls — poor building standards collapse", "Limited emergency services and equipment", "Slower rescue response — fewer trained personnel", "Less access to technology for early warning", "Case study: Haiti 2010 — 7.0 Mw, ~316,000 deaths"] }, right: { label: "Earthquake impacts — HICs", items: ["Lower death tolls — earthquake-proof buildings (base isolators, flexible steel frames)", "Well-equipped rapid emergency services", "Early warning systems reduce casualties", "Strict building codes enforced by government", "Case study: Japan 2011 — 9.0 Mw, ~20,000 deaths (mainly tsunami)"] } },
        { kind: "tip", text: "Compare earthquake impacts between HICs and LICs using specific data. Key contrasts: buildings (quality, codes), emergency services (speed, equipment), early warning systems, economic resources for recovery. Haiti 2010 vs Japan 2011 perfectly illustrates how development level determines impact." },
      ],
    },
    {
      section: "3.2 Climate and Ecosystems",
      blocks: [
        { kind: "video", youtubeId: "Vr4bZW21RtY", title: "Biomes and Ecosystems — IGCSE Geography", caption: "How climate determines vegetation — tropical rainforest, hot desert, savanna, and tundra adaptations explained" },
        { kind: "intro", text: "**Climate** is the long-term average weather pattern in a region. Climate and vegetation are closely linked — each major climate zone supports a distinctive ecosystem (biome)." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vegetation.png/800px-Vegetation.png", caption: "Global biome distribution: driven primarily by temperature and rainfall. Tropical rainforests near the equator; hot deserts at ~30°N/S; temperate forests in mid-latitudes; tundra near the poles.", side: "full" },
        { kind: "table", headers: ["Biome", "Climate", "Vegetation adaptations"], rows: [
          ["Tropical rainforest", "Hot (25–28°C year-round), heavy rainfall (>2000mm), no dry season", "Drip-tip leaves (shed water fast), buttress roots (support tall trees in shallow soil), epiphytes (absorb moisture from air), layered canopy structure"],
          ["Hot desert", "Very hot days (40°C+), cold nights, very low rainfall (<250mm/yr)", "Deep/spreading roots (find/store water), waxy cuticle (reduce water loss), CAM photosynthesis (open stomata at night), succulent stems (store water)"],
          ["Tropical savanna", "Hot (20–30°C), distinct wet season and dry season", "Deciduous trees (shed leaves in dry season), fire-resistant bark, long deep roots to reach water table"],
          ["Polar/tundra", "Very cold (below 0°C much of year), low precipitation, permafrost", "Cushion plant form (low to ground, resists wind), dark pigmentation (absorb heat), very short growing season, shallow roots above permafrost"],
        ]},
        { kind: "tip", text: "For ecosystem questions: name the biome → describe the climate → explain how vegetation is adapted to that climate. Always link structure to function: e.g. 'Drip-tip leaves allow water to drain quickly, reducing leaf weight and preventing algae growth in the high-rainfall tropical rainforest environment.'" },
      ],
    },
  ],
};
