"use client";

import { Entry } from "@/lib/queries";
import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";

const TYPE_INFO: Record<string, { label: string; emoji: string }> = {
  prompt: { label: "Prompt", emoji: "\uD83D\uDCAC" },
  skill: { label: "Skill", emoji: "\u26A1" },
  agent_workflow: { label: "Agent/Workflow", emoji: "\uD83E\uDD16" },
  resource: { label: "Resource", emoji: "\uD83D\uDCE6" },
};

function getTypeInfo(type: string) {
  return TYPE_INFO[type] || { label: type, emoji: "\uD83D\uDCCB" };
}

interface EntryDetailProps {
  entry: Entry;
  onClose: () => void;
  allEntries?: Entry[];
  onSelectEntry?: (entry: Entry) => void;
}

export default function EntryDetail({ entry, onClose }: EntryDetailProps) {
  const typeInfo = getTypeInfo(entry.type);
  const slug = entry.slug || entry.title.toLowerCase().replace(/\s+/g, "-");

  const createdDate = entry.created_at
    ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(entry.created_at))
    : "";
  const updatedDate = entry.updated_at
    ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date(entry.updated_at))
    : "";

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[8px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{typeInfo.emoji}</span>
            <h2 className="truncate text-lg font-bold text-[var(--text)]">{entry.title}</h2>
            {entry.featured && <span style={{ color: "var(--star-color)" }}>{"\u2605"}</span>}
          </div>
          <button onClick={onClose} className="shrink-0 rounded-[6px] p-1 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-[var(--muted)]">{entry.description}</p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] font-bold text-[var(--muted)]">
              {typeInfo.emoji} {typeInfo.label}
            </span>
            {entry.category && entry.category !== entry.type && (
              <span className="inline-flex items-center rounded-[20px] bg-[var(--accent)]/10 px-2 py-[2px] text-[10px] font-bold text-[var(--accent)]">
                {entry.category}
              </span>
            )}
          </div>

          {/* Primary Actions */}
          <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3">
            {/* Install command for skills */}
            {entry.install_command && (
              <div>
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Install command</div>
                <div className="flex items-center justify-between rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 font-mono text-[12px] text-[var(--code)]">
                  <span>$ {entry.install_command}</span>
                  <CopyButton text={entry.install_command} variant="inline" label="Copy" />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {entry.content && (
                <>
                  <CopyButton text={entry.content} variant="button" label="Copy to clipboard" />
                  <DownloadButton content={entry.content} filename={`${slug}.md`} />
                </>
              )}
            </div>
          </div>

          {/* Prerequisites */}
          {entry.prerequisites && entry.prerequisites.length > 0 && (
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Prerequisites</h3>
              <div className="flex flex-wrap gap-1.5">
                {entry.prerequisites.map((prereq) => (
                  <span key={prereq} className="rounded-[20px] bg-[var(--accent)]/10 px-2 py-[2px] text-[10px] font-bold text-[var(--accent)]">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-[20px] bg-[#7B8FF7]/15 px-2 py-[2px] text-[10px] font-bold text-[#7B8FF7]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          {entry.content && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Content</h3>
                <CopyButton text={entry.content} variant="inline" label="Copy" />
              </div>
              <div className="relative">
                <pre className="whitespace-pre-wrap rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--code)]">
                  {entry.content}
                </pre>
                <CopyButton text={entry.content} className="absolute right-3 top-3 bg-[var(--surface-2)] hover:bg-[var(--surface-3)]" />
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[var(--muted)]">
            {createdDate && <span>Created: {createdDate}</span>}
            {updatedDate && <span>Updated: {updatedDate}</span>}
          </div>

          {/* Source URL */}
          {entry.source_url && (
            <a
              href={entry.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#7B8FF7] hover:underline"
            >
              <span>{"\uD83D\uDD17"}</span> Source: {entry.source_url.replace(/^https?:\/\/(www\.)?/, "").split("/").slice(0, 3).join("/")}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-[var(--border)] px-6 py-3">
          <button onClick={onClose} className="rounded-[6px] px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
