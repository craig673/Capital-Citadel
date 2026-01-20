import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const TeamMember = ({ name, role, bio }: { name: string, role: string, bio: string }) => (
  <div className="border-b border-border py-12 first:pt-0 last:border-0">
    <div className="grid md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <h3 className="text-xl font-display text-primary font-medium">{name}</h3>
        <p className="text-sm text-secondary uppercase tracking-widest mt-1">{role}</p>
      </div>
      <div className="md:col-span-3">
        <p className="text-muted-foreground leading-relaxed max-w-2xl text-justify">
          {bio}
        </p>
      </div>
    </div>
  </div>
);

export default function Team() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-20">
            <h6 className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm">Leadership</h6>
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-6">Partners</h1>
          </div>
          
          <div className="space-y-4">
            <TeamMember 
              name="Alexander J. Sterling" 
              role="Managing Partner & CIO"
              bio="Alexander founded 10,000 Days Capital in 2008 after a distinguished tenure at Citadel and Goldman Sachs. He pioneered the firm's 'Duration Arbitrage' strategy, which successfully navigated the Great Financial Crisis and the 2020 volatility event. He holds an MBA from Wharton and a BS in Mathematics from MIT."
            />
            <TeamMember 
              name="Dr. Elena V. Rostova" 
              role="Head of Quantitative Research"
              bio="Dr. Rostova leads the firm's data science and algorithmic trading divisions. Prior to joining the firm, she was a tenured professor of Physics at Cambridge University and a lead researcher at CERN. Her work on stochastic processes is widely cited in both academic and financial literature."
            />
            <TeamMember 
              name="Jameson T. Worth" 
              role="Chief Risk Officer"
              bio="Mr. Worth ensures the firm's survival across all market environments. With over 25 years of experience in risk management at Bridgewater Associates and the Federal Reserve Bank of New York, he oversees the firm's stress-testing infrastructure and counterparty relationships."
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
