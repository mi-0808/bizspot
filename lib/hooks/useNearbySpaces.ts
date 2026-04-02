"use client";

import useSWR from "swr";
import type { Space } from "@/lib/types/space";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("スペースの取得に失敗しました");
    return res.json();
  });

export function useNearbySpaces(lat: number | null, lng: number | null, radius = 1500) {
  const key = lat !== null && lng !== null ? `/api/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}` : null;

  const { data, error, isLoading, mutate } = useSWR<Space[]>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    spaces: data ?? [],
    error: error?.message ?? null,
    loading: isLoading,
    refresh: mutate,
  };
}
