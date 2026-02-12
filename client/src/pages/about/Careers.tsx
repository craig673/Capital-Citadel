import { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, CheckCircle, Loader2, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Job } from "@shared/schema";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const pendingEvent = useRef<React.FormEvent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [openJobs, setOpenJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/jobs/open")
      .then((res) => res.json())
      .then((data: Job[]) => {
        setOpenJobs(data);
        const params = new URLSearchParams(window.location.search);
        const deepLinkId = params.get("jobId");
        if (deepLinkId && data.some((j: Job) => j.id === deepLinkId)) {
          setExpandedJobs(new Set([deepLinkId]));
          setTimeout(() => {
            document.getElementById(`job-accordion-${deepLinkId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 300);
        }
      })
      .catch(() => setOpenJobs([]))
      .finally(() => setJobsLoading(false));
  }, []);

  const selectedJob = openJobs.find((j) => j.id === selectedJobId) || null;

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }
    pendingEvent.current = e;
    setShowConfirm(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      if (selectedJobId) formData.append("jobId", selectedJobId);
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

  const toggleJob = (jobId: string) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  };

  const handleApplyForRole = (jobId: string) => {
    setSelectedJobId(jobId);
    setTimeout(() => {
      document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
            Join The Revolution
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
              We are at the forefront of The AIRS Revolution™, where companies harness the
              transformative power of Artificial Intelligence to reshape how capital
              is allocated and managed. If you are driven by intellectual curiosity,
              disciplined thinking, and the desire to be part of something
              Revolutionary, we want to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white" data-testid="section-open-roles">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div className="text-center" {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl text-slate-900" data-testid="text-open-roles-title">
              Open Roles
            </h2>
            <div className="mt-3 h-px w-16 bg-secondary mx-auto" aria-hidden="true" />
          </motion.div>

          {jobsLoading ? (
            <motion.div
              className="mt-12 flex justify-center"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
            >
              <Loader2 className="w-8 h-8 animate-spin text-secondary" data-testid="spinner-jobs-loading" />
            </motion.div>
          ) : openJobs.length === 0 ? (
            <motion.div
              className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-8 md:p-12 text-center"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              data-testid="card-no-open-roles"
            >
              <p className="text-slate-900 text-lg leading-relaxed font-medium" data-testid="text-no-roles-message">
                We currently have no open roles, but if you are interested in joining the team,
                please upload your resume below and click send.
              </p>
            </motion.div>
          ) : (
            <div className="mt-12 space-y-4" data-testid="list-open-jobs">
              {openJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 + index * 0.1 }}
                  id={`job-accordion-${job.id}`}
                  data-testid={`card-job-${job.id}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleJob(job.id)}
                    className="w-full flex items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left hover:bg-slate-50 transition-colors"
                    data-testid={`button-toggle-${job.id}`}
                  >
                    <h3 className="font-display text-xl text-slate-900" data-testid={`text-job-title-${job.id}`}>
                      {job.title}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform duration-300 ${expandedJobs.has(job.id) ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedJobs.has(job.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.0, 0.0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-slate-100 pt-6">
                          <h4 className="font-display text-2xl text-slate-900">{job.title}</h4>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600" data-testid={`badge-location-${job.id}`}>{job.location}</span>
                            <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600" data-testid={`badge-type-${job.id}`}>{job.employmentType}</span>
                            {job.internshipStartDate && job.internshipEndDate && (
                              <span className="inline-block rounded bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600" data-testid={`badge-dates-${job.id}`}>{job.internshipStartDate} – {job.internshipEndDate}</span>
                            )}
                          </div>
                          <div className="mt-3 h-px w-20 bg-secondary" aria-hidden="true" />

                          <div className="mt-8">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3">About the Role</p>
                            <div className="text-slate-600 leading-relaxed prose prose-sm prose-slate max-w-none [&_strong]:font-semibold" data-testid={`text-job-description-${job.id}`}>
                              <ReactMarkdown>{job.roleDescription || ""}</ReactMarkdown>
                            </div>
                          </div>

                          <div className="mt-8">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3">Why 10,000 Days</p>
                            <p className="text-slate-600 leading-relaxed">
                              10,000 Days Capital is a Revolutionary investment firm operating at the intersection of deep fundamental research and cutting-edge Artificial Intelligence. We believe in thinking in decades — not quarters — and our long-term horizon means we pursue opportunities that others overlook. As part of The AIRS Revolution™, you will be at the forefront of how capital is allocated and managed in the 21st century. We offer a culture of intellectual curiosity, disciplined thinking, and the conviction that the greatest returns come from patience and vision.
                            </p>
                          </div>

                          {(job.responsibilities || []).length > 0 && (
                            <div className="mt-8">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3">Responsibilities</p>
                              <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed" data-testid={`list-job-responsibilities-${job.id}`}>
                                {(job.responsibilities || []).map((item, i) => (
                                  <li key={i} className="[&_p]:inline [&_strong]:font-semibold"><ReactMarkdown>{item}</ReactMarkdown></li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {(job.requirements || []).length > 0 && (
                            <div className="mt-8">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3">Requirements</p>
                              <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed" data-testid={`list-job-requirements-${job.id}`}>
                                {(job.requirements || []).map((item, i) => (
                                  <li key={i} className="[&_p]:inline [&_strong]:font-semibold"><ReactMarkdown>{item}</ReactMarkdown></li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {(job.whatWeOffer || []).length > 0 && (
                            <div className="mt-8">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3">What We Offer</p>
                              <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed" data-testid={`list-job-offer-${job.id}`}>
                                {(job.whatWeOffer || []).map((item, i) => (
                                  <li key={i} className="[&_p]:inline [&_strong]:font-semibold"><ReactMarkdown>{item}</ReactMarkdown></li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleApplyForRole(job.id)}
                            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-primary font-bold uppercase tracking-wider text-sm hover:bg-secondary/90 transition-colors"
                            data-testid={`button-apply-${job.id}`}
                          >
                            Apply for this Role
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="application-form" className="py-20 md:py-28 bg-primary border-t border-border" data-testid="section-application-form">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div className="text-center" {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl text-white" data-testid="text-application-title">
              {selectedJob ? `Apply for ${selectedJob.title}` : "Send Us Your Resume"}
            </h2>
            {!selectedJob && (
              <p className="text-center text-gray-400 max-w-2xl mx-auto mb-8 mt-4 leading-relaxed">
                Don't see the specific role you're looking for? We are always searching for exceptional talent to join us in navigating The AIRS Revolution™. If you have the conviction and curiosity to contribute to our long-term mission, please submit your resume and a brief note describing how you can add value to the team.
              </p>
            )}
            {selectedJob && (
              <button
                type="button"
                onClick={() => setSelectedJobId(null)}
                className="mt-2 text-secondary/70 hover:text-secondary text-sm underline underline-offset-2 transition-colors"
                data-testid="button-clear-selection"
              >
                Clear selection — send a general application instead
              </button>
            )}
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
              onSubmit={handleFormSubmit}
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
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow"
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
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow"
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
                        <span className="flex items-center gap-2 text-slate-900 text-sm truncate">
                          <FileText className="w-4 h-4 text-secondary/60 flex-shrink-0" />
                          {f.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(f.name)}
                          className="text-slate-500 hover:text-slate-900 transition-colors"
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
                disabled={isSubmitting || !name.trim() || !email.trim() || files.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3.5 text-primary font-bold uppercase tracking-wider text-sm hover:bg-secondary/90 disabled:opacity-50 transition-colors"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(false)}
            data-testid="modal-confirm-overlay"
          >
            <motion.div
              className="relative w-full max-w-md bg-primary border border-secondary/30 p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="modal-confirm-dialog"
            >
              <div className="w-10 h-10 mx-auto mb-5 rounded-full bg-secondary/15 flex items-center justify-center">
                <Upload className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-display text-xl text-white text-center mb-4">Confirm Submission</h3>
              <p className="text-white/70 text-sm leading-relaxed text-center mb-8">
                Please be sure you have uploaded any and all documentation you'd like to submit before sending. Are you sure you want to Send?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-white/20 px-4 py-3 text-white/70 text-sm font-semibold uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
                  data-testid="button-confirm-cancel"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmedSubmit}
                  className="flex-1 rounded-lg bg-secondary px-4 py-3 text-primary text-sm font-bold uppercase tracking-wider hover:bg-secondary/90 transition-colors"
                  data-testid="button-confirm-send"
                >
                  Yes, Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
