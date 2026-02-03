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
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});

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
    setProcessing(userId);
    setError("");

    try {
      const role = selectedRoles[userId] || "user";
      const response = await fetch(`/api/admin/approve-user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }

      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      setProcessing(null);
    } catch (err: any) {
      setError(err.message || "Failed to approve user");
      setProcessing(null);
    }
  };

  const handleDeny = async (userId: string) => {
    setProcessing(userId);
    setError("");

    try {
      const response = await fetch(`/api/admin/deny-user/${userId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to deny user");
      }

      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      setProcessing(null);
    } catch (err: any) {
      setError(err.message || "Failed to deny user");
      setProcessing(null);
    }
  };

  const toggleRole = (userId: string) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: prev[userId] === "admin" ? "user" : "admin",
    }));
  };

  const getFullName = (user: UserWithoutPassword) => {
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "—";
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
                  className="bg-primary text-primary-foreground border border-secondary/30 p-6 shadow-[0_0_0_1px_rgba(197,160,89,0.10)]"
                  data-testid={`card-user-${idx}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="text-xs font-bold uppercase tracking-widest text-secondary mb-2" data-testid={`text-user-label-${idx}`}>
                        Pending Approval
                      </div>
                      <h2 className="font-display text-xl text-primary-foreground" data-testid={`text-user-name-${idx}`}>
                        {getFullName(user)}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-user-email-${idx}`}>
                        {user.email}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-user-role-${idx}`}>
                        Current Role: {user.role}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Assign as:</span>
                        <button
                          onClick={() => toggleRole(user.id)}
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-widest border transition-colors ${
                            (selectedRoles[user.id] || "user") === "admin"
                              ? "bg-secondary text-secondary-foreground border-secondary"
                              : "bg-transparent text-primary-foreground border-secondary/50 hover:border-secondary"
                          }`}
                          data-testid={`button-toggle-role-${idx}`}
                        >
                          {selectedRoles[user.id] || "user"}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={processing === user.id}
                          className="bg-secondary text-secondary-foreground px-5 py-2 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid={`button-approve-${idx}`}
                        >
                          {processing === user.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleDeny(user.id)}
                          disabled={processing === user.id}
                          className="bg-red-600 text-white px-5 py-2 text-sm font-semibold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          data-testid={`button-deny-${idx}`}
                        >
                          {processing === user.id ? "..." : "Deny"}
                        </button>
                      </div>
                    </div>
                  </div>
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
