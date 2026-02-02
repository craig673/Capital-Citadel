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
    date: "OCTOBER 2025",
    title: "Robotics Supply Chain Inflection Point",
    summary:
      "A sector update outlining why robotics is poised for an acceleration as AI shifts machines from programmed automation to learned behavior. We highlight the investable opportunity in the humanoid and broader robotics supply chain, where differentiated component makers can benefit regardless of which OEMs ultimately scale. We also frame key risks\u2014vertical integration and low-cost competition\u2014against the durability of Western, high-trust components.",
    href: "/assets/Robotics-Supply-Chain-Inflection-Point.pdf",
  },
  {
    date: "JANUARY 2026",
    title: "The Year of the Construct",
    summary:
      "Our 2026 outlook focuses on the convergence of AI infrastructure and energy markets. We discuss why we are increasing exposure to the 'physical layer' of the compute revolution.",
    href: "/assets/2026-Outlook.pdf",
  },
  {
    date: "OCTOBER 2025",
    title: "Volatility as an Asset Class",
    summary:
      "A review of Q3 performance and our thesis on interest rate normalization. Why we believe the era of 'free money' distortion is ending, and what it means for valuation multiples.",
    href: "/assets/Q3-Letter.pdf",
  },
  {
    date: "JULY 2025",
    title: "The Robotics Supercycle",
    summary:
      "Deep dive into the industrial automation sector. We analyze the labor shortage data and the capital expenditure intentions of the Fortune 500.",
    href: "/assets/Robotics-Paper.pdf",
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
