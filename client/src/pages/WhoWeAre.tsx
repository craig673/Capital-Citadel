import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function WhoWeAre() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h6 className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm">Our Firm</h6>
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-12 leading-tight">
              We are architects of <span className="italic text-muted-foreground">financial durability</span>.
            </h1>
            
            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed font-light">
              <p>
                10,000 Days Capital Management was founded on a simple yet radical premise: the most valuable edge in modern finance is time. While the market chases micro-second arbitrage, we focus on the secular trends that define decades.
              </p>
              <p>
                Our name reflects our commitment to the long game—roughly 27 years, or the span of a generation. This horizon shapes every decision we make, from our hiring practices to our risk management frameworks.
              </p>
              <div className="pl-6 border-l-2 border-secondary my-12">
                <p className="text-2xl font-display text-primary italic">
                  "In a world of noise, silence is the ultimate luxury. We buy quiet conviction."
                </p>
                <cite className="block mt-4 text-sm not-italic uppercase tracking-wider text-muted-foreground">— Founder's Letter, 2008</cite>
              </div>
              <p>
                We serve a select group of institutional partners—sovereign wealth funds, university endowments, and family offices—who share our belief that capital preservation is the prerequisite for capital growth.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
