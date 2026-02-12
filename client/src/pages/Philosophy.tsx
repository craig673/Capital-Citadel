import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

function ConvergenceSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.10 }}
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
        </radialGradient>
      </defs>

      <line x1="200" y1="300" x2="600" y2="300" stroke="#C5A059" strokeWidth="1" />
      <line x1="600" y1="300" x2="1000" y2="300" stroke="#C5A059" strokeWidth="1" />

      <line x1="200" y1="300" x2="600" y2="120" stroke="#C5A059" strokeWidth="0.7" strokeDasharray="6 4" />
      <line x1="1000" y1="300" x2="600" y2="120" stroke="#C5A059" strokeWidth="0.7" strokeDasharray="6 4" />

      <line x1="200" y1="300" x2="600" y2="480" stroke="#C5A059" strokeWidth="0.7" strokeDasharray="6 4" />
      <line x1="1000" y1="300" x2="600" y2="480" stroke="#C5A059" strokeWidth="0.7" strokeDasharray="6 4" />

      <path d="M100 150 L160 150 L160 200 L220 200" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M100 450 L160 450 L160 400 L220 400" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M980 150 L1040 150 L1040 200 L1100 200" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M980 450 L1040 450 L1040 400 L1100 400" stroke="#C5A059" strokeWidth="0.5" />

      <path d="M350 100 L400 100 L400 160" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M350 500 L400 500 L400 440" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M800 100 L850 100 L850 160" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M800 500 L850 500 L850 440" stroke="#C5A059" strokeWidth="0.5" />

      <path d="M500 80 L540 80 L540 140 L580 140" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M620 140 L660 140 L660 80 L700 80" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M500 520 L540 520 L540 460 L580 460" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M620 460 L660 460 L660 520 L700 520" stroke="#C5A059" strokeWidth="0.5" />

      <path d="M280 220 Q340 180 400 220" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M800 220 Q860 180 920 220" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M280 380 Q340 420 400 380" stroke="#C5A059" strokeWidth="0.5" />
      <path d="M800 380 Q860 420 920 380" stroke="#C5A059" strokeWidth="0.5" />

      <circle cx="200" cy="300" r="8" fill="url(#nodeGlow)" />
      <circle cx="200" cy="300" r="3" fill="#C5A059" />

      <circle cx="600" cy="300" r="12" fill="url(#nodeGlow)" />
      <circle cx="600" cy="300" r="4" fill="#C5A059" />

      <circle cx="1000" cy="300" r="8" fill="url(#nodeGlow)" />
      <circle cx="1000" cy="300" r="3" fill="#C5A059" />

      <circle cx="600" cy="120" r="5" fill="url(#nodeGlow)" />
      <circle cx="600" cy="120" r="2" fill="#C5A059" />
      <circle cx="600" cy="480" r="5" fill="url(#nodeGlow)" />
      <circle cx="600" cy="480" r="2" fill="#C5A059" />

      {[160, 220, 350, 400, 500, 540, 660, 700, 800, 850, 980, 1040].map((x, i) =>
        [100, 150, 200, 450, 500, 520].filter((_, j) => (i + j) % 3 === 0).map((y) => (
          <circle key={`n-${x}-${y}`} cx={x} cy={y} r="1.5" fill="#C5A059" opacity="0.5" />
        ))
      )}

      <rect x="180" y="280" width="40" height="40" rx="0" stroke="#C5A059" strokeWidth="0.4" fill="none" />
      <rect x="580" y="280" width="40" height="40" rx="0" stroke="#C5A059" strokeWidth="0.4" fill="none" />
      <rect x="980" y="280" width="40" height="40" rx="0" stroke="#C5A059" strokeWidth="0.4" fill="none" />

      <rect x="140" y="260" width="120" height="80" rx="0" stroke="#C5A059" strokeWidth="0.3" fill="none" strokeDasharray="3 3" />
      <rect x="540" y="260" width="120" height="80" rx="0" stroke="#C5A059" strokeWidth="0.3" fill="none" strokeDasharray="3 3" />
      <rect x="940" y="260" width="120" height="80" rx="0" stroke="#C5A059" strokeWidth="0.3" fill="none" strokeDasharray="3 3" />
    </svg>
  );
}

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.15,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

function AIRSCard({
  kicker,
  title,
  description,
  videoSrc,
  testId,
  index,
}: {
  kicker: string;
  title: string;
  description: string;
  videoSrc: string;
  testId: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    videoRef.current?.pause();
  };

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      className="relative overflow-hidden border border-border p-8 transition-transform duration-300 ease-out cursor-default"
      style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={testId}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      <div className="relative z-10">
        <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
          {kicker}
        </div>
        <h3
          className="font-display text-xl mb-4 transition-colors duration-300"
          style={{ color: hovered ? "#ffffff" : "" }}
        >
          {!hovered && <span className="text-primary">{title}</span>}
          {hovered && <span>{title}</span>}
        </h3>
        <p
          className="leading-relaxed transition-colors duration-300"
          style={{ color: hovered ? "rgba(255,255,255,0.85)" : "" }}
        >
          {!hovered && <span className="text-muted-foreground">{description}</span>}
          {hovered && <span>{description}</span>}
        </p>
      </div>
    </motion.div>
  );
}

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
            <div className="max-w-4xl">
              <motion.div
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={0}
              >
                <div
                  className="text-secondary font-bold uppercase tracking-widest mb-5 text-sm"
                  data-testid="text-philosophy-hero-kicker"
                >
                  Philosophy
                </div>
              </motion.div>

              <motion.h1
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={1}
                className="font-display text-4xl md:text-6xl text-primary leading-tight"
                data-testid="text-philosophy-hero-title"
              >
                We do not chase trends.
                <br />
                <span
                  className="inline-block bg-clip-text text-transparent animate-shimmer"
                  style={{
                    backgroundImage: "linear-gradient(110deg, #C5A059 0%, #E8D5A3 30%, #C5A059 50%, #A8843C 70%, #C5A059 100%)",
                    backgroundSize: "300% 100%",
                  }}
                >
                  We map the future.
                </span>
              </motion.h1>

              <motion.p
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={2}
                className="mt-8 text-lg text-muted-foreground leading-relaxed"
                data-testid="text-philosophy-hero-subtext-1"
              >
                Innovation is insufficient. True progress does not come from iterating on the
                status quo; it comes from breaking it. BlackBerry was an innovator, but the
                Smartphone Revolution reshaped how humanity connects. Automakers innovated for
                a century, but the transition to "robots on wheels" redefined the very concept
                of movement.
              </motion.p>

              <motion.p
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={3}
                className="mt-6 text-lg text-muted-foreground leading-relaxed"
                data-testid="text-philosophy-hero-subtext-2"
              >
                At <span className="font-semibold text-primary">10,000 Days Capital</span>, our
                focus is singular: identifying the structural shifts that will reshape the global
                economy and the human experience over the next 27.4 years. We look past the
                noise of the moment to find the signal of the future. We are students of the
                paradigm shift. We are focused on <span className="font-semibold text-primary">Revolutions.</span>
              </motion.p>
            </div>
          </div>
        </section>

        {/* AIRS */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-5xl">
              <motion.div
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={0}
              >
                <SectionTitle kicker="The Convergence" title="The AIRS Revolution" />
              </motion.div>

              <motion.p
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={1}
                className="text-lg text-muted-foreground leading-relaxed mb-12"
                data-testid="text-philosophy-airs-intro"
              >
                We stand at the precipice of a convergence unlike any in history. Three distinct
                yet interconnected forces are accelerating simultaneously to alter the fabric of
                society.
              </motion.p>

              <div className="relative">
                <div className="absolute inset-0 -z-10 -m-8 hidden lg:block" aria-hidden="true">
                  <ConvergenceSVG />
                </div>
              <div className="grid lg:grid-cols-3 gap-10">
                <AIRSCard
                  kicker="1. The AI Revolution"
                  title="The Cognitive Shift"
                  description="Artificial Intelligence is not just software; it is the decoupling of intelligence from biological constraints. It is the revolution of logic, creativity, and efficiency. We are moving from an era of static computation to one of generative reasoning, where machines do not just execute commands but solve problems. This revolution will redefine the value of human labor and the speed of scientific discovery."
                  videoSrc="/videos/airs-ai-bg.mp4"
                  testId="card-airs-ai"
                  index={0}
                />

                <AIRSCard
                  kicker="2. The Robotics Revolution"
                  title="The Physical Shift"
                  description="While AI transforms the digital world, Robotics reclaims the physical one. From autonomous logistics to humanoid assistants, we are witnessing the automation of the tangible. This is not just about manufacturing; it is about liberating humanity from dangerous and repetitive toil, allowing the physical world to move and adapt with the speed of software."
                  videoSrc="/videos/airs-robotics-bg.mp4"
                  testId="card-airs-robotics"
                  index={1}
                />

                <AIRSCard
                  kicker="3. The Space Revolution"
                  title="The Boundary Shift"
                  description="For all of human history, our economy has been earthbound. That era is ending. The Space Revolution is not merely about exploration; it is about expansion. It is the industrialization of orbit, the harvesting of infinite resources, and the creation of a multi-planetary civilization. We view the stars not as a destination, but as the new frontier of economic and societal necessity."
                  videoSrc="/videos/airs-space-bg.mp4"
                  testId="card-airs-space"
                  index={2}
                />
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discipline */}
        <section className="py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
              <motion.div
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={0}
              >
                <SectionTitle kicker="Our Discipline" title="How We See the Future" />
              </motion.div>

              <div className="space-y-12 text-muted-foreground leading-relaxed">
                <motion.section
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={0}
                  data-testid="section-discipline-1"
                >
                  <h3 className="font-display text-2xl text-primary mb-3">
                    1. The Discipline of 10,000 Days
                  </h3>
                  <p>
                    Civilization is built on long horizons. While the world reacts to the
                    volatility of the hour, we operate on a timeline of 10,000 days. We model the
                    future not by quarters, but by decades. This long-term discipline allows us
                    to see past the "froth" of hype cycles and identify the enduring technologies
                    that will thrive long after the bubbles burst.
                  </p>
                </motion.section>

                <motion.section
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={1}
                  data-testid="section-discipline-2"
                >
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
                </motion.section>

                <motion.section
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={2}
                  data-testid="section-discipline-3"
                >
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
                    By quantifying factors like "Inflection Points" and "Scalability" through our
                    proprietary models, we turn abstract visions into measurable data.
                  </p>
                </motion.section>

                <motion.section
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={3}
                  data-testid="section-discipline-4"
                  className="border-t border-border pt-10"
                >
                  <h3 className="font-display text-2xl text-primary mb-3">
                    4. The Human Element
                  </h3>
                  <p>
                    Technology is the tool, but humanity is the architect. Our approach is driven
                    by a collective of thinkers, engineers, and analysts united by a single
                    ambition: to be on the right side of history.
                  </p>
                </motion.section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
