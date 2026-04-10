"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface HeaderProps {
  totalCount: number;
}

export default function Header({ totalCount }: HeaderProps) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/80 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-[var(--text)]">Prompt Vault</span>
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
        </Link>
        <span className="rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] font-bold text-[var(--muted)]">
          {totalCount} items
        </span>
      </div>

      <div className="flex items-center gap-3">
        {!isLoaded ? null : isSignedIn ? (
          <>
            <Link
              href="/propose"
              className="flex items-center gap-1.5 rounded-[6px] bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-[var(--bg)] transition-colors hover:brightness-110"
            >
              <span>+</span> Propose
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7",
                },
              }}
            />
          </>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-[6px] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
