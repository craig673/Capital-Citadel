import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Radio } from "lucide-react";
import { Link } from "wouter";

const episodes = [
  {
    date: "JAN 27, 2025",
    id: "SINhxpfRNYs",
    title: "The AI Revolution Call: Jan 27",
    context:
      "Weekly analysis of major tech equities (TSLA, NVDA), crypto markets, and the macroeconomic outlook for late January.",
  },
  {
    date: "JAN 21, 2025",
    id: "MMSGUjoTFZU",
    title: "The AI Revolution Call: Jan 21",
    context:
      "A deep dive into Q1 market trends, key support levels for major indices, and the evolving AI hardware trade.",
  },
  {
    date: "JAN 13, 2025",
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

export default function AiRevolution() {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-primary-foreground">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-14" data-testid="section-ai-revolution-hero">
            <div className="flex items-center justify-between gap-6" data-testid="row-ai-revolution-hero">
              <div>
                <div className="flex items-center gap-3 text-secondary" data-testid="row-ai-revolution-kicker">
                  <Radio size={16} aria-hidden="true" />
                  <div
                    className="text-xs font-bold uppercase tracking-widest"
                    data-testid="text-ai-revolution-kicker"
                  >
                    Series
                  </div>
                </div>
                <h1
                  className="mt-4 font-display text-5xl md:text-6xl tracking-tight"
                  data-testid="text-ai-revolution-title"
                >
                  THE AI REVOLUTION CALL.
                </h1>
                <p
                  className="mt-6 max-w-3xl text-muted-foreground text-lg leading-relaxed"
                  data-testid="text-ai-revolution-subtext"
                >
                  A running archive of weekly conversations focused on the AI complex, market structure, and the macro
                  backdrop.
                </p>
              </div>

              <Link
                href="/insights/videos"
                className="hidden md:inline-flex items-center gap-2 text-secondary/90 hover:text-secondary transition-colors"
                data-testid="link-ai-revolution-back"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest">Back to Screening Room</span>
              </Link>
            </div>

            <div className="mt-10 h-px bg-secondary/20" aria-hidden="true" />
          </section>

          <section data-testid="section-ai-revolution-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="grid-ai-revolution-episodes">
              {episodes.map((ep, idx) => (
                <article
                  key={ep.id}
                  className="h-full flex flex-col border border-secondary/30 bg-white/[0.03] shadow-[0_0_0_1px_rgba(197,160,89,0.08)]"
                  data-testid={`card-ai-revolution-${idx}`}
                >
                  <VideoFrame id={ep.id} title={ep.title} testId={`video-ai-revolution-${idx}`} />

                  <div className="p-6 flex-1 flex flex-col" data-testid={`section-ai-revolution-meta-${idx}`}>
                    <div
                      className="text-xs font-bold uppercase tracking-widest text-secondary"
                      data-testid={`text-ai-revolution-date-${idx}`}
                    >
                      {ep.date}
                    </div>
                    <h2
                      className="mt-3 font-display text-2xl text-primary-foreground"
                      data-testid={`text-ai-revolution-episode-title-${idx}`}
                    >
                      {ep.title}
                    </h2>
                    <p
                      className="mt-3 text-sm leading-relaxed text-primary-foreground/75"
                      data-testid={`text-ai-revolution-context-${idx}`}
                    >
                      {ep.context}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
