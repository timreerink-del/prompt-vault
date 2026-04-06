"use client";

import { useRef } from "react";
import { Attachment } from "@/lib/types";
import { toast } from "./Toast";

const MAX_FILE_SIZE = 750 * 1024; // 750KB per file
const ALLOWED_TYPES = [
  ".md", ".txt", ".json", ".yaml", ".yml", ".csv",
  ".zip", ".js", ".ts", ".tsx", ".jsx", ".css",
  ".html", ".xml", ".sh", ".py", ".pdf",
];

interface FileUploadProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(name: string): string {
  if (name.endsWith(".md")) return "\uD83D\uDCC4";
  if (name.endsWith(".zip")) return "\uD83D\uDCE6";
  if (name.endsWith(".pdf")) return "\uD83D\uDCC3";
  if (name.endsWith(".json") || name.endsWith(".yaml") || name.endsWith(".yml")) return "\u2699\uFE0F";
  if (name.match(/\.(js|ts|tsx|jsx|py|sh|css|html)$/)) return "\uD83D\uDCBB";
  return "\uD83D\uDCCE";
}

export default function FileUpload({ attachments, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    const newAttachments: Attachment[] = [];

    for (const file of Array.from(fileList)) {
      if (file.size > MAX_FILE_SIZE) {
        toast(`${file.name} is te groot (max 750KB)`, "error");
        continue;
      }

      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_TYPES.includes(ext)) {
        toast(`${file.name}: type niet toegestaan`, "error");
        continue;
      }

      if (attachments.some((a) => a.name === file.name)) {
        toast(`${file.name} is al toegevoegd`, "info");
        continue;
      }

      const data = await fileToBase64(file);
      newAttachments.push({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data,
      });
    }

    if (newAttachments.length > 0) {
      onChange([...attachments, ...newAttachments]);
      toast(`${newAttachments.length} bestand(en) toegevoegd`);
    }
  };

  const handleRemove = (name: string) => {
    onChange(attachments.filter((a) => a.name !== name));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((a) => (
          <div
            key={a.name}
            className="flex items-center gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
          >
            <span className="text-sm">{getFileIcon(a.name)}</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[var(--text)]">{a.name}</p>
              <p className="text-[10px] text-[var(--muted)]">{formatSize(a.size)}</p>
            </div>
            <button
              onClick={() => handleRemove(a.name)}
              className="ml-1 text-[var(--muted)] hover:text-[var(--warn)]"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-2 flex items-center gap-1.5 rounded-[6px] border border-dashed border-[var(--border-hover)] px-3 py-2 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Bestanden uploaden (.md, .zip, .txt, ...)
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_TYPES.join(",")}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}

export function AttachmentList({ attachments }: { attachments: Attachment[] }) {
  const handleDownload = (attachment: Attachment) => {
    const byteString = atob(attachment.data);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: attachment.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.name;
    a.click();
    URL.revokeObjectURL(url);
    toast(`${attachment.name} gedownload`);
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
        Bijlagen ({attachments.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {attachments.map((a) => (
          <button
            key={a.name}
            onClick={() => handleDownload(a)}
            className="flex items-center gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--bg)] px-3 py-2 transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
          >
            <span className="text-sm">{getFileIcon(a.name)}</span>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-medium text-[var(--text)]">{a.name}</p>
              <p className="text-[10px] text-[var(--muted)]">{formatSize(a.size)}</p>
            </div>
            <svg className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:...;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
