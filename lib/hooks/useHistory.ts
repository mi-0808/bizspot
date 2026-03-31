"use client";

import useSWR from "swr";
import { useCallback } from "react";
import type { HistoryEntry, HistoryAction } from "@/lib/types/history";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useHistory() {
  const { data, error, isLoading, mutate } = useSWR<HistoryEntry[]>(
    "/api/history",
    fetcher,
    { revalidateOnFocus: false }
  );

  const addHistory = useCallback(
    async (
      placeId: string,
      placeName: string,
      placeType: string | null,
      action: HistoryAction = "viewed"
    ) => {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId, placeName, placeType, action }),
      });
      mutate();
    },
    [mutate]
  );

  return {
    history: data ?? [],
    loading: isLoading,
    error,
    addHistory,
    refresh: mutate,
  };
}
