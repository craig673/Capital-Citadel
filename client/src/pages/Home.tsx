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
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display text-primary mb-8">
              We invest with a <span className="text-secondary italic">century-long</span> horizon.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              At 10,000 Days Capital, we believe that true wealth is built through patience, not velocity. Our proprietary models isolate signal from noise, allowing us to execute high-conviction strategies that withstand market volatility.
            </p>
            <Link href="/who-we-are">
              <a className="inline-flex items-center gap-2 text-primary font-semibold tracking-wide border-b border-secondary pb-1 hover:text-secondary transition-colors">
                Discover Our Philosophy <ArrowRight size={16} />
              </a>
            </Link>
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
              <div className="text-4xl font-display text-secondary mb-2">$12.5B+</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Assets Under Management</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-display text-secondary mb-2">24/7</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Global Risk Monitoring</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-display text-secondary mb-2">18</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Years of Excellence</div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
