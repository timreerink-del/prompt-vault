"use client";

import { Prompt } from "@/lib/types";
import { getCategoryInfo, getStatusInfo } from "@/lib/constants";
import { updatePrompt } from "@/lib/firebase";

interface DatabaseViewProps {
  prompts: Prompt[];
  onSelect: (prompt: Prompt) => void;
}

export default function DatabaseView({ prompts, onSelect }: DatabaseViewProps) {
  const handleStar = async (e: React.MouseEvent, prompt: Prompt) => {
    e.stopPropagation();
    await updatePrompt(prompt.id, { starred: !prompt.starred });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
            <th className="px-3 py-2 w-8">&starf;</th>
            <th className="px-3 py-2">Titel</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2 hidden md:table-cell">Beschrijving</th>
            <th className="px-3 py-2 hidden lg:table-cell">Output</th>
            <th className="px-3 py-2 hidden md:table-cell">Lands In</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 hidden lg:table-cell">\uD83D\uDCCE</th>
            <th className="px-3 py-2 text-right">Gebruik</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((p) => {
            const cat = getCategoryInfo(p.category);
            const stat = getStatusInfo(p.status);
            return (
              <tr
                key={p.id}
                onClick={() => onSelect(p)}
                className="cursor-pointer border-b border-[var(--border)] transition-colors hover:bg-[var(--surface)]"
              >
                <td className="px-3 py-2.5">
                  <button
                    onClick={(e) => handleStar(e, p)}
                    className={`text-sm ${p.starred ? "text-yellow-400" : "text-[var(--muted)]/30 hover:text-yellow-400"}`}
                  >
                    {p.starred ? "\u2605" : "\u2606"}
                  </button>
                </td>
                <td className="px-3 py-2.5 font-medium text-[var(--text)] max-w-[200px] truncate">
                  {p.title}
                </td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] font-bold text-[var(--muted)]">
                    {cat.emoji} {cat.label}
                  </span>
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell max-w-[200px] truncate text-[var(--muted)]">
                  {p.description}
                </td>
                <td className="px-3 py-2.5 hidden lg:table-cell max-w-[180px] truncate text-[var(--muted)]">
                  {p.output}
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  {p.landsIn && (
                    <span className="inline-flex items-center rounded-[20px] bg-[var(--accent)]/10 px-2 py-[2px] text-[10px] font-bold text-[var(--accent)]">
                      {p.landsIn}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center rounded-[20px] px-2 py-[2px] text-[10px] font-bold ${stat.color}`}>
                    {stat.label}
                  </span>
                </td>
                <td className="px-3 py-2.5 hidden lg:table-cell text-[var(--muted)]">
                  {p.attachments?.length > 0 ? p.attachments.length : ""}
                </td>
                <td className="px-3 py-2.5 text-right text-[var(--muted)]">
                  {p.usageCount}&times;
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
