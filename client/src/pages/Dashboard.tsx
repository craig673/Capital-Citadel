import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Download, FileText, ChevronRight, Mail, Phone, User as UserIcon, ArrowLeft, Upload, Check, Loader2, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";

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

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [recentLetters, setRecentLetters] = useState<PublishedDocument[]>([]);
  const [fundDocuments, setFundDocuments] = useState<PublishedDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      setUploadError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      setUploadSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

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
    const fetchDocuments = async () => {
      try {
        const [lettersRes, fundDocsRes] = await Promise.all([
          fetch("/api/documents/letters/recent?limit=4", { credentials: "include" }),
          fetch("/api/documents/legal", { credentials: "include" }),
        ]);
        
        if (lettersRes.ok) {
          const lettersData = await lettersRes.json();
          setRecentLetters(lettersData.documents);
        }
        
        if (fundDocsRes.ok) {
          const fundDocsData = await fundDocsRes.json();
          setFundDocuments(fundDocsData.documents);
        }
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };
    
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const firstName = user?.firstName || "Investor";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="bg-primary text-primary-foreground pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-secondary uppercase tracking-widest">
              <Link href="/" className="hover:underline" data-testid="link-dashboard-breadcrumb-home">
                Home
              </Link>
              <ChevronRight size={10} />
              <span data-testid="text-dashboard-breadcrumb-current">Investor Portal</span>
            </div>
            {user?.role === "admin" && (
              <Link
                href="/admin/approvals"
                className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-secondary hover:text-secondary-foreground transition-colors"
                data-testid="button-back-to-admin"
              >
                <ArrowLeft size={14} />
                Back to Admin Dashboard
              </Link>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-display border-b-4 border-secondary pb-4 inline-block" data-testid="text-dashboard-title">
            INVESTOR PORTAL
          </h1>
          <p className="text-primary-foreground/70 mt-4 text-lg" data-testid="text-dashboard-greeting">
            Welcome, {firstName}
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {recentLetters.length > 0 && (
                <section data-testid="section-latest-insight">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">
                    Latest Insight
                  </h2>
                  <div className="bg-primary text-primary-foreground p-8 border border-secondary/30 shadow-[0_0_0_1px_rgba(197,160,89,0.10)]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div>
                        <div className="text-xs text-secondary uppercase tracking-widest mb-2">
                          Quarterly Letter
                        </div>
                        <h3 className="font-display text-2xl mb-2">{recentLetters[0].title}</h3>
                        <p className="text-primary-foreground/60 text-sm">
                          Published {formatDate(recentLetters[0].publishDate)}
                        </p>
                      </div>
                      <a
                        href={`/api/documents/download/${recentLetters[0].id}`}
                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] whitespace-nowrap"
                        data-testid="button-download-quarterly"
                      >
                        <Download size={16} />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </section>
              )}

              <section data-testid="section-investor-letters">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">
                    Investor Letters
                  </h2>
                  <Link
                    href="/letters"
                    className="inline-flex items-center gap-1 text-xs text-secondary hover:underline font-medium uppercase tracking-widest"
                    data-testid="link-view-all-letters"
                  >
                    View All
                    <ArrowRight size={12} />
                  </Link>
                </div>
                {recentLetters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded" data-testid="text-no-letters">
                    No investor letters have been published yet.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {recentLetters.map((letter) => (
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
                )}
              </section>

              <section data-testid="section-fund-documents">
                <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">
                  Fund Documents
                </h2>
                {fundDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded" data-testid="text-no-fund-docs">
                    No fund documents have been published yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fundDocuments.map((doc) => (
                      <a
                        key={doc.id}
                        href={`/api/documents/download/${doc.id}`}
                        className="group bg-white border border-border p-5 hover:border-secondary/50 transition-colors flex items-center justify-between"
                        data-testid={`card-document-${doc.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-muted p-2 rounded text-xs font-bold text-muted-foreground uppercase">
                            PDF
                          </div>
                          <div className="text-sm font-medium text-primary group-hover:text-secondary transition-colors">
                            {doc.title}
                          </div>
                        </div>
                        <Download size={16} className="text-muted-foreground group-hover:text-secondary transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section data-testid="section-ir-contact">
                <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">
                  Investor Relations
                </h2>
                <div className="bg-primary text-primary-foreground p-6 border border-secondary/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-secondary/20 p-3 rounded-full">
                      <UserIcon size={24} className="text-secondary" />
                    </div>
                    <div>
                      <div className="font-display text-lg">Craig Delaune</div>
                      <div className="text-xs text-primary-foreground/60">Research & Operations Associate</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <a
                      href="tel:+15752031075"
                      className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                      data-testid="link-ir-phone"
                    >
                      <Phone size={16} />
                      +1 (575) 203-1075 Ext 100
                    </a>
                    <a
                      href="mailto:ir@10000dayscapital.com"
                      className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                      data-testid="link-ir-email"
                    >
                      <Mail size={16} />
                      ir@10000dayscapital.com
                    </a>
                  </div>
                </div>
              </section>

              <section data-testid="section-account-summary">
                <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">
                  Account Summary
                </h2>
                <div className="bg-muted/30 p-6 border border-border">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Account Email</div>
                      <div className="text-sm font-medium text-primary">{user?.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Account Status</div>
                      <div className="text-xs inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full mt-1">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section data-testid="section-document-upload">
                <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">
                  Secure Document Upload
                </h2>
                <div className="bg-primary text-primary-foreground p-6 border border-secondary/30">
                  <p className="text-sm text-primary-foreground/70 mb-4">
                    Securely upload documents for review by your investment team.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.gif"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        data-testid="input-file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="block w-full border-2 border-dashed border-secondary/50 p-4 text-center cursor-pointer hover:border-secondary transition-colors"
                      >
                        <Upload size={24} className="mx-auto mb-2 text-secondary" />
                        <span className="text-sm text-primary-foreground/70">
                          {selectedFile ? selectedFile.name : "Click to select PDF or image"}
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="button-upload-document"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Document
                        </>
                      )}
                    </button>

                    {uploadSuccess && (
                      <div className="flex items-center gap-2 text-green-400 text-sm" data-testid="text-upload-success">
                        <Check size={16} />
                        Document uploaded successfully
                      </div>
                    )}

                    {uploadError && (
                      <div className="text-red-400 text-sm" data-testid="text-upload-error">
                        {uploadError}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
