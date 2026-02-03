import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Download, FileText, ChevronRight, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isApproved: boolean;
}

interface PublishedDocument {
  id: string;
  title: string;
  fileName: string;
  storedPath: string;
  category: string;
  publishDate: string;
  createdAt: string;
}

export default function Letters() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [letters, setLetters] = useState<PublishedDocument[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (!response.ok) {
          setLocation("/auth/login");
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch {
        setLocation("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setLocation]);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch("/api/documents/letter", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setLetters(data.documents);
        }
      } catch (err) {
        console.error("Failed to fetch letters:", err);
      }
    };
    if (user) {
      fetchLetters();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const groupByYear = (docs: PublishedDocument[]) => {
    const grouped: Record<string, PublishedDocument[]> = {};
    docs.forEach(doc => {
      const year = new Date(doc.publishDate).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(doc);
    });
    return grouped;
  };

  const groupedLetters = groupByYear(letters);
  const years = Object.keys(groupedLetters).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="bg-primary text-primary-foreground pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-secondary uppercase tracking-widest">
              <Link href="/" className="hover:underline" data-testid="link-letters-breadcrumb-home">
                Home
              </Link>
              <ChevronRight size={10} />
              <Link href="/dashboard" className="hover:underline" data-testid="link-letters-breadcrumb-dashboard">
                Investor Portal
              </Link>
              <ChevronRight size={10} />
              <span data-testid="text-letters-breadcrumb-current">Investor Letters</span>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-secondary hover:text-secondary-foreground transition-colors"
              data-testid="button-back-to-dashboard"
            >
              <ArrowLeft size={14} />
              Back to Portal
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-display border-b-4 border-secondary pb-4 inline-block" data-testid="text-letters-title">
            INVESTOR LETTERS
          </h1>
          <p className="text-primary-foreground/70 mt-4 text-lg" data-testid="text-letters-subtitle">
            Complete archive of quarterly investor letters
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {letters.length === 0 ? (
            <div className="text-center py-16" data-testid="text-no-letters">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No investor letters have been published yet.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {years.map(year => (
                <section key={year} data-testid={`section-year-${year}`}>
                  <h2 className="text-lg font-display text-primary mb-4 pb-2 border-b border-border">
                    {year}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {groupedLetters[year].map((letter) => (
                      <a
                        key={letter.id}
                        href={`/api/documents/download/${letter.id}`}
                        className="group bg-white border border-border p-5 hover:border-secondary/50 transition-colors flex items-center justify-between"
                        data-testid={`card-letter-${letter.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-2 rounded">
                            <FileText size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-primary group-hover:text-secondary transition-colors">
                              {letter.title}
                            </div>
                            <div className="text-xs text-muted-foreground">{formatDate(letter.publishDate)}</div>
                          </div>
                        </div>
                        <Download size={16} className="text-muted-foreground group-hover:text-secondary transition-colors" />
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
