import type { NoteChapter } from "./types";

export const biologyEcologyNotes: NoteChapter = {
  subject: "Biology",
  title: "Ecology & Environment",
  pages: [
    {
      section: "8.1 Ecosystems & Food Chains",
      blocks: [
        {
          kind: "keyterms",
          terms: [
            { label: "Habitat", value: "the place where an organism lives" },
            { label: "Population", value: "all organisms of one species in an area" },
            { label: "Community", value: "all populations of different species living in an area" },
            { label: "Ecosystem", value: "the community plus the non-living (abiotic) environment" },
            { label: "Producer", value: "an organism that makes its own food by photosynthesis (plants, algae)" },
            { label: "Consumer", value: "an organism that obtains energy by eating other organisms" },
          ],
        },
        {
          kind: "highlight",
          text: "Food chain: shows feeding relationships and direction of energy transfer.\nArrow means 'is eaten by' / 'energy flows to'\nExample: grass → rabbit → fox → decomposer",
          color: "green",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Energy transfer between trophic levels:",
              sub: [
                "Only ~10% of energy is transferred to the next trophic level",
                "~90% is lost through: respiration (heat), movement, excretion, parts not eaten",
                "This is why food chains rarely have more than 4-5 levels",
                "Pyramid of biomass: shows dry mass at each level — almost always pyramid-shaped",
                "Pyramid of numbers: can be inverted (e.g. one oak tree → many caterpillars → few birds)",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "**Pyramid of biomass:**\n• Each level (trophic level) has LESS biomass than the one below\n• Energy is lost at each level as heat (respiration), waste, and uneaten material\n• Only ~10% of energy passes from one trophic level to the next\n• This is why food chains rarely have more than 4–5 levels — too little energy remains",
          color: "green",
        },
      ],
    },
    {
      section: "8.2 Nutrient Cycles",
      blocks: [
        {
          kind: "intro",
          text: "Nutrients are recycled through ecosystems. The carbon cycle and nitrogen cycle are the most important for IGCSE.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "The Carbon Cycle:",
              sub: [
                "CO₂ removed from atmosphere by: photosynthesis (plants), dissolving in oceans",
                "CO₂ added to atmosphere by: respiration (all organisms), combustion (burning fossil fuels/wood), decomposition",
                "Carbon stored in: fossil fuels, wood, shells (calcium carbonate), soil organic matter",
                "Deforestation increases atmospheric CO₂ (less photosynthesis + burning releases stored carbon)",
              ],
            },
            {
              text: "The Nitrogen Cycle:",
              sub: [
                "Nitrogen fixation: N₂ → NH₃/NH₄⁺ by nitrogen-fixing bacteria (in soil or root nodules of legumes)",
                "Nitrification: NH₄⁺ → NO₂⁻ → NO₃⁻ by nitrifying bacteria in soil",
                "Assimilation: plants absorb NO₃⁻ and use it to make amino acids and proteins",
                "Decomposition: dead organisms → NH₄⁺ by decomposers (bacteria and fungi)",
                "Denitrification: NO₃⁻ → N₂ by denitrifying bacteria (in waterlogged soil)",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "Legumes (peas, beans, clover) have nitrogen-fixing bacteria in root nodules. This is why farmers rotate crops — legumes restore soil nitrogen naturally, reducing the need for fertilisers.",
        },
      ],
    },
    {
      section: "8.3 Human Impacts on Ecosystems",
      blocks: [
        {
          kind: "table",
          headers: ["Human activity", "Environmental impact", "Consequence"],
          rows: [
            ["Deforestation", "Habitat loss, reduced photosynthesis, soil erosion", "Biodiversity loss, increased CO₂, flooding"],
            ["Burning fossil fuels", "Increased CO₂ and SO₂/NOₓ", "Global warming, acid rain"],
            ["Fertiliser runoff", "Eutrophication of water bodies", "Algal bloom → oxygen depletion → fish death"],
            ["Pesticide use", "Bioaccumulation in food chains", "Top predators most affected (e.g. DDT in birds of prey)"],
            ["Overfishing", "Collapse of fish populations", "Loss of biodiversity, food chain disruption"],
            ["Plastic pollution", "Ingestion by wildlife, microplastics in food chain", "Wildlife death, human health concerns"],
          ],
        },
        {
          kind: "definition",
          term: "Eutrophication",
          definition: "excess fertilisers (nitrates/phosphates) run into water → algal bloom → blocks light → aquatic plants die → decomposers multiply → use up O₂ → fish and other organisms die (deoxygenation).",
        },
        {
          kind: "highlight",
          text: "Bioaccumulation: toxic substances (e.g. DDT, mercury) are not broken down and accumulate in organisms. Concentration increases at each trophic level — top predators have the highest concentrations.",
          color: "pink",
        },
      ],
    },
    {
      section: "8.4 Conservation & Biodiversity",
      blocks: [
        {
          kind: "definition",
          term: "Biodiversity",
          definition: "the variety of different species in an ecosystem. High biodiversity makes ecosystems more stable and resilient to change.",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Why biodiversity is important:",
              sub: [
                "Ecosystem stability — more species = more resilient to disturbance",
                "Food security — diverse crops are more resistant to disease",
                "Medicine — many drugs derived from wild species (e.g. aspirin from willow bark)",
                "Ecosystem services — pollination, water purification, carbon storage",
              ],
            },
            {
              text: "Conservation methods:",
              sub: [
                "Protected areas (national parks, nature reserves) — preserve habitats",
                "Captive breeding programmes — breed endangered species in zoos, then reintroduce",
                "Seed banks — store seeds of endangered plant species",
                "Sustainable fishing — quotas, mesh size regulations, no-take zones",
                "Reforestation — planting trees to restore habitats and absorb CO₂",
                "International agreements — CITES (trade in endangered species), Paris Agreement (climate)",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Sustainable development: meeting the needs of the present without compromising the ability of future generations to meet their own needs. Balances economic development with environmental protection.",
          color: "green",
        },
      ],
    },
    {
      section: "8.5 Global Warming & Climate Change",
      blocks: [
        {
          kind: "bullets",
          items: [
            {
              text: "Greenhouse gases and their sources:",
              sub: [
                "CO₂: burning fossil fuels, deforestation, respiration",
                "Methane (CH₄): cattle digestion, rice paddies, landfill, natural gas leaks",
                "Water vapour: evaporation (natural)",
                "Nitrous oxide (N₂O): fertilisers, livestock",
              ],
            },
            {
              text: "Consequences of global warming:",
              sub: [
                "Rising sea levels (melting ice caps + thermal expansion of oceans)",
                "More extreme weather events (storms, droughts, floods)",
                "Habitat loss — coral bleaching, Arctic/Antarctic ecosystem disruption",
                "Species extinction — organisms cannot adapt fast enough",
                "Disruption of food chains and agricultural systems",
                "Spread of tropical diseases to new regions",
              ],
            },
          ],
        },
        {
          kind: "comparison",
          left: {
            label: "Reducing greenhouse gas emissions",
            items: [
              "Renewable energy (solar, wind, hydro)",
              "Electric vehicles",
              "Energy efficiency improvements",
              "Reducing deforestation",
              "Plant-based diets (less livestock)",
            ],
          },
          right: {
            label: "Carbon capture & adaptation",
            items: [
              "Reforestation and afforestation",
              "Carbon capture and storage (CCS)",
              "Sea walls and flood defences",
              "Drought-resistant crop varieties",
              "International climate agreements",
            ],
          },
      ],
    },
  ],
};
