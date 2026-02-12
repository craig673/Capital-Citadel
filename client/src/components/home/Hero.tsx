import { motion } from "framer-motion";
import { useState } from "react";

export function Hero() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={() => setVideoError(true)}
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        )}
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white mb-6 drop-shadow-2xl max-w-5xl mx-auto leading-tight">
            The Engine of Prosperity is <br />
            <span className="text-white/90 font-light italic">Driven by <span className="font-bold text-secondary">Tech Revolutions</span></span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-10 uppercase tracking-widest">
            Vision. Discipline. Patience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
