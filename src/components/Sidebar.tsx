"use client";

import { useAuth, useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { CategoryFilter } from "@/hooks/usePrompts";
import { useTheme } from "./ThemeProvider";

const CATEGORIES: { value: CategoryFilter; label: string; emoji: string }[] = [
  { value: "prompt", label: "Prompts", emoji: "\uD83D\uDCAC" },
  { value: "skill", label: "Skills", emoji: "\u26A1" },
  { value: "agent_workflow", label: "Agents & Workflows", emoji: "\uD83E\uDD16" },
  { value: "agent_experience", label: "Agent Experience", emoji: "\uD83E\uDDED" },
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
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  const displayName = user?.firstName
    || user?.username
    || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]
    || "";

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
          {/* Mobile header */}
          <div className="mb-4 flex items-center justify-between px-3 lg:hidden">
            <span className="text-sm font-bold text-[var(--text)]">Menu</span>
            <button onClick={onClose} className="p-1 text-[var(--muted)]">&times;</button>
          </div>

          {/* Category nav */}
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

          {/* ── Mobile-only: actions ── */}
          <div className="mt-auto border-t border-[var(--border)] pt-4 space-y-2 lg:hidden">
            {/* + New */}
            {isLoaded && isSignedIn && (
              <Link
                href="/propose"
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-[6px] px-[9px] py-[9px] text-sm text-[var(--text)] transition-colors hover:bg-[var(--surface)]"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold"
                  style={{ background: "var(--accent)", color: "var(--btn-text)" }}
                >
                  +
                </span>
                New submission
              </Link>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => { toggleTheme(); onClose(); }}
              className="flex w-full items-center gap-3 rounded-[6px] px-[9px] py-[9px] text-sm text-[var(--text)] transition-colors hover:bg-[var(--surface)]"
            >
              <span className="flex h-6 w-6 items-center justify-center text-[var(--muted)]">
                {theme === "dark" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </span>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>

            {/* Auth */}
            {isLoaded && isSignedIn ? (
              <div className="flex items-center justify-between rounded-[6px] px-[9px] py-[9px]">
                <div className="flex items-center gap-2 min-w-0">
                  <UserButton appearance={{ elements: { avatarBox: { width: 22, height: 22 } } }} />
                  <span className="truncate text-sm text-[var(--text)]">{displayName}</span>
                </div>
                <SignOutButton>
                  <button className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            ) : isLoaded ? (
              <Link
                href="/sign-in"
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-[6px] px-[9px] py-[9px] text-sm text-[var(--text)] transition-colors hover:bg-[var(--surface)]"
              >
                <span className="flex h-6 w-6 items-center justify-center text-[var(--muted)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </span>
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
}
