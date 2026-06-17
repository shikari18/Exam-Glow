import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const physicsSubject: Subject = {
  id: "physics-0625",
  name: "Physics",
  code: "0625",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "Physics – Cambridge IGCSE (0625)",
};

const physicsObjectives: SyllabusObjective[] = [
  {
    id: "phys-1", subjectId: "physics-0625", code: "1",
    title: "Motion, Forces and Energy", description: "Mechanics, motion, forces, pressure, and energy", order: 1,
    subObjectives: [
      { id: "phys-1-1", subjectId: "physics-0625", code: "1.1", title: "Physical Quantities and Measurement", description: "Use SI units; scalar and vector quantities; measuring instruments", order: 1, parentId: "phys-1" },
      { id: "phys-1-2", subjectId: "physics-0625", code: "1.2", title: "Motion", description: "Speed, velocity, acceleration; distance-time and velocity-time graphs; equations of motion", order: 2, parentId: "phys-1" },
      { id: "phys-1-3", subjectId: "physics-0625", code: "1.3", title: "Mass and Weight", description: "Distinguish between mass and weight; gravitational field strength", order: 3, parentId: "phys-1" },
      { id: "phys-1-4", subjectId: "physics-0625", code: "1.4", title: "Density", description: "Define density; calculate density using mass and volume", order: 4, parentId: "phys-1" },
      { id: "phys-1-5", subjectId: "physics-0625", code: "1.5", title: "Forces", description: "Newton's laws of motion; resultant forces; friction; elastic and inelastic deformation; Hooke's Law", order: 5, parentId: "phys-1" },
      { id: "phys-1-6", subjectId: "physics-0625", code: "1.6", title: "Momentum", description: "Calculate momentum; apply the principle of conservation of momentum", order: 6, parentId: "phys-1" },
      { id: "phys-1-7", subjectId: "physics-0625", code: "1.7", title: "Energy, Work and Power", description: "Forms of energy; energy conservation; work done; power; kinetic and potential energy", order: 7, parentId: "phys-1" },
      { id: "phys-1-8", subjectId: "physics-0625", code: "1.8", title: "Pressure", description: "Define pressure; pressure in fluids; atmospheric pressure; Bernoulli effect", order: 8, parentId: "phys-1" },
    ],
  },
  {
    id: "phys-2", subjectId: "physics-0625", code: "2",
    title: "Thermal Physics", description: "Thermal properties, heat transfer, and gas laws", order: 2,
    subObjectives: [
      { id: "phys-2-1", subjectId: "physics-0625", code: "2.1", title: "Kinetic Particle Model of Matter", description: "Explain states of matter, Brownian motion and diffusion using kinetic particle theory", order: 1, parentId: "phys-2" },
      { id: "phys-2-2", subjectId: "physics-0625", code: "2.2", title: "Thermal Properties and Temperature", description: "Thermometers; thermal expansion; specific heat capacity; specific latent heat", order: 2, parentId: "phys-2" },
      { id: "phys-2-3", subjectId: "physics-0625", code: "2.3", title: "Thermal Energy Transfers", description: "Conduction, convection, and radiation; factors affecting rate of heat transfer", order: 3, parentId: "phys-2" },
    ],
  },
  {
    id: "phys-3", subjectId: "physics-0625", code: "3",
    title: "Waves", description: "General wave properties, light, and sound", order: 3,
    subObjectives: [
      { id: "phys-3-1", subjectId: "physics-0625", code: "3.1", title: "General Wave Properties", description: "Describe waves; amplitude, frequency, wavelength and speed; transverse and longitudinal waves", order: 1, parentId: "phys-3" },
      { id: "phys-3-2", subjectId: "physics-0625", code: "3.2", title: "Light", description: "Reflection; refraction; total internal reflection; thin lenses; dispersion", order: 2, parentId: "phys-3" },
      { id: "phys-3-3", subjectId: "physics-0625", code: "3.3", title: "Electromagnetic Spectrum", description: "Properties of the EM spectrum; uses and hazards of different regions", order: 3, parentId: "phys-3" },
      { id: "phys-3-4", subjectId: "physics-0625", code: "3.4", title: "Sound", description: "Properties of sound waves; speed of sound; ultrasound applications", order: 4, parentId: "phys-3" },
    ],
  },
  {
    id: "phys-4", subjectId: "physics-0625", code: "4",
    title: "Electricity and Magnetism", description: "Electrical circuits, electromagnetism, and motors", order: 4,
    subObjectives: [
      { id: "phys-4-1", subjectId: "physics-0625", code: "4.1", title: "Simple Phenomena of Magnetism", description: "Magnetic poles; magnetic fields; induced magnetism", order: 1, parentId: "phys-4" },
      { id: "phys-4-2", subjectId: "physics-0625", code: "4.2", title: "Electrical Quantities", description: "Electric charge; current; potential difference; resistance; Ohm's Law; resistivity", order: 2, parentId: "phys-4" },
      { id: "phys-4-3", subjectId: "physics-0625", code: "4.3", title: "Electric Circuits", description: "Series and parallel circuits; circuit diagrams; EMF; internal resistance", order: 3, parentId: "phys-4" },
      { id: "phys-4-4", subjectId: "physics-0625", code: "4.4", title: "Electrical Safety", description: "Mains electricity; fuses; earth wires; double insulation; electrical energy and power", order: 4, parentId: "phys-4" },
      { id: "phys-4-5", subjectId: "physics-0625", code: "4.5", title: "Electromagnetic Effects", description: "Electromagnetic induction; AC generators; transformers; the national grid", order: 5, parentId: "phys-4" },
      { id: "phys-4-6", subjectId: "physics-0625", code: "4.6", title: "Magnetic Effect of a Current", description: "Magnetic fields due to currents; the motor effect; DC motors", order: 6, parentId: "phys-4" },
    ],
  },
  {
    id: "phys-5", subjectId: "physics-0625", code: "5",
    title: "Nuclear Physics", description: "Atomic structure, radioactivity, and nuclear energy", order: 5,
    subObjectives: [
      { id: "phys-5-1", subjectId: "physics-0625", code: "5.1", title: "The Nuclear Model of the Atom", description: "Protons, neutrons, electrons; atomic number and mass number; isotopes", order: 1, parentId: "phys-5" },
      { id: "phys-5-2", subjectId: "physics-0625", code: "5.2", title: "Radioactivity", description: "Alpha, beta and gamma radiation; properties; nuclear equations; half-life; background radiation", order: 2, parentId: "phys-5" },
      { id: "phys-5-3", subjectId: "physics-0625", code: "5.3", title: "Nuclear Fission and Fusion", description: "Describe nuclear fission and fusion; E = mc²; nuclear reactors", order: 3, parentId: "phys-5" },
    ],
  },
  {
    id: "phys-6", subjectId: "physics-0625", code: "6",
    title: "Space Physics", description: "The Solar System, stars, and the universe", order: 6,
    subObjectives: [
      { id: "phys-6-1", subjectId: "physics-0625", code: "6.1", title: "Earth and the Solar System", description: "Describe the Solar System; orbital motion; gravity; satellites", order: 1, parentId: "phys-6" },
      { id: "phys-6-2", subjectId: "physics-0625", code: "6.2", title: "Stars and the Universe", description: "Life cycle of a star; the Big Bang theory; red shift and expanding universe", order: 2, parentId: "phys-6" },
    ],
  },
];

export const physics0625Data: SyllabusData = {
  subject: physicsSubject,
  objectives: physicsObjectives,
  notes: [],
};
