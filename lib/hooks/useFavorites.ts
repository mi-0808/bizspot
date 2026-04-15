"use client";

import useSWR from "swr";
import { useCallback, useMemo } from "react";
import type { Favorite } from "@/lib/types/favorites";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useFavorites() {
  const { data, error, isLoading, mutate } = useSWR<Favorite[]>(
    "/api/favorites",
    fetcher,
    { revalidateOnFocus: false }
  );

  const favorites = useMemo(() => data ?? [], [data]);
  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.placeId)), [favorites]);

  const addFavorite = useCallback(
    async (placeId: string, placeName: string, placeType: string | null) => {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId, placeName, placeType }),
      });
      mutate();
    },
    [mutate]
  );

  const removeFavorite = useCallback(
    async (placeId: string) => {
      await fetch(`/api/favorites/${placeId}`, { method: "DELETE" });
      mutate();
    },
    [mutate]
  );

  const toggleFavorite = useCallback(
    async (placeId: string, placeName: string, placeType: string | null) => {
      if (favoriteIds.has(placeId)) {
        await removeFavorite(placeId);
      } else {
        await addFavorite(placeId, placeName, placeType);
      }
    },
    [favoriteIds, addFavorite, removeFavorite]
  );

  return {
    favorites,
    favoriteIds,
    loading: isLoading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
