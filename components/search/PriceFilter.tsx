"use client";

import { Chip } from "@/components/ui/Chip";
import { PRICE_LABELS, type PriceFilter } from "@/lib/types/filters";

interface Props {
  selected: PriceFilter[];
  onToggle: (price: PriceFilter) => void;
}

const PRICES: PriceFilter[] = ["free", "one_drink", "paid"];

export function PriceFilterPanel({ selected, onToggle }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">料金</p>
      <div className="flex flex-wrap gap-2">
        {PRICES.map((p) => (
          <Chip
            key={p}
            label={PRICE_LABELS[p]}
            selected={selected.includes(p)}
            onClick={() => onToggle(p)}
          />
        ))}
      </div>
    </div>
  );
}
