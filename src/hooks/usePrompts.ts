"use client";

import { useEffect, useState, useCallback } from "react";
import { subscribeToPrompts, isCollectionEmpty, batchCreatePrompts, getAllPromptTitles, migrateActionFields } from "@/lib/firebase";
import { Prompt, Category, Status, SortOption } from "@/lib/types";
import { SEED_DATA } from "@/data/seed";
import { UX_COLLECTION } from "@/data/seed-ux-collection";
import { AGENT_DATA } from "@/data/seed-agents";

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all" | "starred">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  useEffect(() => {
    // Seed data if collection is empty
    const seeded = localStorage.getItem("prompt-registry-seeded");
    if (!seeded) {
      isCollectionEmpty().then((empty) => {
        if (empty) {
          batchCreatePrompts(SEED_DATA).then(() => {
            localStorage.setItem("prompt-registry-seeded", "true");
          });
        } else {
          localStorage.setItem("prompt-registry-seeded", "true");
        }
      });
    }

    // Seed UX collection — skip duplicates by title
    const uxSeeded = localStorage.getItem("prompt-registry-ux-seeded-v2");
    if (!uxSeeded) {
      getAllPromptTitles().then((existingTitles) => {
        const newItems = UX_COLLECTION.filter(
          (item) => !existingTitles.includes(item.title)
        );
        if (newItems.length > 0) {
          batchCreatePrompts(newItems).then(() => {
            localStorage.setItem("prompt-registry-ux-seeded-v2", "true");
          });
        } else {
          localStorage.setItem("prompt-registry-ux-seeded-v2", "true");
        }
      });
    }

    // Migrate existing docs: add actionType + linkedItems fields where missing
    const migrated = localStorage.getItem("prompt-registry-migrated-v2");
    if (!migrated) {
      const allSeedData = [...SEED_DATA, ...UX_COLLECTION, ...AGENT_DATA];
      migrateActionFields(allSeedData).then(() => {
        localStorage.setItem("prompt-registry-migrated-v2", "true");
      });
    }

    // Seed agents — skip duplicates by title
    const agentsSeeded = localStorage.getItem("prompt-registry-agents-seeded-v1");
    if (!agentsSeeded) {
      getAllPromptTitles().then((existingTitles) => {
        const newAgents = AGENT_DATA.filter(
          (item) => !existingTitles.includes(item.title)
        );
        if (newAgents.length > 0) {
          batchCreatePrompts(newAgents).then(() => {
            localStorage.setItem("prompt-registry-agents-seeded-v1", "true");
          });
        } else {
          localStorage.setItem("prompt-registry-agents-seeded-v1", "true");
        }
      });
    }

    const unsubscribe = subscribeToPrompts((data) => {
      setPrompts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = useCallback(() => {
    let result = [...prompts];

    if (categoryFilter === "starred") {
      result = result.filter((p) => p.starred);
    } else if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "usage":
        result.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case "recent":
      default:
        break;
    }

    return result;
  }, [prompts, search, categoryFilter, statusFilter, sortBy]);

  const allTags = [...new Set(prompts.flatMap((p) => p.tags))].sort();
  const allFiles = [...new Set(prompts.flatMap((p) => p.files || []))].sort();

  const counts: Record<string, number> = {
    all: prompts.length,
    starred: prompts.filter((p) => p.starred).length,
    prompt: prompts.filter((p) => p.category === "prompt").length,
    skill: prompts.filter((p) => p.category === "skill").length,
    workflow: prompts.filter((p) => p.category === "workflow").length,
    system: prompts.filter((p) => p.category === "system").length,
    agent: prompts.filter((p) => p.category === "agent").length,
    output: prompts.filter((p) => p.category === "output").length,
    snippet: prompts.filter((p) => p.category === "snippet").length,
    active: prompts.filter((p) => p.status === "active").length,
    totalUsage: prompts.reduce((sum, p) => sum + p.usageCount, 0),
  };

  return {
    prompts: filtered(),
    allPrompts: prompts,
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
  };
}
