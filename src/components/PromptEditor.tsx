"use client";

import { useState } from "react";
import { Prompt, Category, Status, Attachment, ActionType } from "@/lib/types";
import { CATEGORIES, STATUSES, LANDS_IN_OPTIONS, ACTION_TYPES } from "@/lib/constants";
import { createPrompt, updatePrompt, addVersion } from "@/lib/firebase";
import TagInput from "./TagInput";
import FileUpload from "./FileUpload";
import { toast } from "./Toast";

interface PromptEditorProps {
  prompt?: Prompt;
  allTags: string[];
  allFiles: string[];
  defaultAuthor?: string;
  onClose: () => void;
}

export default function PromptEditor({ prompt, allTags, allFiles, defaultAuthor = "", onClose }: PromptEditorProps) {
  const [title, setTitle] = useState(prompt?.title ?? "");
  const [description, setDescription] = useState(prompt?.description ?? "");
  const [category, setCategory] = useState<Category>(prompt?.category ?? "prompt");
  const [status, setStatus] = useState<Status>(prompt?.status ?? "draft");
  const [landsIn, setLandsIn] = useState(prompt?.landsIn ?? "Claude.ai");
  const [content, setContent] = useState(prompt?.content ?? "");
  const [output, setOutput] = useState(prompt?.output ?? "");
  const [tags, setTags] = useState<string[]>(prompt?.tags ?? []);
  const [files, setFiles] = useState<string[]>(prompt?.files ?? []);
  const [attachments, setAttachments] = useState<Attachment[]>(prompt?.attachments ?? []);
  const [actionType, setActionType] = useState<ActionType>(prompt?.actionType ?? "copy");
  const [installCommand, setInstallCommand] = useState(prompt?.installCommand ?? "");
  const [sourceUrl, setSourceUrl] = useState(prompt?.sourceUrl ?? "");
  const [linkedItems, setLinkedItems] = useState<string[]>(prompt?.linkedItems ?? []);
  const [author, setAuthor] = useState(prompt?.author || defaultAuthor);
  const [saving, setSaving] = useState(false);

  const isEdit = !!prompt?.id;

  const handleSave = async () => {
    if (!title.trim()) {
      toast("Titel is verplicht", "error");
      return;
    }
    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        category,
        status,
        landsIn,
        content,
        output,
        tags,
        files,
        attachments,
        actionType,
        installCommand: installCommand.trim(),
        sourceUrl: sourceUrl.trim(),
        linkedItems,
        author: author.trim(),
        starred: prompt?.starred ?? false,
        usageCount: prompt?.usageCount ?? 0,
      };

      if (isEdit && prompt.id) {
        if (content !== prompt.content || output !== prompt.output) {
          await addVersion(prompt.id, {
            content: prompt.content,
            output: prompt.output,
            author: prompt.author || author.trim(),
          });
        }
        await updatePrompt(prompt.id, data);
        toast("Opgeslagen");
      } else {
        await createPrompt(data);
        toast("Aangemaakt");
      }
      onClose();
    } catch (err) {
      toast("Opslaan mislukt: " + (err as Error).message, "error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--border-hover)] placeholder:text-[var(--muted)]";
  const selectClass = "w-full rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--border-hover)]";
  const labelClass = "mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]";

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[8px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-lg font-bold text-[var(--text)]">
            {isEdit ? "Bewerken" : "Nieuw item"}
          </h2>
          <button onClick={onClose} className="rounded-[6px] p-1 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className={labelClass}>Titel</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Beschrijving</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Wat doet het — één zin" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className={labelClass}>Categorie</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={selectClass}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={selectClass}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Lands In</label>
              <select value={landsIn} onChange={(e) => setLandsIn(e.target.value)} className={selectClass}>
                {LANDS_IN_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Auteur</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Naam" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Actie</label>
              <select value={actionType} onChange={(e) => setActionType(e.target.value as ActionType)} className={selectClass}>
                {ACTION_TYPES.map((a) => (
                  <option key={a.value} value={a.value}>{a.icon} {a.label}</option>
                ))}
              </select>
            </div>
            {actionType === "install" && (
              <div className="sm:col-span-2">
                <label className={labelClass}>Install commando</label>
                <input value={installCommand} onChange={(e) => setInstallCommand(e.target.value)} placeholder="npx skills add ... of /plugin marketplace add ..." className={`${inputClass} font-mono text-[12px]`} />
              </div>
            )}
            {(actionType === "link" || sourceUrl) && (
              <div className={actionType === "install" ? "" : "sm:col-span-2"}>
                <label className={labelClass}>Bron URL</label>
                <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://github.com/..." className={inputClass} />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Gekoppelde items</label>
            <TagInput tags={linkedItems} onChange={setLinkedItems} suggestions={allTags} placeholder="Titel van gekoppeld item..." />
          </div>

          <div>
            <label className={labelClass}>Tags</label>
            <TagInput tags={tags} onChange={setTags} suggestions={allTags} placeholder="Tags toevoegen..." />
          </div>

          <div>
            <label className={labelClass}>Benodigde bestanden</label>
            <TagInput tags={files} onChange={setFiles} suggestions={allFiles} placeholder="Bestanden toevoegen..." />
          </div>

          <div>
            <label className={labelClass}>Bijlagen (.md, .zip, .txt, ...)</label>
            <FileUpload attachments={attachments} onChange={setAttachments} />
          </div>

          <div>
            <label className={labelClass}>Inhoud</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="De prompt/skill/workflow inhoud..."
              className={`${inputClass} font-mono text-[12px] leading-relaxed`}
            />
          </div>

          <div>
            <label className={labelClass}>Verwachte output</label>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={4}
              placeholder="Wat het moet opleveren..."
              className={`${inputClass} font-mono text-[12px] leading-relaxed`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] px-6 py-3">
          <button onClick={onClose} className="rounded-[6px] px-4 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)]">
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[6px] bg-[var(--accent)] px-5 py-1.5 text-xs font-bold text-[var(--bg)] hover:brightness-110 disabled:opacity-50"
          >
            {saving ? "Opslaan..." : isEdit ? "Bijwerken" : "Aanmaken"}
          </button>
        </div>
      </div>
    </div>
  );
}
