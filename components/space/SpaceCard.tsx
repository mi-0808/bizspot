"use client";

import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils/categoryColors";
import { formatOpenStatus } from "@/lib/utils/openingHours";
import type { Space } from "@/lib/types/space";

interface Props {
  space: Space;
  onViewDetail: (placeId: string) => void;
  onClose: () => void;
}

export function SpaceCard({ space, onViewDetail, onClose }: Props) {
  return (
    <div className="absolute bottom-24 left-3 right-3 bg-white rounded-2xl shadow-xl p-4 z-10">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[space.category] }}
            />
            <span className="text-xs text-gray-500">{CATEGORY_LABELS[space.category]}</span>
          </div>
          <h3 className="font-bold text-gray-900 truncate">{space.name}</h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">{space.address}</p>

          <div className="flex items-center gap-3 mt-2">
            {space.rating && (
              <span className="flex items-center gap-1 text-xs">
                <span className="text-yellow-400">★</span>
                <span className="font-medium text-gray-700">{space.rating.toFixed(1)}</span>
                {space.ratingCount && (
                  <span className="text-gray-400">({space.ratingCount})</span>
                )}
              </span>
            )}
            <span
              className={`text-xs font-medium ${
                space.isOpen === true
                  ? "text-green-600"
                  : space.isOpen === false
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {formatOpenStatus(space.isOpen)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>

      <button
        type="button"
        onClick={() => onViewDetail(space.placeId)}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        詳細を見る
      </button>
    </div>
  );
}
