import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const businessSubject: Subject = {
  id: "business-studies-0450",
  name: "Business Studies",
  code: "0450",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "Business Studies – Cambridge IGCSE (0450)",
};

const businessObjectives: SyllabusObjective[] = [
  {
    id: "bus-1", subjectId: "business-studies-0450", code: "1",
    title: "Understanding Business Activity", description: "Purpose of business, sectors, types of organisation, and objectives", order: 1,
    subObjectives: [
      { id: "bus-1-1", subjectId: "business-studies-0450", code: "1.1", title: "Business Activity and Sectors", description: "Explain added value, purpose of business; primary, secondary, and tertiary sectors", order: 1, parentId: "bus-1" },
      { id: "bus-1-2", subjectId: "business-studies-0450", code: "1.2", title: "Enterprise and Size", description: "Role of entrepreneurs, measuring business size, and methods of growth", order: 2, parentId: "bus-1" },
      { id: "bus-1-3", subjectId: "business-studies-0450", code: "1.3", title: "Types of Organisation and Objectives", description: "Sole traders, partnerships, limited companies, franchises; business and stakeholder aims", order: 3, parentId: "bus-1" },
    ],
  },
  {
    id: "bus-2", subjectId: "business-studies-0450", code: "2",
    title: "People in Business", description: "Motivation theories, management structures, recruitment, and communication", order: 2,
    subObjectives: [
      { id: "bus-2-1", subjectId: "business-studies-0450", code: "2.1", title: "Motivating Workers", description: "Motivation theories (Taylor, Maslow, Herzberg); financial and non-financial rewards", order: 1, parentId: "bus-2" },
      { id: "bus-2-2", subjectId: "business-studies-0450", code: "2.2", title: "Organisation and Management", description: "Span of control, chain of command, delegation, leadership styles (autocratic, democratic, laissez-faire)", order: 2, parentId: "bus-2" },
      { id: "bus-2-3", subjectId: "business-studies-0450", code: "2.3", title: "Recruitment, Training and Communication", description: "Internal/external recruitment, training types; effective communication and barriers", order: 3, parentId: "bus-2" },
    ],
  },
  {
    id: "bus-3", subjectId: "business-studies-0450", code: "3",
    title: "Marketing", description: "Market research, the 4Ps, and marketing strategy", order: 3,
    subObjectives: [
      { id: "bus-3-1", subjectId: "business-studies-0450", code: "3.1", title: "Marketing and the Customer", description: "Mass vs niche markets, market orientation, and segmentation", order: 1, parentId: "bus-3" },
      { id: "bus-3-2", subjectId: "business-studies-0450", code: "3.2", title: "Market Research", description: "Primary and secondary research methods; qualitative vs quantitative data", order: 2, parentId: "bus-3" },
      { id: "bus-3-3", subjectId: "business-studies-0450", code: "3.3", title: "The Marketing Mix (4Ps)", description: "Product lifecycle, pricing strategies, promotion mix, and distribution channels", order: 3, parentId: "bus-3" },
    ],
  },
  {
    id: "bus-4", subjectId: "business-studies-0450", code: "4",
    title: "Operations Management", description: "Production methods, costs, break-even, quality, and location decisions", order: 4,
    subObjectives: [
      { id: "bus-4-1", subjectId: "business-studies-0450", code: "4.1", title: "Production and Costs", description: "Job, batch, flow production; lean production; fixed and variable costs; economies of scale", order: 1, parentId: "bus-4" },
      { id: "bus-4-2", subjectId: "business-studies-0450", code: "4.2", title: "Break-even and Quality", description: "Calculate break-even point and margin of safety; quality control vs quality assurance", order: 2, parentId: "bus-4" },
      { id: "bus-4-3", subjectId: "business-studies-0450", code: "4.3", title: "Location Decisions", description: "Factors influencing location of manufacturing, service, and retailing businesses", order: 3, parentId: "bus-4" },
    ],
  },
  {
    id: "bus-5", subjectId: "business-studies-0450", code: "5",
    title: "Financial Information and Decisions", description: "Sources of finance, cash flow, income statements, balance sheets, and ratios", order: 5,
    subObjectives: [
      { id: "bus-5-1", subjectId: "business-studies-0450", code: "5.1", title: "Sources of Finance and Cash Flow", description: "Internal and external sources; cash flow forecasting and managing cash flow problems", order: 1, parentId: "bus-5" },
      { id: "bus-5-2", subjectId: "business-studies-0450", code: "5.2", title: "Financial Statements", description: "Understand and interpret Income Statements and Statements of Financial Position", order: 2, parentId: "bus-5" },
      { id: "bus-5-3", subjectId: "business-studies-0450", code: "5.3", title: "Analysis of Accounts", description: "Calculate profitability ratios (gross and net profit margin, ROCE) and liquidity ratios", order: 3, parentId: "bus-5" },
    ],
  },
  {
    id: "bus-6", subjectId: "business-studies-0450", code: "6",
    title: "External Influences", description: "Economic, environmental, and ethical influences; globalisation", order: 6,
    subObjectives: [
      { id: "bus-6-1", subjectId: "business-studies-0450", code: "6.1", title: "Economic Influences", description: "Inflation, exchange rates, interest rates, unemployment, and government objectives", order: 1, parentId: "bus-6" },
      { id: "bus-6-2", subjectId: "business-studies-0450", code: "6.2", title: "Environmental and Ethical Issues", description: "CSR, green policies, ethical constraints, and sustainable development", order: 2, parentId: "bus-6" },
      { id: "bus-6-3", subjectId: "business-studies-0450", code: "6.3", title: "Globalisation and MNCs", description: "Benefits and drawbacks of globalisation; multinational companies; trade restrictions", order: 3, parentId: "bus-6" },
    ],
  },
];

export const business0450Data: SyllabusData = {
  subject: businessSubject,
  objectives: businessObjectives,
  notes: [],
};
