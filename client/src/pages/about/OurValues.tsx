import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.1,
      ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

const pillars = [
  {
    number: "01",
    title: "Vision",
    subtitle: "The Intuition to Identify Revolution.",
    body: "We possess the fundamental understanding and raw intuition required to find Revolutionary companies. In our pursuit of the next Great Revolution, we look beyond the data to see the structural shifts that will define the future.",
    videoSrc: "/videos/pillar-vision.mp4",
  },
  {
    number: "02",
    title: "Discipline",
    subtitle: 'The "Investor First" Standard.',
    body: "Discipline is the resolve to make the hard decisions: to hold when conviction is high, to trim when the market gets frothy, and to ensure our investors' interests are always first. We operate with the ethical rigidity required to be true stewards of capital.",
    videoSrc: "/videos/pillar-discipline.mp4",
  },
  {
    number: "03",
    title: "Patience",
    subtitle: "The 10,000 Days Virtue.",
    body: "Patience keeps us from bailing when markets fluctuate. It is the virtue that ensures we stick to our philosophy of investing for the next 10,000 days. We aren't racing for the quarter; we are building for the era.",
    videoSrc: "/videos/pillar-patience.mp4",
  },
];

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    videoRef.current?.pause();
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare({ x: 50, y: 50 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 20;
    const rotateX = (0.5 - y) * 20;
    setTilt({ rotateX, rotateY });
    setGlare({ x: x * 100, y: y * 100 });
  };

  return (
    <div className="h-full" style={{ perspective: "800px" }}>
      <motion.div
        ref={cardRef}
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={index}
        className="relative overflow-hidden border border-border p-8 cursor-default h-full"
        style={{
          transform: `scale(${hovered ? 1.05 : 1}) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease-out",
          boxShadow: hovered
            ? `0 ${20 + Math.abs(tilt.rotateX)}px ${40 + Math.abs(tilt.rotateX)}px rgba(0,0,0,0.25)`
            : "0 1px 3px rgba(0,0,0,0.08)",
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        data-testid={`card-values-pillar-${pillar.number}`}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            src={pillar.videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: hovered ? 0.15 : 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10">
          <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
            {pillar.number} — {pillar.title}
          </div>
          <h3
            className="font-display text-xl mb-2 transition-colors duration-300"
            style={{ color: hovered ? "#ffffff" : "" }}
          >
            {!hovered && <span className="text-primary">{pillar.subtitle}</span>}
            {hovered && <span>{pillar.subtitle}</span>}
          </h3>
          <p
            className="leading-relaxed transition-colors duration-300"
            style={{ color: hovered ? "rgba(255,255,255,0.85)" : "" }}
          >
            {!hovered && <span className="text-muted-foreground">{pillar.body}</span>}
            {hovered && <span>{pillar.body}</span>}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function OurValues() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24">
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
                  At 10,000 Days Capital, we do not chase cycles; we anticipate Revolutions. Our framework is built upon three non-negotiable pillars: the Vision to see opportunity, the Discipline to manage it with integrity, and the Patience to believe in our Revolution Investing philosophy. We operate at the intersection of fundamental insight and generational time horizons.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-10 items-stretch" data-testid="list-values-pillars">
                {pillars.map((p, i) => (
                  <PillarCard key={p.number} pillar={p} index={i + 1} />
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
