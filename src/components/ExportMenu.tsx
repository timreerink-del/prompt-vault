"use client";

import { useRef } from "react";
import { Prompt } from "@/lib/types";
import { createPrompt } from "@/lib/firebase";
import { toast } from "./Toast";

export function exportAsJSON(prompts: Prompt[]) {
  const data = prompts.map(({ id, createdAt, updatedAt, ...rest }) => rest);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `randstad-craft-kit-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast(`${prompts.length} items geëxporteerd als JSON`);
}

export function ImportButton() {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as Partial<Prompt>[];

      let count = 0;
      for (const item of data) {
        await createPrompt({
          title: item.title || "Untitled",
          category: item.category || "prompt",
          status: item.status || "draft",
          description: item.description || "",
          content: item.content || "",
          output: item.output || "",
          landsIn: item.landsIn || "",
          tags: item.tags || [],
          files: item.files || [],
          attachments: item.attachments || [],
          actionType: item.actionType || "copy",
          installCommand: item.installCommand || "",
          sourceUrl: item.sourceUrl || "",
          linkedItems: item.linkedItems || [],
          author: item.author || "",
          starred: item.starred || false,
          usageCount: item.usageCount || 0,
        });
        count++;
      }
      toast(`${count} items geïmporteerd`);
    } catch {
      toast("Ongeldig JSON bestand", "error");
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <input
      ref={fileRef}
      type="file"
      accept=".json"
      onChange={handleImport}
      className="hidden"
      id="import-file"
    />
  );
}
