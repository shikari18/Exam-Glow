import type { NoteChapter } from "./types";

export const economicsBasicProblemNotes: NoteChapter = {
  subject: "Economics",
  title: "The Basic Economic Problem",
  pages: [
    {
      section: "1.1 Scarcity and Choice",
      blocks: [
        { kind: "video", youtubeId: "g9aDizJpd_s", title: "Basic Economic Concepts — Crash Course Economics #1", caption: "Scarcity, opportunity cost, factors of production and the basic economic problem explained" },
        { kind: "intro", text: "**Economics** studies how individuals, firms, and governments make decisions about allocating **scarce resources** to satisfy **unlimited wants**. The fundamental problem: resources are limited but human wants are limitless." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Production_Possibility_Frontier_Curve.svg/600px-Production_Possibility_Frontier_Curve.svg.png", caption: "Production Possibility Frontier (PPF): shows the maximum combination of two goods an economy can produce. Points inside = inefficient; on the curve = efficient; outside = unattainable. Moving along the curve shows opportunity cost.", side: "right" },
        { kind: "highlight", text: "**The Basic Economic Problem:**\n• Resources (land, labour, capital, enterprise) are SCARCE\n• Human wants are UNLIMITED\n• Therefore, CHOICES must be made: what to produce, how, and for whom\n\n→ Every choice involves a **trade-off** and has an **opportunity cost**", color: "blue" },
        { kind: "keyterms", terms: [
          { label: "Scarcity", value: "Resources are limited relative to unlimited human wants — the fundamental economic problem." },
          { label: "Opportunity cost", value: "The value of the NEXT BEST ALTERNATIVE given up when a choice is made." },
          { label: "Land", value: "All natural resources — soil, minerals, water, forests, climate." },
          { label: "Labour", value: "Human effort (physical and mental) used in production." },
          { label: "Capital", value: "Man-made resources used to produce goods — machinery, tools, buildings, equipment." },
          { label: "Enterprise", value: "The skill of combining factors of production and bearing risk. The entrepreneur." },
        ]},
        { kind: "comparison", left: { label: "Needs", items: ["Essential for survival", "Food, water, shelter, clothing, basic healthcare", "Relatively limited in number"] }, right: { label: "Wants", items: ["Desired but not essential for survival", "Luxury goods, entertainment, travel", "Unlimited — satisfying one creates others"] } },
        { kind: "tip", text: "Opportunity cost questions: state WHAT was given up, not just that a choice was made. E.g. 'The opportunity cost of building a hospital is the school that could have been built with the same budget.'" },
      ],
    },
    {
      section: "1.2 Economic Systems",
      blocks: [
        { kind: "video", youtubeId: "B43YEW2FvDs", title: "Economic Systems — Capitalism vs Communism — Crash Course", caption: "Market economies, command economies, and mixed economies — how each answers the three fundamental questions" },
        { kind: "intro", text: "All economies answer three questions: **What to produce? How? For whom?** Different economic systems answer these differently." },
        { kind: "table", headers: ["Economic system", "Who decides?", "Key features", "Examples"], rows: [
          ["Market (free) economy", "Private individuals and firms via the price mechanism", "Private ownership; profit motive; competition; little government intervention", "USA, Hong Kong"],
          ["Command (planned) economy", "Central government", "Government owns all resources and firms; decides all production; eliminates private profit", "Former USSR, Cuba, North Korea"],
          ["Mixed economy", "Both private sector and government", "Private and public sectors coexist; government regulates and provides public goods", "UK, France, Germany, most nations"],
        ]},
        { kind: "tip", text: "For 'evaluate economic systems' questions: consider efficiency, equity (fairness), economic freedom, incentives to innovate, provision of public goods, and risk of market failure. Always give a balanced answer before reaching a judgement." },
      ],
    },
  ],
};

export const economicsSupplyDemandNotes: NoteChapter = {
  subject: "Economics",
  title: "Supply, Demand and Markets",
  pages: [
    {
      section: "2.1 Demand",
      blocks: [
        { kind: "video", youtubeId: "Lbfv5ThUFJ0", title: "Supply and Demand — Crash Course Economics #4", caption: "The law of demand, demand curves, shifts vs movements, and determinants of demand" },
        { kind: "intro", text: "**Demand** is the willingness AND ability to buy a good at various prices. The Law of Demand: as price rises, quantity demanded falls (inverse relationship)." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Supply-demand-right-shift-demand.svg/600px-Supply-demand-right-shift-demand.svg.png", caption: "Demand and supply diagram: demand curve (D) slopes downward; supply curve (S) slopes upward. Equilibrium E is where they intersect. Shift of D to D2 raises both price and quantity.", side: "right" },
        { kind: "highlight", text: "**Movement ALONG the demand curve:** caused ONLY by change in the good's own PRICE\n• Price rises → contraction of demand (move up-left)\n• Price falls → extension of demand (move down-right)\n\n**SHIFT of the demand curve:** caused by any factor OTHER than the good's own price\n→ Shifts RIGHT = increase in demand\n→ Shifts LEFT = decrease in demand", color: "blue" },
        { kind: "keyterms", terms: [
          { label: "Demand", value: "Amount of a good consumers are willing and ABLE to purchase at each price level." },
          { label: "Substitute goods", value: "Goods used instead of each other (butter/margarine). Rise in price of one → rise in demand for the other." },
          { label: "Complementary goods", value: "Goods used together (cars/petrol). Rise in price of one → fall in demand for the other." },
          { label: "Normal good", value: "Demand RISES as income rises (holidays, restaurant meals, cars)." },
          { label: "Inferior good", value: "Demand FALLS as income rises (e.g. budget brands, bus travel — consumers switch to better alternatives)." },
        ]},
        { kind: "bullets", items: [
          { text: "**Factors that SHIFT the demand curve (SPITE):**", sub: [
            "**S**ubstitutes: substitute's price rises → demand for THIS good rises",
            "**P**rice of complements: complement's price rises → demand for THIS good falls",
            "**I**ncome: rises → normal good demand rises; inferior good demand falls",
            "**T**astes/fashion: positive trend → demand rises; negative → demand falls",
            "**E**xpectations/Population: expected price rise now → demand rises now; larger population → demand rises",
          ]},
        ]},
        { kind: "tip", text: "Draw a demand and supply diagram for EVERY market question. Label axes (Price on Y, Quantity on X), label D and S curves, mark equilibrium E with P* and Q*. When a curve shifts, label it D₂/S₂ and mark new equilibrium E₂." },
      ],
    },
    {
      section: "2.2 Supply",
      blocks: [
        { kind: "video", youtubeId: "ewPNugIqCUM", title: "Supply Explained — IGCSE Economics", caption: "Law of supply, supply curves, factors causing shifts, and how supply and demand reach equilibrium" },
        { kind: "intro", text: "**Supply** is the willingness and ability of producers to offer goods for sale at various prices. Law of Supply: as price rises, quantity supplied rises (positive relationship)." },
        { kind: "highlight", text: "**SHIFT of supply curve RIGHTWARD** (increase in supply):\n• Fall in costs of production (cheaper raw materials, lower wages)\n• Improved technology (more efficient production)\n• Government subsidies to producers\n• Favourable weather (agriculture)\n• More producers enter the market\n\n**SHIFT LEFTWARD** (decrease in supply):\n• Opposite of above + higher taxes on producers", color: "green" },
        { kind: "comparison", left: { label: "Movement ALONG supply curve", items: ["Caused ONLY by change in the good's own price", "Price rises → extension of supply (more offered)", "Price falls → contraction of supply (less offered)", "Curve itself stays in place"] }, right: { label: "SHIFT of supply curve", items: ["Caused by factors OTHER than price", "Technology improvement → shifts right", "Increase in wages (cost) → shifts left", "Government subsidy → shifts right", "Bad harvest → shifts left"] } },
      ],
    },
    {
      section: "2.3 Price Elasticity of Demand (PED)",
      blocks: [
        { kind: "video", youtubeId: "lXHQ5GYJNKM", title: "Price Elasticity of Demand — IGCSE Economics", caption: "PED formula, interpretation, factors affecting elasticity, and the revenue rule explained with diagrams" },
        { kind: "intro", text: "**PED** measures how RESPONSIVE quantity demanded is to a change in price." },
        { kind: "highlight", text: "**PED formula:**\nPED = % change in Qd ÷ % change in P\n\n• |PED| > 1 → price ELASTIC (luxury goods, many substitutes)\n• |PED| < 1 → price INELASTIC (necessities, few substitutes)\n• |PED| = 1 → unit elastic\n• |PED| = 0 → perfectly inelastic (vertical demand curve)\n• |PED| = ∞ → perfectly elastic (horizontal demand curve)\n\n**PED is always NEGATIVE** (inverse relationship) — use absolute value |PED|.", color: "blue" },
        { kind: "table", headers: ["Factor", "Makes demand MORE elastic", "Makes demand MORE inelastic"], rows: [
          ["Substitutes", "Many close substitutes available", "Few or no substitutes"],
          ["Necessity vs luxury", "Luxury good (can go without)", "Necessity (food, medicine, heating)"],
          ["Time period", "Longer time (consumers adapt)", "Short time (no time to switch)"],
          ["Proportion of income", "Large proportion of income", "Small proportion of income"],
          ["Brand loyalty", "Generic/unbranded product", "Strong brand loyalty (e.g. iPhone)"],
        ]},
        { kind: "highlight", text: "**Revenue rule:**\n• ELASTIC demand (PED > 1): price rise → revenue FALLS; price cut → revenue RISES\n• INELASTIC demand (PED < 1): price rise → revenue RISES; price cut → revenue FALLS\n\n→ Firms with inelastic demand (utilities, addictive goods) can raise price and earn more revenue.", color: "pink" },
        { kind: "tip", text: "State the PED value, interpret elastic/inelastic, then APPLY to the specific good in the question. Generic answers about 'many substitutes' without applying to context score half marks." },
      ],
    },
    {
      section: "2.4 Market Failure and Government Intervention",
      blocks: [
        { kind: "video", youtubeId: "k2mGEPNQbcU", title: "Market Failure & Externalities — Crash Course Economics", caption: "Negative and positive externalities, public goods, merit goods and government intervention methods" },
        { kind: "intro", text: "**Market failure** occurs when the free market allocates resources inefficiently — producing too much or too little relative to the socially optimal quantity." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Negative_externality.svg/600px-Negative_externality.svg.png", caption: "Negative externality diagram: the social cost (MSC) exceeds the private cost (MPC). The free market overproduces at Q1. The socially optimal output Q* is lower. Government can correct this with a tax equal to the external cost.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "Negative externality", value: "A cost imposed on third parties not involved in the transaction (e.g. pollution — nearby residents bear health costs)." },
          { label: "Positive externality", value: "A benefit enjoyed by third parties (e.g. vaccination — unvaccinated people also protected from spread)." },
          { label: "Public good", value: "Non-rival (one person's use doesn't reduce supply) and non-excludable (impossible to stop free riders). E.g. national defence, street lighting." },
          { label: "Merit good", value: "Good the market underprovides because individuals undervalue its benefits (e.g. education, healthcare)." },
        ]},
        { kind: "comparison", left: { label: "Government intervention methods", items: ["Indirect taxes: raise price → reduce consumption → internalise negative externality", "Subsidies: lower price → increase consumption → correct merit good underproduction", "Price controls: maximum prices (affordability) or minimum prices (guarantee income)", "Regulations: laws limiting negative activities (pollution limits, smoking bans)", "State provision: directly provide public and merit goods"] }, right: { label: "Limitations of intervention", items: ["Taxes may be passed on to consumers via higher prices", "Subsidies costly — funded by taxpayers", "Maximum prices can create shortages; minimum prices create surpluses", "Regulations create compliance costs for businesses", "Government may lack perfect information about optimal output"] } },
      ],
    },
  ],
};

export const economicsMacroNotes: NoteChapter = {
  subject: "Economics",
  title: "The National Economy",
  pages: [
    {
      section: "3.1 Economic Growth and GDP",
      blocks: [
        { kind: "video", youtubeId: "QZOxrkmULsI", title: "Economic Growth & GDP — Crash Course Economics", caption: "What GDP measures, how economies grow, the business cycle, and the difference between growth and development" },
        { kind: "intro", text: "**Macroeconomics** studies the performance of the whole economy. Governments aim for sustained growth, low unemployment, low inflation, and a stable balance of payments." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Business_cycle_expanding.svg/600px-Business_cycle_expanding.svg.png", caption: "The business cycle: output fluctuates between boom (expansion) and recession (contraction). Governments use fiscal and monetary policy to smooth these fluctuations.", side: "right" },
        { kind: "keyterms", terms: [
          { label: "GDP (Gross Domestic Product)", value: "Total monetary value of all goods and services produced in a country in one year. Main measure of economic output." },
          { label: "Economic growth", value: "An increase in real GDP over time. Expressed as a percentage. Indicates rising output and living standards." },
          { label: "Business cycle", value: "Regular fluctuations in GDP: expansion → peak → recession → trough → recovery." },
          { label: "Recession", value: "Two consecutive quarters (6 months) of falling GDP. Associated with rising unemployment and falling investment." },
        ]},
        { kind: "comparison", left: { label: "Benefits of economic growth", items: ["Higher incomes and living standards", "Lower unemployment — more jobs created", "Higher tax revenues → better public services", "More business profit → more investment"] }, right: { label: "Costs of economic growth", items: ["Inflation — rising demand may push prices up", "Environmental damage — more pollution, resource depletion", "Income inequality — growth may benefit wealthy most", "Structural unemployment as old industries decline"] } },
      ],
    },
    {
      section: "3.2 Inflation and Unemployment",
      blocks: [
        { kind: "video", youtubeId: "cjDe6N3AFNA", title: "Inflation Explained — Crash Course Economics", caption: "What causes inflation, how it is measured using CPI, its effects, and government policies to control it" },
        { kind: "intro", text: "**Inflation** is a sustained rise in the general price level. **Unemployment** is when people of working age who are able and willing to work cannot find a job." },
        { kind: "highlight", text: "**Causes of inflation:**\n• **Demand-pull inflation:** excessive demand 'pulls' prices up — too much money chasing too few goods\n• **Cost-push inflation:** rising costs of production (wages, raw materials) push prices up as firms pass costs to consumers\n\n**Measuring inflation:** CPI (Consumer Price Index) — tracks prices of a 'basket' of typical household goods and services.", color: "blue" },
        { kind: "table", headers: ["Unemployment type", "Cause", "Policy solution"], rows: [
          ["Cyclical (demand-deficient)", "Economic recession — lack of demand means less labour needed", "Expansionary fiscal/monetary policy to boost demand"],
          ["Structural", "Change in economy makes some skills obsolete (e.g. automation replacing factory workers)", "Retraining, education, regional development"],
          ["Frictional", "Workers moving between jobs (even in a healthy economy)", "Better job information services, reduce restrictions"],
          ["Seasonal", "Demand varies with seasons (agriculture, tourism, Christmas retail)", "Diversification, unemployment benefits"],
        ]},
        { kind: "tip", text: "To identify unemployment type correctly, focus on the CAUSE. Recession → cyclical. Technology replacing jobs → structural. Workers between jobs → frictional. Winter → seasonal." },
      ],
    },
    {
      section: "3.3 Fiscal and Monetary Policy",
      blocks: [
        { kind: "video", youtubeId: "wJbBXMqfHFE", title: "Fiscal & Monetary Policy — Crash Course Economics", caption: "How governments use taxation and spending (fiscal) and interest rates (monetary) to manage the economy" },
        { kind: "intro", text: "Governments use **fiscal policy** (taxation and government spending) and **monetary policy** (interest rates and money supply) to manage economic performance." },
        { kind: "comparison", left: { label: "Fiscal policy (government/treasury)", items: ["Expansionary: cut taxes OR increase spending → boost demand", "Contractionary: raise taxes OR cut spending → reduce demand/inflation", "Budget deficit: government spends more than it collects in taxes", "Budget surplus: government collects more in taxes than it spends", "Funded by taxation, borrowing (national debt), or asset sales"] }, right: { label: "Monetary policy (central bank)", items: ["Lower interest rates → cheaper borrowing → more spending/investment → growth", "Higher interest rates → more expensive borrowing → less spending → reduces inflation", "Quantitative easing: central bank creates money to purchase assets → stimulates economy", "Inflation targeting: most central banks aim for ~2% inflation"] } },
        { kind: "highlight", text: "**The policy conflict:**\nBoosting growth reduces unemployment → but risks increasing inflation.\nReducing inflation requires higher interest rates or cutting spending → increases unemployment.\n\nGovernments must BALANCE these competing objectives — the 'economic policy trilemma'.", color: "yellow" },
      ],
    },
  ],
};

export const economicsTradeNotes: NoteChapter = {
  subject: "Economics",
  title: "International Trade and Development",
  pages: [
    {
      section: "4.1 International Trade",
      blocks: [
        { kind: "video", youtubeId: "owLB7ERNlqw", title: "International Trade & Comparative Advantage — Crash Course Economics", caption: "Why countries trade, comparative vs absolute advantage, free trade benefits and arguments for protectionism" },
        { kind: "intro", text: "Countries trade because they can specialise in goods they are relatively more efficient at producing (comparative advantage), then trade for other goods." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/World_Trade_Organization_map.svg/800px-World_Trade_Organization_map.svg.png", caption: "WTO member countries (blue): the World Trade Organisation promotes free trade by negotiating reductions in tariffs and trade barriers between member nations.", side: "full" },
        { kind: "keyterms", terms: [
          { label: "Comparative advantage", value: "A country has comparative advantage in producing a good if it can produce it at a LOWER OPPORTUNITY COST than another country — even if less efficient in absolute terms." },
          { label: "Absolute advantage", value: "A country produces MORE of a good with the SAME resources than another country." },
          { label: "Free trade", value: "Trade between countries without tariffs, quotas, or other barriers." },
          { label: "Tariff", value: "A tax on imported goods. Raises the price of imports → protects domestic producers but raises prices for consumers." },
          { label: "Quota", value: "A physical limit on the quantity of a good that can be imported." },
          { label: "Protectionism", value: "Government policies restricting imports to protect domestic industries (tariffs, quotas, embargoes, subsidies to domestic firms)." },
        ]},
        { kind: "comparison", left: { label: "Arguments for free trade", items: ["Lower prices for consumers", "Wider choice of goods available", "Economies of scale for exporting firms", "Promotes economic growth and development", "Efficient allocation of world resources"] }, right: { label: "Arguments for protectionism", items: ["Protect infant industries until competitive", "Prevent dumping (selling below cost to destroy competition)", "Protect jobs in declining industries", "National security — protect strategic industries (defence, food)", "Correct a balance of payments deficit"] } },
      ],
    },
    {
      section: "4.2 Economic Development",
      blocks: [
        { kind: "video", youtubeId: "pNfCRNMEDrs", title: "Economic Development vs Economic Growth — Crash Course", caption: "The difference between GDP growth and development, HDI, the Gini coefficient and how to measure living standards" },
        { kind: "intro", text: "**Economic development** is broader than growth — it includes improvements in living standards, health, education, freedom, and equality. GDP growth alone does not guarantee development." },
        { kind: "image", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/2023_UN_Human_Development_Report_Human_Development_Index_map.svg/1024px-2023_UN_Human_Development_Report_Human_Development_Index_map.svg.png", caption: "Global Human Development Index (HDI) map 2023: dark green = very high HDI (rich nations); red = low HDI (developing nations). The index combines income, education, and health indicators.", side: "full" },
        { kind: "table", headers: ["Indicator", "Type", "Measures"], rows: [
          ["GDP per capita", "Economic", "Average income per person. Crude — ignores inequality."],
          ["HDI (Human Development Index)", "Composite", "GDP per capita + years of schooling + life expectancy. More comprehensive than GDP alone."],
          ["Gini coefficient", "Inequality", "Income inequality. 0 = perfect equality; 1 = all income to one person."],
          ["Infant mortality rate", "Health", "Deaths per 1,000 live births. Low = better healthcare and nutrition."],
          ["Adult literacy rate", "Education", "% of adults who can read and write."],
          ["Life expectancy", "Health", "Average years expected to live at birth."],
        ]},
        { kind: "tip", text: "Always use MULTIPLE indicators when evaluating development. GDP alone is misleading — high GDP can coexist with extreme inequality or poor health outcomes. HDI is more comprehensive but still incomplete (ignores political freedom, environmental sustainability)." },
      ],
    },
  ],
};
