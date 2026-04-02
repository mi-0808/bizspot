"use client";

import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/utils/categoryColors";
import type { SpaceCategory } from "@/lib/types/space";

export function CategoryLegend() {
  const categories = Object.keys(CATEGORY_COLORS) as SpaceCategory[];

  return (
    <div className="glass-panel absolute right-4 top-28 z-10 hidden rounded-[24px] p-3 lg:block">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700/80">
        Categories
      </p>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat} className="flex items-center gap-2">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            <span className="text-xs font-medium text-slate-700">{CATEGORY_LABELS[cat]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
