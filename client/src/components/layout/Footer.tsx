import logo from "@assets/10k_logo_no_words_1768927881066.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="10,000 Days Capital Logo" className="h-8 w-auto brightness-0 invert" />
            <h3 className="font-display text-lg font-semibold uppercase tracking-widest text-secondary">
              10,000 Days Capital
            </h3>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-md">
            Three decades of insight. One mission: Superior execution. We are Cody Willard's investment fund, built to lead throughout The AIRS Revolution and beyond.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-secondary">Contact</h4>
          <address className="not-italic text-sm text-primary-foreground/70 space-y-2">
            <p>555 Fifth Avenue, Ninth Floor</p>
            <p>Suite 900</p>
            <p>New York, NY 10017</p>
            <p>+1 (575) 203-1075 Ext 100</p>
            <p>ir@10000dayscapital.com</p>
          </address>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-secondary">Legal</h4>
          <ul className="text-sm text-primary-foreground/70 space-y-2">
            <li><a href="/terms" className="hover:text-white transition-colors" data-testid="link-terms">Terms of Use</a></li>
            <li><a href="/privacy" className="hover:text-white transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-primary-foreground/10">
        <p className="text-xs text-primary-foreground/50 text-justify leading-relaxed">
          For institutional and accredited investors only. This website is for informational purposes and does not constitute an offer to sell or a solicitation of an offer to buy any interests in 10,000 Days Capital Management, LP or any of its affiliated funds. Past performance is not indicative of future results. All investments involve risk, including the loss of principal.
        </p>
        <p className="text-xs text-primary-foreground/50 mt-4">
          © {new Date().getFullYear()} 10,000 Days Capital Management, LP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
