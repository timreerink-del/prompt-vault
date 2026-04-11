"use client";

import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export type ViewMode = "grid" | "list";

interface HeaderProps {
  totalCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function Header({ totalCount, viewMode, onViewModeChange }: HeaderProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();

  const displayName = user?.firstName
    || user?.username
    || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]
    || "";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--header-border)",
        background: "var(--header-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        height: 48,
      }}
      className="px-3 md:px-6"
    >
      {/* ── Left: App name + dot + count + view toggle ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            Prompt Vault
          </span>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent)",
              flexShrink: 0,
            }}
          />
        </Link>

        {/* Count pill — hidden on small screens */}
        <span
          className="hidden sm:inline-flex"
          style={{
            background: "var(--toggle-bg)",
            borderRadius: 20,
            padding: "2px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--muted)",
          }}
        >
          {totalCount} items
        </span>

        {/* View toggle — hidden on small screens */}
        <div
          className="hidden sm:flex"
          style={{
            alignItems: "center",
            gap: 2,
            background: "var(--toggle-bg)",
            borderRadius: 6,
            padding: 2,
          }}
        >
          <button
            onClick={() => onViewModeChange("grid")}
            title="Grid view"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 24,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: viewMode === "grid" ? "var(--toggle-active)" : "transparent",
              color: viewMode === "grid" ? "var(--text)" : "var(--muted)",
              transition: "all 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            title="List view"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 24,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: viewMode === "list" ? "var(--toggle-active)" : "transparent",
              color: viewMode === "list" ? "var(--text)" : "var(--muted)",
              transition: "all 0.15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="14" height="3" rx="1" />
              <rect x="1" y="6.5" width="14" height="3" rx="1" />
              <rect x="1" y="12" width="14" height="3" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Right: desktop-only controls ── */}
      <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "var(--toggle-bg)",
            color: "var(--muted)",
            transition: "all 0.2s",
          }}
        >
          {theme === "dark" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {isLoaded && isSignedIn ? (
          <>
            <Link
              href="/propose"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "var(--accent)",
                color: "var(--btn-text)",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                lineHeight: 1,
                transition: "filter 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
            >
              <span style={{ fontSize: 15, lineHeight: 1 }}>+</span>
              New
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{displayName}</span>
              <span
                style={{
                  background: "var(--accent)",
                  color: "var(--btn-text)",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "lowercase",
                }}
              >
                admin
              </span>
            </div>

            <UserButton
              appearance={{
                elements: { avatarBox: { width: 28, height: 28 } },
              }}
            />
          </>
        ) : isLoaded ? (
          <Link
            href="/sign-in"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--accent)",
              color: "var(--btn-text)",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            Sign in
          </Link>
        ) : null}
      </div>
    </header>
  );
}
