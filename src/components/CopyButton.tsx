"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: "icon" | "button" | "inline";
}

export default function CopyButton({ text, label, className = "", variant = "icon" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail
    }
  }, [text]);

  if (variant === "button") {
    return (
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 rounded-[6px] bg-[#5CEFB5] px-4 py-2 text-xs font-bold text-[var(--bg)] transition-colors hover:brightness-110 ${className}`}
      >
        {copied ? (
          <>
            <CheckIcon />
            Copied!
          </>
        ) : (
          <>
            <CopyIcon />
            {label || "Copy to clipboard"}
          </>
        )}
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1 text-[10px] text-[var(--muted)] transition-colors hover:text-[var(--text)] ${className}`}
      >
        {copied ? (
          <>
            <CheckIcon className="h-3 w-3" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <CopyIcon className="h-3 w-3" />
            <span>{label || "Copy"}</span>
          </>
        )}
      </button>
    );
  }

  // Default: icon variant
  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      className={`rounded-[6px] p-1.5 text-[var(--muted)] transition-all hover:bg-[var(--surface-2)] hover:text-[var(--text)] ${className}`}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

function CopyIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={`${className} text-[#5CEFB5]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
