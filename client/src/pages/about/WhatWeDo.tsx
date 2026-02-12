import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "wouter";

const sections = [
  {
    id: "intro",
    kicker: "Our Firm",
    title: "Committed to Excellence",
    body: "10,000 Days Capital Management was founded on a simple yet radical premise: the most valuable edge in modern finance is time. While the market chases micro-second arbitrage, we focus on the secular trends that define decades. We serve a select group of institutional partners — sovereign wealth funds, university endowments, and family offices — who share our belief that capital preservation is the prerequisite for capital growth.",
    bgType: "video" as const,
    bgSrc: "/videos/who-skyscraper.mp4",
  },
  {
    id: "discipline",
    kicker: "The Long View",
    title: "The 10,000 Days",
    body: "Our name reflects our commitment to the long game — roughly 27 years, or the span of a generation. This horizon shapes every decision we make, from our hiring practices to our risk management frameworks. In a world of noise, silence is the ultimate luxury. We buy quiet conviction and hold it with the patience that only a generational perspective can afford.",
    bgType: "video" as const,
    bgSrc: "/videos/who-hourglass.mp4",
  },
  {
    id: "leadership",
    kicker: "Our People",
    title: "Led by Experience",
    body: "Our approach is driven by a collective of thinkers, engineers, and analysts united by a single ambition: to be on the right side of history. Leadership at 10,000 Days is not about tenure — it is about clarity of vision and the courage to act on it. Every member of our team is selected for their ability to see what others miss and the discipline to wait for what others abandon.",
    bgType: "image" as const,
    bgSrc: "/images/who-boardroom.jpg",
  },
  {
    id: "approach",
    kicker: "Our Method",
    title: "Rigor & Responsibility",
    body: "We combine deep fundamental analysis with proprietary algorithmic scoring to identify the structural shifts that will reshape the global economy. Our dual-lens approach — telescopic for macro trends, microscopic for individual opportunities — ensures that every position in our portfolio has been stress-tested against the forces of time, disruption, and human behavior.",
    bgType: "network" as const,
    bgSrc: "",
  },
];

function NetworkBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {[
        [200, 200], [400, 350], [600, 150], [800, 400], [1000, 250],
        [1200, 450], [1400, 300], [1600, 180], [1750, 400],
        [300, 600], [500, 750], [700, 550], [900, 700], [1100, 600],
        [1300, 800], [1500, 650], [1700, 750],
        [250, 900], [550, 950], [850, 850], [1150, 950], [1450, 880], [1650, 950],
      ].map(([x, y], i) => (
        <circle key={`n${i}`} cx={x} cy={y} r="3" fill="#C5A059" opacity="0.3" />
      ))}
      {[
        [[200, 200], [400, 350]], [[400, 350], [600, 150]], [[600, 150], [1000, 250]],
        [[800, 400], [1200, 450]], [[1000, 250], [1400, 300]], [[1400, 300], [1600, 180]],
        [[1600, 180], [1750, 400]], [[300, 600], [500, 750]], [[500, 750], [700, 550]],
        [[700, 550], [900, 700]], [[900, 700], [1100, 600]], [[1100, 600], [1300, 800]],
        [[1300, 800], [1500, 650]], [[1500, 650], [1700, 750]],
        [[200, 200], [300, 600]], [[600, 150], [700, 550]], [[1000, 250], [1100, 600]],
        [[1400, 300], [1500, 650]], [[400, 350], [500, 750]], [[800, 400], [900, 700]],
        [[1200, 450], [1300, 800]], [[250, 900], [300, 600]], [[550, 950], [500, 750]],
        [[850, 850], [900, 700]], [[1150, 950], [1100, 600]], [[1450, 880], [1500, 650]],
      ].map(([[x1, y1], [x2, y2]], i) => (
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C5A059" strokeWidth="0.5" opacity="0.2" />
      ))}
    </svg>
  );
}

function ScrollytellingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSections = sections.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const segmentSize = 1 / totalSections;
    const idx = Math.floor(v / segmentSize);
    setActiveIndex(Math.min(totalSections - 1, idx));
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(totalSections + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {sections.map((section, i) => (
          <div
            key={section.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          >
            {section.bgType === "video" && (
              <video
                src={section.bgSrc}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {section.bgType === "image" && (
              <img
                src={section.bgSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "blur(2px) brightness(0.4)" }}
              />
            )}
            {section.bgType === "network" && (
              <div className="absolute inset-0 bg-[#080810]">
                <NetworkBackground />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl mx-auto px-6 w-full">
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                data-testid={`section-${section.id}`}
                animate={{
                  opacity: i === activeIndex ? 1 : 0,
                  y: i === activeIndex ? 0 : 40,
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
                className="absolute max-w-4xl px-6"
                style={{
                  pointerEvents: i === activeIndex ? "auto" : "none",
                }}
              >
                <div className="text-secondary font-bold uppercase tracking-widest mb-5 text-sm">
                  {section.kicker}
                </div>
                <h2 className="font-display text-4xl md:text-6xl text-white leading-tight mb-8">
                  {section.title}
                </h2>
                <div
                  className="max-w-2xl rounded-sm p-6"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", backdropFilter: "blur(12px)" }}
                >
                  <p className="text-lg leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {section.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {sections.map((section, i) => (
            <div
              key={section.id}
              className="w-2 h-2 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i === activeIndex ? "#C5A059" : "rgba(255,255,255,0.3)",
                transform: i === activeIndex ? "scale(1.5)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WhatWeDo() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <ScrollytellingSection />

        <section
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "#C5A059" }}
          data-testid="section-finale"
        >
          <div className="text-center px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
              className="font-display text-3xl md:text-5xl text-white mb-10 leading-tight"
            >
              See how we apply this discipline.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            >
              <Link
                href="/philosophy"
                className="inline-block border-2 border-white text-white font-display text-lg uppercase tracking-widest px-12 py-5 hover:bg-white hover:text-[#C5A059] transition-all duration-500"
                data-testid="link-explore-philosophy"
              >
                Explore Our Philosophy
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
