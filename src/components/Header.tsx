"use client";

import { Prompt, ViewMode } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { ImportButton } from "./ExportMenu";

interface HeaderProps {
  totalCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNewPrompt: () => void;
  onExportJSON: () => void;
  allPrompts: Prompt[];
  isAdmin: boolean;
}

export default function Header({
  totalCount,
  viewMode,
  onViewModeChange,
  onNewPrompt,
  onExportJSON,
  isAdmin,
}: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-[var(--text)]">Randstad Craft Kit</span>
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
        </div>
        <span className="rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] font-bold text-[var(--muted)]">
          {totalCount} items
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewModeChange(viewMode === "cards" ? "database" : "cards")}
          title={viewMode === "cards" ? "Database view" : "Card view"}
          className="rounded-[6px] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          {viewMode === "cards" ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )}
        </button>

        <button
          onClick={onExportJSON}
          title="Export JSON"
          className="rounded-[6px] p-2 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        {isAdmin && (
          <button
            onClick={onNewPrompt}
            className="flex items-center gap-1.5 rounded-[6px] bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-[var(--bg)] transition-colors hover:brightness-110"
          >
            <span>+</span> Nieuw
          </button>
        )}

        {/* User info + logout */}
        <div className="ml-2 flex items-center gap-2 border-l border-[var(--border)] pl-3">
          <span className="hidden text-[11px] text-[var(--muted)] sm:inline">
            {user?.email?.split("@")[0]}
          </span>
          {isAdmin && (
            <span className="rounded-[20px] bg-[var(--accent)]/15 px-1.5 py-[1px] text-[9px] font-bold text-[var(--accent)]">
              admin
            </span>
          )}
          <button
            onClick={signOut}
            title="Uitloggen"
            className="rounded-[6px] p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <ImportButton />
    </header>
  );
}
