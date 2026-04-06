"use client";

import { Prompt } from "@/lib/types";
import { getCategoryInfo, getStatusInfo, getActionInfo } from "@/lib/constants";
import { updatePrompt } from "@/lib/firebase";
import { toast } from "./Toast";

interface PromptCardProps {
  prompt: Prompt;
  onClick: () => void;
}

export default function PromptCard({ prompt, onClick }: PromptCardProps) {
  const category = getCategoryInfo(prompt.category);
  const status = getStatusInfo(prompt.status);
  const action = getActionInfo(prompt.actionType || "copy");

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.content);
      await updatePrompt(prompt.id, { usageCount: prompt.usageCount + 1 });
      toast("Gekopieerd naar clipboard");
    } catch {
      toast("Kopiëren mislukt", "error");
    }
  };

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updatePrompt(prompt.id, { starred: !prompt.starred });
  };

  const formattedDate = prompt.updatedAt?.toDate?.()
    ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(prompt.updatedAt.toDate())
    : "";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:-translate-y-[1px] hover:border-[var(--border-hover)] hover:shadow-lg hover:shadow-black/20"
    >
      {/* Top row: star + title + copy */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleStar}
            className={`shrink-0 text-sm transition-colors ${
              prompt.starred ? "text-yellow-400" : "text-[var(--muted)]/40 hover:text-yellow-400"
            }`}
          >
            {prompt.starred ? "\u2605" : "\u2606"}
          </button>
          <h3 className="truncate text-sm font-semibold text-[var(--text)]">{prompt.title}</h3>
        </div>
        <button
          onClick={handleCopy}
          title="Kopieer"
          className="shrink-0 rounded-[6px] p-1.5 text-[var(--muted)] opacity-0 transition-all hover:bg-[var(--surface-2)] hover:text-[var(--text)] group-hover:opacity-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Badges */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] font-bold text-[var(--muted)]">
          {category.emoji} {category.label}
        </span>
        <span className={`inline-flex items-center rounded-[20px] px-2 py-[2px] text-[10px] font-bold ${status.color}`}>
          {status.label}
        </span>
        {prompt.landsIn && (
          <span className="inline-flex items-center rounded-[20px] bg-[var(--accent)]/10 px-2 py-[2px] text-[10px] font-bold text-[var(--accent)]">
            &rarr; {prompt.landsIn}
          </span>
        )}
        <span className={`inline-flex items-center rounded-[20px] px-2 py-[2px] text-[10px] font-bold ${action.color}`}>
          {action.icon} {action.label}
        </span>
      </div>

      {/* Description */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
        {prompt.description || prompt.content.slice(0, 120)}
      </p>

      {/* Bottom: tags + meta */}
      <div className="flex flex-wrap items-center gap-1.5">
        {prompt.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] text-[var(--muted)]"
          >
            {tag}
          </span>
        ))}
        {prompt.tags.length > 3 && (
          <span className="text-[10px] text-[var(--muted)]">+{prompt.tags.length - 3}</span>
        )}
        <span className="ml-auto flex items-center gap-2 text-[10px] text-[var(--muted)]">
          {prompt.linkedItems?.length > 0 && (
            <span title={`${prompt.linkedItems.length} gekoppelde items`}>
              {prompt.category === "agent" ? "\uD83D\uDD17" : "\uD83E\uDD16"} {prompt.linkedItems.length}
            </span>
          )}
          {prompt.attachments?.length > 0 && (
            <span title={`${prompt.attachments.length} bijlage(n)`}>
              \uD83D\uDCCE {prompt.attachments.length}
            </span>
          )}
          {prompt.usageCount > 0 && <span>{prompt.usageCount}&times;</span>}
          {formattedDate && <span>{formattedDate}</span>}
        </span>
      </div>
    </div>
  );
}
