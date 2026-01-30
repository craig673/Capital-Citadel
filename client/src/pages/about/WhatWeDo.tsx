import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function WhatWeDo() {
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
                data-testid="text-whatwedo-hero-kicker"
              >
                Firm Overview
              </div>
              <h1
                className="font-display text-4xl md:text-6xl text-primary leading-tight"
                data-testid="text-whatwedo-hero-title"
              >
                Committed to excellence.
              </h1>
              <p
                className="mt-8 text-lg text-muted-foreground leading-relaxed"
                data-testid="text-whatwedo-hero-subtext"
              >
                10,000 Days Capital Management is a private investment firm dedicated to
                delivering superior risk-adjusted returns. We navigate complex markets with a
                disciplined, long-term perspective.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 1 */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
              <div className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm" data-testid="text-whatwedo-1-kicker">
                Who We Are
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-primary mb-6" data-testid="text-whatwedo-1-title">
                A Tradition of Discipline
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed" data-testid="text-whatwedo-1-body">
                <p>
                  We are an investment firm serving accredited investors and qualified
                  purchasers. Our mission is to preserve and grow capital by identifying
                  structural dislocations in the global economy.
                </p>
                <p>
                  We do not chase temporary trends. We focus on “The 10,000 Days”—investing with
                  a generational horizon that allows us to filter out market noise and execute
                  with conviction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
              <div className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm" data-testid="text-whatwedo-2-kicker">
                Our Leadership
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-primary mb-6" data-testid="text-whatwedo-2-title">
                Led by Experience
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed" data-testid="text-whatwedo-2-body">
                <p>
                  The firm is led by <span className="font-semibold text-primary">Cody Willard</span>, who brings
                  over 30 years of investment experience to the portfolio.
                </p>
                <p>
                  From the trading floor to the boardroom, our leadership’s deep domain
                  expertise anchors our strategy. We combine this fundamental experience with
                  proprietary analytical frameworks to maintain an edge in an evolving market.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-5xl">
              <div className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm" data-testid="text-whatwedo-3-kicker">
                Our Approach
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-primary mb-10" data-testid="text-whatwedo-3-title">
                Rigor & Responsibility
              </h2>

              <div className="grid lg:grid-cols-3 gap-10" data-testid="grid-whatwedo-approach">
                <div className="bg-white border border-border p-8" data-testid="card-approach-fundamental">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Fundamental Research</div>
                  <p className="text-muted-foreground leading-relaxed">
                    We conduct deep-dive analysis into business models, favoring companies with
                    robust moats and visionary execution.
                  </p>
                </div>
                <div className="bg-white border border-border p-8" data-testid="card-approach-risk">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Risk Management</div>
                  <p className="text-muted-foreground leading-relaxed">
                    Capital preservation is our first mandate. We employ active hedging and
                    strict position sizing to manage volatility.
                  </p>
                </div>
                <div className="bg-white border border-border p-8" data-testid="card-approach-alignment">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Alignment</div>
                  <p className="text-muted-foreground leading-relaxed">
                    We are partners in prosperity. We invest our own capital alongside our
                    clients, ensuring our interests are fully aligned.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-primary text-primary-foreground px-10 py-14 border border-secondary/20" data-testid="card-whatwedo-cta">
              <div className="text-secondary font-bold uppercase tracking-widest mb-3 text-xs" data-testid="text-whatwedo-cta-kicker">
                Patient Capital
              </div>
              <div className="font-display text-2xl md:text-3xl" data-testid="text-whatwedo-cta-title">
                “Discover the power of patient capital.”
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
