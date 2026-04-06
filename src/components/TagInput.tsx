"use client";

import { useState, useRef } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export default function TagInput({ tags, onChange, suggestions = [], placeholder = "Add tags..." }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 focus-within:border-[var(--border-hover)]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-[20px] bg-[#7B8FF7]/15 px-2 py-[2px] text-[10px] font-bold text-[#7B8FF7]"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-0.5 text-[#7B8FF7]/60 hover:text-white"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(input);
            }
            if (e.key === "Backspace" && !input && tags.length > 0) {
              removeTag(tags[tags.length - 1]);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
        />
      </div>
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-2)] py-1 shadow-xl">
          {filteredSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              onMouseDown={() => addTag(s)}
              className="w-full px-3 py-1.5 text-left text-sm text-[var(--text)] hover:bg-[var(--surface-3)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
