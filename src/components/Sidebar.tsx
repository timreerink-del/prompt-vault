"use client";

import { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";

interface SidebarProps {
  categoryFilter: Category | "all" | "starred";
  onCategoryChange: (val: Category | "all" | "starred") => void;
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
  const handleClick = (val: Category | "all" | "starred") => {
    onCategoryChange(val);
    onClose();
  };

  const activeClass = "border-l-[3px] border-l-[var(--accent)] bg-[var(--surface-2)] text-[var(--text)]";
  const inactiveClass = "border-l-[3px] border-l-transparent text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]";

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg)] transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-2 py-5">
          {/* Logo - mobile only */}
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
              <span>Alles</span>
              <span className="text-[11px] text-[var(--muted)]">{counts.all || 0}</span>
            </button>

            <button
              onClick={() => handleClick("starred")}
              className={`flex w-full items-center justify-between rounded-[6px] px-[9px] py-[9px] text-sm transition-colors ${
                categoryFilter === "starred" ? activeClass : inactiveClass
              }`}
            >
              <span>Favorieten</span>
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

            <div className="mx-3 my-3 border-t border-[var(--border)]" />

            <div className="space-y-2 px-3 py-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--muted)]">Actief</span>
                <span className="font-bold text-[var(--accent)]">{counts.active || 0}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--muted)]">Totaal gebruik</span>
                <span className="font-bold text-[var(--text)]">{counts.totalUsage || 0}&times;</span>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
