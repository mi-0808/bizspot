"use client";

import { useFavorites } from "@/lib/hooks/useFavorites";
import type { SpaceCategory } from "@/lib/types/space";

interface Props {
  placeId: string;
  placeName: string;
  category: SpaceCategory;
  isLoggedIn: boolean;
  onNeedAuth: () => void;
}

export function FavoriteButton({ placeId, placeName, category, isLoggedIn, onNeedAuth }: Props) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorited = favoriteIds.has(placeId);

  const handleClick = () => {
    if (!isLoggedIn) {
      onNeedAuth();
      return;
    }
    toggleFavorite(placeId, placeName, category);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorited ? "お気に入りから削除" : "お気に入りに追加"}
      className={`p-2 rounded-full transition-colors ${
        isFavorited
          ? "text-red-500 bg-red-50"
          : "text-gray-400 bg-gray-100 hover:bg-red-50 hover:text-red-400"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
