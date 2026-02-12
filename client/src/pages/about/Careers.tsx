import { useState, useCallback, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Upload, X, FileText, CheckCircle, Loader2 } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number] },
};

export default function Careers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter((f) => acceptedTypes.includes(f.type));
    setFiles((prev) => {
      const names = new Set(prev.map((p) => p.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
  }, []);

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/applications", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.08),transparent_60%)]" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.p
            className="text-secondary font-bold uppercase tracking-[0.25em] text-xs mb-6"
            {...fadeUp}
            data-testid="text-careers-subtitle"
          >
            Careers
          </motion.p>
          <motion.h1
            className="font-display text-4xl md:text-6xl text-white leading-tight"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            data-testid="text-careers-title"
          >
            Join the Revolution
          </motion.h1>
          <motion.div
            className="mt-8 space-y-5 text-white/75 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
          >
            <p data-testid="text-careers-description-1">
              At 10,000 Days Capital, we think in decades — not quarters. Our long-term
              horizon means we pursue deep, fundamental research that others overlook,
              and we build conviction where others see uncertainty.
            </p>
            <p data-testid="text-careers-description-2">
              We are at the forefront of the AIRS Revolution, harnessing the
              transformative power of Artificial Intelligence to reshape how capital
              is allocated and managed. If you are driven by intellectual curiosity,
              disciplined thinking, and the desire to be part of something
              Revolutionary, we want to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background" data-testid="section-open-roles">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div className="text-center" {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl text-white" data-testid="text-open-roles-title">
              Open Roles
            </h2>
            <div className="mt-3 h-px w-16 bg-secondary mx-auto" aria-hidden="true" />
          </motion.div>

          <motion.div
            className="mt-12 rounded-xl border border-border bg-card p-8 md:p-12 text-center"
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            data-testid="card-no-open-roles"
          >
            <p className="text-white/70 text-lg leading-relaxed" data-testid="text-no-roles-message">
              We currently have no open roles, but if you are interested in joining the team,
              please upload your resume here and click send.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-primary border-t border-border" data-testid="section-application-form">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div className="text-center" {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl text-white" data-testid="text-application-title">
              Send Us Your Resume
            </h2>
            <div className="mt-3 h-px w-16 bg-secondary mx-auto" aria-hidden="true" />
          </motion.div>

          {submitted ? (
            <motion.div
              className="mt-12 rounded-xl border border-secondary/30 bg-secondary/5 p-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              data-testid="card-success-message"
            >
              <CheckCircle className="w-14 h-14 text-secondary mx-auto mb-5" />
              <h3 className="font-display text-2xl text-white mb-3">Application Received</h3>
              <p className="text-white/70">
                Thank you for your interest in 10,000 Days Capital. We will review your
                materials and reach out if there is a fit.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="mt-12 space-y-6"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
            >
              <div>
                <label htmlFor="app-name" className="block text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  id="app-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow"
                  placeholder="Your full name"
                  required
                  data-testid="input-name"
                />
              </div>

              <div>
                <label htmlFor="app-email" className="block text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  id="app-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow"
                  placeholder="you@example.com"
                  required
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">
                  Resume &amp; Documents
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                    isDragging
                      ? "border-secondary bg-secondary/10"
                      : "border-border hover:border-secondary/40 bg-card/50"
                  }`}
                  data-testid="dropzone-files"
                >
                  <Upload className="w-8 h-8 text-secondary/60 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">
                    Drag &amp; drop your files here, or{" "}
                    <span className="text-secondary underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-white/30 text-xs mt-2">PDF or Word documents only</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                    data-testid="input-file"
                  />
                </div>

                {files.length > 0 && (
                  <ul className="mt-4 space-y-2" data-testid="list-uploaded-files">
                    {files.map((f) => (
                      <li
                        key={f.name}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                        data-testid={`file-item-${f.name}`}
                      >
                        <span className="flex items-center gap-2 text-white/80 text-sm truncate">
                          <FileText className="w-4 h-4 text-secondary/60 flex-shrink-0" />
                          {f.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(f.name)}
                          className="text-white/40 hover:text-white transition-colors"
                          aria-label={`Remove ${f.name}`}
                          data-testid={`button-remove-${f.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {error && (
                <p className="text-red-400 text-sm" data-testid="text-error">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3.5 text-primary font-bold uppercase tracking-wider text-sm hover:bg-secondary/90 disabled:opacity-50 transition-colors"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Application"
                )}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
