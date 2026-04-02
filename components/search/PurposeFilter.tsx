"use client";

import { Chip } from "@/components/ui/Chip";
import { PURPOSE_LABELS, type Purpose } from "@/lib/types/filters";

interface Props {
  selected: Purpose[];
  onToggle: (purpose: Purpose) => void;
}

const PURPOSES: Purpose[] = ["focus", "meeting", "study", "relax"];
const PURPOSE_HINTS: Record<Purpose, string> = {
  focus: "静かに集中しやすい場所",
  meeting: "会話や打ち合わせ向け",
  study: "長時間の勉強や課題向け",
  relax: "気分転換しながら作業",
};

export function PurposeFilter({ selected, onToggle }: Props) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-bold text-slate-900">基本条件</p>
        <p className="mt-1 text-xs text-slate-500">使い方を選ぶと、相性のよい場所を優先できます。</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PURPOSES.map((p) => (
          <Chip
            key={p}
            label={PURPOSE_LABELS[p]}
            hint={PURPOSE_HINTS[p]}
            selected={selected.includes(p)}
            onClick={() => onToggle(p)}
          />
        ))}
      </div>
    </div>
  );
}
