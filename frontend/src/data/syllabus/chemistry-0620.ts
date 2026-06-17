import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const chemistrySubject: Subject = {
  id: "chemistry-0620",
  name: "Chemistry",
  code: "0620",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "Chemistry – Cambridge IGCSE (0620)",
};

const chemistryObjectives: SyllabusObjective[] = [
  {
    id: "chem-1", subjectId: "chemistry-0620", code: "1",
    title: "The Particulate Nature of Matter", description: "States of matter and kinetic particle theory", order: 1,
    subObjectives: [
      { id: "chem-1-1", subjectId: "chemistry-0620", code: "1.1", title: "States of Matter", description: "Describe the three states of matter and their properties in terms of arrangement, movement and energy of particles", order: 1, parentId: "chem-1" },
      { id: "chem-1-2", subjectId: "chemistry-0620", code: "1.2", title: "Kinetic Particle Theory", description: "Explain changes of state and properties of gases using the kinetic particle theory", order: 2, parentId: "chem-1" },
      { id: "chem-1-3", subjectId: "chemistry-0620", code: "1.3", title: "Diffusion", description: "Describe and explain diffusion in terms of particle movement", order: 3, parentId: "chem-1" },
    ],
  },
  {
    id: "chem-2", subjectId: "chemistry-0620", code: "2",
    title: "Experimental Techniques and Chemical Analysis", description: "Experimental methods, apparatus and chemical analysis techniques", order: 2,
    subObjectives: [
      { id: "chem-2-1", subjectId: "chemistry-0620", code: "2.1", title: "Measurement", description: "Use appropriate apparatus and measurement techniques", order: 1, parentId: "chem-2" },
      { id: "chem-2-2", subjectId: "chemistry-0620", code: "2.2", title: "Criteria of Purity", description: "Describe and explain melting and boiling points as criteria of purity", order: 2, parentId: "chem-2" },
      { id: "chem-2-3", subjectId: "chemistry-0620", code: "2.3", title: "Methods of Purification", description: "Describe and explain filtration, crystallisation, simple distillation, fractional distillation and chromatography", order: 3, parentId: "chem-2" },
      { id: "chem-2-4", subjectId: "chemistry-0620", code: "2.4", title: "Identification of Ions and Gases", description: "Identify cations, anions, and gases using chemical tests", order: 4, parentId: "chem-2" },
    ],
  },
  {
    id: "chem-3", subjectId: "chemistry-0620", code: "3",
    title: "Atoms, Elements and Compounds", description: "Atomic structure, the Periodic Table and bonding", order: 3,
    subObjectives: [
      { id: "chem-3-1", subjectId: "chemistry-0620", code: "3.1", title: "Atomic Structure and the Periodic Table", description: "Describe the structure of atoms; protons, neutrons, electrons, atomic number and mass number", order: 1, parentId: "chem-3" },
      { id: "chem-3-2", subjectId: "chemistry-0620", code: "3.2", title: "Isotopes", description: "Describe isotopes as atoms of the same element with different numbers of neutrons", order: 2, parentId: "chem-3" },
      { id: "chem-3-3", subjectId: "chemistry-0620", code: "3.3", title: "Ionic Bonding", description: "Describe ionic bonding as electrostatic attraction between oppositely charged ions", order: 3, parentId: "chem-3" },
      { id: "chem-3-4", subjectId: "chemistry-0620", code: "3.4", title: "Covalent Bonding", description: "Describe covalent bonding in terms of shared pairs of electrons", order: 4, parentId: "chem-3" },
      { id: "chem-3-5", subjectId: "chemistry-0620", code: "3.5", title: "Metallic Bonding", description: "Describe metallic bonding as lattice of positive ions surrounded by delocalised electrons", order: 5, parentId: "chem-3" },
    ],
  },
  {
    id: "chem-4", subjectId: "chemistry-0620", code: "4",
    title: "Stoichiometry", description: "The mole concept and chemical calculations", order: 4,
    subObjectives: [
      { id: "chem-4-1", subjectId: "chemistry-0620", code: "4.1", title: "Relative Atomic Mass", description: "Define relative atomic mass (Ar) and relative molecular mass (Mr)", order: 1, parentId: "chem-4" },
      { id: "chem-4-2", subjectId: "chemistry-0620", code: "4.2", title: "The Mole Concept", description: "Use the mole concept to calculate reacting masses, volumes of gases and solutions", order: 2, parentId: "chem-4" },
      { id: "chem-4-3", subjectId: "chemistry-0620", code: "4.3", title: "Chemical Formulae and Equations", description: "Write and balance chemical equations, calculate empirical and molecular formulae", order: 3, parentId: "chem-4" },
    ],
  },
  {
    id: "chem-5", subjectId: "chemistry-0620", code: "5",
    title: "Electricity and Chemistry", description: "Electrolysis and electrochemical cells", order: 5,
    subObjectives: [
      { id: "chem-5-1", subjectId: "chemistry-0620", code: "5.1", title: "Electrolysis", description: "Describe electrolysis as decomposition by electricity; predict products at electrodes", order: 1, parentId: "chem-5" },
      { id: "chem-5-2", subjectId: "chemistry-0620", code: "5.2", title: "Electroplating", description: "Describe the process of electroplating and its uses", order: 2, parentId: "chem-5" },
      { id: "chem-5-3", subjectId: "chemistry-0620", code: "5.3", title: "Hydrogen–Oxygen Fuel Cell", description: "Describe the operation of a hydrogen–oxygen fuel cell", order: 3, parentId: "chem-5" },
    ],
  },
  {
    id: "chem-6", subjectId: "chemistry-0620", code: "6",
    title: "Chemical Energetics", description: "Energy changes in chemical reactions", order: 6,
    subObjectives: [
      { id: "chem-6-1", subjectId: "chemistry-0620", code: "6.1", title: "Exothermic and Endothermic Reactions", description: "Describe exothermic and endothermic reactions and draw energy profile diagrams", order: 1, parentId: "chem-6" },
      { id: "chem-6-2", subjectId: "chemistry-0620", code: "6.2", title: "Bond Energies", description: "Use bond energy values to calculate energy changes in reactions", order: 2, parentId: "chem-6" },
    ],
  },
  {
    id: "chem-7", subjectId: "chemistry-0620", code: "7",
    title: "Chemical Reactions", description: "Rates of reaction, reversibility and redox reactions", order: 7,
    subObjectives: [
      { id: "chem-7-1", subjectId: "chemistry-0620", code: "7.1", title: "Physical and Chemical Changes", description: "Distinguish between physical and chemical changes", order: 1, parentId: "chem-7" },
      { id: "chem-7-2", subjectId: "chemistry-0620", code: "7.2", title: "Rate of Reaction", description: "Describe the effects of concentration, temperature, particle size and catalysts on reaction rate", order: 2, parentId: "chem-7" },
      { id: "chem-7-3", subjectId: "chemistry-0620", code: "7.3", title: "Reversible Reactions and Equilibrium", description: "Describe reversible reactions and dynamic equilibrium; apply Le Chatelier's principle", order: 3, parentId: "chem-7" },
      { id: "chem-7-4", subjectId: "chemistry-0620", code: "7.4", title: "Redox Reactions", description: "Define oxidation and reduction in terms of oxygen/hydrogen transfer and electron transfer (OIL RIG)", order: 4, parentId: "chem-7" },
    ],
  },
  {
    id: "chem-8", subjectId: "chemistry-0620", code: "8",
    title: "Acids, Bases and Salts", description: "Properties of acids, bases, and salt preparation", order: 8,
    subObjectives: [
      { id: "chem-8-1", subjectId: "chemistry-0620", code: "8.1", title: "Acids and Bases", description: "Define acids and bases in terms of proton transfer and the pH scale; describe indicators", order: 1, parentId: "chem-8" },
      { id: "chem-8-2", subjectId: "chemistry-0620", code: "8.2", title: "Preparation of Salts", description: "Describe methods for preparing salts: neutralisation, precipitation, and reaction with acid", order: 2, parentId: "chem-8" },
      { id: "chem-8-3", subjectId: "chemistry-0620", code: "8.3", title: "Oxides", description: "Classify oxides as acidic, basic, amphoteric or neutral and describe their reactions", order: 3, parentId: "chem-8" },
    ],
  },
  {
    id: "chem-9", subjectId: "chemistry-0620", code: "9",
    title: "The Periodic Table", description: "Trends and properties of elements in the Periodic Table", order: 9,
    subObjectives: [
      { id: "chem-9-1", subjectId: "chemistry-0620", code: "9.1", title: "Organisation of the Periodic Table", description: "Describe the arrangement of elements in groups and periods, and trends across periods", order: 1, parentId: "chem-9" },
      { id: "chem-9-2", subjectId: "chemistry-0620", code: "9.2", title: "Group I – Alkali Metals", description: "Describe properties and reactions of Group I metals and trends down the group", order: 2, parentId: "chem-9" },
      { id: "chem-9-3", subjectId: "chemistry-0620", code: "9.3", title: "Group VII – Halogens", description: "Describe properties and reactions of halogens and trends down the group", order: 3, parentId: "chem-9" },
      { id: "chem-9-4", subjectId: "chemistry-0620", code: "9.4", title: "Group 0 – Noble Gases", description: "Describe the properties of noble gases and explain their lack of reactivity", order: 4, parentId: "chem-9" },
      { id: "chem-9-5", subjectId: "chemistry-0620", code: "9.5", title: "Transition Elements", description: "Describe properties of transition elements including catalytic activity and coloured compounds", order: 5, parentId: "chem-9" },
    ],
  },
  {
    id: "chem-10", subjectId: "chemistry-0620", code: "10",
    title: "Metals", description: "Reactivity, extraction, and uses of metals", order: 10,
    subObjectives: [
      { id: "chem-10-1", subjectId: "chemistry-0620", code: "10.1", title: "Properties of Metals", description: "Describe general physical and chemical properties of metals", order: 1, parentId: "chem-10" },
      { id: "chem-10-2", subjectId: "chemistry-0620", code: "10.2", title: "Reactivity Series", description: "Use the reactivity series to predict reactions of metals with water, steam, dilute acids, and salt solutions", order: 2, parentId: "chem-10" },
      { id: "chem-10-3", subjectId: "chemistry-0620", code: "10.3", title: "Extraction of Metals", description: "Describe the extraction of metals by reduction with carbon and electrolysis (aluminium)", order: 3, parentId: "chem-10" },
      { id: "chem-10-4", subjectId: "chemistry-0620", code: "10.4", title: "Alloys", description: "Explain why alloys are harder than pure metals and describe uses of alloys", order: 4, parentId: "chem-10" },
      { id: "chem-10-5", subjectId: "chemistry-0620", code: "10.5", title: "Corrosion of Metals", description: "Describe rusting of iron and methods of rust prevention including sacrificial protection", order: 5, parentId: "chem-10" },
    ],
  },
  {
    id: "chem-11", subjectId: "chemistry-0620", code: "11",
    title: "Air and Water", description: "Composition of air, water treatment, and the environment", order: 11,
    subObjectives: [
      { id: "chem-11-1", subjectId: "chemistry-0620", code: "11.1", title: "Air", description: "Describe the composition of clean, dry air and reactions of gases in the air", order: 1, parentId: "chem-11" },
      { id: "chem-11-2", subjectId: "chemistry-0620", code: "11.2", title: "Water", description: "Describe the treatment of water for drinking and the tests for water purity", order: 2, parentId: "chem-11" },
      { id: "chem-11-3", subjectId: "chemistry-0620", code: "11.3", title: "Pollution", description: "Describe causes and effects of air pollution including acid rain, greenhouse effect and ozone depletion", order: 3, parentId: "chem-11" },
    ],
  },
  {
    id: "chem-12", subjectId: "chemistry-0620", code: "12",
    title: "Sulfur", description: "The chemistry of sulfur and its compounds", order: 12,
    subObjectives: [
      { id: "chem-12-1", subjectId: "chemistry-0620", code: "12.1", title: "Sulfur and Its Compounds", description: "Describe the properties and uses of sulfur dioxide and sulfuric acid; the Contact Process", order: 1, parentId: "chem-12" },
    ],
  },
  {
    id: "chem-13", subjectId: "chemistry-0620", code: "13",
    title: "Carbonates", description: "The chemistry of carbon and carbonates", order: 13,
    subObjectives: [
      { id: "chem-13-1", subjectId: "chemistry-0620", code: "13.1", title: "Carbon", description: "Describe the allotropes of carbon (diamond, graphite, fullerenes) and their properties", order: 1, parentId: "chem-13" },
      { id: "chem-13-2", subjectId: "chemistry-0620", code: "13.2", title: "Carbonates", description: "Describe the thermal decomposition and reactions of carbonates", order: 2, parentId: "chem-13" },
    ],
  },
  {
    id: "chem-14", subjectId: "chemistry-0620", code: "14",
    title: "Organic Chemistry", description: "Hydrocarbons, polymers and organic reactions", order: 14,
    subObjectives: [
      { id: "chem-14-1", subjectId: "chemistry-0620", code: "14.1", title: "Introduction to Organic Chemistry", description: "Understand the principles of organic chemistry: homologous series, functional groups, general formulae", order: 1, parentId: "chem-14" },
      { id: "chem-14-2", subjectId: "chemistry-0620", code: "14.2", title: "Alkanes", description: "Describe the properties and reactions of alkanes; fractional distillation of crude oil", order: 2, parentId: "chem-14" },
      { id: "chem-14-3", subjectId: "chemistry-0620", code: "14.3", title: "Alkenes", description: "Describe the properties and reactions of alkenes including addition reactions and polymerisation", order: 3, parentId: "chem-14" },
      { id: "chem-14-4", subjectId: "chemistry-0620", code: "14.4", title: "Alcohols", description: "Describe the structure and properties of ethanol; fermentation and industrial production", order: 4, parentId: "chem-14" },
      { id: "chem-14-5", subjectId: "chemistry-0620", code: "14.5", title: "Carboxylic Acids", description: "Describe the properties and reactions of ethanoic acid", order: 5, parentId: "chem-14" },
      { id: "chem-14-6", subjectId: "chemistry-0620", code: "14.6", title: "Polymers", description: "Describe addition and condensation polymerisation; uses and environmental impact of polymers", order: 6, parentId: "chem-14" },
    ],
  },
];

export const chemistry0620Data: SyllabusData = {
  subject: chemistrySubject,
  objectives: chemistryObjectives,
  notes: [],
};
