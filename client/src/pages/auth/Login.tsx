import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      setLocation("/");
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
            <h1 className="font-display text-3xl text-primary-foreground mb-6" data-testid="text-login-title">
              CLIENT LOGIN
            </h1>

            <form onSubmit={handleSubmit} data-testid="form-login">
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

              <div className="mb-6">
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
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-secondary/30">
              <p className="text-sm text-muted-foreground text-center">
                Don't have access?{" "}
                <Link href="/auth/request-access" className="text-secondary hover:brightness-110 font-semibold" data-testid="link-request-access">
                  Request Access
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
