import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Vision",
    subtitle: "The Intuition to Identify Revolution.",
    body:
      "We possess the fundamental understanding and raw intuition required to find Revolutionary companies. In our pursuit of the next Great Revolution, we look beyond the data to see the structural shifts that will define the future.",
  },
  {
    number: "02",
    title: "Discipline",
    subtitle: 'The "Investor First" Standard.',
    body:
      "Discipline is the resolve to make the hard decisions: to hold when conviction is high, to trim when the market gets frothy, and to ensure our investors' interests are always first. We operate with the ethical rigidity required to be true stewards of capital.",
  },
  {
    number: "03",
    title: "Patience",
    subtitle: "The 10,000 Days Virtue.",
    body:
      "Patience keeps us from bailing when markets fluctuate. It is the virtue that ensures we stick to our philosophy of investing for the next 10,000 days. We aren't racing for the quarter; we are building for the era.",
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

        {/* Three Pillars */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-5xl">
              <div
                className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm"
                data-testid="text-values-pillars-kicker"
              >
                The Three Pillars
              </div>
              <h2
                className="font-display text-3xl md:text-4xl text-primary mb-4"
                data-testid="text-values-pillars-title"
              >
                How we operate.
              </h2>
              <p
                className="text-muted-foreground leading-relaxed mb-10"
                data-testid="text-values-pillars-summary"
              >
                At 10,000 Days Capital, we do not chase cycles; we anticipate Revolutions. Our framework is built upon three non-negotiable pillars: the Vision to see opportunity, the Discipline to manage it with integrity, and the Patience to let compounding work its magic. We operate at the intersection of fundamental insight and generational time horizons.
              </p>

              <div className="space-y-6" data-testid="list-values-pillars">
                {pillars.map((p) => (
                  <div
                    key={p.number}
                    className="bg-white border border-border p-8 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-secondary/50"
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

      </main>
      <Footer />
    </div>
  );
}
