import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@assets/10k_logo_no_words_1768927881066.png";

const aboutItems = [
  { href: "/about/what-we-do", label: "What We Do" },
  { href: "/about/values", label: "Our Values" },
  { href: "/about/leadership", label: "Leadership" },
  { href: "/about/locations", label: "Locations" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/philosophy", label: "Our Philosophy" },
    { href: "/team", label: "Our Team" },
    { href: "/insights", label: "Insights" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-display font-semibold text-xl tracking-tight text-primary uppercase hover:opacity-80 transition-opacity"
          data-testid="link-home-logo"
        >
          <img src={logo} alt="10,000 Days Capital Logo" className="h-10 w-auto" data-testid="img-logo" />
          <span data-testid="text-brand-name">
            10,000 Days <span className="text-secondary font-light">Capital</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {/* About dropdown */}
          <div className="relative group">
            <Link
              href="/about/what-we-do"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-secondary",
                location.startsWith("/about") ? "text-primary" : "text-muted-foreground"
              )}
              data-testid="nav-about-trigger"
            >
              About Us
              <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
            </Link>

            <div className="pointer-events-none absolute left-0 top-full pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
              <div className="w-64 bg-primary text-primary-foreground border border-secondary/20 shadow-xl">
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="text-xs uppercase tracking-widest text-secondary" data-testid="text-about-menu-title">
                    About
                  </div>
                </div>
                <div className="py-2">
                  {aboutItems.map((item) => {
                    const active = location === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                          active
                            ? "text-secondary bg-white/5"
                            : "text-primary-foreground/90 hover:bg-white/5 hover:text-white"
                        )}
                        data-testid={`nav-about-item-${item.href}`}
                      >
                        {item.label}
                        <span className="text-secondary/70">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-secondary",
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}
              data-testid={`nav-link-${link.href}`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/login"
            className="bg-primary text-primary-foreground px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
            data-testid="button-client-login"
          >
            Client Login
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border/40 p-6 flex flex-col gap-4">
          <div className="pt-1" data-testid="mobile-about-group">
            <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2" data-testid="text-mobile-about">
              About Us
            </div>
            <div className="flex flex-col gap-2">
              {aboutItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-primary hover:text-secondary"
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-about-item-${item.href}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-primary hover:text-secondary"
              onClick={() => setIsOpen(false)}
              data-testid={`mobile-link-${link.href}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-lg font-medium text-secondary"
            onClick={() => setIsOpen(false)}
            data-testid="mobile-link-login"
          >
            Client Login
          </Link>
        </div>
      )}
    </nav>
  );
}
