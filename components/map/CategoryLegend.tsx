"use client";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/utils/categoryColors";
import type { SpaceCategory } from "@/lib/types/space";

export function CategoryLegend() {
  const categories = Object.keys(CATEGORY_COLORS) as SpaceCategory[];

  return (
    <div className="absolute bottom-24 right-3 bg-white rounded-xl shadow-lg p-3 z-10">
      <p className="text-xs font-semibold text-gray-500 mb-2">スペースの種類</p>
      <ul className="space-y-1.5">
        {categories.map((cat) => (
          <li key={cat} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            <span className="text-xs text-gray-700">{CATEGORY_LABELS[cat]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
