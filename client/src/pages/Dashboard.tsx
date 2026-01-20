import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Download, FileText, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const documents = [
    { title: "Monthly Performance Report - Dec 2025", type: "PDF", size: "2.4 MB" },
    { title: "Q4 2025 Investor Letter", type: "PDF", size: "1.8 MB" },
    { title: "Audited Financials FY 2024", type: "PDF", size: "14.2 MB" },
    { title: "Strategy Pitch Deck - 2026 Outlook", type: "PDF", size: "8.5 MB" },
    { title: "Risk Exposure Supplement", type: "XLSX", size: "0.5 MB" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="bg-primary text-primary-foreground pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-secondary uppercase tracking-widest mb-4">
            <Link href="/"><a className="hover:underline">Home</a></Link> <ChevronRight size={10} /> <span>Portal</span>
          </div>
          <h1 className="text-3xl font-display">Investor Dashboard</h1>
          <p className="text-primary-foreground/60 mt-2">Welcome, Institutional Partner.</p>
        </div>
      </div>
      
      <main className="flex-grow py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white border border-border p-8 shadow-sm">
              <h2 className="text-lg font-display text-primary mb-6 flex items-center gap-2">
                <FileText size={20} className="text-secondary" /> Latest Documents
              </h2>
              <div className="space-y-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-border/50 hover:border-secondary/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="bg-muted p-2 rounded-sm text-xs font-bold text-muted-foreground uppercase">{doc.type}</div>
                      <div>
                        <div className="text-sm font-medium text-primary group-hover:text-secondary transition-colors">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">{doc.size}</div>
                      </div>
                    </div>
                    <button className="text-primary hover:text-secondary transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-muted/30 p-6 border border-border">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Account Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground">Fund Strategy</div>
                  <div className="text-sm font-medium text-primary">Global Macro Opportunities II</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Inception Date</div>
                  <div className="text-sm font-medium text-primary">Nov 12, 2018</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="text-xs inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1">Active / Good Standing</div>
                </div>
              </div>
            </div>

            <div className="bg-primary p-6 text-primary-foreground">
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">Need Assistance?</h3>
              <p className="text-sm opacity-80 mb-4">Contact your dedicated relationship manager.</p>
              <div className="text-sm font-medium">Sarah Jenkins</div>
              <div className="text-xs opacity-70">Director, Investor Relations</div>
              <div className="mt-4 pt-4 border-t border-white/10 text-xs opacity-70">
                +1 (203) 555-0199
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
