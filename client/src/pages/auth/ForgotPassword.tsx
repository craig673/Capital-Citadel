import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6">
        <div className="w-full max-w-md">
          <div className="bg-primary border border-secondary/30 p-8 shadow-[0_0_0_1px_rgba(197,160,89,0.10)]">
            <h1 className="font-display text-3xl text-primary-foreground mb-2">
              RESET PASSWORD
            </h1>

            {submitted ? (
              <div>
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  If an account with that email exists, a password reset link has been sent. Please check your inbox (and spam folder).
                </div>
                <Link
                  href="/auth/login"
                  className="block text-center text-secondary hover:brightness-110 font-semibold text-sm uppercase tracking-widest"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-semibold text-primary-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background/50 border border-secondary/30 px-4 py-2 text-primary-foreground focus:outline-none focus:border-secondary"
                      required
                      placeholder="you@example.com"
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary text-secondary-foreground px-5 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-secondary/30">
                  <p className="text-sm text-muted-foreground text-center">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-secondary hover:brightness-110 font-semibold">
                      Log In
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
