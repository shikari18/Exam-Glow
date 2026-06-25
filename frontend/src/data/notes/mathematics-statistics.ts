import type { NoteChapter } from "./types";

export const mathematicsStatisticsNotes: NoteChapter = {
  subject: "Mathematics",
  title: "Statistics & Probability",
  pages: [
    {
      section: "8.1 Averages & Spread",
      blocks: [
        {
          kind: "video",
          youtubeId: "3mJ49e2gBZs",
          title: "Mean, Median, Mode & Range — GCSE Maths (Cognito)",
          caption: "How to calculate and compare averages (mean, median, mode) and spread (range)."
        },
        {
          kind: "table",
          headers: ["Measure", "Definition", "Formula / Method"],
          rows: [
            ["Mean", "Sum of all values ÷ number of values", "x̄ = Σx/n  or  Σfx/Σf (frequency table)"],
            ["Median", "Middle value when data is ordered", "Position: (n+1)/2 for odd n; average of n/2 and n/2+1 for even n"],
            ["Mode", "Most frequently occurring value", "The value with highest frequency"],
            ["Range", "Spread of all data", "Max − Min"],
            ["IQR", "Spread of middle 50%", "Q3 − Q1 (more reliable than range)"],
          ],
        },
        {
          kind: "highlight",
          text: "For grouped data: use midpoints of each class interval to estimate the mean.\nMean ≈ Σ(midpoint × frequency) / Σfrequency",
          color: "blue",
        },
        {
          kind: "tip",
          text: "When to use each average: Mean — use when data has no extreme outliers (uses all values). Median — use when data has outliers (not affected by extremes). Mode — use for categorical data or when most common value is needed.",
        },
      ],
    },
    {
      section: "8.2 Cumulative Frequency & Box Plots",
      blocks: [
        {
          kind: "bullets",
          items: [
            {
              text: "Drawing a cumulative frequency graph:",
              sub: [
                "Add up frequencies cumulatively (running total)",
                "Plot points at the UPPER CLASS BOUNDARY of each interval",
                "Join with a smooth S-shaped curve",
                "Read off: median at n/2, Q1 at n/4, Q3 at 3n/4",
              ],
            },
            {
              text: "Reading from the graph:",
              sub: [
                "Median: read across from n/2 on y-axis → down to x-axis",
                "Q1: read across from n/4 → down to x-axis",
                "Q3: read across from 3n/4 → down to x-axis",
                "IQR = Q3 − Q1",
                "Percentile: read across from (p/100 × n) → down to x-axis",
              ],
            },
          ],
        },
        {
          kind: "highlight",
          text: "Box plot shows: minimum | Q1 | median | Q3 | maximum\nThe box spans Q1 to Q3 (IQR). The whiskers extend to min and max (or 1.5×IQR for outliers).",
          color: "green",
        },
        {
          kind: "image",
          src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Elements_of_a_boxplot.svg/500px-Elements_of_a_boxplot.svg.png",
          caption: "Elements of a box plot: minimum, lower quartile (Q1), median, upper quartile (Q3), and maximum.",
          side: "right"
        },
        {
          kind: "warning",
          text: "Common mistake: plotting cumulative frequency at the midpoint instead of the upper class boundary. Always use the upper boundary (e.g. for class 10 < x ≤ 20, plot at x = 20).",
        },
      ],
    },
    {
      section: "8.3 Histograms",
      blocks: [
        {
          kind: "definition",
          term: "Frequency density",
          definition: "the y-axis value in a histogram. Frequency density = frequency ÷ class width. The AREA of each bar represents the frequency.",
        },
        {
          kind: "highlight",
          text: "Frequency = frequency density × class width\nFrequency density = frequency ÷ class width\nArea of bar = frequency",
          color: "pink",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Steps to draw a histogram:",
              sub: [
                "Calculate frequency density for each class: fd = f ÷ class width",
                "Draw bars with width = class width and height = frequency density",
                "Bars must be touching (continuous data)",
                "Label y-axis as 'Frequency density', NOT 'Frequency'",
              ],
            },
          ],
        },
        {
          kind: "warning",
          text: "The most common histogram mistake: plotting frequency on the y-axis instead of frequency density. This only works when all class widths are equal. If class widths differ, you MUST use frequency density.",
        },
      ],
    },
    {
      section: "8.4 Probability",
      blocks: [
        {
          kind: "keyterms",
          terms: [
            { label: "Probability", value: "P(event) = number of favourable outcomes / total number of equally likely outcomes. Always between 0 and 1." },
            { label: "Mutually exclusive", value: "events that cannot both happen at the same time. P(A or B) = P(A) + P(B)" },
            { label: "Independent", value: "events where one does not affect the other. P(A and B) = P(A) × P(B)" },
            { label: "Conditional probability", value: "P(A|B) = P(A and B) / P(B) — probability of A given B has occurred" },
          ],
        },
        {
          kind: "highlight",
          text: "Tree diagrams: multiply along branches (AND), add between branches (OR).\nP(A and B) = P(A) × P(B|A)\nAlways check probabilities on each set of branches sum to 1.",
          color: "blue",
        },
        {
          kind: "bullets",
          items: [
            {
              text: "Worked example — tree diagram:",
              sub: [
                "Bag has 3 red, 5 blue balls. Draw 2 without replacement.",
                "P(red then red) = 3/8 × 2/7 = 6/56 = 3/28",
                "P(both same colour) = P(RR) + P(BB) = 3/28 + (5/8 × 4/7) = 3/28 + 20/56 = 6/56 + 20/56 = 26/56 = 13/28",
              ],
            },
          ],
        },
        {
          kind: "tip",
          text: "For 'without replacement' problems, the denominator decreases by 1 for the second draw. For 'with replacement', probabilities stay the same for each draw.",
        },
      ],
    },
    {
      section: "8.5 Scatter Graphs & Correlation",
      blocks: [
        {
          kind: "table",
          headers: ["Type of correlation", "Description", "Line of best fit"],
          rows: [
            ["Strong positive", "Points close to upward line", "Steep positive gradient"],
            ["Weak positive", "Points loosely around upward line", "Gentle positive gradient"],
            ["No correlation", "Points scattered randomly", "No meaningful line"],
            ["Weak negative", "Points loosely around downward line", "Gentle negative gradient"],
            ["Strong negative", "Points close to downward line", "Steep negative gradient"],
          ],
        },
        {
          kind: "highlight",
          text: "Line of best fit: draw through the mean point (x̄, ȳ) with roughly equal numbers of points above and below. Use it to estimate values within the data range (interpolation) — not outside (extrapolation is unreliable).",
          color: "yellow",
        },
        {
          kind: "warning",
          text: "Correlation does NOT imply causation. Two variables may be correlated due to a third (confounding) variable. E.g. ice cream sales and drowning rates are both correlated with hot weather — ice cream doesn't cause drowning.",
        },
      ],
    },
  ],
};
