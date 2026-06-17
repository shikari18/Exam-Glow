import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const geographySubject: Subject = {
  id: "geography-0460",
  name: "Geography",
  code: "0460",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "Geography – Cambridge IGCSE (0460)",
};

const geographyObjectives: SyllabusObjective[] = [
  {
    id: "geog-1", subjectId: "geography-0460", code: "1",
    title: "Population and Settlement", description: "Population dynamics, migration, population structure, and settlement patterns", order: 1,
    subObjectives: [
      { id: "geog-1-1", subjectId: "geography-0460", code: "1.1", title: "Population Dynamics", description: "Birth and death rates, population growth trends, over/underpopulation, and policies", order: 1, parentId: "geog-1" },
      { id: "geog-1-2", subjectId: "geography-0460", code: "1.2", title: "Migration", description: "Push and pull factors, internal and international migration, and its impacts", order: 2, parentId: "geog-1" },
      { id: "geog-1-3", subjectId: "geography-0460", code: "1.3", title: "Population Structure", description: "Age-sex pyramids, dependency ratios, and youthful/ageing populations", order: 3, parentId: "geog-1" },
      { id: "geog-1-4", subjectId: "geography-0460", code: "1.4", title: "Settlement and Services", description: "Urban patterns, city zones, problems of urbanisation, and solutions", order: 4, parentId: "geog-1" },
    ],
  },
  {
    id: "geog-2", subjectId: "geography-0460", code: "2",
    title: "The Natural Environment", description: "Plate tectonics, river systems, coastal processes, weather, and climate", order: 2,
    subObjectives: [
      { id: "geog-2-1", subjectId: "geography-0460", code: "2.1", title: "Plate Tectonics", description: "Plate boundaries, earthquakes, volcanoes, and tsunamis; hazards and management", order: 1, parentId: "geog-2" },
      { id: "geog-2-2", subjectId: "geography-0460", code: "2.2", title: "Rivers and Water", description: "Drainage basins, river landforms (valleys, waterfalls, meanders), flooding and management", order: 2, parentId: "geog-2" },
      { id: "geog-2-3", subjectId: "geography-0460", code: "2.3", title: "Coasts", description: "Coastal erosion, transport, deposition, landforms, and coastal protection", order: 3, parentId: "geog-2" },
      { id: "geog-2-4", subjectId: "geography-0460", code: "2.4", title: "Weather and Climate", description: "Weather instruments, climate zones, rainforests and deserts, and climate change", order: 4, parentId: "geog-2" },
    ],
  },
  {
    id: "geog-3", subjectId: "geography-0460", code: "3",
    title: "Economic Development", description: "Development indicators, agriculture, industry, tourism, energy, and water resources", order: 3,
    subObjectives: [
      { id: "geog-3-1", subjectId: "geography-0460", code: "3.1", title: "Development and Industry", description: "Measuring development; classification of industries; location factors", order: 1, parentId: "geog-3" },
      { id: "geog-3-2", subjectId: "geography-0460", code: "3.2", title: "Food Production and Tourism", description: "Agricultural systems, food shortages; growth and impacts of tourism", order: 2, parentId: "geog-3" },
      { id: "geog-3-3", subjectId: "geography-0460", code: "3.3", title: "Energy and Water", description: "Renewable vs non-renewable energy; water supply, demand, and environmental management", order: 3, parentId: "geog-3" },
    ],
  },
];

export const geography0460Data: SyllabusData = {
  subject: geographySubject,
  objectives: geographyObjectives,
  notes: [],
};
