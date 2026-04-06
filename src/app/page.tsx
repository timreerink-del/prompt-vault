"use client";

import { useState } from "react";
import { usePrompts } from "@/hooks/usePrompts";
import { useAuth } from "@/hooks/useAuth";
import { Prompt, ViewMode } from "@/lib/types";
import { exportAsJSON } from "@/components/ExportMenu";
import LoginScreen from "@/components/LoginScreen";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import PromptCard from "@/components/PromptCard";
import DatabaseView from "@/components/DatabaseView";
import PromptEditor from "@/components/PromptEditor";
import PromptDetail from "@/components/PromptDetail";
import ToastContainer from "@/components/Toast";

export default function Home() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Show login screen if not authenticated
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AppContent isAdmin={isAdmin} userName={user.displayName || user.email || ""} />;
}

function AppContent({ isAdmin, userName }: { isAdmin: boolean; userName: string }) {
  const {
    prompts,
    allPrompts,
    loading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    allTags,
    allFiles,
    counts,
  } = usePrompts();

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | undefined>();

  const handleNew = () => {
    setEditingPrompt(undefined);
    setEditorOpen(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setSelectedPrompt(undefined);
    setEditingPrompt(prompt);
    setEditorOpen(true);
  };

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
        <Header
          totalCount={counts.all}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onNewPrompt={handleNew}
          onExportJSON={() => exportAsJSON(allPrompts)}
          allPrompts={allPrompts}
          isAdmin={isAdmin}
        />

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
          ) : prompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 text-4xl opacity-40">
                {search || categoryFilter !== "all" || statusFilter !== "all" ? "\uD83D\uDD0D" : "\uD83D\uDCCB"}
              </div>
              <h2 className="mb-2 text-sm font-semibold text-[var(--text)]">
                {search || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Geen resultaten gevonden"
                  : "Nog geen items"}
              </h2>
              <p className="mb-6 text-xs text-[var(--muted)]">
                {search || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Pas je zoekopdracht of filters aan"
                  : "Maak je eerste item aan om te beginnen"}
              </p>
              {isAdmin && !search && categoryFilter === "all" && statusFilter === "all" && (
                <button
                  onClick={handleNew}
                  className="rounded-[6px] bg-[var(--accent)] px-5 py-2 text-xs font-bold text-[var(--bg)]"
                >
                  Eerste item aanmaken
                </button>
              )}
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {prompts.map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={p}
                  onClick={() => setSelectedPrompt(p)}
                />
              ))}
            </div>
          ) : (
            <DatabaseView
              prompts={prompts}
              onSelect={(p) => setSelectedPrompt(p)}
            />
          )}
        </main>
      </div>

      {editorOpen && (
        <PromptEditor
          prompt={editingPrompt}
          allTags={allTags}
          allFiles={allFiles}
          defaultAuthor={userName}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {selectedPrompt && (
        <PromptDetail
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(undefined)}
          onEdit={() => handleEdit(selectedPrompt)}
          isAdmin={isAdmin}
          allPrompts={allPrompts}
          onSelectPrompt={(p) => setSelectedPrompt(p)}
        />
      )}

      <ToastContainer />
    </div>
  );
}
