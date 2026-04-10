"use client";

import { Entry } from "@/lib/queries";
import CopyButton from "./CopyButton";

const TYPE_INFO: Record<string, { label: string; emoji: string }> = {
  prompt: { label: "Prompt", emoji: "\uD83D\uDCAC" },
  skill: { label: "Skill", emoji: "\u26A1" },
  agent_workflow: { label: "Agent/Workflow", emoji: "\uD83E\uDD16" },
  resource: { label: "Resource", emoji: "\uD83D\uDCE6" },
};

function getTypeInfo(type: string) {
  return TYPE_INFO[type] || { label: type, emoji: "\uD83D\uDCCB" };
}

interface EntryCardProps {
  entry: Entry;
  onClick: () => void;
}

export default function EntryCard({ entry, onClick }: EntryCardProps) {
  const typeInfo = getTypeInfo(entry.type);

  const formattedDate = entry.updated_at
    ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(entry.updated_at))
    : "";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-[1px] hover:border-[var(--border-hover)] hover:shadow-lg hover:shadow-black/20"
    >
      {/* Top row: star + title + copy */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {entry.featured && (
            <span className="shrink-0 text-sm" style={{ color: "#facc15" }}>{"\u2605"}</span>
          )}
          <h3 className="truncate text-sm font-semibold text-[var(--text)]">{entry.title}</h3>
        </div>
        <div className="opacity-0 transition-all group-hover:opacity-100">
          <CopyButton text={entry.content || entry.description} />
        </div>
      </div>

      {/* Badges */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] font-bold text-[var(--muted)]">
          {typeInfo.emoji} {typeInfo.label}
        </span>
        {entry.category && entry.category !== entry.type && (
          <span className="inline-flex items-center rounded-[20px] bg-[var(--accent)]/10 px-2 py-[2px] text-[10px] font-bold text-[var(--accent)]">
            {entry.category}
          </span>
        )}
        {entry.install_command && (
          <span className="inline-flex items-center rounded-[20px] bg-[#7B8FF7]/15 px-2 py-[2px] text-[10px] font-bold text-[#7B8FF7]">
            {"\u2699\uFE0F"} Install
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
        {entry.description}
      </p>

      {/* Bottom: tags + meta */}
      <div className="flex flex-wrap items-center gap-1.5">
        {entry.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] text-[var(--muted)]"
          >
            {tag}
          </span>
        ))}
        {entry.tags.length > 3 && (
          <span className="text-[10px] text-[var(--muted)]">+{entry.tags.length - 3}</span>
        )}
        {formattedDate && (
          <span className="ml-auto text-[10px] text-[var(--muted)]">{formattedDate}</span>
        )}
      </div>
    </div>
  );
}
