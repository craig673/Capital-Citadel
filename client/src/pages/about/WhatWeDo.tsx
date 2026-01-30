import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function WhatWeDo() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h6 className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm" data-testid="text-about-kicker">
            About
          </h6>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-4" data-testid="text-about-whatwedo-title">
            What We Do
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed" data-testid="text-about-whatwedo-body">
            Content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
