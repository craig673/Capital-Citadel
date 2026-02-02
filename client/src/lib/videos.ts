export type VideoSeries = "interviews" | "ai_revolution_call" | "featured_insight";

export type Video = {
  id: string;
  title: string;
  date: string; // ISO: YYYY-MM-DD
  description: string;
  series: VideoSeries;
};

export const videos: Video[] = [
  {
    id: "OWi7ePKPI8I",
    title: "Stop Investing in the Wrong Companies",
    date: "2024-10-01",
    description:
      "The Revolution Investing Framework: How to identify the trillion-dollar companies of tomorrow before the crowd arrives.",
    series: "featured_insight",
  },
  {
    id: "nUvMkLI3eXM",
    title: "AI as a Market Force",
    date: "2024-09-12",
    description:
      "Cody discusses why the AI shift is larger than geopolitical tensions and how it reshapes labor and capital.",
    series: "interviews",
  },
  {
    id: "uJauiCLefj8",
    title: "The Energy & Automation Supercycle",
    date: "2024-08-27",
    description: "A deep dive into why Tesla, AI, and the Middle East are just getting started.",
    series: "interviews",
  },
  {
    id: "ORgT7lZtazE",
    title: "Live Q&A: Navigating Volatility",
    date: "2024-08-05",
    description:
      "Unscripted analysis of Bitcoin, Gold, and the tech sector during market drawdowns.",
    series: "interviews",
  },
  {
    id: "SINhxpfRNYs",
    title: "The AI Revolution Call: Jan 19",
    date: "2025-01-19",
    description:
      "Weekly analysis of major tech equities (TSLA, NVDA), crypto markets, and the macroeconomic outlook for late January.",
    series: "ai_revolution_call",
  },
  {
    id: "MMSGUjoTFZU",
    title: "The AI Revolution Call: Jan 12",
    date: "2025-01-12",
    description:
      "A deep dive into Q1 market trends, key support levels for major indices, and the evolving AI hardware trade.",
    series: "ai_revolution_call",
  },
  {
    id: "GdPICJ2tM8c",
    title: "The AI Revolution Call: Dec 29",
    date: "2024-12-29",
    description: "Weekly market analysis and positioning across the AI complex.",
    series: "ai_revolution_call",
  },
];

export function sortVideosByDateDesc(list: Video[]) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getMostRecentVideo(list: Video[]) {
  const sorted = sortVideosByDateDesc(list);
  return sorted[0];
}

export function getVideosBySeries(list: Video[], series: VideoSeries) {
  return list.filter((v) => v.series === series);
}
