"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getProposals, approveProposal, rejectProposal, Proposal } from "@/lib/queries";
import Link from "next/link";
import { toast } from "@/components/Toast";
import ToastContainer from "@/components/Toast";

// Hardcode admin user IDs here. In production, use Clerk metadata or a database table.
const ADMIN_USER_IDS: string[] = [
  // Add your Clerk user IDs here, e.g.:
  // "user_2abc123...",
];

export default function AdminProposalsPage() {
  const { user, isLoaded } = useUser();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState<Record<string, string>>({});

  // Check admin access
  const isAdmin = user && (ADMIN_USER_IDS.length === 0 || ADMIN_USER_IDS.includes(user.id));

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    fetchProposals();
  }, [isLoaded, isAdmin, statusFilter]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await getProposals(statusFilter);
      setProposals(data);
    } catch (err) {
      toast("Failed to load proposals: " + (err as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveProposal(id);
      toast("Proposal approved and published!");
      fetchProposals();
    } catch (err) {
      toast("Approve failed: " + (err as Error).message, "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectProposal(id, rejectFeedback[id] || undefined);
      toast("Proposal rejected");
      fetchProposals();
    } catch (err) {
      toast("Reject failed: " + (err as Error).message, "error");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <h1 className="mb-2 text-lg font-bold text-[var(--text)]">Access Denied</h1>
          <p className="mb-4 text-sm text-[var(--muted)]">You don&apos;t have admin access.</p>
          <Link href="/" className="text-sm text-[var(--accent)] hover:underline">Back to Browse</Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-[#F7C948]/15 text-[#F7C948]",
    approved: "bg-[#5CEFB5]/15 text-[#5CEFB5]",
    rejected: "bg-[#F7715C]/15 text-[#F7715C]",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-[var(--text)]">Prompt Vault</span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          </Link>
          <span className="rounded-[20px] bg-[var(--accent)]/15 px-2 py-[1px] text-[9px] font-bold text-[var(--accent)]">admin</span>
        </div>
        <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--text)]">Back to Browse</Link>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[var(--text)]">Proposals</h1>
          <div className="flex items-center gap-2">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-[var(--accent)] text-[var(--bg)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm text-[var(--muted)]">No proposals found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-[var(--text)]">{proposal.title}</h3>
                      <span className={`inline-flex items-center rounded-[20px] px-2 py-[2px] text-[10px] font-bold ${statusColors[proposal.status] || ""}`}>
                        {proposal.status}
                      </span>
                      <span className="text-[10px] text-[var(--muted)]">{proposal.type}</span>
                    </div>
                    <p className="text-xs text-[var(--muted)]">{proposal.description}</p>
                    <div className="mt-1 text-[10px] text-[var(--muted)]">
                      by {proposal.user_name || proposal.user_email || "Anonymous"} &middot;{" "}
                      {new Date(proposal.created_at).toLocaleDateString("en-US")}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === proposal.id ? null : proposal.id)}
                    className="shrink-0 rounded-[6px] px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]"
                  >
                    {expandedId === proposal.id ? "Collapse" : "View"}
                  </button>
                </div>

                {expandedId === proposal.id && (
                  <div className="mt-4 space-y-4 border-t border-[var(--border)] pt-4">
                    {/* Full content */}
                    {proposal.content && (
                      <pre className="whitespace-pre-wrap rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--code)]">
                        {proposal.content}
                      </pre>
                    )}

                    {/* Tags */}
                    {proposal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proposal.tags.map((tag) => (
                          <span key={tag} className="rounded-[20px] bg-[#7B8FF7]/15 px-2 py-[2px] text-[10px] font-bold text-[#7B8FF7]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {proposal.status === "pending" && (
                      <div className="flex items-end gap-3">
                        <button
                          onClick={() => handleApprove(proposal.id)}
                          className="rounded-[6px] bg-[#5CEFB5] px-4 py-2 text-xs font-bold text-[var(--bg)] hover:brightness-110"
                        >
                          Approve & Publish
                        </button>
                        <div className="flex-1">
                          <input
                            value={rejectFeedback[proposal.id] || ""}
                            onChange={(e) => setRejectFeedback((prev) => ({ ...prev, [proposal.id]: e.target.value }))}
                            placeholder="Rejection feedback (optional)"
                            className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                          />
                        </div>
                        <button
                          onClick={() => handleReject(proposal.id)}
                          className="rounded-[6px] bg-[#F7715C]/15 px-4 py-2 text-xs font-bold text-[#F7715C] hover:bg-[#F7715C]/25"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Admin feedback on rejected */}
                    {proposal.status === "rejected" && proposal.admin_feedback && (
                      <div className="rounded-[6px] bg-[#F7715C]/10 px-4 py-3 text-xs text-[#F7715C]">
                        Feedback: {proposal.admin_feedback}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
