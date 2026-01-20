import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Quantitative Discovery",
      description: "We employ proprietary algorithms to ingest over 40 petabytes of alternative data daily, identifying dislocation patterns invisible to the naked eye."
    },
    {
      number: "02",
      title: "Fundamental Validation",
      description: "Our sector specialists rigorously stress-test quantitative signals against real-world mechanics, supply chain realities, and geopolitical shifts."
    },
    {
      number: "03",
      title: "Risk Calibration",
      description: "Position sizing is determined not by upside potential, but by downside variance. We optimize for survival first, ensuring we remain in the game to capture the fat tails."
    },
    {
      number: "04",
      title: "Execution & Monitoring",
      description: "We utilize algorithmic execution to minimize slippage and maintain a 24/7 watch over liquidity conditions, ready to pivot as market structures evolve."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20 max-w-2xl">
            <h6 className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm">Our Methodology</h6>
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-6">The System of Truth</h1>
            <p className="text-muted-foreground text-lg">
              We do not predict the future. We rigorously prepare for a distribution of outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {steps.map((step) => (
              <div key={step.number} className="group hover:bg-muted/30 p-8 -mx-8 transition-colors rounded-sm">
                <div className="text-6xl font-display font-light text-primary/10 mb-6 group-hover:text-secondary/20 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-2xl font-display text-primary mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
