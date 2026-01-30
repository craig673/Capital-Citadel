import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h6 className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm" data-testid="text-terms-kicker">
            Legal
          </h6>

          <h1 className="font-display text-4xl md:text-5xl text-primary mb-4" data-testid="text-terms-title">
            Terms of Use
          </h1>

          <p className="text-sm text-muted-foreground mb-12" data-testid="text-terms-updated">
            <span className="font-semibold">Last Updated:</span> January 30, 2026
          </p>

          <div className="space-y-10 text-muted-foreground leading-relaxed" data-testid="section-terms-body">
            <p>
              Welcome to the website of <span className="font-semibold text-primary">10,000 Days Capital Management, LP</span> ("10,000 Days," "we," "us," or "our"). By accessing or using this website (the "Site"), you agree to be bound by the following terms and conditions.
            </p>

            <section>
              <h2 className="font-display text-2xl text-primary mb-3" data-testid="text-terms-1-title">
                1. For Informational Purposes Only / No Offer
              </h2>
              <p data-testid="text-terms-1-body">
                This Site is for informational purposes only. Nothing contained herein constitutes an offer to sell or a solicitation of an offer to buy any interest in any investment fund managed by 10,000 Days. Any such offer or solicitation will be made only by means of a confidential Private Placement Memorandum (PPM) and only in jurisdictions where permitted by law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-3" data-testid="text-terms-2-title">
                2. Accredited Investors Only
              </h2>
              <p data-testid="text-terms-2-body">
                By accessing this Site, you represent and warrant that you are an "Accredited Investor" as defined in Regulation D under the U.S. Securities Act of 1933, or a "Qualified Purchaser" as defined in the Investment Company Act of 1940.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-3" data-testid="text-terms-3-title">
                3. No Investment Advice
              </h2>
              <p data-testid="text-terms-3-body">
                The content on this Site is not intended to provide legal, tax, or investment advice. You should consult your own professional advisors regarding your specific situation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-3" data-testid="text-terms-4-title">
                4. Proprietary Rights
              </h2>
              <p data-testid="text-terms-4-body">
                All content, including our proprietary algorithms, market signal monitoring strategies, and logos, are the property of 10,000 Days Capital Management. You may not reproduce, distribute, or create derivative works without our express written consent.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-primary mb-3" data-testid="text-terms-5-title">
                5. Past Performance
              </h2>
              <p data-testid="text-terms-5-body">
                <span className="font-semibold text-primary">Past performance is not indicative of future results.</span> Financial markets are volatile, and there is no guarantee that our investment objectives will be achieved.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2 className="font-display text-2xl text-primary mb-3" data-testid="text-terms-6-title">
                6. Contact
              </h2>
              <p data-testid="text-terms-6-body">
                For questions regarding these Terms, please contact:
              </p>
              <div className="mt-4 text-primary" data-testid="card-terms-contact">
                <div className="font-semibold">10,000 Days Capital Management</div>
                <div className="text-muted-foreground">
                  555 Fifth Avenue, Ninth Floor, Suite 900
                  <br />
                  New York, NY 10017
                  <br />
                  ir@10000dayscapital.com
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
