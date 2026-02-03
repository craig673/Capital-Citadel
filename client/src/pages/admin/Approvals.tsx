import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { User } from "@shared/schema";
import { ExternalLink, Download, FileText, X, AlertTriangle, UserCheck, Search, FileDown, MoreVertical, Upload, Trash2, Calendar, Loader2 } from "lucide-react";

type UserWithoutPassword = Omit<User, "password">;

interface DocumentUpload {
  id: string;
  fileName: string;
  uploadDate: string;
  investorName: string;
  investorEmail: string;
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

export default function Approvals() {
  const [, setLocation] = useLocation();
  const [pendingUsers, setPendingUsers] = useState<UserWithoutPassword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [approvedUsers, setApprovedUsers] = useState<UserWithoutPassword[]>([]);
  const [approvedUsersLoading, setApprovedUsersLoading] = useState(true);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banTarget, setBanTarget] = useState<UserWithoutPassword | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banProcessing, setBanProcessing] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserWithoutPassword | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editProcessing, setEditProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [publishedLetters, setPublishedLetters] = useState<PublishedDocument[]>([]);
  const [publishedFundDocs, setPublishedFundDocs] = useState<PublishedDocument[]>([]);
  const [letterTitle, setLetterTitle] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [letterPublishing, setLetterPublishing] = useState(false);
  const [fundDocTitle, setFundDocTitle] = useState("");
  const [fundDocFile, setFundDocFile] = useState<File | null>(null);
  const [fundDocPublishing, setFundDocPublishing] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const letterFileRef = useRef<HTMLInputElement>(null);
  const fundDocFileRef = useRef<HTMLInputElement>(null);

  const sortedFilteredUsers = useMemo(() => {
    let filtered = approvedUsers;
    
    if (userSearch.trim()) {
      const searchLower = userSearch.toLowerCase();
      filtered = approvedUsers.filter(user => {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
        const reverseName = `${user.lastName || ""} ${user.firstName || ""}`.toLowerCase();
        return fullName.includes(searchLower) || 
               reverseName.includes(searchLower) || 
               user.email.toLowerCase().includes(searchLower);
      });
    }
    
    return filtered.sort((a, b) => {
      const lastNameA = (a.lastName || "").toLowerCase();
      const lastNameB = (b.lastName || "").toLowerCase();
      if (lastNameA !== lastNameB) return lastNameA.localeCompare(lastNameB);
      const firstNameA = (a.firstName || "").toLowerCase();
      const firstNameB = (b.firstName || "").toLowerCase();
      return firstNameA.localeCompare(firstNameB);
    });
  }, [approvedUsers, userSearch]);

  const getDisplayName = (user: UserWithoutPassword) => {
    if (user.lastName && user.firstName) {
      return `${user.lastName}, ${user.firstName}`;
    }
    if (user.lastName) return user.lastName;
    if (user.firstName) return user.firstName;
    return null;
  };

  const toggleMenu = (userId: string) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const handleMenuAction = (action: string, user: UserWithoutPassword) => {
    setOpenMenuId(null);
    if (action === "deactivate") {
      openBanModal(user);
    } else if (action === "reactivate") {
      handleReactivate(user.id);
    } else if (action === "edit") {
      openEditModal(user);
    }
  };

  const openEditModal = (user: UserWithoutPassword) => {
    setEditTarget(user);
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditRole(user.role);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditTarget(null);
    setEditFirstName("");
    setEditLastName("");
    setEditRole("user");
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    
    setEditProcessing(true);
    try {
      const response = await fetch(`/api/admin/users/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          role: editRole,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setApprovedUsers(prev => prev.map(u => u.id === editTarget.id ? data.user : u));
        closeEditModal();
        showToast("User updated successfully", "success");
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to update user", "error");
      }
    } catch (err) {
      showToast("Failed to update user", "error");
    } finally {
      setEditProcessing(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Role", "Status"];
    const rows = sortedFilteredUsers.map(user => [
      user.firstName || "",
      user.lastName || "",
      user.email,
      user.role,
      user.accountStatus === "banned" ? "Deactivated" : "Active"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `active-users-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchDocuments();
    fetchApprovedUsers();
    fetchPublishedDocuments();
  }, []);

  const fetchPublishedDocuments = async () => {
    try {
      const response = await fetch("/api/admin/published-documents", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setPublishedLetters(data.letters);
        setPublishedFundDocs(data.fundDocs);
      }
    } catch (err) {
      console.error("Failed to fetch published documents:", err);
    }
  };

  const handlePublishLetter = async () => {
    if (!letterTitle.trim() || !letterFile) return;
    
    setLetterPublishing(true);
    try {
      const formData = new FormData();
      formData.append("file", letterFile);
      formData.append("title", letterTitle.trim());
      formData.append("category", "letter");
      if (letterDate) {
        formData.append("publishDate", letterDate);
      }

      const response = await fetch("/api/admin/publish-document", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPublishedLetters(prev => [data.document, ...prev]);
        setLetterTitle("");
        setLetterDate("");
        setLetterFile(null);
        if (letterFileRef.current) letterFileRef.current.value = "";
        showToast("Investor letter published successfully", "success");
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to publish letter", "error");
      }
    } catch (err) {
      showToast("Failed to publish letter", "error");
    } finally {
      setLetterPublishing(false);
    }
  };

  const handlePublishFundDoc = async () => {
    if (!fundDocTitle.trim() || !fundDocFile) return;
    
    setFundDocPublishing(true);
    try {
      const formData = new FormData();
      formData.append("file", fundDocFile);
      formData.append("title", fundDocTitle.trim());
      formData.append("category", "legal");

      const response = await fetch("/api/admin/publish-document", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPublishedFundDocs(prev => [data.document, ...prev]);
        setFundDocTitle("");
        setFundDocFile(null);
        if (fundDocFileRef.current) fundDocFileRef.current.value = "";
        showToast("Fund document published successfully", "success");
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to publish document", "error");
      }
    } catch (err) {
      showToast("Failed to publish document", "error");
    } finally {
      setFundDocPublishing(false);
    }
  };

  const handleDeleteFundDoc = async (docId: string) => {
    setDeletingDocId(docId);
    try {
      const response = await fetch(`/api/admin/documents/${docId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setPublishedFundDocs(prev => prev.filter(d => d.id !== docId));
        showToast("Document deleted successfully", "success");
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to delete document", "error");
      }
    } catch (err) {
      showToast("Failed to delete document", "error");
    } finally {
      setDeletingDocId(null);
    }
  };

  const formatPublishDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const fetchApprovedUsers = async () => {
    try {
      const response = await fetch("/api/admin/approved-users", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setApprovedUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch approved users:", err);
    } finally {
      setApprovedUsersLoading(false);
    }
  };

  const openBanModal = (user: UserWithoutPassword) => {
    setBanTarget(user);
    setBanReason("");
    setBanModalOpen(true);
  };

  const closeBanModal = () => {
    setBanModalOpen(false);
    setBanTarget(null);
    setBanReason("");
  };

  const handleBan = async () => {
    if (!banTarget || !banReason.trim()) return;
    
    setBanProcessing(true);
    try {
      const response = await fetch(`/api/admin/ban-user/${banTarget.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: banReason.trim() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setApprovedUsers(prev => prev.map(u => u.id === banTarget.id ? data.user : u));
        closeBanModal();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to ban user");
      }
    } catch (err) {
      setError("Failed to ban user");
    } finally {
      setBanProcessing(false);
    }
  };

  const handleReactivate = async (userId: string) => {
    setProcessing(userId);
    try {
      const response = await fetch(`/api/admin/reactivate-user/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setApprovedUsers(prev => prev.map(u => u.id === userId ? data.user : u));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to reactivate user");
      }
    } catch (err) {
      setError("Failed to reactivate user");
    } finally {
      setProcessing(null);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/admin/documents", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.uploads);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleDownload = (documentId: string) => {
    window.open(`/api/admin/documents/${documentId}/download`, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
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
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-5 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-secondary hover:text-secondary-foreground transition-colors mt-4 md:mt-0"
                data-testid="button-view-client-portal"
              >
                <ExternalLink size={16} />
                View Client Portal
              </Link>
            </div>
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

          <section className="mt-16" data-testid="section-client-uploads">
            <h2 className="font-display text-3xl text-primary tracking-tight border-b-4 border-secondary pb-3 inline-block mb-8">
              CLIENT UPLOADS
            </h2>
            
            {documentsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-primary border border-secondary/30 p-8 text-center" data-testid="section-no-documents">
                <FileText size={32} className="mx-auto mb-3 text-secondary/50" />
                <p className="text-muted-foreground">No client documents have been uploaded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-client-uploads">
                  <thead>
                    <tr className="border-b border-secondary/30">
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-secondary py-3 pr-4">Date</th>
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-secondary py-3 pr-4">Investor</th>
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-secondary py-3 pr-4">File Name</th>
                      <th className="text-right text-xs font-bold uppercase tracking-widest text-secondary py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, idx) => (
                      <tr
                        key={doc.id}
                        className="border-b border-border/50 hover:bg-primary/5 transition-colors"
                        data-testid={`row-document-${idx}`}
                      >
                        <td className="py-4 pr-4 text-sm text-muted-foreground">{formatDate(doc.uploadDate)}</td>
                        <td className="py-4 pr-4">
                          <div className="text-sm font-medium text-primary">{doc.investorName}</div>
                          <div className="text-xs text-muted-foreground">{doc.investorEmail}</div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-secondary" />
                            <span className="text-sm text-primary">{doc.fileName}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDownload(doc.id)}
                            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter]"
                            data-testid={`button-download-${idx}`}
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-16" data-testid="section-active-users">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h2 className="font-display text-3xl text-primary tracking-tight border-b-4 border-secondary pb-3 inline-block">
                ACTIVE USERS
              </h2>
              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter]"
                data-testid="button-export-csv"
              >
                <FileDown size={16} />
                Export List
              </button>
            </div>

            <div className="mb-6">
              <div className="relative max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-secondary"
                  data-testid="input-user-search"
                />
              </div>
            </div>
            
            {approvedUsersLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
              </div>
            ) : sortedFilteredUsers.length === 0 ? (
              <div className="bg-primary border border-secondary/30 p-8 text-center" data-testid="section-no-active-users">
                <p className="text-muted-foreground">
                  {userSearch.trim() ? "No users match your search." : "No active users found."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-active-users">
                  <thead>
                    <tr className="border-b border-secondary/30">
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-secondary py-3 pr-4 w-[40%]">User</th>
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-secondary py-3 pr-4 w-[15%]">Role</th>
                      <th className="text-left text-xs font-bold uppercase tracking-widest text-secondary py-3 pr-4 w-[20%]">Status</th>
                      <th className="text-center text-xs font-bold uppercase tracking-widest text-secondary py-3 w-[25%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFilteredUsers.map((user, idx) => {
                      const displayName = getDisplayName(user);
                      return (
                        <tr
                          key={user.id}
                          className={`border-b border-border/50 transition-colors ${user.accountStatus === "banned" ? "opacity-70 bg-red-500/5" : "hover:bg-primary/5"}`}
                          data-testid={`row-user-${idx}`}
                        >
                          <td className="py-4 pr-4">
                            {displayName ? (
                              <>
                                <div className="text-sm font-medium text-primary">{displayName}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </>
                            ) : (
                              <div className="text-sm font-medium text-primary">{user.email}</div>
                            )}
                            {user.banReason && (
                              <div className="text-xs italic text-red-400 mt-1">Note: {user.banReason}</div>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            <span className={`text-xs font-semibold uppercase px-2 py-1 ${user.role === "admin" ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            {user.accountStatus === "banned" ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-red-500 bg-red-500/10 px-2 py-1">
                                <AlertTriangle size={12} />
                                Deactivated
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-green-600 bg-green-500/10 px-2 py-1">
                                <UserCheck size={12} />
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-center">
                            <div className="relative inline-block">
                              <button
                                onClick={() => toggleMenu(user.id)}
                                className="p-2 hover:bg-muted rounded transition-colors"
                                data-testid={`button-menu-${idx}`}
                              >
                                <MoreVertical size={18} className="text-primary" />
                              </button>
                              {openMenuId === user.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-border shadow-lg rounded min-w-[160px]" data-testid={`menu-dropdown-${idx}`}>
                                    <button
                                      className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                                      onClick={() => handleMenuAction("edit", user)}
                                      data-testid={`menu-edit-${idx}`}
                                    >
                                      Edit Details
                                    </button>
                                    {user.accountStatus === "banned" ? (
                                      <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-muted transition-colors"
                                        onClick={() => handleMenuAction("reactivate", user)}
                                        data-testid={`menu-reactivate-${idx}`}
                                      >
                                        Reactivate User
                                      </button>
                                    ) : (
                                      <button
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-muted transition-colors"
                                        onClick={() => handleMenuAction("deactivate", user)}
                                        data-testid={`menu-deactivate-${idx}`}
                                      >
                                        Deactivate User
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-16" data-testid="section-document-publishing">
            <h2 className="font-display text-3xl text-primary tracking-tight border-b-4 border-secondary pb-3 inline-block mb-8">
              DOCUMENT PUBLISHING
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-primary text-primary-foreground p-6 border border-secondary/30" data-testid="section-publish-letter">
                <h3 className="font-display text-xl mb-6">Publish Quarterly Letter</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                      Letter Title
                    </label>
                    <input
                      type="text"
                      value={letterTitle}
                      onChange={(e) => setLetterTitle(e.target.value)}
                      placeholder="e.g., Q4 2025 Investor Letter"
                      className="w-full bg-primary-foreground text-primary border border-secondary/30 p-3 text-sm focus:outline-none focus:border-secondary"
                      data-testid="input-letter-title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                      Publish Date (Optional)
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        type="date"
                        value={letterDate}
                        onChange={(e) => setLetterDate(e.target.value)}
                        className="w-full bg-primary-foreground text-primary border border-secondary/30 p-3 pl-10 text-sm focus:outline-none focus:border-secondary"
                        data-testid="input-letter-date"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                      PDF File
                    </label>
                    <input
                      ref={letterFileRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setLetterFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="letter-file-input"
                      data-testid="input-letter-file"
                    />
                    <label
                      htmlFor="letter-file-input"
                      className="block w-full border-2 border-dashed border-secondary/50 p-4 text-center cursor-pointer hover:border-secondary transition-colors"
                    >
                      <Upload size={24} className="mx-auto mb-2 text-secondary" />
                      <span className="text-sm text-primary-foreground/70">
                        {letterFile ? letterFile.name : "Click to select PDF"}
                      </span>
                    </label>
                  </div>
                  
                  <button
                    onClick={handlePublishLetter}
                    disabled={!letterTitle.trim() || !letterFile || letterPublishing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-publish-letter"
                  >
                    {letterPublishing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Publish Letter
                      </>
                    )}
                  </button>
                </div>

                {publishedLetters.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-secondary/30">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                      Published Letters ({publishedLetters.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {publishedLetters.map((letter) => (
                        <div
                          key={letter.id}
                          className="flex items-center justify-between p-2 bg-primary-foreground/5 text-sm"
                          data-testid={`published-letter-${letter.id}`}
                        >
                          <div>
                            <div className="text-primary-foreground">{letter.title}</div>
                            <div className="text-xs text-primary-foreground/50">{formatPublishDate(letter.publishDate)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 border border-border" data-testid="section-manage-fund-docs">
                <h3 className="font-display text-xl text-primary mb-6">Manage Fund Documents</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={fundDocTitle}
                      onChange={(e) => setFundDocTitle(e.target.value)}
                      placeholder="e.g., Private Placement Memorandum"
                      className="w-full border border-border p-3 text-sm focus:outline-none focus:border-secondary"
                      data-testid="input-funddoc-title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                      PDF File
                    </label>
                    <input
                      ref={fundDocFileRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFundDocFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="funddoc-file-input"
                      data-testid="input-funddoc-file"
                    />
                    <label
                      htmlFor="funddoc-file-input"
                      className="block w-full border-2 border-dashed border-secondary/50 p-4 text-center cursor-pointer hover:border-secondary transition-colors"
                    >
                      <Upload size={24} className="mx-auto mb-2 text-secondary" />
                      <span className="text-sm text-muted-foreground">
                        {fundDocFile ? fundDocFile.name : "Click to select PDF"}
                      </span>
                    </label>
                  </div>
                  
                  <button
                    onClick={handlePublishFundDoc}
                    disabled={!fundDocTitle.trim() || !fundDocFile || fundDocPublishing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-publish-funddoc"
                  >
                    {fundDocPublishing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Add Document
                      </>
                    )}
                  </button>
                </div>

                {publishedFundDocs.length > 0 && (
                  <div className="pt-6 border-t border-border">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">
                      Current Fund Documents ({publishedFundDocs.length})
                    </h4>
                    <div className="space-y-2">
                      {publishedFundDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-muted/30 border border-border"
                          data-testid={`fund-doc-${doc.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-secondary" />
                            <span className="text-sm text-primary">{doc.title}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteFundDoc(doc.id)}
                            disabled={deletingDocId === doc.id}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50"
                            title="Delete document"
                            data-testid={`button-delete-funddoc-${doc.id}`}
                          >
                            {deletingDocId === doc.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {banModalOpen && banTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="modal-ban-overlay">
          <div className="bg-white max-w-md w-full shadow-xl" data-testid="modal-ban">
            <div className="bg-primary text-primary-foreground p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Deactivate User Access</h3>
                <button
                  onClick={closeBanModal}
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  data-testid="button-modal-close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                You are about to deactivate access for <strong className="text-primary">{getDisplayName(banTarget) || banTarget.email}</strong>{getDisplayName(banTarget) && ` (${banTarget.email})`}.
              </p>
              <div className="mb-4">
                <label htmlFor="ban-reason" className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                  Reason for deactivating (Internal Note)
                </label>
                <textarea
                  id="ban-reason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g., Left the firm - Jan 2026"
                  className="w-full border border-border p-3 text-sm resize-none h-24 focus:outline-none focus:border-secondary"
                  data-testid="input-ban-reason"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeBanModal}
                  className="px-5 py-2 text-sm font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-colors"
                  data-testid="button-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBan}
                  disabled={!banReason.trim() || banProcessing}
                  className="px-5 py-2 text-sm font-semibold uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-modal-confirm-ban"
                >
                  {banProcessing ? "Processing..." : "Confirm Deactivation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && editTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="modal-edit-overlay">
          <div className="bg-white max-w-md w-full shadow-xl" data-testid="modal-edit">
            <div className="bg-primary text-primary-foreground p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">Edit User</h3>
                <button
                  onClick={closeEditModal}
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  data-testid="button-edit-modal-close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-firstName" className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    First Name
                  </label>
                  <input
                    id="edit-firstName"
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full border border-border p-3 text-sm focus:outline-none focus:border-secondary"
                    data-testid="input-edit-firstName"
                  />
                </div>
                <div>
                  <label htmlFor="edit-lastName" className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    Last Name
                  </label>
                  <input
                    id="edit-lastName"
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full border border-border p-3 text-sm focus:outline-none focus:border-secondary"
                    data-testid="input-edit-lastName"
                  />
                </div>
                <div>
                  <label htmlFor="edit-role" className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    Role
                  </label>
                  <select
                    id="edit-role"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full border border-border p-3 text-sm focus:outline-none focus:border-secondary bg-white"
                    data-testid="select-edit-role"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={closeEditModal}
                  className="px-5 py-2 text-sm font-semibold uppercase tracking-widest border border-border hover:bg-muted transition-colors"
                  data-testid="button-edit-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editProcessing}
                  className="px-5 py-2 text-sm font-semibold uppercase tracking-widest bg-secondary text-secondary-foreground hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-edit-save"
                >
                  {editProcessing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 shadow-lg ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
          data-testid="toast-notification"
        >
          {toast.message}
        </div>
      )}

      <Footer />
    </div>
  );
}
