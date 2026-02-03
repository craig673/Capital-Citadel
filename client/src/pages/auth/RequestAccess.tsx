import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RequestAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isApproved: false, role: "user" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6">
          <div className="w-full max-w-md">
            <div className="bg-primary border border-secondary/30 p-8 shadow-[0_0_0_1px_rgba(197,160,89,0.10)]">
              <div className="text-center" data-testid="section-success">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl text-primary-foreground mb-4" data-testid="text-success-title">
                  Request Submitted
                </h2>
                <p className="text-muted-foreground mb-6" data-testid="text-success-message">
                  Your request has been submitted. You will be notified once an administrator approves your access.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block bg-secondary text-secondary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter]"
                  data-testid="link-login"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6">
        <div className="w-full max-w-md">
          <div className="bg-primary border border-secondary/30 p-8 shadow-[0_0_0_1px_rgba(197,160,89,0.10)]">
            <h1 className="font-display text-3xl text-primary-foreground mb-2" data-testid="text-request-access-title">
              REQUEST ACCESS
            </h1>
            <p className="text-sm text-muted-foreground mb-6" data-testid="text-request-access-subtitle">
              Submit your information for approval by our team.
            </p>

            <form onSubmit={handleSubmit} data-testid="form-request-access">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold text-primary-foreground mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-secondary/30 px-4 py-2 text-primary-foreground focus:outline-none focus:border-secondary"
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-semibold text-primary-foreground mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-secondary/30 px-4 py-2 text-primary-foreground focus:outline-none focus:border-secondary"
                  required
                  data-testid="input-password"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background/50 border border-secondary/30 px-4 py-2 text-primary-foreground focus:outline-none focus:border-secondary"
                  required
                  data-testid="input-confirm-password"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm" data-testid="text-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-secondary-foreground px-5 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-submit"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-secondary/30">
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-secondary hover:brightness-110 font-semibold" data-testid="link-login">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
