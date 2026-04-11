"use client";

import { useState } from "react";
import { usePrompts, CategoryFilter, StatusFilter, SortOption } from "@/hooks/usePrompts";
import { Entry } from "@/lib/queries";
import Header, { ViewMode } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import EntryCard from "@/components/EntryCard";
import EntryDetail from "@/components/EntryDetail";
import ToastContainer from "@/components/Toast";

export default function Home() {
  const {
    entries,
    allEntries,
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    counts,
  } = usePrompts();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        counts={counts}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header totalCount={counts.all} viewMode={viewMode} onViewModeChange={setViewMode} />

        <SearchBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-6 pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 text-4xl opacity-40">
                {search || categoryFilter !== "all" || statusFilter !== "all" ? "\uD83D\uDD0D" : "\uD83D\uDCCB"}
              </div>
              <h2 className="mb-2 text-sm font-semibold text-[var(--text)]">
                {search || categoryFilter !== "all" || statusFilter !== "all"
                  ? "No results found"
                  : "No items yet"}
              </h2>
              <p className="mb-6 text-xs text-[var(--muted)]">
                {search || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Check back soon for community-contributed prompts and skills"}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-2"}>
              {entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => setSelectedEntry(entry)}
                  compact={viewMode === "list"}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedEntry && (
        <EntryDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(undefined)}
          allEntries={allEntries}
          onSelectEntry={(e) => setSelectedEntry(e)}
        />
      )}

      <ToastContainer />
    </div>
  );
}
