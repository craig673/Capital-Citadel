import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Videos() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-primary" data-testid="text-insights-videos-title">
              Video Perspectives
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl" data-testid="text-insights-videos-subtext">
              Coming soon.
            </p>
          </div>

          <div className="bg-white border border-border p-10" data-testid="card-insights-videos-placeholder">
            <div className="text-sm text-muted-foreground leading-relaxed" data-testid="text-insights-videos-body">
              This section will host interviews, broadcast appearances, and roundtables.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
