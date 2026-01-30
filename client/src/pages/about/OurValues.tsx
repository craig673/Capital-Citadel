import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Radical Alignment",
    subtitle: "The “Investor First” Standard.",
    body:
      "Our investors are not simply clients; they are partners. The team proudly invests alongside our Limited Partners. We succeed only when you succeed. We operate with absolute transparency and ethical rigidity because we are stewards of your trust, not just your capital.",
  },
  {
    number: "02",
    title: "The Synthesis of Truth",
    subtitle: "Fundamental Insight + Quantitative Rigor.",
    body:
      "We reject the false choice between human intuition and machine precision. We believe true alpha is found at their intersection. We use proprietary algorithms to stress-test our fundamental theses, stripping away bias to reveal the raw reality of an investment. We let the data challenge our convictions, ensuring our decisions are based on evidence, not ego.",
  },
  {
    number: "03",
    title: "Intellectual Courage",
    subtitle: "The Anti-Consensus Mindset.",
    body:
      "Consensus is priced in; opportunity is not. We foster a culture where dissenting views are encouraged and conventional wisdom is interrogated. To capture the upside of a Revolution, one must have the courage to stand apart from the crowd and the discipline to hold that ground when the market disagrees.",
  },
  {
    number: "04",
    title: "Generational Discipline",
    subtitle: "The 10,000 Days Horizon.",
    body:
      "Speed is a commodity; patience is an edge. We refuse to sacrifice long-term compounding for short-term optics. We build portfolios designed to weather the volatility of the moment and capture the structural growth of the decade. We are not racing for the quarter; we are building for the era.",
  },
];

export default function OurValues() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero */}
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-4xl"
            >
              <div
                className="text-secondary font-bold uppercase tracking-widest mb-5 text-sm"
                data-testid="text-values-hero-kicker"
              >
                About
              </div>
              <h1
                className="font-display text-4xl md:text-6xl text-primary leading-tight"
                data-testid="text-values-hero-title"
              >
                Principled performance.
              </h1>
              <p
                className="mt-8 text-lg text-muted-foreground leading-relaxed"
                data-testid="text-values-hero-subtext"
              >
                We believe that high standards are non-negotiable in our field. We operate with absolute
                integrity and transparency, ensuring that our ethical commitments are the
                foundation of our partnership with you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-5xl">
              <div
                className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm"
                data-testid="text-values-pillars-kicker"
              >
                The Four Pillars
              </div>
              <h2
                className="font-display text-3xl md:text-4xl text-primary mb-10"
                data-testid="text-values-pillars-title"
              >
                How we operate.
              </h2>

              <div className="space-y-6" data-testid="list-values-pillars">
                {pillars.map((p) => (
                  <div
                    key={p.number}
                    className="bg-white border border-border p-8"
                    data-testid={`card-values-pillar-${p.number}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="md:w-56">
                        <div className="text-5xl font-display font-light text-primary/10">
                          {p.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-2xl text-primary mb-2" data-testid={`text-values-pillar-title-${p.number}`}>
                          {p.title}
                        </h3>
                        <div
                          className="text-secondary font-semibold italic mb-5"
                          data-testid={`text-values-pillar-subtitle-${p.number}`}
                        >
                          {p.subtitle}
                        </div>
                        <p className="text-muted-foreground leading-relaxed" data-testid={`text-values-pillar-body-${p.number}`}>
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="bg-primary text-primary-foreground px-10 py-14 border border-secondary/20"
              data-testid="card-values-cta"
            >
              <div
                className="text-secondary font-bold uppercase tracking-widest mb-3 text-xs"
                data-testid="text-values-cta-kicker"
              >
                Standard
              </div>
              <div className="font-display text-2xl md:text-3xl" data-testid="text-values-cta-title">
                “Integrity is our only non-depreciating asset.”
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
