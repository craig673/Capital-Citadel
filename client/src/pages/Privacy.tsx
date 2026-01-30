import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h6
            className="text-secondary font-bold uppercase tracking-widest mb-4 text-sm"
            data-testid="text-privacy-kicker"
          >
            Legal
          </h6>

          <h1
            className="font-display text-4xl md:text-5xl text-primary mb-4"
            data-testid="text-privacy-title"
          >
            Privacy Policy
          </h1>

          <p
            className="text-sm text-muted-foreground mb-12"
            data-testid="text-privacy-updated"
          >
            <span className="font-semibold">Last Updated:</span> January 30, 2026
          </p>

          <div
            className="space-y-10 text-muted-foreground leading-relaxed"
            data-testid="section-privacy-body"
          >
            <p>
              <span className="font-semibold text-primary">
                10,000 Days Capital Management, LP
              </span>{" "}
              is committed to protecting the privacy and confidentiality of our
              investors and website visitors. This Privacy Policy outlines how we
              collect, use, and safeguard your non-public personal information.
            </p>

            <section>
              <h2
                className="font-display text-2xl text-primary mb-3"
                data-testid="text-privacy-1-title"
              >
                1. Information We Collect
              </h2>
              <p className="mb-4" data-testid="text-privacy-1-body">
                We may collect personal information that you provide to us directly,
                such as when you use our "Client Login," request information, or
                subscribe to our insights. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2" data-testid="list-privacy-1">
                <li>Name, address, email, and phone number.</li>
                <li>Account credentials and login history.</li>
                <li>
                  Investor status and financial data (if applicable via the Client
                  Portal).
                </li>
              </ul>
            </section>

            <section>
              <h2
                className="font-display text-2xl text-primary mb-3"
                data-testid="text-privacy-2-title"
              >
                2. How We Use Your Information
              </h2>
              <p className="mb-4" data-testid="text-privacy-2-body">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2" data-testid="list-privacy-2">
                <li>Verify your identity and eligibility to invest.</li>
                <li>
                  Provide access to our proprietary research and client dashboards.
                </li>
                <li>
                  Comply with legal and regulatory requirements (e.g., AML/KYC).
                </li>
              </ul>
            </section>

            <section>
              <h2
                className="font-display text-2xl text-primary mb-3"
                data-testid="text-privacy-3-title"
              >
                3. Information Sharing
              </h2>
              <p data-testid="text-privacy-3-body">
                <span className="font-semibold text-primary">
                  We do not sell your personal information.
                </span>{" "}
                We may share your data with trusted third-party service providers
                (e.g., fund administrators, auditors, legal counsel) solely for the
                purpose of operating our business and funds.
              </p>
            </section>

            <section>
              <h2
                className="font-display text-2xl text-primary mb-3"
                data-testid="text-privacy-4-title"
              >
                4. Data Security
              </h2>
              <p data-testid="text-privacy-4-body">
                We implement robust physical, electronic, and procedural safeguards
                to protect your data, including encryption and secure server
                infrastructure. However, no transmission over the internet is
                completely secure.
              </p>
            </section>

            <section className="border-t border-border pt-8">
              <h2
                className="font-display text-2xl text-primary mb-3"
                data-testid="text-privacy-5-title"
              >
                5. Your Rights
              </h2>
              <p data-testid="text-privacy-5-body">
                Depending on your jurisdiction, you may have the right to access,
                correct, or delete your personal data. To exercise these rights,
                please contact us at{" "}
                <span className="font-semibold text-primary">
                  ir@10000dayscapital.com
                </span>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
