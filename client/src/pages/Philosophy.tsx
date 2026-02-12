import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.15,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const disciplinePoints = [
  {
    id: "section-discipline-1",
    title: "1. The Discipline of 10,000 Days",
    content: (
      <p>
        Civilization is built on long horizons. While the world reacts to the
        volatility of the hour, we operate on a timeline of 10,000 days. We model the
        future not by quarters, but by decades. This long-term discipline allows us
        to see past the "froth" of hype cycles and identify the enduring technologies
        that will thrive long after the bubbles burst.
      </p>
    ),
  },
  {
    id: "section-discipline-2",
    title: "2. The Contrarian Mindset",
    content: (
      <p>
        The Status Quo is rarely the future. To see what others miss, one must be
        willing to stand apart. We challenge conventional wisdom and reject the
        comfort of the crowd. When the world sees fear, we see opportunity. When the
        world sees euphoria, we see caution. We strip away emotional bias to view the
        mechanics of society with absolute clarity.
      </p>
    ),
  },
  {
    id: "section-discipline-3",
    title: "3. The Proprietary Lens",
    content: (
      <>
        <p className="mb-5">
          Understanding a Revolution requires both a telescope and a microscope.
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <span className="font-semibold text-white">Top-Down:</span> We analyze the
            macroscopic shifts in demographics, energy, and geopolitics that create the
            fertile ground for change.
          </li>
          <li>
            <span className="font-semibold text-white">Bottom-Up:</span> We apply
            rigorous mathematical modeling to the specific engines of these
            Revolutions—the entities executing the vision.
          </li>
        </ul>
        <p className="mt-5">
          By quantifying factors like "Inflection Points" and "Scalability" through our
          proprietary models, we turn abstract visions into measurable data.
        </p>
      </>
    ),
  },
  {
    id: "section-discipline-4",
    title: "4. The Human Element",
    content: (
      <p>
        Technology is the tool, but humanity is the architect. Our approach is driven
        by a collective of thinkers, engineers, and analysts united by a single
        ambition: to be on the right side of history.
      </p>
    ),
  },
];

function WireframeSphere() {
  return (
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      width="600"
      height="600"
      viewBox="0 0 600 600"
      fill="none"
      style={{ opacity: 0.10 }}
    >
      <circle cx="300" cy="300" r="250" stroke="#C5A059" strokeWidth="0.5" />
      <circle cx="300" cy="300" r="200" stroke="#C5A059" strokeWidth="0.4" />
      <circle cx="300" cy="300" r="150" stroke="#C5A059" strokeWidth="0.3" />

      <ellipse cx="300" cy="300" rx="250" ry="80" stroke="#C5A059" strokeWidth="0.5" />
      <ellipse cx="300" cy="300" rx="250" ry="80" stroke="#C5A059" strokeWidth="0.4" transform="rotate(30 300 300)" />
      <ellipse cx="300" cy="300" rx="250" ry="80" stroke="#C5A059" strokeWidth="0.4" transform="rotate(60 300 300)" />
      <ellipse cx="300" cy="300" rx="250" ry="80" stroke="#C5A059" strokeWidth="0.4" transform="rotate(90 300 300)" />
      <ellipse cx="300" cy="300" rx="250" ry="80" stroke="#C5A059" strokeWidth="0.4" transform="rotate(120 300 300)" />
      <ellipse cx="300" cy="300" rx="250" ry="80" stroke="#C5A059" strokeWidth="0.4" transform="rotate(150 300 300)" />

      <ellipse cx="300" cy="300" rx="80" ry="250" stroke="#C5A059" strokeWidth="0.4" />
      <ellipse cx="300" cy="300" rx="160" ry="250" stroke="#C5A059" strokeWidth="0.3" />

      <line x1="50" y1="300" x2="550" y2="300" stroke="#C5A059" strokeWidth="0.3" />
      <line x1="300" y1="50" x2="300" y2="550" stroke="#C5A059" strokeWidth="0.3" />
    </svg>
  );
}

function DisciplineScrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPoints = disciplinePoints.length;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [sphereRotation, setSphereRotation] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const segmentSize = 1 / (totalPoints + 1);
    const idx = Math.floor(v / segmentSize) - 1;
    const clamped = Math.max(-1, Math.min(totalPoints - 1, idx));
    setActiveIndex(clamped);
    setSphereRotation(v * 120);
  });

  return (
    <div ref={containerRef} style={{ height: `${(totalPoints + 2) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: "#0A0A0F" }}>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: `rotate(${sphereRotation}deg)`, transition: "transform 0.3s ease-out" }}
        >
          <WireframeSphere />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <div className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm">
              Our Discipline
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              How We See the Future
            </h2>
          </div>

          <div className="space-y-10">
            {disciplinePoints.map((point, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              const isFuture = i > activeIndex;
              const isVisible = activeIndex >= 0;

              let opacity = 0;
              let translateY = 40;

              if (isVisible) {
                if (isActive) {
                  opacity = 1;
                  translateY = 0;
                } else if (isPast) {
                  opacity = 0.3;
                  translateY = -20;
                } else if (isFuture && i === activeIndex + 1) {
                  opacity = 0.15;
                  translateY = 30;
                } else {
                  opacity = 0;
                  translateY = 40;
                }
              }

              return (
                <motion.div
                  key={point.id}
                  data-testid={point.id}
                  animate={{ opacity, y: translateY }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  className="leading-relaxed"
                >
                  <h3 className="font-display text-2xl text-white mb-3">
                    {point.title}
                  </h3>
                  <div className="text-gray-400">
                    {point.content}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

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
        </section>

        {/* Discipline — Sticky Scrollytelling */}
        <DisciplineScrollytelling />
      </main>
      <Footer />
    </div>
  );
}
