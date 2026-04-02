"use client";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  hint?: string;
}

export function Chip({ label, selected, onClick, hint }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition-all ${
        selected
          ? "border-blue-500 bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] text-blue-700 shadow-sm"
          : "border-sky-100 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{label}</span>
        {selected && <span className="text-xs font-bold text-blue-600">選択中</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </button>
  );
}
