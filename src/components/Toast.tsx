"use client";

import { useEffect, useState } from "react";

interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

let addToastFn: ((text: string, type?: "success" | "error" | "info") => void) | null = null;

export function toast(text: string, type: "success" | "error" | "info" = "success") {
  addToastFn?.(text, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (text, type = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2200);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-up rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            t.type === "success"
              ? "bg-[#5CEFB5] text-[#0B0D11]"
              : t.type === "error"
                ? "bg-[#F7715C] text-white"
                : "bg-[#232833] text-[#E4E6EB] border border-[var(--border)]"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
