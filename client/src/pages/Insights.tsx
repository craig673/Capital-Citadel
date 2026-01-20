import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Play } from "lucide-react";

export default function Insights() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 border-b border-border pb-8">
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">Insights</h1>
            <p className="text-muted-foreground max-w-2xl">
              Research, market commentary, and perspectives on the global economy from our investment team.
            </p>
          </div>

          {/* Featured Video */}
          <div className="mb-24">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-secondary flex items-center gap-2">
              <Play size={16} fill="currentColor" /> Featured Analysis
            </h3>
            <div className="aspect-video w-full bg-black/5 rounded-sm overflow-hidden relative group cursor-pointer">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=Placeholder" 
                title="Market Analysis" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="absolute inset-0"
              />
            </div>
            <h2 className="text-2xl font-display text-primary mt-6">The Great Deleveraging: Navigating the Next Cycle</h2>
            <p className="text-muted-foreground mt-2">CIO Alexander Sterling discusses the impact of rate normalization on global asset classes.</p>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="group cursor-pointer">
                <div className="h-48 bg-muted mb-6 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="text-xs font-bold text-secondary uppercase tracking-widest mb-3">
                  Market Commentary • Oct 2025
                </div>
                <h3 className="text-xl font-display text-primary font-medium mb-3 group-hover:text-secondary transition-colors">
                  {i % 2 === 0 ? "Asymmetric Opportunities in Emerging Debt" : "The Convergence of Volatility and Liquidity"}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  We explore the underlying structural shifts that are creating new pockets of alpha in traditionally overlooked markets. Our analysis suggests a rotation is imminent...
                </p>
                <div className="mt-4 text-xs font-semibold text-primary underline decoration-secondary/50 underline-offset-4 group-hover:decoration-secondary transition-all">
                  Read Report
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
