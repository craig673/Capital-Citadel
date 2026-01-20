import heroBg from "@assets/generated_images/abstract_architectural_background_for_hedge_fund_hero_section.png";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-6 drop-shadow-2xl">
            The Discipline <br />
            <span className="text-white/90 font-light italic">of Time</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Rigorous analysis. Long-term compounding. Institutional preservation of capital across generations.
          </p>
          <div className="h-16 w-[1px] bg-secondary mx-auto mt-12 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
