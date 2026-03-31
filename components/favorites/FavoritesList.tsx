"use client";

import { useFavorites } from "@/lib/hooks/useFavorites";
import { CATEGORY_LABELS } from "@/lib/utils/categoryColors";
import type { SpaceCategory } from "@/lib/types/space";

interface Props {
  onSelectSpace: (placeId: string) => void;
}

export function FavoritesList({ onSelectSpace }: Props) {
  const { favorites, loading, removeFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">お気に入りがまだありません</p>
        <p className="text-gray-300 text-xs mt-1">スペース詳細の ♡ から追加できます</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {favorites.map((fav) => (
        <li key={fav.id} className="flex items-center">
          <button
            type="button"
            onClick={() => onSelectSpace(fav.placeId)}
            className="flex-1 text-left px-5 py-4 hover:bg-gray-50 transition-colors min-w-0"
          >
            <p className="text-sm font-medium text-gray-900 truncate">{fav.placeName}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {fav.placeType ? CATEGORY_LABELS[fav.placeType as SpaceCategory] ?? fav.placeType : ""}
            </p>
          </button>
          <button
            type="button"
            onClick={() => removeFavorite(fav.placeId)}
            className="px-4 py-4 text-gray-300 hover:text-red-400 transition-colors"
            aria-label="お気に入りから削除"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
