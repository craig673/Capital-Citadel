import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Download, FileText } from "lucide-react";

const documents = [
  {
    date: "JANUARY 2026",
    title: "The AIRS Revolution",
    summary:
      "A foundational framework piece that explains why AI, robotics, and space are converging into a single compounding supercycle\u2014the AIRS Revolution. It reframes macro noise as secondary to technology-driven productivity and wealth creation, positioning 10,000 Days Capital as long-horizon Revolution Investors. This is a staple narrative for clients because it clarifies what we own, why we own it, and why the next 25 years are structurally different.",
    href: "/assets/The-AIRS-Revolution.pdf",
  },
  {
    date: "JUNE 2023",
    title: "What Does it Mean to be a Revolution Investor?",
    summary:
      "A clear, first-principles explanation of the Revolution Investing playbook: identify paradigm-shifting technological revolutions, determine the likely winners and losers, and position capital early while maintaining discipline through inevitable cycles. Bryce outlines why these shifts repeatedly drive multi-billion and trillion-dollar value creation—and why the real edge comes from sustained research, integrity, and long-term conviction rather than reactive macro noise. The piece reinforces our focus on learning, perspective, and community to continually surface the next compounding opportunities.",
    href: "/assets/What-Does-It-Mean-To-Be-A-Revolution-Investor.pdf",
  },
  {
    date: "DECEMBER 2025",
    title: "Our 2026 Predictions",
    summary:
      "A high-conviction set of calls spanning markets, macro, and the AIRS landscape\u2014from shifting sentiment around stores of value to the next phase of AI infrastructure, energy, and space. The note pairs Cody\u2019s macro-market expectations with Bryce\u2019s forward-looking milestones in humanoid adoption, direct-to-cell connectivity, and AI-driven platform breakouts. It\u2019s a staple because it crisply communicates how we think, what we\u2019re watching, and why Revolution Investing stays focused on multi-year compounding over short-term noise.",
    href: "/assets/Our-2026-Predictions.pdf",
  },
  {
    date: "OCTOBER 2025",
    title: "Value Investing Meets Revolution Technology",
    summary:
      "A detailed look at how we blend classic value discipline with Revolution Investing: rigorous financial modeling, long-horizon profitability assumptions, and valuation work that goes far beyond headline P/E ratios. Bryce explains how we estimate five-year return potential by pairing a company\u2019s role in a Tech Revolution with management quality, margin structure, and realistic multiples. The framework is designed to keep us concentrated in the most Revolutionary platform builders while avoiding the drawdowns that come from chasing every shiny object.",
    href: "/assets/Value-Investing-Meets-Revolution-Technology.pdf",
  },
  {
    date: "OCTOBER 2025",
    title: "Robotics Supply Chain Inflection Point",
    summary:
      "A sector update outlining why robotics is poised for an acceleration as AI shifts machines from programmed automation to learned behavior. We highlight the investable opportunity in the humanoid and broader robotics supply chain, where differentiated component makers can benefit regardless of which OEMs ultimately scale. We also frame key risks\u2014vertical integration and low-cost competition\u2014against the durability of Western, high-trust components.",
    href: "/assets/Robotics-Supply-Chain-Inflection-Point.pdf",
  },
  {
    date: "AUGUST 2025",
    title: "Revolution Investing Valuations",
    summary:
      "A deep dive into why valuation discipline remains central to our Revolution Investing framework, even amidst rapid technological shifts. We contrast historic P/E ratios from the App Revolution era against today\u2019s AI-driven market, explaining why higher multiples for dominant, high-margin platforms like Apple and Nvidia are justified by their unprecedented scale and durability. At the same time, we caution against the 'hype-ful' overvaluation of unproven theme stocks, emphasizing our focus on profitable winners over speculative FOMO.",
    href: "/assets/Revolution-Investing-Valuations.pdf",
  },
];

export default function Commentary() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-14" data-testid="section-commentary-hero">
            <div className="flex items-center gap-3 text-secondary" data-testid="row-commentary-hero-kicker">
              <FileText size={16} aria-hidden="true" />
              <div className="text-xs font-bold uppercase tracking-widest" data-testid="text-commentary-hero-kicker">
                Investor Relations Archive
              </div>
            </div>

            <h1
              className="mt-4 font-display text-5xl md:text-6xl text-primary tracking-tight"
              data-testid="text-commentary-hero-title"
            >
              MARKET COMMENTARY.
            </h1>
            <p
              className="mt-6 max-w-3xl text-muted-foreground text-lg leading-relaxed"
              data-testid="text-commentary-hero-subtext"
            >
              Our latest thinking on market structure, thematic positioning, and the macroeconomic landscape.
            </p>
            <div className="mt-10 h-px bg-border" aria-hidden="true" />
          </section>

          <section data-testid="section-commentary-grid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="grid-commentary-documents">
              {documents.map((doc, idx) => (
                <article
                  key={`${doc.date}-${doc.title}`}
                  className="bg-primary text-primary-foreground border border-secondary/30 p-8 shadow-[0_0_0_1px_rgba(197,160,89,0.10)]"
                  data-testid={`card-commentary-doc-${idx}`}
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary" data-testid={`text-commentary-date-${idx}`}>
                    {doc.date}
                  </div>

                  <h2 className="mt-4 font-display text-2xl md:text-3xl text-primary-foreground" data-testid={`text-commentary-title-${idx}`}>
                    {doc.title}
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80" data-testid={`text-commentary-summary-${idx}`}>
                    {doc.summary}
                  </p>

                  <div className="mt-8" data-testid={`row-commentary-actions-${idx}`}>
                    <a
                      href={doc.href}
                      className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter]"
                      data-testid={`button-commentary-download-${idx}`}
                    >
                      Download PDF
                      <Download size={14} aria-hidden="true" />
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
