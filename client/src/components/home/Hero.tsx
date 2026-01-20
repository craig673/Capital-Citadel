import heroVideo from "@assets/generated_videos/futuristic_data_center_with_glowing_lights.mp4";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
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
            <span className="text-white/90 font-light italic">Driven by Tech Revolutions</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-10 uppercase tracking-widest">
            Rigorous Insight. Proprietary Analysis. Collective Ambition
          </p>
          <div className="h-16 w-[1px] bg-secondary mx-auto mt-12 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
