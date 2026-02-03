import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User } from "@shared/schema";

type UserWithoutPassword = Omit<User, "password">;

export default function Approvals() {
  const [, setLocation] = useLocation();
  const [pendingUsers, setPendingUsers] = useState<UserWithoutPassword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("/api/admin/pending-users");
      
      if (response.status === 401 || response.status === 403) {
        setLocation("/auth/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch pending users");
      }

      const data = await response.json();
      setPendingUsers(data.users);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending users");
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setApproving(userId);
    setError("");

    try {
      const response = await fetch(`/api/admin/approve-user/${userId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }

      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      setApproving(null);
    } catch (err: any) {
      setError(err.message || "Failed to approve user");
      setApproving(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-14" data-testid="section-approvals-hero">
            <h1
              className="font-display text-5xl md:text-6xl text-primary tracking-tight border-b-4 border-secondary pb-4 inline-block"
              data-testid="text-approvals-hero-title"
            >
              ADMIN DASHBOARD
            </h1>
            <p
              className="mt-6 max-w-3xl text-muted-foreground text-lg leading-relaxed"
              data-testid="text-approvals-hero-subtext"
            >
              Review and approve pending access requests from prospective clients.
            </p>
          </section>

          {loading && (
            <div className="text-center py-12" data-testid="section-loading">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              <p className="mt-4 text-muted-foreground">Loading pending users...</p>
            </div>
          )}

          {error && !loading && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400" data-testid="text-error">
              {error}
            </div>
          )}

          {!loading && !error && pendingUsers.length === 0 && (
            <div className="bg-primary border border-secondary/30 p-12 text-center shadow-[0_0_0_1px_rgba(197,160,89,0.10)]" data-testid="section-no-users">
              <p className="text-muted-foreground text-lg">
                No pending access requests at this time.
              </p>
            </div>
          )}

          {!loading && !error && pendingUsers.length > 0 && (
            <div className="space-y-4" data-testid="section-pending-users">
              {pendingUsers.map((user, idx) => (
                <article
                  key={user.id}
                  className="bg-primary text-primary-foreground border border-secondary/30 p-6 shadow-[0_0_0_1px_rgba(197,160,89,0.10)] flex items-center justify-between"
                  data-testid={`card-user-${idx}`}
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2" data-testid={`text-user-label-${idx}`}>
                      Pending Approval
                    </div>
                    <h2 className="font-display text-xl text-primary-foreground" data-testid={`text-user-email-${idx}`}>
                      {user.email}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`text-user-role-${idx}`}>
                      Role: {user.role}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApprove(user.id)}
                    disabled={approving === user.id}
                    className="bg-secondary text-secondary-foreground px-6 py-2 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid={`button-approve-${idx}`}
                  >
                    {approving === user.id ? "Approving..." : "Approve"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
