"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createProposal } from "@/lib/queries";
import Link from "next/link";
import { toast } from "@/components/Toast";
import ToastContainer from "@/components/Toast";

const TYPES = [
  { value: "prompt", label: "Prompt" },
  { value: "skill", label: "Skill" },
  { value: "agent_workflow", label: "Agent/Workflow" },
  { value: "resource", label: "Resource" },
];

const CATEGORIES = [
  "Design Review & Audit",
  "Design System & Tokens",
  "UX Research & Strategy",
  "UI Generation & Prototyping",
  "Performance & Code Quality",
  "Design Workflow & Ops",
  "Document Creation",
  "Communication",
  "Other",
];

const PREREQUISITES = [
  "Claude Code",
  "Figma MCP",
  "GitHub",
  "API Access",
  "None",
];

export default function ProposePage() {
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("prompt");
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setContent(text);
    toast("File content loaded");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) { toast("Title is required", "error"); return; }
    if (!description.trim()) { toast("Description is required", "error"); return; }
    if (type !== "resource" && !content.trim()) { toast("Content is required", "error"); return; }

    setSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await createProposal({
        user_id: user?.id || "anonymous",
        user_name: user?.fullName || user?.username || undefined,
        user_email: user?.primaryEmailAddress?.emailAddress || undefined,
        title: title.trim(),
        type,
        category,
        description: description.trim(),
        content: content.trim() || undefined,
        prerequisites: prerequisites.filter((p) => p !== "None"),
        source_url: sourceUrl.trim() || undefined,
        tags,
      });

      setSubmitted(true);
      toast("Proposal submitted for review!");
    } catch (err) {
      toast("Submission failed: " + (err as Error).message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="w-full max-w-md rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="mb-4 text-4xl">{"\u2705"}</div>
          <h2 className="mb-2 text-lg font-bold text-[var(--text)]">Proposal Submitted!</h2>
          <p className="mb-6 text-sm text-[var(--muted)]">
            Your contribution has been submitted for admin review. You&apos;ll see it in the registry once approved.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-[6px] bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--bg)] hover:brightness-110"
            >
              Back to Browse
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setTitle("");
                setDescription("");
                setContent("");
                setSourceUrl("");
                setTagsInput("");
                setPrerequisites([]);
              }}
              className="rounded-[6px] px-4 py-2 text-xs text-[var(--muted)] hover:text-[var(--text)]"
            >
              Submit Another
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  const inputClass = "w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--border-hover)] placeholder:text-[var(--muted)]";
  const selectClass = "w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--border-hover)]";
  const labelClass = "mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 px-6 py-3 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-[var(--text)]">Prompt Vault</span>
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
        </Link>
        <span className="text-sm text-[var(--muted)]">Propose a new entry</span>
      </header>

      {/* Form */}
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-6 text-xl font-bold text-[var(--text)]">Propose a New Entry</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Title <span className="text-[var(--warn)]">*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              placeholder="e.g. UX Friction Audit"
              className={inputClass}
            />
            <span className="mt-1 block text-[10px] text-[var(--muted)]">{title.length}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type <span className="text-[var(--warn)]">*</span></label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category <span className="text-[var(--warn)]">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description <span className="text-[var(--warn)]">*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="What does this prompt/skill do? One paragraph."
              className={inputClass}
            />
            <span className="mt-1 block text-[10px] text-[var(--muted)]">{description.length}/500</span>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className={labelClass}>
                Content {type !== "resource" && <span className="text-[var(--warn)]">*</span>}
              </label>
              <label className="cursor-pointer rounded-[6px] border border-dashed border-[var(--border-hover)] px-2 py-1 text-[10px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                Upload .md
                <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="The prompt text, skill instructions, or workflow steps..."
              className={`${inputClass} font-mono text-[12px] leading-relaxed`}
            />
          </div>

          <div>
            <label className={labelClass}>Prerequisites</label>
            <div className="flex flex-wrap gap-2">
              {PREREQUISITES.map((prereq) => (
                <label key={prereq} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={prerequisites.includes(prereq)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPrerequisites((prev) => [...prev, prereq]);
                      } else {
                        setPrerequisites((prev) => prev.filter((p) => p !== prereq));
                      }
                    }}
                    className="h-3.5 w-3.5 rounded border-[var(--border)] bg-[var(--bg)] accent-[var(--accent)]"
                  />
                  <span className="text-xs text-[var(--text)]">{prereq}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Source URL (optional)</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://github.com/..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tags (optional, comma-separated)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ux, review, audit"
              className={inputClass}
            />
          </div>

          {/* Preview toggle */}
          {content && (
            <div>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)]"
              >
                <span className={`transition-transform ${showPreview ? "rotate-90" : ""}`}>&rsaquo;</span>
                Preview
              </button>
              {showPreview && (
                <pre className="mt-2 whitespace-pre-wrap rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--code)]">
                  {content}
                </pre>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/" className="rounded-[6px] px-4 py-2 text-xs text-[var(--muted)] hover:text-[var(--text)]">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[6px] bg-[var(--accent)] px-6 py-2 text-xs font-bold text-[var(--bg)] hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Proposal"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}
