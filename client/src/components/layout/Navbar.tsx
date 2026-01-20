import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@assets/10k_logo_no_words_1768927881066.png";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/who-we-are", label: "Who We Are" },
    { href: "/process", label: "Our Process" },
    { href: "/team", label: "Our Team" },
    { href: "/insights", label: "Insights" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-3 font-display font-semibold text-xl tracking-tight text-primary uppercase hover:opacity-80 transition-opacity">
            <img src={logo} alt="10,000 Days Capital Logo" className="h-10 w-auto" />
            <span>
              10,000 Days <span className="text-secondary font-light">Capital</span>
            </span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-secondary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <Link href="/login">
            <a className="bg-primary text-primary-foreground px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Client Login
            </a>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border/40 p-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className="text-lg font-medium text-primary hover:text-secondary"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <Link href="/login">
            <a 
              className="text-lg font-medium text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Client Login
            </a>
          </Link>
        </div>
      )}
    </nav>
  );
}
