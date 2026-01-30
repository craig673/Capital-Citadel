import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10">
      <div
        className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm"
        data-testid="text-philosophy-kicker"
      >
        {kicker}
      </div>
      <h2
        className="font-display text-3xl md:text-4xl text-primary"
        data-testid="text-philosophy-section-title"
      >
        {title}
      </h2>
    </div>
  );
}

export default function Philosophy() {
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
                data-testid="text-philosophy-hero-kicker"
              >
                Philosophy
              </div>
              <h1
                className="font-display text-4xl md:text-6xl text-primary leading-tight"
                data-testid="text-philosophy-hero-title"
              >
                We do not chase trends.
                <br />
                We map the future.
              </h1>
              <p
                className="mt-8 text-lg text-muted-foreground leading-relaxed"
                data-testid="text-philosophy-hero-subtext-1"
              >
                Innovation is insufficient. True progress does not come from iterating on the
                status quo; it comes from breaking it. BlackBerry was an innovator, but the
                Smartphone Revolution reshaped how humanity connects. Automakers innovated for
                a century, but the transition to “robots on wheels” redefined the very concept
                of movement.
              </p>
              <p
                className="mt-6 text-lg text-muted-foreground leading-relaxed"
                data-testid="text-philosophy-hero-subtext-2"
              >
                At <span className="font-semibold text-primary">10,000 Days Capital</span>, our
                focus is singular: identifying the structural shifts that will reshape the global
                economy and the human experience over the next 27.4 years. We look past the
                noise of the moment to find the signal of the future. We are students of the
                paradigm shift. We are focused on <span className="font-semibold text-primary">Revolutions.</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* AIRS */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-5xl">
              <SectionTitle kicker="The Convergence" title="The AIRS Revolution" />
              <p
                className="text-lg text-muted-foreground leading-relaxed mb-12"
                data-testid="text-philosophy-airs-intro"
              >
                We stand at the precipice of a convergence unlike any in history. Three distinct
                yet interconnected forces are accelerating simultaneously to alter the fabric of
                society.
              </p>

              <div className="grid lg:grid-cols-3 gap-10">
                <div className="bg-white border border-border p-8" data-testid="card-airs-ai">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                    1. The AI Revolution
                  </div>
                  <h3 className="font-display text-xl text-primary mb-4">
                    The Cognitive Shift
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Artificial Intelligence is not just software; it is the decoupling of
                    intelligence from biological constraints. It is the revolution of logic,
                    creativity, and efficiency. We are moving from an era of static computation
                    to one of generative reasoning, where machines do not just execute commands
                    but solve problems. This revolution will redefine the value of human labor
                    and the speed of scientific discovery.
                  </p>
                </div>

                <div className="bg-white border border-border p-8" data-testid="card-airs-robotics">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                    2. The Robotics Revolution
                  </div>
                  <h3 className="font-display text-xl text-primary mb-4">
                    The Physical Shift
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    While AI transforms the digital world, Robotics reclaims the physical one.
                    From autonomous logistics to humanoid assistants, we are witnessing the
                    automation of the tangible. This is not just about manufacturing; it is about
                    liberating humanity from dangerous and repetitive toil, allowing the physical
                    world to move and adapt with the speed of software.
                  </p>
                </div>

                <div className="bg-white border border-border p-8" data-testid="card-airs-space">
                  <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                    3. The Space Revolution
                  </div>
                  <h3 className="font-display text-xl text-primary mb-4">
                    The Boundary Shift
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    For all of human history, our economy has been earthbound. That era is ending.
                    The Space Revolution is not merely about exploration; it is about expansion.
                    It is the industrialization of orbit, the harvesting of infinite resources,
                    and the creation of a multi-planetary civilization. We view the stars not as
                    a destination, but as the new frontier of economic and societal necessity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discipline */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
              <SectionTitle kicker="Our Discipline" title="How We See the Future" />

              <div className="space-y-12 text-muted-foreground leading-relaxed">
                <section data-testid="section-discipline-1">
                  <h3 className="font-display text-2xl text-primary mb-3">
                    1. The Discipline of 10,000 Days
                  </h3>
                  <p>
                    Civilization is built on long horizons. While the world reacts to the
                    volatility of the hour, we operate on a timeline of 10,000 days. We model the
                    future not by quarters, but by decades. This long-term discipline allows us
                    to see past the “froth” of hype cycles and identify the enduring technologies
                    that will thrive long after the bubbles burst.
                  </p>
                </section>

                <section data-testid="section-discipline-2">
                  <h3 className="font-display text-2xl text-primary mb-3">
                    2. The Contrarian Mindset
                  </h3>
                  <p>
                    The Status Quo is rarely the future. To see what others miss, one must be
                    willing to stand apart. We challenge conventional wisdom and reject the
                    comfort of the crowd. When the world sees fear, we see opportunity. When the
                    world sees euphoria, we see caution. We strip away emotional bias to view the
                    mechanics of society with absolute clarity.
                  </p>
                </section>

                <section data-testid="section-discipline-3">
                  <h3 className="font-display text-2xl text-primary mb-3">
                    3. The Proprietary Lens
                  </h3>
                  <p className="mb-5">
                    Understanding a Revolution requires both a telescope and a microscope.
                  </p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="font-semibold text-primary">Top-Down:</span> We analyze the
                      macroscopic shifts in demographics, energy, and geopolitics that create the
                      fertile ground for change.
                    </li>
                    <li>
                      <span className="font-semibold text-primary">Bottom-Up:</span> We apply
                      rigorous mathematical modeling to the specific engines of these
                      Revolutions—the entities executing the vision.
                    </li>
                  </ul>
                  <p className="mt-5">
                    By quantifying factors like “Inflection Points” and “Scalability” through our
                    proprietary models, we turn abstract visions into measurable data.
                  </p>
                </section>

                <section data-testid="section-discipline-4" className="border-t border-border pt-10">
                  <h3 className="font-display text-2xl text-primary mb-3">
                    4. The Human Element
                  </h3>
                  <p>
                    Technology is the tool, but humanity is the architect. Our approach is driven
                    by a collective of thinkers, engineers, and analysts united by a single
                    ambition: to be on the right side of history.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
