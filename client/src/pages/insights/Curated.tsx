import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExternalLink, BookOpen } from "lucide-react";

const entries = [
  {
    tag: "NETWORK ECONOMICS",
    title: "Information Rules: A Strategic Guide to the Network Economy",
    source: "Carl Shapiro & Hal R. Varian",
    take: "Essential reading for understanding how underlying economic principles that have persisted for ages continue to be the foundation of solid analysis today.",
    href: "https://store.hbr.org/product/information-rules-a-strategic-guide-to-the-network-economy/863X",
  },
  {
    tag: "TECHNOLOGY",
    title: "Computing Machinery and Intelligence",
    source: "Alan Turing (1950)",
    take: "Turing’s original imitation game paper. It reminds us that the goal of AI is not just processing power, but the replication of reasoning—a revolution we are only now realizing.",
    href: "#",
  },
  {
    tag: "MACROECONOMICS",
    title: "The Use of Knowledge in Society",
    source: "F.A. Hayek",
    take: "A masterclass in why decentralized markets outperform central planning. In an era of AI-driven data, Hayek’s thesis on the 'dispersion of knowledge' is more relevant than ever.",
    href: "#",
  },
];

export default function Curated() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-14" data-testid="section-curated-hero">
            <div className="flex items-center gap-3 text-secondary" data-testid="row-curated-hero-kicker">
              <BookOpen size={16} aria-hidden="true" />
              <div className="text-xs font-bold uppercase tracking-widest" data-testid="text-curated-hero-kicker">
                Curated Intelligence
              </div>
            </div>
            <h1
              className="mt-4 font-display text-5xl md:text-6xl text-primary tracking-tight"
              data-testid="text-curated-hero-title"
            >
              THE LIBRARY.
            </h1>
            <p
              className="mt-6 max-w-3xl text-muted-foreground text-lg leading-relaxed"
              data-testid="text-curated-hero-subtext"
            >
              To understand the future, one must study the past. This is a living collection of the research,
              historical analogies, and economic theories that shape our investment thesis.
            </p>
            <div className="mt-10 h-px bg-border" aria-hidden="true" />
          </section>

          <section data-testid="section-curated-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="grid-curated-entries">
              {entries.map((item, idx) => (
                <article
                  key={item.title}
                  className="bg-primary text-primary-foreground border border-secondary/30 p-8 shadow-[0_0_0_1px_rgba(197,160,89,0.10)]"
                  data-testid={`card-curated-entry-${idx}`}
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary" data-testid={`text-curated-tag-${idx}`}>
                    {item.tag}
                  </div>

                  <h2 className="mt-4 font-display text-2xl md:text-3xl text-primary-foreground" data-testid={`text-curated-title-${idx}`}>
                    {item.title}
                  </h2>

                  <div className="mt-3 text-sm text-primary-foreground/70" data-testid={`text-curated-source-${idx}`}>
                    {item.source}
                  </div>

                  <div
                    className="mt-7 border border-secondary/20 bg-white/5 p-6"
                    data-testid={`card-curated-take-${idx}`}
                  >
                    <div className="text-xs font-bold uppercase tracking-widest text-secondary" data-testid={`text-curated-take-label-${idx}`}>
                      The 10,000 Days Take
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80" data-testid={`text-curated-take-${idx}`}>
                      {item.take}
                    </p>
                  </div>

                  <div className="mt-8" data-testid={`row-curated-actions-${idx}`}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter]"
                      data-testid={`button-curated-read-${idx}`}
                    >
                      Read Source
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
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
