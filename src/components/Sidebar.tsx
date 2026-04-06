"use client";

import { CategoryFilter } from "@/hooks/usePrompts";

const CATEGORIES: { value: CategoryFilter; label: string; emoji: string }[] = [
  { value: "prompt", label: "Prompts", emoji: "\uD83D\uDCAC" },
  { value: "skill", label: "Skills", emoji: "\u26A1" },
  { value: "agent_workflow", label: "Agents & Workflows", emoji: "\uD83E\uDD16" },
  { value: "resource", label: "Resources", emoji: "\uD83D\uDCE6" },
];

interface SidebarProps {
  categoryFilter: CategoryFilter;
  onCategoryChange: (val: CategoryFilter) => void;
  counts: Record<string, number>;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  categoryFilter,
  onCategoryChange,
  counts,
  open,
  onClose,
}: SidebarProps) {
  const handleClick = (val: CategoryFilter) => {
    onCategoryChange(val);
    onClose();
  };

  const activeClass = "border-l-[3px] border-l-[var(--accent)] bg-[var(--surface-2)] text-[var(--text)]";
  const inactiveClass = "border-l-[3px] border-l-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]";

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg)] transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-2 py-5">
          <div className="mb-4 flex items-center justify-between px-3 lg:hidden">
            <span className="text-sm font-bold text-[var(--text)]">Menu</span>
            <button onClick={onClose} className="p-1 text-[var(--muted)]">&times;</button>
          </div>

          <nav className="flex-1 space-y-0.5">
            <button
              onClick={() => handleClick("all")}
              className={`flex w-full items-center justify-between rounded-[6px] px-[9px] py-[9px] text-sm transition-colors ${
                categoryFilter === "all" ? activeClass : inactiveClass
              }`}
            >
              <span>All</span>
              <span className="text-[11px] text-[var(--muted)]">{counts.all || 0}</span>
            </button>

            <button
              onClick={() => handleClick("starred")}
              className={`flex w-full items-center justify-between rounded-[6px] px-[9px] py-[9px] text-sm transition-colors ${
                categoryFilter === "starred" ? activeClass : inactiveClass
              }`}
            >
              <span>{"\u2605"} Favorites</span>
              <span className="text-[11px] text-[var(--muted)]">{counts.starred || 0}</span>
            </button>

            <div className="mx-3 my-3 border-t border-[var(--border)]" />

            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleClick(cat.value)}
                className={`flex w-full items-center justify-between rounded-[6px] px-[9px] py-[9px] text-sm transition-colors ${
                  categoryFilter === cat.value ? activeClass : inactiveClass
                }`}
              >
                <span>
                  {cat.emoji} {cat.label}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {counts[cat.value] || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
