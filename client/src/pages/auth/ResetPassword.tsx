import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
    } else {
      setError("Invalid reset link. No token provided.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
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
              SET NEW PASSWORD
            </h1>

            {success ? (
              <div>
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  Your password has been reset successfully.
                </div>
                <Link
                  href="/auth/login"
                  className="block w-full text-center bg-secondary text-secondary-foreground px-5 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter]"
                >
                  Log In Now
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your new password below. Must be at least 8 characters.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-semibold text-primary-foreground mb-2">
                      New Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-background/50 border border-secondary/30 px-4 py-2 text-primary-foreground focus:outline-none focus:border-secondary"
                      required
                      minLength={8}
                      placeholder="Minimum 8 characters"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary-foreground mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-background/50 border border-secondary/30 px-4 py-2 text-primary-foreground focus:outline-none focus:border-secondary"
                      required
                      minLength={8}
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !token}
                    className="w-full bg-secondary text-secondary-foreground px-5 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-secondary/30">
                  <p className="text-sm text-muted-foreground text-center">
                    <Link href="/auth/forgot-password" className="text-secondary hover:brightness-110 font-semibold">
                      Request a new reset link
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
