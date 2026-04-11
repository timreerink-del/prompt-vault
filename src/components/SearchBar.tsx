"use client";

import { useEffect, useRef } from "react";
import { StatusFilter, SortOption } from "@/hooks/usePrompts";

interface SearchBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (val: StatusFilter) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  onToggleSidebar: () => void;
}

export default function SearchBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onToggleSidebar,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSearch = (val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearchChange(val), 300);
  };

  const selectClass = "rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--border-hover)]";

  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-6 sm:py-4">
      <button
        onClick={onToggleSidebar}
        className="rounded-[6px] p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] lg:hidden"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="relative min-w-[200px] flex-1">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          defaultValue={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search prompts, skills, workflows..."
          className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] py-2 pl-10 pr-4 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--border-hover)]"
        />
      </div>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className={selectClass}
      >
        <option value="recent">Recent</option>
        <option value="az">A &rarr; Z</option>
      </select>
    </div>
  );
}
