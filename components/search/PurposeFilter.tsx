"use client";

import { Chip } from "@/components/ui/Chip";
import { PURPOSE_LABELS, type Purpose } from "@/lib/types/filters";

interface Props {
  selected: Purpose[];
  onToggle: (purpose: Purpose) => void;
}

const PURPOSES: Purpose[] = ["focus", "meeting", "study", "relax"];

export function PurposeFilter({ selected, onToggle }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">用途</p>
      <div className="flex flex-wrap gap-2">
        {PURPOSES.map((p) => (
          <Chip
            key={p}
            label={PURPOSE_LABELS[p]}
            selected={selected.includes(p)}
            onClick={() => onToggle(p)}
          />
        ))}
      </div>
    </div>
  );
}
