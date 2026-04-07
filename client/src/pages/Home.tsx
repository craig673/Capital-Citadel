import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ArrowRight, MapPin, CalendarDays, Loader2, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/rsvp", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setRsvpOpen(false);
        // Reset form after close animation
        setTimeout(() => {
          setFirstName("");
          setLastName("");
          setEmail("");
          setSubmitted(false);
        }, 300);
      }, 3000);
    } catch (error: any) {
      toast({
        title: "RSVP Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Intro Teaser */}
        <section className="py-24 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-display text-primary mb-6">
                  Grounded in <span className="text-secondary">Deep Fundamental Analysis</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We go beyond surface-level metrics by identifying non-commoditized tech revolutions at their market inflection points and stress-testing every potential investment against a rigorous core set of questions. Our team builds detailed, line-by-line financial models that project out as far as 15 years to fully understand long-term value creation.
                </p>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-display text-primary mb-6">
                  Optimized by<br /><span className="text-secondary">Algorithmic Scoring</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We apply our proprietary Revolution Factor and WiNR Ratio algorithms to every opportunity, providing a disciplined quantitative overlay to our fundamental research. This data-driven approach dictates our active portfolio construction, allowing us to build positions strategically in tranches to capitalize on market dislocations.
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <Link
                href="/about/what-we-do"
                className="inline-flex items-center gap-3 text-2xl text-primary font-display font-semibold tracking-widest uppercase border-2 border-secondary px-14 py-6 hover:bg-secondary hover:text-white transition-all duration-500"
                data-testid="link-discover-philosophy"
              >
                Discover Who We Are <ArrowRight size={24} />
              </Link>

              {/* RSVP Button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <button
                  onClick={() => setRsvpOpen(true)}
                  className="group inline-flex items-center gap-4 bg-primary text-primary-foreground px-10 py-5 border border-secondary/40 hover:border-secondary hover:bg-secondary hover:text-white transition-all duration-500 cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs uppercase tracking-[0.25em] text-secondary group-hover:text-white/90 transition-colors font-medium">
                      You're Invited
                    </span>
                    <span className="text-lg font-display font-semibold tracking-wide">
                      RSVP: Santa Fe Event
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-right opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-1.5 text-sm">
                      <CalendarDays size={14} className="text-secondary group-hover:text-white/90" />
                      Sept 9–11
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-white/70">
                      <MapPin size={12} className="text-secondary group-hover:text-white/90" />
                      La Fonda on the Plaza
                    </span>
                  </div>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* RSVP Modal */}
        <Dialog open={rsvpOpen} onOpenChange={setRsvpOpen}>
          <DialogContent className="bg-primary border-secondary/40 text-primary-foreground sm:max-w-md">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <CheckCircle size={56} className="text-secondary mb-4" />
                <h3 className="text-xl font-display font-semibold mb-2">Thank You</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Your RSVP has been confirmed. We look forward to seeing you in Santa Fe.
                </p>
              </motion.div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display text-secondary tracking-wide">
                    Join Us in Santa Fe
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm leading-relaxed pt-2">
                    We invite you to the 10,000 Days Capital Event, September 9–11 at La Fonda on the Plaza. Please confirm your attendance below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRsvpSubmit} className="space-y-4 pt-2">
                  <div>
                    <label htmlFor="rsvp-first" className="block text-xs uppercase tracking-widest text-secondary mb-1.5 font-medium">
                      First Name
                    </label>
                    <Input
                      id="rsvp-first"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      required
                      className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground placeholder:text-muted-foreground/50 focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label htmlFor="rsvp-last" className="block text-xs uppercase tracking-widest text-secondary mb-1.5 font-medium">
                      Last Name
                    </label>
                    <Input
                      id="rsvp-last"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      required
                      className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground placeholder:text-muted-foreground/50 focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label htmlFor="rsvp-email" className="block text-xs uppercase tracking-widest text-secondary mb-1.5 font-medium">
                      Email Address
                    </label>
                    <Input
                      id="rsvp-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="bg-primary-foreground/10 border-secondary/30 text-primary-foreground placeholder:text-muted-foreground/50 focus:border-secondary"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-secondary text-primary hover:bg-secondary/90 font-display uppercase tracking-widest text-sm py-5 mt-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Confirm RSVP"
                    )}
                  </Button>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Stats / Proof Points */}
        <section className="py-24 bg-primary text-primary-foreground border-y border-secondary/20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-display text-secondary mb-2">~$60M</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Assets Under Management</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-display text-secondary mb-2">Data-Driven</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Proprietary Algorithms</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl md:text-4xl font-display text-secondary mb-2">Tech-Enabled</div>
              <div className="text-sm uppercase tracking-widest opacity-70">Continuous Research & Market Signal Monitoring</div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
