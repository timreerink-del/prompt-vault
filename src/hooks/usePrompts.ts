"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Entry } from "@/lib/queries";

export type CategoryFilter = "all" | "starred" | "prompt" | "skill" | "agent_workflow" | "resource";
export type StatusFilter = "all" | "published" | "draft" | "archived";
export type SortOption = "recent" | "az";

export function usePrompts() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("entries")
        .select("*")
        .eq("status", "published")
        .order("updated_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setEntries((data || []) as Entry[]);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filtered = useCallback(() => {
    let result = [...entries];

    if (categoryFilter === "starred") {
      result = result.filter((e) => e.featured);
    } else if (categoryFilter !== "all") {
      result = result.filter((e) => e.type === categoryFilter || e.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.content || "").toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
      default:
        break;
    }

    return result;
  }, [entries, search, categoryFilter, statusFilter, sortBy]);

  const allTags = [...new Set(entries.flatMap((e) => e.tags))].sort();

  const counts: Record<string, number> = {
    all: entries.length,
    starred: entries.filter((e) => e.featured).length,
    prompt: entries.filter((e) => e.type === "prompt" || e.category === "prompt").length,
    skill: entries.filter((e) => e.type === "skill" || e.category === "skill").length,
    agent_workflow: entries.filter((e) => e.type === "agent_workflow" || e.category === "agent" || e.category === "workflow").length,
    resource: entries.filter((e) => e.type === "resource").length,
  };

  return {
    entries: filtered(),
    allEntries: entries,
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
    counts,
    refetch: fetchEntries,
  };
}
