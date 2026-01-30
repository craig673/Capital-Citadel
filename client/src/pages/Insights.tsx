import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, PlayCircle, Globe, ArrowRight } from "lucide-react";

function HubCard({
  href,
  title,
  description,
  icon,
  testId,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  testId: string;
}) {
  return (
    <Link
      href={href}
      className="group block bg-primary text-primary-foreground border border-secondary/30 p-8 shadow-[0_0_0_1px_rgba(197,160,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-[0_14px_40px_rgba(0,0,0,0.20),0_0_0_1px_rgba(197,160,89,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      data-testid={testId}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div
              className="text-secondary"
              aria-hidden="true"
              data-testid={`${testId}-icon`}
            >
              {icon}
            </div>
            <h2
              className="font-display text-2xl text-primary-foreground"
              data-testid={`${testId}-title`}
            >
              {title}
            </h2>
          </div>
          <p
            className="mt-4 text-sm leading-relaxed text-primary-foreground/70"
            data-testid={`${testId}-description`}
          >
            {description}
          </p>
        </div>

        <div
          className="mt-1 shrink-0 text-secondary/80 transition-colors group-hover:text-secondary"
          aria-hidden="true"
        >
          <ArrowRight size={18} />
        </div>
      </div>

      <div className="mt-7 h-px bg-secondary/20" aria-hidden="true" />

      <div
        className="mt-5 text-xs font-semibold uppercase tracking-widest text-secondary"
        data-testid={`${testId}-cta`}
      >
        Explore
      </div>
    </Link>
  );
}

export default function Insights() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 border-b border-border pb-8">
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-4" data-testid="text-insights-title">
              Insights
            </h1>
            <p className="text-muted-foreground max-w-2xl" data-testid="text-insights-subtext">
              Research, market commentary, and perspectives from our investment team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="grid-insights-hub">
            <HubCard
              href="/insights/commentary"
              title="Market Commentary"
              description="Read our latest memos, quarterly letters, and deep-dive analysis on the structural shifts defining the economy."
              icon={<FileText size={22} />}
              testId="card-insights-commentary"
            />
            <HubCard
              href="/insights/videos"
              title="Video Perspectives"
              description="Watch interviews, broadcast appearances, and roundtable discussions with our investment team."
              icon={<PlayCircle size={22} />}
              testId="card-insights-videos"
            />
            <HubCard
              href="/insights/curated"
              title="Curated Intelligence"
              description="What we are reading. A selection of external research, historical analogies, and economic theory that informs our worldview."
              icon={<Globe size={22} />}
              testId="card-insights-curated"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
