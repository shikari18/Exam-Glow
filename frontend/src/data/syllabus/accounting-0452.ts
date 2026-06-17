import { SyllabusData, Subject, SyllabusObjective } from "@/types/syllabus";

const accountingSubject: Subject = {
  id: "accounting-0452",
  name: "Accounting",
  code: "0452",
  examBoard: { id: "cambridge", name: "Cambridge", code: "Cambridge" },
  displayName: "Accounting – Cambridge IGCSE (0452)",
};

const accountingObjectives: SyllabusObjective[] = [
  {
    id: "acc-1", subjectId: "accounting-0452", code: "1",
    title: "The Fundamentals of Accounting", description: "The purpose of accounting and the accounting equation", order: 1,
    subObjectives: [
      { id: "acc-1-1", subjectId: "accounting-0452", code: "1.1", title: "Purpose of Accounting", description: "Bookkeeping vs accounting; measuring profit and loss; decision-making", order: 1, parentId: "acc-1" },
      { id: "acc-1-2", subjectId: "accounting-0452", code: "1.2", title: "The Accounting Equation", description: "Understand and apply Assets = Liabilities + Owner's Equity", order: 2, parentId: "acc-1" },
    ],
  },
  {
    id: "acc-2", subjectId: "accounting-0452", code: "2",
    title: "Sources and Recording of Data", description: "Double-entry, business documents, and books of prime entry", order: 2,
    subObjectives: [
      { id: "acc-2-1", subjectId: "accounting-0452", code: "2.1", title: "Double-entry Bookkeeping", description: "Debits and credits, T-accounts, and ledger division (sales, purchases, general)", order: 1, parentId: "acc-2" },
      { id: "acc-2-2", subjectId: "accounting-0452", code: "2.2", title: "Business Documents", description: "Invoices, credit notes, receipts, debit notes, and statements of account", order: 2, parentId: "acc-2" },
      { id: "acc-2-3", subjectId: "accounting-0452", code: "2.3", title: "Books of Prime Entry", description: "Sales/purchases journals, cash book, petty cash book, and general journal", order: 3, parentId: "acc-2" },
    ],
  },
  {
    id: "acc-3", subjectId: "accounting-0452", code: "3",
    title: "Verification of Accounting Records", description: "Trial balances, correcting errors, bank reconciliations, and control accounts", order: 3,
    subObjectives: [
      { id: "acc-3-1", subjectId: "accounting-0452", code: "3.1", title: "The Trial Balance", description: "Extracting a trial balance, purpose, and limitations", order: 1, parentId: "acc-3" },
      { id: "acc-3-2", subjectId: "accounting-0452", code: "3.2", title: "Correction of Errors", description: "Types of errors, suspense accounts, and journal entries to correct errors", order: 2, parentId: "acc-3" },
      { id: "acc-3-3", subjectId: "accounting-0452", code: "3.3", title: "Bank Reconciliation", description: "Adjusted cash book, bank statement items, and bank reconciliation statement", order: 3, parentId: "acc-3" },
      { id: "acc-3-4", subjectId: "accounting-0452", code: "3.4", title: "Control Accounts", description: "Sales ledger and purchases ledger control accounts", order: 4, parentId: "acc-3" },
    ],
  },
  {
    id: "acc-4", subjectId: "accounting-0452", code: "4",
    title: "Accounting Procedures", description: "Capital vs revenue, depreciation, bad debts, accruals and prepayments", order: 4,
    subObjectives: [
      { id: "acc-4-1", subjectId: "accounting-0452", code: "4.1", title: "Capital and Revenue Expenditure", description: "Classify transactions; evaluate impact on financial statements", order: 1, parentId: "acc-4" },
      { id: "acc-4-2", subjectId: "accounting-0452", code: "4.2", title: "Depreciation and Disposal", description: "Straight-line and reducing balance methods; recording depreciation and asset disposal", order: 2, parentId: "acc-4" },
      { id: "acc-4-3", subjectId: "accounting-0452", code: "4.3", title: "Provisions and Adjustments", description: "Irrecoverable debts, provision for doubtful debts, accruals and prepayments", order: 3, parentId: "acc-4" },
    ],
  },
  {
    id: "acc-5", subjectId: "accounting-0452", code: "5",
    title: "Preparation of Financial Statements", description: "Financial statements for sole traders, partnerships, limited companies, and manufacturing", order: 5,
    subObjectives: [
      { id: "acc-5-1", subjectId: "accounting-0452", code: "5.1", title: "Sole Traders and Partnerships", description: "Trading/Profit & Loss accounts, balance sheets, appropriation accounts, current/capital accounts", order: 1, parentId: "acc-5" },
      { id: "acc-5-2", subjectId: "accounting-0452", code: "5.2", title: "Limited Companies and Manufacturing", description: "Ordinary shares, retained earnings, manufacturing prime costs, and factory overheads", order: 2, parentId: "acc-5" },
      { id: "acc-5-3", subjectId: "accounting-0452", code: "5.3", title: "Non-trading Organisations", description: "Receipts and payments, income and expenditure, and accumulated funds for clubs", order: 3, parentId: "acc-5" },
    ],
  },
  {
    id: "acc-6", subjectId: "accounting-0452", code: "6",
    title: "Analysis and Interpretation", description: "Accounting ratios, business performance, and limitations", order: 6,
    subObjectives: [
      { id: "acc-6-1", subjectId: "accounting-0452", code: "6.1", title: "Accounting Ratios", description: "Calculate profitability (margin, mark-up, ROCE), liquidity, and efficiency (turnover, collection/payment periods)", order: 1, parentId: "acc-6" },
      { id: "acc-6-2", subjectId: "accounting-0452", code: "6.2", title: "Interpretation", description: "Evaluate and compare business performance using ratios; limitations of ratio analysis", order: 2, parentId: "acc-6" },
    ],
  },
  {
    id: "acc-7", subjectId: "accounting-0452", code: "7",
    title: "Accounting Principles and Policies", description: "Going concern, consistency, prudence, accruals, and other standards", order: 7,
    subObjectives: [
      { id: "acc-7-1", subjectId: "accounting-0452", code: "7.1", title: "Core Accounting Principles", description: "Understand going concern, consistency, prudence, accruals/matching, and historical cost", order: 1, parentId: "acc-7" },
    ],
  },
];

export const accounting0452Data: SyllabusData = {
  subject: accountingSubject,
  objectives: accountingObjectives,
  notes: [],
};
