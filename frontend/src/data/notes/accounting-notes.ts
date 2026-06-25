import type { NoteChapter } from "./types";

export const accountingDoubleEntryNotes: NoteChapter = {
  subject: "Accounting",
  title: "Double Entry Bookkeeping",
  pages: [
    {
      section: "1.1 The Accounting Equation & Double Entry",
      blocks: [
        { kind: "video", youtubeId: "_HK5gpg39pY", title: "Double Entry Bookkeeping — IGCSE Accounting", caption: "Understanding debits, credits and the accounting equation with worked T-account examples" },
        { kind: "intro", text: "**Double entry bookkeeping** records every financial transaction in TWO accounts — a debit in one and an equal credit in another. This keeps the **accounting equation** always balanced." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Principles_of_Accounting.jpg/800px-Principles_of_Accounting.jpg", caption: "The foundation of accounting: every business transaction affects at least two accounts, always keeping Assets = Capital + Liabilities in perfect balance.", side: "full" },
        { kind: "highlight", text: "**The Accounting Equation:**\n\nAssets = Capital + Liabilities\n\nor equivalently:\n\nCapital = Assets − Liabilities\n\nThis equation MUST balance after EVERY single transaction.", color: "blue" },
        { kind: "keyterms", terms: [
          { label: "Asset", value: "Something the business OWNS or is OWED (cash, machinery, inventory, trade receivables, bank, premises)." },
          { label: "Liability", value: "Something the business OWES to others (bank loan, trade payables, accruals, debentures)." },
          { label: "Capital (Owner's Equity)", value: "Owner's investment in the business = Assets − Liabilities. Increases with profit; decreases with drawings and losses." },
          { label: "Debit (DR)", value: "Entry on the LEFT side of a T-account. Increases assets and expenses; decreases liabilities, capital, and income." },
          { label: "Credit (CR)", value: "Entry on the RIGHT side of a T-account. Increases liabilities, capital, and income; decreases assets and expenses." },
        ]},
        { kind: "highlight", text: "**Memory aid — DEAD CLIC:**\n**D**rawings — Debit increases\n**E**xpenses — Debit increases\n**A**ssets — Debit increases\n**D**ebit side increases these\n\n**C**apital — Credit increases\n**L**iabilities — Credit increases\n**I**ncome — Credit increases\n**C**redit side increases these", color: "pink" },
        { kind: "table", headers: ["Account type", "Debit (DR) increases", "Credit (CR) increases", "Examples"], rows: [
          ["Asset", "✓ YES", "✗ NO", "Cash, Bank, Machinery, Trade receivables, Inventory, Premises"],
          ["Liability", "✗ NO", "✓ YES", "Bank loan, Trade payables, Accruals, Mortgage"],
          ["Capital", "✗ NO", "✓ YES", "Owner's capital account"],
          ["Income / Revenue", "✗ NO", "✓ YES", "Sales, Rent received, Commission received"],
          ["Expense", "✓ YES", "✗ NO", "Wages, Rent paid, Insurance, Electricity, Depreciation"],
          ["Drawings", "✓ YES", "✗ NO", "Cash/goods taken by owner for personal use"],
        ]},
        { kind: "warning", text: "Common mistake: confusing Bank and Trade Payables. When you PAY a creditor by cheque:\n• Debit Trade Payables (liability decreases — you owe less)\n• Credit Bank (asset decreases — you have less cash)\nNOT the other way round." },
        { kind: "tip", text: "For every transaction: (1) Which TWO accounts are affected? (2) Does each increase or decrease? (3) Apply DEAD CLIC to decide debit or credit." },
      ],
    },
    {
      section: "1.2 Ledger Accounts and the Journal",
      blocks: [
        { kind: "video", youtubeId: "VhD_HFSJbRo", title: "Ledger Accounts & T-Accounts — IGCSE Accounting", caption: "How to record transactions in T-accounts, balance ledger accounts, and use the journal as a book of prime entry" },
        { kind: "intro", text: "All transactions are first recorded in the **journal** (book of original entry), then posted to **ledger accounts** (T-accounts). The ledger is organised into: Sales Ledger (customers), Purchases Ledger (suppliers), and General Ledger (all other accounts)." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Ledger-T-Account.png/600px-Ledger-T-Account.png", caption: "A T-Account (ledger account): debit entries on the left, credit entries on the right. The balance is the difference between the two sides — carried down (c/d) and brought down (b/d).", side: "right" },
        { kind: "highlight", text: "**T-Account structure:**\n\n       Dr  |  Account Name  |  Cr\n──────────────────────────────────\nDate Details £   |  Date Details £\n\nBalance c/d = closing balance\nBalance b/d = opening balance for next period", color: "blue" },
        { kind: "bullets", items: [
          { text: "**Journal entry format:**", sub: ["Date | Account DEBITED | Amount (£)", "Date | Account CREDITED (indented) | Amount (£)", "Narrative: brief explanation of transaction"] },
          { text: "**Source documents (evidence for transactions):**", sub: ["Sales invoice → records a credit sale (money owed to us)", "Purchase invoice → records a credit purchase (money we owe)", "Credit note → records a return (reduces amount owed)", "Receipt → records cash received", "Cheque counterfoil → records cash/cheque paid out"] },
        ]},
        { kind: "tip", text: "The journal is used for: opening entries, closing entries, corrections of errors, purchase/sale of non-current assets on credit. It is NOT used for cash transactions (those go in the cash book) or credit sales/purchases (those go in the respective day books)." },
      ],
    },
    {
      section: "1.3 Trial Balance",
      blocks: [
        { kind: "video", youtubeId: "Pj4QPiHB7HM", title: "Trial Balance — IGCSE Accounting", caption: "How to prepare a trial balance and identify errors it reveals versus errors it cannot detect" },
        { kind: "intro", text: "The **Trial Balance** is a list of all ledger account balances at a point in time. Total debits MUST equal total credits. It is NOT a financial statement — it checks for arithmetic errors only." },
        { kind: "highlight", text: "**Trial balance format:**\n\nAccount Name          | Dr (£) | Cr (£)\n──────────────────────────────────────\nPremises              |  50,000 |\nMachinery             |  20,000 |\nBank                  |   5,000 |\nInventory             |   8,000 |\nTrade receivables     |   4,000 |\nCapital               |         |  60,000\nBank loan             |         |  15,000\nTrade payables        |         |   6,000\nSales                 |         |  40,000\nWages                 |  20,000 |\nRent paid             |  14,000 |\n──────────────────────────────────────\nTOTAL                 | 121,000 | 121,000 ✓", color: "blue" },
        { kind: "comparison", left: { label: "Errors REVEALED by trial balance", items: ["Single entry (one side of double entry missing)", "Posting to wrong side of an account", "Arithmetic error in balancing a ledger account", "Account balance omitted from trial balance"] }, right: { label: "Errors NOT revealed (trial balance still balances)", items: ["Omission: transaction not recorded at all", "Commission: correct amount, wrong person's account", "Principle: revenue/capital expenditure confused", "Compensating: two equal and opposite errors cancel out", "Reversal: debit and credit entries swapped but equal"] } },
        { kind: "warning", text: "A balanced trial balance does NOT mean the accounts are error-free. Errors of omission, commission, principle, original entry, reversal, and compensating errors pass undetected." },
      ],
    },
  ],
};

export const accountingFinancialStatementsNotes: NoteChapter = {
  subject: "Accounting",
  title: "Financial Statements",
  pages: [
    {
      section: "2.1 Income Statement (Profit & Loss Account)",
      blocks: [
        { kind: "video", youtubeId: "FiLDYrQGOCw", title: "Income Statement — IGCSE Accounting", caption: "Preparing an income statement step-by-step: revenue, cost of sales, gross profit and net profit" },
        { kind: "intro", text: "The **Income Statement** shows the revenue earned and expenses incurred over a period, resulting in net profit or net loss." },
        { kind: "highlight", text: "**Income Statement structure:**\n\n Revenue (Sales)                  ____\n− Cost of Sales                   ____\n= GROSS PROFIT                    ____\n\n− Expenses (wages, rent, insurance, depreciation…) ____\n= NET PROFIT (or NET LOSS)        ____\n\n**Cost of Sales = Opening Inventory + Purchases − Returns Outwards − Closing Inventory**", color: "blue" },
        { kind: "keyterms", terms: [
          { label: "Revenue / Sales", value: "Total income from selling goods or services during the period." },
          { label: "Cost of Sales", value: "Direct cost of goods sold. Formula: Opening Inventory + Net Purchases − Closing Inventory." },
          { label: "Gross Profit", value: "Revenue − Cost of Sales. Profit before deducting operational expenses." },
          { label: "Net Profit", value: "Gross Profit − Expenses. The 'bottom line' profit after ALL costs are deducted." },
          { label: "Accrual", value: "Expense incurred but not yet paid. Added to the expense in the income statement." },
          { label: "Prepayment", value: "Expense paid in advance for a future period. Deducted from that expense." },
        ]},
        { kind: "tip", text: "Adjust expenses for accruals and prepayments BEFORE calculating net profit:\n• Accrual: ADD to expense (more is owed)\n• Prepayment: SUBTRACT from expense (already paid for next period)" },
        { kind: "warning", text: "Revenue expenditure → income statement (day-to-day: wages, rent, repairs). Capital expenditure → balance sheet as asset (buying long-term assets: buildings, machinery). Mixing these = error of principle." },
      ],
    },
    {
      section: "2.2 Statement of Financial Position (Balance Sheet)",
      blocks: [
        { kind: "video", youtubeId: "aqaHBk6TVKM", title: "Balance Sheet — IGCSE Accounting", caption: "How to prepare and interpret a statement of financial position (balance sheet) in vertical format" },
        { kind: "intro", text: "The **Statement of Financial Position** shows the financial position at a SPECIFIC DATE — what the business owns (assets), what it owes (liabilities), and the resulting capital." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Simple_balance_sheet.png/600px-Simple_balance_sheet.png", caption: "Balance sheet: assets on one side, liabilities + capital on the other. The two sides always balance because Capital = Assets − Liabilities.", side: "right" },
        { kind: "highlight", text: "**Balance Sheet (vertical format):**\n\nNon-current assets (premises, machinery, vehicles) ____\n+ Current assets (inventory, receivables, bank, cash) ____\n= TOTAL ASSETS ____\n\n− Current liabilities (payables, overdraft, accruals) ____\n− Non-current liabilities (bank loan, mortgage)       ____\n= NET ASSETS ____\n\n= CAPITAL (opening + net profit − drawings) ____", color: "blue" },
        { kind: "comparison", left: { label: "Non-current assets", items: ["Held for MORE than one year", "Used in the business — NOT for resale", "Depreciate over time", "Examples: land, buildings, machinery, vehicles, equipment"] }, right: { label: "Current assets", items: ["Converted to cash WITHIN one year", "Listed in order of INCREASING liquidity", "Order: Inventory → Receivables → Prepayments → Bank → Cash", "Cash is most liquid asset"] } },
        { kind: "tip", text: "The balance sheet MUST balance: Total Assets = Total Equity + Total Liabilities. If not, check: included all assets/liabilities? Calculated depreciation correctly? Adjusted capital for net profit and drawings?" },
      ],
    },
    {
      section: "2.3 Depreciation",
      blocks: [
        { kind: "video", youtubeId: "Mz2ATDQK0kY", title: "Depreciation Explained — IGCSE Accounting (Straight-Line & Reducing Balance)", caption: "How to calculate depreciation using both methods, record it in accounts, and show it on the balance sheet" },
        { kind: "intro", text: "**Depreciation** is the systematic reduction in value of a non-current asset over its useful life. It ensures assets are shown at a realistic value and costs are matched to the periods they benefit." },
        { kind: "comparison", left: { label: "Straight-line method", items: ["Equal charge each year", "Formula: (Cost − Residual value) ÷ Useful life", "Example: cost $10,000; residual $2,000; 4 years → $2,000/year", "Best for assets used evenly over time (e.g. office equipment)", "Simple to calculate"] }, right: { label: "Reducing balance method", items: ["Fixed PERCENTAGE applied to NET BOOK VALUE each year", "Higher depreciation early, lower later", "Formula: NBV × rate%", "Example: NBV $10,000; 20% → Year 1: $2,000; Year 2: $1,600; Year 3: $1,280", "Never reaches zero"] } },
        { kind: "highlight", text: "**Key depreciation terms:**\n• **Cost** — original purchase price\n• **Residual value** — estimated value at end of useful life ('scrap value')\n• **Net Book Value (NBV)** = Cost − Accumulated Depreciation\n• **Accumulated depreciation** — total depreciation charged to date\n• **Provision for depreciation account** — credit balance; recorded separately from the asset account", color: "green" },
        { kind: "warning", text: "Depreciation is a NON-CASH expense — no money actually leaves the business. It reduces profit (appears as an expense on the income statement) but does NOT represent an actual payment. Its purpose is to match the cost of an asset to the periods it benefits (matching concept)." },
      ],
    },
  ],
};

export const accountingCashFlowNotes: NoteChapter = {
  subject: "Accounting",
  title: "Cash Flow and Analysis",
  pages: [
    {
      section: "3.1 Cash Flow Statements",
      blocks: [
        { kind: "video", youtubeId: "5VyTbhCpOhk", title: "Cash Flow Statement — IGCSE Accounting", caption: "How to prepare a cash flow statement, identify inflows and outflows, and understand cash vs profit" },
        { kind: "intro", text: "A **cash flow statement** shows the actual movement of cash into and out of a business. A business can be profitable but still run out of cash — making cash flow management critical for survival." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Cash_flow_statement.png/600px-Cash_flow_statement.png", caption: "Cash flow statement structure: operating activities + investing activities + financing activities = net change in cash. Opening + net change = closing cash balance.", side: "right" },
        { kind: "comparison", left: { label: "Cash inflows (+)", items: ["Cash sales", "Receipts from trade receivables (credit customers paying)", "Sale of non-current assets", "Owner's additional capital invested", "Bank loans received"] }, right: { label: "Cash outflows (−)", items: ["Cash purchases of inventory", "Payments to trade payables (suppliers)", "Purchase of non-current assets", "Wages and salaries paid", "Loan repayments and interest", "Owner's drawings"] } },
        { kind: "highlight", text: "**Cash flow formulas:**\nNet cash flow = Total inflows − Total outflows\nClosing balance = Opening balance + Net cash flow\n\nA NEGATIVE closing balance = cash deficit → bank overdraft needed\n\n**Key distinction:** PROFIT ≠ CASH. A business is profitable if revenue > costs. It has cash if inflows > outflows. These are DIFFERENT.", color: "blue" },
        { kind: "tip", text: "Depreciation does NOT appear in a cash flow statement — it is non-cash. Only actual physical cash receipts and payments are included." },
      ],
    },
    {
      section: "3.2 Accounting Ratios",
      blocks: [
        { kind: "video", youtubeId: "1Z0Cz0-DPVI", title: "Accounting Ratios — IGCSE Accounting (Profitability, Liquidity, Efficiency)", caption: "How to calculate and interpret gross profit margin, net profit margin, ROCE, current ratio, quick ratio and more" },
        { kind: "intro", text: "**Accounting ratios** analyse financial performance and position. They allow comparison between years and between businesses." },
        { kind: "table", headers: ["Ratio", "Formula", "What it measures"], rows: [
          ["Gross profit margin", "(Gross Profit ÷ Revenue) × 100", "% of each $1 of sales remaining as gross profit"],
          ["Net profit margin", "(Net Profit ÷ Revenue) × 100", "% of each $1 of sales remaining as net profit after all expenses"],
          ["ROCE", "(Net Profit ÷ Capital Employed) × 100", "How effectively capital generates profit"],
          ["Current ratio", "Current Assets ÷ Current Liabilities", "Ability to meet short-term debts. Ideal: ~2:1"],
          ["Quick ratio (acid test)", "(Current Assets − Inventory) ÷ Current Liabilities", "Liquidity excluding inventory. Ideal: ~1:1"],
          ["Trade receivables days", "(Trade Receivables ÷ Revenue) × 365", "Average days customers take to pay. Lower = better"],
          ["Trade payables days", "(Trade Payables ÷ Cost of Sales) × 365", "Average days to pay suppliers"],
          ["Inventory turnover", "Cost of Sales ÷ Average Inventory", "Times inventory sold per year. Higher = faster-selling stock"],
        ]},
        { kind: "tip", text: "When analysing ratios: COMPARE to a benchmark (previous year, competitor, industry average). State the ratio value, say whether it is good or bad for THIS type of business, explain WHY, state a possible CAUSE, and suggest a remedy." },
        { kind: "warning", text: "Ratios have limitations: they use historical data, don't account for non-financial factors (staff morale, market trends), and comparing businesses in different sectors is misleading." },
      ],
    },
  ],
};
