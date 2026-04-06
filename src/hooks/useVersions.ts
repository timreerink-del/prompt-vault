"use client";

import { useEffect, useState } from "react";
import { subscribeToVersions } from "@/lib/firebase";
import { PromptVersion } from "@/lib/types";

export function useVersions(promptId: string | null) {
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!promptId) {
      setVersions([]);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToVersions(promptId, (data) => {
      setVersions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [promptId]);

  return { versions, loading };
}
