import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

import nycImg from "@/assets/locations-nyc.jpg";
import nmImg from "@/assets/locations-newmexico.jpg";

function LocationBlock({
  header,
  title,
  description,
  addressLines,
  contactLabel,
  contactValue,
  imageSrc,
  imageAlt,
  reverse,
  testIdPrefix,
}: {
  header: string;
  title: string;
  description: string;
  addressLines: string[];
  contactLabel: string;
  contactValue: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  testIdPrefix: string;
}) {
  return (
    <section className="py-16 md:py-20 border-t border-border" data-testid={`section-location-${testIdPrefix}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Image first on mobile */}
          <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
            <div className="relative bg-primary border border-secondary/20" data-testid={`card-location-image-${testIdPrefix}`}>
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full aspect-[4/3] object-cover"
                data-testid={`img-location-${testIdPrefix}`}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 via-primary/20 to-transparent" aria-hidden="true" />
              <div className="absolute inset-0 ring-1 ring-secondary/15" aria-hidden="true" />
            </div>
          </div>

          <div className={`lg:col-span-6 ${reverse ? "lg:order-2" : "lg:order-1"}`}>
            <div className="max-w-xl" data-testid={`block-location-text-${testIdPrefix}`}>
              <div className="text-secondary font-bold uppercase tracking-widest text-xs" data-testid={`text-location-header-${testIdPrefix}`}>
                {header}
              </div>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-primary" data-testid={`text-location-title-${testIdPrefix}`}>
                {title}
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed" data-testid={`text-location-description-${testIdPrefix}`}>
                {description}
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-8" data-testid={`grid-location-details-${testIdPrefix}`}>
                <div>
                  <div className="text-secondary font-bold uppercase tracking-widest text-xs" data-testid={`text-location-address-label-${testIdPrefix}`}>
                    Address
                  </div>
                  <div className="mt-3 space-y-1 text-primary/90" data-testid={`text-location-address-${testIdPrefix}`}>
                    {addressLines.map((line, idx) => (
                      <div key={idx} data-testid={`text-location-addressline-${testIdPrefix}-${idx}`}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-secondary font-bold uppercase tracking-widest text-xs" data-testid={`text-location-contact-label-${testIdPrefix}`}>
                    {contactLabel}
                  </div>
                  <div className="mt-3 text-primary/90" data-testid={`text-location-contact-${testIdPrefix}`}>
                    {contactValue}
                  </div>
                </div>
              </div>

              <div className="mt-10 h-px bg-border" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Locations() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero */}
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-5xl"
            >
              <div className="text-secondary font-bold uppercase tracking-widest mb-5 text-sm" data-testid="text-locations-hero-kicker">
                About
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-primary leading-tight" data-testid="text-locations-hero-title">
                Global reach.
              </h1>
              <p className="mt-8 text-lg text-muted-foreground leading-relaxed" data-testid="text-locations-hero-subtext">
                From the financial capital of the world to the frontier of innovation, our footprint
                reflects our philosophy: grounded in fundamentals, focused on the future.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Zig-Zag Sections (mobile: image above text) */}
        <LocationBlock
          header="Headquarters"
          title="New York"
          description="Located in the heart of Midtown Manhattan, our headquarters anchors our fundamental research and investor relations teams."
          addressLines={["555 Fifth Avenue, Ninth Floor", "Suite 900", "New York, NY 10017"]}
          contactLabel="Contact"
          contactValue="ir@10000dayscapital.com"
          imageSrc={nycImg}
          imageAlt="New York City skyline"
          reverse={false}
          testIdPrefix="ny"
        />

        <LocationBlock
          header="Quantitative Research Hub"
          title="New Mexico"
          description="Away from the noise of Wall Street, our New Mexico operations focus on data science, algorithmic modeling, and long-term strategic signal generation."
          addressLines={["Las Cruces, New Mexico", "(Visits by appointment only)"]}
          contactLabel="Contact"
          contactValue="+1 (575) 203-1075"
          imageSrc={nmImg}
          imageAlt="New Mexico desert landscape"
          reverse={true}
          testIdPrefix="nm"
        />
      </main>
      <Footer />
    </div>
  );
}
