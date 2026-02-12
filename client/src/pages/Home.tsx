import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Intro Teaser */}
        <section className="py-24 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-display text-primary mb-6">
                  Grounded in <span className="text-secondary">Deep Fundamental Analysis</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We go beyond surface-level metrics by identifying non-commoditized tech revolutions at their market inflection points and stress-testing every potential investment against a rigorous core set of questions. Our team builds detailed, line-by-line financial models that project out as far as 15 years to fully understand long-term value creation.
                </p>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-display text-primary mb-6">
                  Optimized by<br /><span className="text-secondary">Algorithmic Scoring</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We apply our proprietary Revolution Factor and WiNR Ratio algorithms to every opportunity, providing a disciplined quantitative overlay to our fundamental research. This data-driven approach dictates our active portfolio construction, allowing us to build positions strategically in tranches to capitalize on market dislocations.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link
                href="/philosophy"
                className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide border-b border-secondary pb-1 hover:text-secondary transition-colors"
                data-testid="link-discover-philosophy"
              >
                Discover Our Philosophy <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats / Proof Points */}
        <section className="py-24 bg-primary text-primary-foreground border-y border-secondary/20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-display text-secondary mb-2">~$60M</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Assets Under Management</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-display text-secondary mb-2">Data-Driven</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Proprietary Algorithms</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl md:text-4xl font-display text-secondary mb-2">Tech-Enabled</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Continuous Research & Market Signal Monitoring</div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
