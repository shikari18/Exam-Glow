import type { NoteChapter } from "./types";

export const businessActivityNotes: NoteChapter = {
  subject: "Business Studies",
  title: "Business Activity",
  pages: [
    {
      section: "1.1 Purpose and Nature of Business Activity",
      blocks: [
        { kind: "video", youtubeId: "UWImfFax8Ew", title: "Introduction to Business — IGCSE Business Studies", caption: "What businesses do, how they add value, stakeholders and the role of enterprise in the economy" },
        { kind: "intro", text: "**Business activity** involves using resources (factors of production) to produce goods and services that satisfy human wants and needs. Businesses solve the basic economic problem by deciding what to produce, how, and for whom." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/400px-Camponotus_flavomarginatus_ant.jpg", caption: "Businesses create added value: raw inputs (like wood, metal, labour) are transformed into finished products worth more than the sum of their parts — the difference is added value, which funds profit and wages.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Business", value: "An organisation that uses resources (inputs) to produce goods or services (outputs) to satisfy customer needs and earn revenue." },
          { label: "Goods", value: "Physical, tangible products (e.g. cars, food, clothing, phones)." },
          { label: "Services", value: "Intangible activities provided to customers (e.g. haircut, banking, teaching, transport)." },
          { label: "Entrepreneur", value: "A person who takes risks by setting up a business, combining factors of production to create products or services." },
          { label: "Added value", value: "Selling price − cost of bought-in inputs. The value a business adds through its own production process." },
          { label: "Stakeholder", value: "Any person or group with an interest in the activities and decisions of a business (shareholders, employees, customers, government, community, suppliers)." },
        ]},
        { kind: "highlight", text: "**How businesses add value:**\n• Better design or branding (Apple charges premium for design)\n• Faster/more convenient service (Amazon Prime delivery)\n• Higher quality materials or craftsmanship\n• Better customer service and after-sales support\n• Unique features (USP — Unique Selling Point)\n\nAdded value = Selling price − Cost of inputs", color: "blue" },
        { kind: "comparison", left: { label: "Private sector businesses", items: ["Owned and controlled by private individuals", "Primary objective: profit", "Funded by shareholders, loans, personal savings", "Examples: Apple, local shops, sole traders, partnerships, PLCs"] }, right: { label: "Public sector organisations", items: ["Owned and controlled by the government", "Primary objective: provide services to the public", "Funded by taxation", "Examples: NHS, state schools, police, government departments"] } },
        { kind: "tip", text: "Added value questions: calculate it correctly (selling price minus input costs), then explain HOW the business adds value — through design, branding, quality, customer service, or convenience." },
      ],
    },
    {
      section: "1.2 Types of Business Organisation",
      blocks: [
        { kind: "video", youtubeId: "BHTA7NTEdlE", title: "Types of Business Ownership — Sole Trader, Partnership, Ltd, PLC — IGCSE Business", caption: "Comparing sole traders, partnerships, private and public limited companies — ownership, liability and control" },
        { kind: "intro", text: "Businesses are organised in different legal forms, each with different ownership, liability, and funding characteristics." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/London_Stock_Exchange_2.jpg/800px-London_Stock_Exchange_2.jpg", caption: "The London Stock Exchange: where public limited companies (PLCs) list their shares for sale to the public. PLCs gain access to enormous capital but face strict regulation and public scrutiny.", side: "full" },
        { kind: "table", headers: ["Type", "Owners", "Liability", "Funding", "Control"], rows: [
          ["Sole trader", "1 owner", "Unlimited — personally liable for ALL debts", "Personal savings, small loans", "Owner makes all decisions — maximum control"],
          ["Partnership", "2–20 partners", "Unlimited (unless LLP)", "Partners' capital and loans", "Shared — risk of disagreement between partners"],
          ["Private Ltd (Ltd)", "Private shareholders — cannot sell shares publicly", "Limited to investment", "Private shares + bank loans + retained profit", "Directors appointed by shareholders"],
          ["Public Ltd (PLC)", "Public shareholders — shares on stock exchange", "Limited to investment", "Issue shares publicly — access to large capital", "Board of directors — ownership and control separated"],
          ["Cooperative", "Members (workers/consumers)", "Limited", "Members' subscriptions and loans", "Democratic — one member, one vote"],
          ["Franchise", "Franchisee runs the branch", "Depends on structure", "Franchisee pays initial fee + royalties to franchisor", "Franchisor sets rules; franchisee runs day-to-day"],
        ]},
        { kind: "highlight", text: "**Limited liability** — shareholders can ONLY lose the money they invested in shares. Personal assets (house, car, savings) are PROTECTED if the business fails.\n\n**Unlimited liability** — the owner is personally responsible for ALL debts. Personal assets CAN be seized to pay business debts.", color: "blue" },
        { kind: "tip", text: "When recommending a business structure: consider the owner's need for capital, desire for control, willingness to share profits, and attitude to risk. Always justify with reference to the specific business context in the question." },
      ],
    },
  ],
};

export const businessPeopleNotes: NoteChapter = {
  subject: "Business Studies",
  title: "People in Business",
  pages: [
    {
      section: "2.1 Motivation",
      blocks: [
        { kind: "video", youtubeId: "v4ViHHgBFiE", title: "Motivation Theories — Maslow, Taylor, Herzberg — IGCSE Business", caption: "How Maslow's hierarchy, Taylor's scientific management and Herzberg's two-factor theory explain workplace motivation" },
        { kind: "intro", text: "**Motivation** is the desire to work hard to achieve goals. Motivated employees are more productive, produce better quality work, and are less likely to leave the business." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/MaslowsHierarchyOfNeeds.svg/800px-MaslowsHierarchyOfNeeds.svg.png", caption: "Maslow's Hierarchy of Needs: lower-level needs (physiological, safety) must be satisfied before higher-level needs (social, esteem, self-actualisation) can motivate workers.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Maslow's Hierarchy of Needs", value: "Workers have 5 levels of needs (physiological → safety → social → esteem → self-actualisation). Lower needs must be satisfied before higher ones motivate." },
          { label: "Taylor (Scientific Management)", value: "Workers are motivated primarily by money. Pay piece-rate and use time-and-motion studies to maximise efficiency. Treats workers as machines." },
          { label: "Herzberg's Two-Factor Theory", value: "Hygiene factors (pay, working conditions) prevent dissatisfaction but don't motivate. Motivators (achievement, recognition, responsibility) actually increase motivation." },
        ]},
        { kind: "table", headers: ["Maslow's level", "Need", "How to satisfy at work"], rows: [
          ["5 — Self-actualisation", "Reaching full potential", "Challenging work, autonomy, career development opportunities"],
          ["4 — Esteem", "Respect, status, achievement", "Promotion, praise, recognition, job titles, awards"],
          ["3 — Social", "Belonging, friendship", "Team working, social events, friendly workplace culture"],
          ["2 — Safety", "Job security, safe conditions", "Contracts, health & safety compliance, pension schemes"],
          ["1 — Physiological", "Food, water, shelter", "Adequate wage, breaks, comfortable working environment"],
        ]},
        { kind: "comparison", left: { label: "Financial motivators", items: ["Wages/salary — basic pay for time worked", "Piece-rate — pay per unit produced", "Commission — % of sales value made", "Bonus — extra payment for hitting targets", "Profit-sharing — share of company profits", "Fringe benefits — company car, health insurance, gym"] }, right: { label: "Non-financial motivators", items: ["Job enrichment — more challenging and meaningful tasks", "Job rotation — variety of different tasks to prevent boredom", "Job enlargement — more tasks at the same skill level", "Teamwork — social belonging and peer support", "Delegation — trusted with authority and responsibility", "Training — opportunities to improve skills and advance"] } },
        { kind: "tip", text: "Apply motivation theory to the context. High staff turnover + low wages → Maslow (physiological/safety needs not met). Workers bored and unchallenged → Herzberg (motivators missing). Always recommend a SPECIFIC solution linked to the theory." },
      ],
    },
    {
      section: "2.2 Organisational Structure",
      blocks: [
        { kind: "video", youtubeId: "dYvn6mhRRfI", title: "Organisational Structure — Hierarchy, Span of Control — IGCSE Business", caption: "Tall vs flat structures, span of control, chain of command, delegation, centralisation and decentralisation" },
        { kind: "intro", text: "**Organisational structure** determines how authority, responsibility, and communication flow through a business — shown in an **organisational chart**." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Org_chart_structure.png/600px-Org_chart_structure.png", caption: "Organisational chart showing a tall hierarchy: CEO at top, multiple management layers below, with narrow spans of control at each level — typical of large, formal organisations like banks or the military.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Hierarchy", value: "The number of levels of authority from top (CEO/board) to bottom (junior workers)." },
          { label: "Span of control", value: "The number of subordinates a manager directly supervises. Wide = many; narrow = few." },
          { label: "Chain of command", value: "The line of authority from top to bottom — the path instructions travel through the hierarchy." },
          { label: "Delegation", value: "Passing authority (but not final responsibility) to a subordinate to make decisions and complete tasks." },
          { label: "Centralisation", value: "Decision-making kept at the TOP. Fast, consistent decisions but ignores local knowledge and initiative." },
          { label: "Decentralisation", value: "Decision-making delegated to LOWER levels. Empowers staff and faster local response but may cause inconsistency." },
        ]},
        { kind: "comparison", left: { label: "Tall structure (many hierarchical levels)", items: ["Many levels, narrow spans of control", "Clear promotion path for employees", "Slow communication — messages pass through many levels", "Close supervision of subordinates", "Suitable for large formal organisations (banks, military)"] }, right: { label: "Flat structure (few hierarchical levels)", items: ["Few levels, wide spans of control", "Better communication — reaches staff quickly", "More employee autonomy and responsibility", "Managers oversee more people — may be overloaded", "Suitable for creative industries, small businesses, startups"] } },
      ],
    },
  ],
};

export const businessMarketingNotes: NoteChapter = {
  subject: "Business Studies",
  title: "Marketing",
  pages: [
    {
      section: "3.1 Market Research",
      blocks: [
        { kind: "video", youtubeId: "ZjE4XpaTsUU", title: "Marketing Mix & Market Research — IGCSE Business Studies", caption: "Primary and secondary market research, market segmentation and the 4Ps marketing mix explained" },
        { kind: "intro", text: "**Marketing** identifies customer needs and satisfies them profitably. **Market research** provides the data needed to make informed marketing decisions." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Segmentation_-_Customer.jpg/600px-Segmentation_-_Customer.jpg", caption: "Market segmentation divides the total market into groups (segments) sharing similar characteristics — allowing businesses to target their product, pricing and promotion to specific customer groups more effectively.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Primary research", value: "New, first-hand data collected directly by the business (surveys, interviews, focus groups, observation, trials)." },
          { label: "Secondary research", value: "Existing data gathered by others and reused (government statistics, published reports, competitor websites, databases)." },
          { label: "Market segmentation", value: "Dividing the market into distinct groups of consumers sharing similar characteristics (age, income, location, lifestyle)." },
          { label: "Target market", value: "The specific market segment(s) a business focuses its products and marketing on." },
          { label: "USP (Unique Selling Point)", value: "The one feature that makes a product different from and better than all competitors — the core of effective marketing." },
        ]},
        { kind: "comparison", left: { label: "Primary research", items: ["Original data — specific to the business's exact needs", "More relevant, up-to-date", "More expensive and time-consuming to collect", "Methods: surveys, focus groups, observation, trials, interviews"] }, right: { label: "Secondary research", items: ["Already collected by others — quicker and cheaper", "May be out of date or not specific enough", "Sources: government statistics, reports, newspapers, internet, trade magazines", "Good starting point before conducting primary research"] } },
      ],
    },
    {
      section: "3.2 The Marketing Mix (4Ps)",
      blocks: [
        { kind: "video", youtubeId: "FTWqXPlnuJk", title: "The 4Ps Marketing Mix — Product, Price, Place, Promotion — IGCSE Business", caption: "How product, pricing strategies, distribution channels and promotional methods work together as the marketing mix" },
        { kind: "intro", text: "The **Marketing Mix (4Ps)** combines four elements that must work together consistently to successfully market a product to its target market." },
        { kind: "table", headers: ["P", "What it covers", "Key decisions"], rows: [
          ["Product", "Design, features, quality, branding, packaging, after-sales service, product range", "USP, product life cycle stage, customer needs, differentiation from competitors"],
          ["Price", "Amount charged for the product", "Pricing strategy: cost-plus, penetration, skimming, competitive, psychological"],
          ["Place", "How the product reaches customers", "Direct (online, own shop) vs indirect (retailers, wholesalers, agents); distribution channels"],
          ["Promotion", "How the business communicates with customers", "Advertising (TV, social media), PR, sales promotion, personal selling — the promotional mix"],
        ]},
        { kind: "highlight", text: "**Pricing strategies:**\n• **Cost-plus:** Add % markup to cost price → simple but ignores market demand\n• **Penetration:** Low initial price → attract customers quickly → raise price later → suits new market entry\n• **Price skimming:** High launch price → high-income early adopters → lower price over time → suits innovative products\n• **Competitive:** Match or beat competitors' prices\n• **Psychological:** £9.99 instead of £10 → feels significantly cheaper", color: "blue" },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Product_life_cycle.png/600px-Product_life_cycle.png", caption: "Product Life Cycle: Introduction (low sales, heavy promotion) → Growth (rapid sales increase) → Maturity (sales peak, high competition) → Decline (sales fall). Marketing strategies change at each stage.", side: "full" },
        { kind: "tip", text: "Marketing mix questions: link EVERY recommendation to the context. E.g. 'A penetration pricing strategy would be effective because the market is price-sensitive (many substitutes) and the business needs to quickly build market share as a new entrant.'" },
      ],
    },
  ],
};

export const businessFinanceNotes: NoteChapter = {
  subject: "Business Studies",
  title: "Business Finance",
  pages: [
    {
      section: "4.1 Revenue, Costs and Profit",
      blocks: [
        { kind: "video", youtubeId: "6jGMRxrZ4vs", title: "Costs, Revenue and Profit — IGCSE Business Studies", caption: "Fixed and variable costs, total cost, revenue, profit and the difference between gross and net profit" },
        { kind: "intro", text: "Understanding the relationship between revenue, costs, and profit is fundamental to assessing business performance and viability." },
        { kind: "highlight", text: "**Key formulas:**\nRevenue = Selling price × Quantity sold\nTotal cost = Fixed cost + Variable cost\nProfit = Revenue − Total cost\nContribution per unit = Selling price − Variable cost per unit\nProfit = Total contribution − Fixed costs", color: "blue" },
        { kind: "comparison", left: { label: "Fixed costs", items: ["Do NOT change with output level", "Paid even if nothing is produced", "Examples: rent, insurance, manager salaries, loan repayments", "On a graph: horizontal line"] }, right: { label: "Variable costs", items: ["Change DIRECTLY with output level", "Zero if nothing produced; double if output doubles", "Examples: raw materials, packaging, piece-rate wages, electricity for machines", "On a graph: diagonal line through origin"] } },
        { kind: "tip", text: "Semi-variable (mixed) costs have both a fixed component and a variable component (e.g. a phone contract: fixed monthly fee + charge per call). Identify these carefully in exam questions." },
      ],
    },
    {
      section: "4.2 Break-Even Analysis",
      blocks: [
        { kind: "video", youtubeId: "E7hVtDVvXYw", title: "Break-Even Analysis — IGCSE Business Studies", caption: "How to calculate break-even output, draw break-even charts, find margin of safety and interpret the results" },
        { kind: "intro", text: "**Break-even analysis** shows the output level at which total revenue equals total costs — at this point the business makes neither profit nor loss." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Breakevenpoint.png/600px-Breakevenpoint.png", caption: "Break-even chart: the intersection of the Total Revenue (TR) and Total Cost (TC) lines is the break-even point. Output above this = profit; output below = loss. The margin of safety is the gap between actual and break-even output.", side: "right" },
        { kind: "highlight", text: "**Break-even formulas:**\nContribution per unit = Selling price − Variable cost per unit\nBreak-even output = Fixed costs ÷ Contribution per unit\nMargin of safety = Actual output − Break-even output\n\n**Worked example:**\nFixed costs = £6,000; Selling price = £20; Variable cost = £8\nContribution = £20 − £8 = £12\nBreak-even = £6,000 ÷ £12 = **500 units**\nIf actual output = 700: Margin of safety = 700 − 500 = **200 units**", color: "green" },
        { kind: "warning", text: "Break-even ASSUMES: constant selling price at all output levels; constant variable cost per unit; all output is sold; fixed costs don't change. In reality all these assumptions may be violated — which limits the usefulness of break-even analysis as a decision-making tool." },
      ],
    },
    {
      section: "4.3 Sources of Finance",
      blocks: [
        { kind: "video", youtubeId: "hVlhMdGOFZE", title: "Sources of Finance — IGCSE Business Studies", caption: "Internal sources (retained profit, asset sales) and external sources (bank loans, overdraft, share issue, crowdfunding) compared" },
        { kind: "intro", text: "Businesses need finance for **start-up**, **working capital** (day-to-day operations), and **expansion**. Different sources suit different needs and business types." },
        { kind: "comparison", left: { label: "Internal sources", items: ["Retained profit — cheapest; no interest, no loss of control", "Sale of assets — selling unused assets for cash (one-off)", "Owner's personal savings — fast but limited amount", "Working capital management — collect debts faster, delay supplier payments"] }, right: { label: "External sources", items: ["Bank loan — large sum; fixed/variable interest; repaid over time", "Bank overdraft — flexible short-term; interest only on amount used", "Share issue (PLC) — large capital; no repayment but ownership diluted", "Venture capital — equity for high-risk startups", "Crowdfunding — small amounts from many people online", "Hire purchase/leasing — acquire assets without large upfront cost"] } },
        { kind: "tip", text: "Match finance source to purpose: long-term investment (new factory) → long-term source (mortgage, share issue). Short-term need (pay wages this month) → short-term source (overdraft). Consider cost, effect on control, and ability to repay." },
      ],
    },
  ],
};
