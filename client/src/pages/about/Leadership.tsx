import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

import codyOnCnbc from "../../../../attached_assets/Cody_on_CNBC_3_1769800619131.jpg";
import codyFamily from "../../../../attached_assets/Cody_&_Fam_1769800970387.jpg";

export default function Leadership() {
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
              className="max-w-5xl"
            >
              <div
                className="text-secondary font-bold uppercase tracking-widest mb-5 text-sm"
                data-testid="text-leadership-hero-kicker"
              >
                About
              </div>
              <h1
                className="font-display text-4xl md:text-6xl text-primary leading-tight"
                data-testid="text-leadership-hero-title"
              >
                Leadership
              </h1>
              <p
                className="mt-8 text-lg text-muted-foreground leading-relaxed"
                data-testid="text-leadership-hero-subtext"
              >
                Experience is a risk discipline. We lead with clarity, accountability, and a
                long-horizon perspective.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Profile */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-12 items-start" data-testid="grid-leadership-profile">
              <div className="lg:col-span-5">
                <div className="mb-4">
                  <div className="text-secondary text-xs font-bold uppercase tracking-widest" data-testid="text-leadership-cody-role">
                    Portfolio Manager
                  </div>
                  <div className="mt-1 text-primary font-display text-3xl" data-testid="text-leadership-cody-name">
                    Cody Willard
                  </div>
                </div>

                <div className="bg-white border border-border" data-testid="card-leadership-cody">
                  <div className="relative">
                    <img
                      src={codyOnCnbc}
                      alt="Cody Willard on CNBC"
                      className="w-full h-auto"
                      data-testid="img-leadership-cody-cnbc"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-6" data-testid="grid-leadership-cody-stats">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-secondary" data-testid="text-leadership-cody-statlabel-0">
                          Experience
                        </div>
                        <div className="mt-2 font-display text-2xl text-primary" data-testid="text-leadership-cody-statvalue-0">
                          30+ Years
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-secondary" data-testid="text-leadership-cody-statlabel-1">
                          Focus
                        </div>
                        <div className="mt-2 font-display text-2xl text-primary" data-testid="text-leadership-cody-statvalue-1">
                          Long-Horizon
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed" data-testid="text-leadership-cody-summary">
                      <p>
                        Cody Willard is the Portfolio Manager of 10,000 Days Capital Management.
                        His career began on Wall Street in 1996 and has spanned hedge fund
                        management, tech/finance analysis, and media.
                      </p>
                      <p>
                        He is a former national television anchor and has served as an adjunct
                        professor, teaching Revolutionomics. He is also the author of
                        <span className="text-primary font-semibold"> Trading with Cody</span>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 bg-primary text-primary-foreground border border-secondary/20 p-8" data-testid="card-leadership-note">
                  <div className="text-secondary text-xs font-bold uppercase tracking-widest" data-testid="text-leadership-note-kicker">
                    Partnership
                  </div>
                  <div className="mt-3 font-display text-xl" data-testid="text-leadership-note">
                    We invest with our Limited Partners, and we lead with the same discipline we
                    demand of the portfolio.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-white border border-border p-10" data-testid="card-leadership-bio">
                  <div className="text-secondary font-bold uppercase tracking-widest text-sm" data-testid="text-leadership-bio-kicker">
                    Background
                  </div>
                  <h2 className="mt-3 font-display text-3xl md:text-4xl text-primary" data-testid="text-leadership-bio-title">
                    Career Highlights
                  </h2>

                  <ul className="mt-10 space-y-6 text-muted-foreground" data-testid="list-leadership-highlights">
                    {[
                      "Started career on Wall Street in 1996.",
                      "Worked his way from Starbucks barista to Oppenheimer analyst and became the first partner to famed stockbroker Andrew Lanj.",
                      "Multifaceted career spanning hedge fund management, tech/finance analysis, media, and real estate.",
                      "Former national TV anchor; co-host of Fox Business Happy Hour and on-air partner to Larry Kudlow on CNBC.",
                      "Former adjunct professor at Seton Hall University where he taught Revolutionomics.",
                      "Publisher of TradingWithCody.com and author of the #1 Amazon best-seller Everything You Need to Know About Investing.",
                      "Also managed a $20 million \"long-only fund\" seeded by an Abu Dhabi sovereign wealth fund.",
                      "Holds a BA in Economics from the University of New Mexico.",
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-4" data-testid={`row-leadership-highlight-${idx}`}>
                        <div className="mt-2 size-1.5 bg-secondary" aria-hidden="true" />
                        <div data-testid={`text-leadership-highlight-${idx}`}>{item}</div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-12 border-t border-border pt-10" data-testid="section-leadership-personal">
                    <div className="grid md:grid-cols-12 gap-8 items-start">
                      <div className="md:col-span-5">
                        <div className="text-secondary font-bold uppercase tracking-widest text-sm" data-testid="text-leadership-personal-kicker">
                          Perspective
                        </div>
                        <h3 className="mt-3 font-display text-2xl text-primary" data-testid="text-leadership-personal-title">
                          A grounded approach
                        </h3>
                        <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-leadership-personal-body">
                          A disciplined life builds a disciplined investor. We approach markets
                          with humility, rigor, and responsibility.
                        </p>
                      </div>
                      <div className="md:col-span-7">
                        <div className="bg-white border border-border" data-testid="card-leadership-family">
                          <img
                            src={codyFamily}
                            alt="Cody Willard with family"
                            className="w-full h-auto"
                            data-testid="img-leadership-cody-family"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
