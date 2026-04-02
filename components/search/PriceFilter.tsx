"use client";

import { Chip } from "@/components/ui/Chip";
import { PRICE_LABELS, type PriceFilter } from "@/lib/types/filters";

interface Props {
  selected: PriceFilter[];
  onToggle: (price: PriceFilter) => void;
}

const PRICES: PriceFilter[] = ["free", "one_drink", "paid"];
const PRICE_HINTS: Record<PriceFilter, string> = {
  free: "コストを抑えて使いたい",
  one_drink: "カフェ利用を前提に探す",
  paid: "有料でも快適さを重視",
};

export function PriceFilterPanel({ selected, onToggle }: Props) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-bold text-slate-900">料金条件</p>
        <p className="mt-1 text-xs text-slate-500">予算感に合わせて候補を絞り込みます。</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PRICES.map((p) => (
          <Chip
            key={p}
            label={PRICE_LABELS[p]}
            hint={PRICE_HINTS[p]}
            selected={selected.includes(p)}
            onClick={() => onToggle(p)}
          />
        ))}
      </div>
    </div>
  );
}
