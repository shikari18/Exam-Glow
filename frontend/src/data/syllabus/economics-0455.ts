import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const economicsSubject: Subject = {
  id: "economics-0455",
  name: "Economics",
  code: "0455",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "Economics – Cambridge IGCSE (0455)",
};

const economicsObjectives: SyllabusObjective[] = [
  {
    id: "econ-1", subjectId: "economics-0455", code: "1",
    title: "The Basic Economic Problem", description: "The nature of the economic problem, factors of production, opportunity cost, and PPCs", order: 1,
    subObjectives: [
      { id: "econ-1-1", subjectId: "economics-0455", code: "1.1", title: "The Economic Problem", description: "Finite resources vs infinite wants; finite and free goods; scarcity", order: 1, parentId: "econ-1" },
      { id: "econ-1-2", subjectId: "economics-0455", code: "1.2", title: "Factors of Production", description: "Land, labour, capital, and enterprise; mobility, rewards, and quality", order: 2, parentId: "econ-1" },
      { id: "econ-1-3", subjectId: "economics-0455", code: "1.3", title: "Opportunity Cost", description: "Define and analyze opportunity cost for consumers, firms, and governments", order: 3, parentId: "econ-1" },
      { id: "econ-1-4", subjectId: "economics-0455", code: "1.4", title: "Production Possibility Curves", description: "PPCs, resource allocation, and illustrating growth or inefficiency", order: 4, parentId: "econ-1" },
    ],
  },
  {
    id: "econ-2", subjectId: "economics-0455", code: "2",
    title: "The Allocation of Resources", description: "Market systems, demand/supply, elasticities, equilibrium, and market failure", order: 2,
    subObjectives: [
      { id: "econ-2-1", subjectId: "economics-0455", code: "2.1", title: "Micro and Macro", description: "Distinction between microeconomics and macroeconomics", order: 1, parentId: "econ-2" },
      { id: "econ-2-2", subjectId: "economics-0455", code: "2.2", title: "The Price Mechanism", description: "Demand, supply, price determination, and resource allocation in markets", order: 2, parentId: "econ-2" },
      { id: "econ-2-3", subjectId: "economics-0455", code: "2.3", title: "Elasticity", description: "Price elasticity of demand (PED) and price elasticity of supply (PES); calculations and determinants", order: 3, parentId: "econ-2" },
      { id: "econ-2-4", subjectId: "economics-0455", code: "2.4", title: "Market Failure", description: "Externalities, public and merit/demerit goods, and government intervention (taxes, subsidies)", order: 4, parentId: "econ-2" },
    ],
  },
  {
    id: "econ-3", subjectId: "economics-0455", code: "3",
    title: "Microeconomic Decision Makers", description: "Money and banks, households, workers, firms, and market structures", order: 3,
    subObjectives: [
      { id: "econ-3-1", subjectId: "economics-0455", code: "3.1", title: "Money and Banking", description: "Functions of money; commercial banks vs central bank and their roles", order: 1, parentId: "econ-3" },
      { id: "econ-3-2", subjectId: "economics-0455", code: "3.2", title: "Households and Workers", description: "Household spending, saving, and borrowing; wages and occupational choices; trade unions", order: 2, parentId: "econ-3" },
      { id: "econ-3-3", subjectId: "economics-0455", code: "3.3", title: "Firms and Production", description: "Firms' objectives, growth, costs (fixed/variable), and economies/diseconomies of scale", order: 3, parentId: "econ-3" },
      { id: "econ-3-4", subjectId: "economics-0455", code: "3.4", title: "Market Structures", description: "Competitive markets, oligopoly, and monopoly; effects on price and output", order: 4, parentId: "econ-3" },
    ],
  },
  {
    id: "econ-4", subjectId: "economics-0455", code: "4",
    title: "Government and the Macroeconomy", description: "Government aims, policies (fiscal, monetary, supply-side), GDP, inflation, and unemployment", order: 4,
    subObjectives: [
      { id: "econ-4-1", subjectId: "economics-0455", code: "4.1", title: "Macroeconomic Objectives", description: "Government aims: growth, employment, price stability, and balance of payments", order: 1, parentId: "econ-4" },
      { id: "econ-4-2", subjectId: "economics-0455", code: "4.2", title: "Macroeconomic Policies", description: "Fiscal, monetary, and supply-side policies; how they affect the economy", order: 2, parentId: "econ-4" },
      { id: "econ-4-3", subjectId: "economics-0455", code: "4.3", title: "Growth, Inflation and Employment", description: "GDP growth, inflation (CPI), and types of unemployment; causes and consequences", order: 3, parentId: "econ-4" },
    ],
  },
  {
    id: "econ-5", subjectId: "economics-0455", code: "5",
    title: "Economic Development", description: "Living standards, poverty, population dynamics, and development policies", order: 5,
    subObjectives: [
      { id: "econ-5-1", subjectId: "economics-0455", code: "5.1", title: "Living Standards and Poverty", description: "GDP per capita and Human Development Index (HDI); absolute vs relative poverty", order: 1, parentId: "econ-5" },
      { id: "econ-5-2", subjectId: "economics-0455", code: "5.2", title: "Population", description: "Birth rates, death rates, migration, and the demographic transition model", order: 2, parentId: "econ-5" },
      { id: "econ-5-3", subjectId: "economics-0455", code: "5.3", title: "Development Differences", description: "Causes of development gaps and policies to promote growth in LICs", order: 3, parentId: "econ-5" },
    ],
  },
  {
    id: "econ-6", subjectId: "economics-0455", code: "6",
    title: "International Trade and Globalisation", description: "Specialisation, trade barriers, exchange rates, and balance of payments", order: 6,
    subObjectives: [
      { id: "econ-6-1", subjectId: "economics-0455", code: "6.1", title: "International Specialisation", description: "Absolute and comparative advantage; benefits and limits of free trade", order: 1, parentId: "econ-6" },
      { id: "econ-6-2", subjectId: "economics-0455", code: "6.2", title: "Protectionism and Globalisation", description: "Tariffs, quotas, subsidies; MNCs and the impacts of globalisation", order: 2, parentId: "econ-6" },
      { id: "econ-6-3", subjectId: "economics-0455", code: "6.3", title: "Exchange Rates and Balance of Payments", description: "Exchange rate determination, appreciation/depreciation; current account deficit/surplus", order: 3, parentId: "econ-6" },
    ],
  },
];

export const economics0455Data: SyllabusData = {
  subject: economicsSubject,
  objectives: economicsObjectives,
  notes: [],
};
