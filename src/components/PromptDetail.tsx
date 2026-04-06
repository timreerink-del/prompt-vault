"use client";

import { useState } from "react";
import { Prompt } from "@/lib/types";
import { getCategoryInfo, getStatusInfo, getActionInfo } from "@/lib/constants";
import { removePrompt, updatePrompt, createPrompt } from "@/lib/firebase";
import { useVersions } from "@/hooks/useVersions";
import { AttachmentList } from "./FileUpload";
import { toast } from "./Toast";

interface PromptDetailProps {
  prompt: Prompt;
  onClose: () => void;
  onEdit: () => void;
  isAdmin?: boolean;
  allPrompts?: Prompt[];
  onSelectPrompt?: (prompt: Prompt) => void;
}

export default function PromptDetail({ prompt, onClose, onEdit, isAdmin = false, allPrompts = [], onSelectPrompt }: PromptDetailProps) {
  const { versions } = useVersions(prompt.id ?? null);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const category = getCategoryInfo(prompt.category);
  const status = getStatusInfo(prompt.status);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      await updatePrompt(prompt.id, { usageCount: prompt.usageCount + 1 });
      toast("Gekopieerd naar clipboard");
    } catch {
      toast("Kopiëren mislukt", "error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Dit item verwijderen? Dit kan niet ongedaan worden.")) return;
    try {
      await removePrompt(prompt.id);
      toast("Verwijderd");
      onClose();
    } catch {
      toast("Verwijderen mislukt", "error");
    }
  };

  const handleDuplicate = async () => {
    try {
      const { id: _id, createdAt: _ca, updatedAt: _ua, ...data } = prompt;
      await createPrompt({
        ...data,
        title: data.title + " (kopie)",
        usageCount: 0,
      });
      toast("Gedupliceerd");
    } catch {
      toast("Dupliceren mislukt", "error");
    }
  };

  const handleStar = async () => {
    await updatePrompt(prompt.id, { starred: !prompt.starred });
  };

  const handleRestore = async (versionContent: string, versionOutput: string) => {
    try {
      await updatePrompt(prompt.id, { content: versionContent, output: versionOutput });
      toast("Versie hersteld");
    } catch {
      toast("Herstellen mislukt", "error");
    }
  };

  const createdDate = prompt.createdAt?.toDate?.()
    ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(prompt.createdAt.toDate())
    : "—";
  const updatedDate = prompt.updatedAt?.toDate?.()
    ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(prompt.updatedAt.toDate())
    : "—";

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[8px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{category.emoji}</span>
            <h2 className="truncate text-lg font-bold text-[var(--text)]">{prompt.title}</h2>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-[6px] p-1 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-5 space-y-5">
          {/* Description */}
          {prompt.description && (
            <p className="text-sm text-[var(--muted)]">{prompt.description}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-[20px] px-2 py-[2px] text-[10px] font-bold ${status.color}`}>
              {status.label}
            </span>
            <span className="inline-flex items-center rounded-[20px] bg-[var(--surface-2)] px-2 py-[2px] text-[10px] font-bold text-[var(--muted)]">
              {category.label}
            </span>
            {prompt.landsIn && (
              <span className="inline-flex items-center rounded-[20px] bg-[var(--accent)]/10 px-2 py-[2px] text-[10px] font-bold text-[var(--accent)]">
                &rarr; {prompt.landsIn}
              </span>
            )}
            {prompt.author && (
              <span className="text-[11px] text-[var(--muted)]">door {prompt.author}</span>
            )}
          </div>

          {/* Primary Action Block */}
          <PrimaryAction prompt={prompt} onCopy={handleCopy} />

          {/* Linked Items */}
          {prompt.linkedItems && prompt.linkedItems.length > 0 && (
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {prompt.category === "agent" ? "Gebruikt:" : "Onderdeel van:"}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {prompt.linkedItems.map((title) => {
                  const linked = allPrompts.find((p) => p.title === title);
                  return (
                    <button
                      key={title}
                      onClick={() => linked && onSelectPrompt?.(linked)}
                      className={`rounded-[20px] px-2 py-[2px] text-[10px] font-bold transition-colors ${
                        linked
                          ? "bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)]/25 cursor-pointer"
                          : "bg-[var(--surface-2)] text-[var(--muted)]"
                      }`}
                    >
                      {prompt.category === "agent" ? "\u2192 " : "\uD83E\uDD16 "}{title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {prompt.tags.map((tag) => (
                <span key={tag} className="rounded-[20px] bg-[#7B8FF7]/15 px-2 py-[2px] text-[10px] font-bold text-[#7B8FF7]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Files */}
          {prompt.files && prompt.files.length > 0 && (
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Benodigde bestanden</h3>
              <div className="flex flex-wrap gap-1.5">
                {prompt.files.map((f) => (
                  <span key={f} className="rounded-[20px] bg-[var(--accent)]/10 px-2 py-[2px] text-[10px] font-bold text-[var(--accent)]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          <AttachmentList attachments={prompt.attachments || []} />

          {/* Content */}
          <div>
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Inhoud</h3>
            <div className="relative">
              <pre className="whitespace-pre-wrap rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--code)]">
                {prompt.content}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute right-3 top-3 rounded-[6px] bg-[var(--surface-2)] p-1.5 text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--text)]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Output */}
          {prompt.output && (
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Verwachte output</h3>
              <pre className="whitespace-pre-wrap rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--muted)]">
                {prompt.output}
              </pre>
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[var(--muted)]">
            <span>Aangemaakt: {createdDate}</span>
            <span>Gewijzigd: {updatedDate}</span>
            <span>Gebruikt: {prompt.usageCount}&times;</span>
          </div>

          {/* Source URL */}
          {prompt.sourceUrl && (
            <a
              href={prompt.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#7B8FF7] hover:underline"
            >
              <span>\uD83D\uDD17</span> Bron: {prompt.sourceUrl.replace(/^https?:\/\/(www\.)?/, "").split("/").slice(0, 3).join("/")}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {/* Versions */}
          {versions.length > 0 && (
            <div>
              <button
                onClick={() => setVersionsOpen(!versionsOpen)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--text)]"
              >
                <span className={`transition-transform ${versionsOpen ? "rotate-90" : ""}`}>&rsaquo;</span>
                Versiegeschiedenis ({versions.length})
              </button>
              {versionsOpen && (
                <div className="mt-2 space-y-2">
                  {versions.map((v, i) => (
                    <div
                      key={v.id ?? i}
                      className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-[var(--bg)] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--text)]">
                          {v.author || "Onbekend"} &mdash;{" "}
                          <span className="text-[var(--muted)]">
                            {v.savedAt?.toDate?.()
                              ? v.savedAt.toDate().toLocaleString("nl-NL")
                              : "Onbekende datum"}
                          </span>
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                          {v.content.slice(0, 80)}...
                        </p>
                      </div>
                      <button
                        onClick={() => handleRestore(v.content, v.output)}
                        className="shrink-0 rounded-[6px] px-3 py-1 text-[11px] font-bold text-[#7B8FF7] hover:bg-[#7B8FF7]/10"
                      >
                        Herstel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-3">
          <div className="flex gap-1">
            <button onClick={handleStar} className="rounded-[6px] px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]">
              {prompt.starred ? "\u2605 Unfavorite" : "\u2606 Favoriet"}
            </button>
            {isAdmin && (
              <>
                <button onClick={handleDuplicate} className="rounded-[6px] px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]">
                  Dupliceer
                </button>
                <button onClick={handleDelete} className="rounded-[6px] px-3 py-1.5 text-xs text-[#F7715C] hover:bg-[#F7715C]/10">
                  Verwijder
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-[6px] px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]">
              Sluiten
            </button>
            {isAdmin && (
              <button onClick={onEdit} className="rounded-[6px] bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-[var(--bg)] hover:brightness-110">
                Bewerken
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimaryAction({ prompt, onCopy }: { prompt: Prompt; onCopy: () => void }) {
  const action = getActionInfo(prompt.actionType || "copy");

  const copyCommand = async () => {
    if (prompt.installCommand) {
      await navigator.clipboard.writeText(prompt.installCommand);
      toast("Commando gekopieerd \u2014 plak in je terminal");
    }
  };

  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-flex items-center rounded-[20px] px-2 py-[2px] text-[10px] font-bold ${action.color}`}>
          {action.icon} {action.label}
        </span>
        <span className="text-[10px] text-[var(--muted)]">
          {prompt.actionType === "copy" && "Kopieer de prompt en plak in Claude"}
          {prompt.actionType === "install" && "Voer dit commando uit in je terminal"}
          {prompt.actionType === "download" && "Download de bijlage(n)"}
          {prompt.actionType === "link" && "Open de externe bron"}
        </span>
      </div>

      {/* Install command */}
      {prompt.actionType === "install" && prompt.installCommand && (
        <button
          onClick={copyCommand}
          className="group flex w-full items-center justify-between rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left font-mono text-[12px] text-[var(--code)] transition-colors hover:border-[#7B8FF7]/40"
        >
          <span>$ {prompt.installCommand}</span>
          <span className="text-[10px] text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100">kopieer</span>
        </button>
      )}

      {/* Copy prompt */}
      {(prompt.actionType === "copy" || !prompt.actionType) && (
        <button
          onClick={onCopy}
          className="flex items-center gap-2 rounded-[6px] bg-[#5CEFB5] px-4 py-2 text-xs font-bold text-[var(--bg)] transition-colors hover:brightness-110"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Kopieer prompt naar clipboard
        </button>
      )}

      {/* Link */}
      {prompt.actionType === "link" && prompt.sourceUrl && (
        <a
          href={prompt.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[6px] bg-[var(--surface-2)] px-4 py-2 text-xs font-bold text-[var(--text)] transition-colors hover:bg-[var(--surface-3)]"
        >
          Open bron
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
