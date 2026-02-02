import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, PlayCircle } from "lucide-react";

const interviews = [
  {
    id: "nUvMkLI3eXM",
    title: "AI as a Market Force",
    context:
      "Cody discusses why the AI shift is larger than geopolitical tensions and how it reshapes labor and capital.",
  },
  {
    id: "uJauiCLefj8",
    title: "The Energy & Automation Supercycle",
    context: "A deep dive into why Tesla, AI, and the Middle East are just getting started.",
  },
  {
    id: "ORgT7lZtazE",
    title: "Live Q&A: Navigating Volatility",
    context:
      "Unscripted analysis of Bitcoin, Gold, and the tech sector during market drawdowns.",
  },
];

const aiRevolutionCall = [
  {
    id: "SINhxpfRNYs",
    title: "The AI Revolution Call: Jan 27",
    context:
      "Weekly analysis of major tech equities (TSLA, NVDA), crypto markets, and the macroeconomic outlook for late January.",
  },
  {
    id: "MMSGUjoTFZU",
    title: "The AI Revolution Call: Jan 21",
    context:
      "A deep dive into Q1 market trends, key support levels for major indices, and the evolving AI hardware trade.",
  },
  {
    id: "GdPICJ2tM8c",
    title: "The AI Revolution Call: Jan 13",
    context: "Weekly market analysis and positioning across the AI complex.",
  },
];

function VideoFrame({
  id,
  title,
  testId,
}: {
  id: string;
  title: string;
  testId: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden border border-secondary/30 bg-black shadow-[0_0_0_1px_rgba(197,160,89,0.10)]"
      data-testid={testId}
    >
      <div className="relative w-full aspect-video" data-testid={`${testId}-ratio`}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          data-testid={`${testId}-iframe`}
        />
      </div>
    </div>
  );
}

function VideoGrid({
  items,
  testId,
}: {
  items: Array<{ id: string; title: string; context: string }>;
  testId: string;
}) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" data-testid={testId}>
      {items.map((v, idx) => (
        <article
          key={v.id}
          className="group border border-secondary/30 bg-white/[0.03] shadow-[0_0_0_1px_rgba(197,160,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-[0_18px_48px_rgba(0,0,0,0.30),0_0_0_1px_rgba(197,160,89,0.18)]"
          data-testid={`card-${testId}-${idx}`}
        >
          <VideoFrame id={v.id} title={v.title} testId={`video-${testId}-${idx}`} />

          <div className="p-6" data-testid={`section-${testId}-meta-${idx}`}>
            <h3
              className="font-display text-xl text-primary-foreground"
              data-testid={`text-${testId}-title-${idx}`}
            >
              {v.title}
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed text-primary-foreground/75"
              data-testid={`text-${testId}-context-${idx}`}
            >
              {v.context}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Videos() {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-primary-foreground">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-16" data-testid="section-videos-feature">
            <div className="flex items-center gap-3 text-secondary" data-testid="row-videos-feature-kicker">
              <PlayCircle size={16} aria-hidden="true" />
              <div className="text-xs font-bold uppercase tracking-widest" data-testid="text-videos-feature-kicker">
                FEATURED INSIGHT
              </div>
            </div>

            <div className="mt-5" data-testid="wrap-videos-feature-player">
              <VideoFrame
                id="OWi7ePKPI8I"
                title="Stop Investing in the Wrong Companies"
                testId="video-feature"
              />
            </div>

            <p
              className="mt-6 max-w-4xl text-sm md:text-base leading-relaxed text-primary-foreground/80"
              data-testid="text-videos-feature-caption"
            >
              The Revolution Investing Framework: How to identify the trillion-dollar companies of tomorrow before the
              crowd arrives.
            </p>

            <div className="mt-12 h-px bg-secondary/20" aria-hidden="true" />
          </section>

          <section className="pb-14" data-testid="section-videos-interviews">
            <div className="flex items-center justify-between gap-6" data-testid="row-videos-interviews-header">
              <h2
                className="font-display text-3xl md:text-4xl tracking-tight"
                data-testid="text-videos-interviews-title"
              >
                INTERVIEWS
              </h2>
            </div>

            <VideoGrid items={interviews} testId="grid-interviews" />
          </section>

          <section className="pt-14 border-t border-secondary/20" data-testid="section-videos-ai-revolution">
            <div className="flex items-center justify-between gap-6" data-testid="row-videos-ai-revolution-header">
              <Link
                href="/insights/ai-revolution"
                className="group inline-flex items-center gap-3 text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                data-testid="link-videos-ai-revolution"
              >
                <h2
                  className="font-display text-3xl md:text-4xl tracking-tight"
                  data-testid="text-videos-ai-revolution-title"
                >
                  THE AI REVOLUTION CALL
                </h2>
                <span
                  className="mt-1 text-secondary/80 transition-colors group-hover:text-secondary"
                  aria-hidden="true"
                  data-testid="icon-videos-ai-revolution-arrow"
                >
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            <VideoGrid items={aiRevolutionCall} testId="grid-ai-revolution" />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
