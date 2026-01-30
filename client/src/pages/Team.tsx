import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import codyHeadshot from "../../../attached_assets/Cody_in_library_3_1769804665633.png";

export default function Team() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-20">
            <h6 className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm" data-testid="text-team-kicker">
              Our Team
            </h6>
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-6" data-testid="text-team-title">
              Partners
            </h1>
          </div>

          <div className="border-b border-border py-12 first:pt-0 last:border-0" data-testid="card-team-cody">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white border border-border" data-testid="card-team-cody-headshot">
                  <img
                    src={codyHeadshot}
                    alt="Cody Willard"
                    className="w-full aspect-[4/3] object-cover"
                    data-testid="img-team-cody"
                  />
                </div>

                <h3 className="mt-6 text-xl font-display text-primary font-medium" data-testid="text-team-name">
                  Cody Willard
                </h3>
                <p className="text-sm text-secondary uppercase tracking-widest mt-1" data-testid="text-team-title-role">
                  Portfolio Manager
                </p>
              </div>

              <div className="md:col-span-3">
                <p className="text-muted-foreground leading-relaxed max-w-2xl text-justify" data-testid="text-team-bio">
                  Cody Willard founded 10,000 Days Capital Management in 2019, bringing over 30 years of Wall Street
                  experience to the firm. Starting as an analyst at Oppenheimer and the first partner to famed
                  stockbroker Andrew Lanyi, Cody later became a Fox Business anchor and on-air partner to Larry
                  Kudlow on CNBC. His insights have been featured in <em>The Wall Street Journal</em>, <em>Financial Times</em>,
                  <em> Barron&apos;s</em>, and <em>MarketWatch</em>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
