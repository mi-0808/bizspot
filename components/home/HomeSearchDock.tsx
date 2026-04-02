"use client";

import { AppIcon } from "@/components/ui/AppIcon";

interface Props {
  resultCount: number;
  activeFilterCount: number;
  statusLoading: boolean;
  locationError: string | null;
  onUseCurrentLocation: () => void;
  onOpenFilters: () => void;
}

export function HomeSearchDock({
  resultCount,
  activeFilterCount,
  statusLoading,
  locationError,
  onUseCurrentLocation,
  onOpenFilters,
}: Props) {
  return (
    <section className="absolute inset-x-5 top-24 z-20">
      <div className="rounded-[32px] border border-sky-100/90 bg-white/96 px-5 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700/80">
              Workspace Search
            </p>
            <h1 className="mt-2 text-[1.7rem] font-black leading-[1.18] tracking-[-0.05em] text-slate-900">
              いま使える
              <br />
              作業場所を探す
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              近くで探すか、条件で絞るか。最初の操作だけを大きく見せます。
            </p>
          </div>

          <div className="rounded-[24px] bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] p-3.5 text-blue-700 shadow-sm">
            <AppIcon name="spark" className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="flex min-h-15 items-center justify-center gap-2 rounded-[24px] bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] px-5 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(59,130,246,0.28)] transition hover:brightness-105"
          >
            <AppIcon name="pin" className="h-4 w-4" />
            近くで探す
          </button>
          <button
            type="button"
            onClick={onOpenFilters}
            className="flex min-h-15 items-center justify-center gap-2 rounded-[24px] border border-sky-100 bg-sky-50/70 px-5 py-4 text-sm font-bold text-slate-700 transition hover:bg-sky-50"
          >
            <AppIcon name="spark" className="h-4 w-4 text-blue-600" />
            条件で探す
          </button>
        </div>

        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1">
          <StatusPill label={`${resultCount}件ヒット`} tone="blue" />
          <StatusPill
            label={activeFilterCount > 0 ? `条件 ${activeFilterCount}件` : "条件指定なし"}
            tone={activeFilterCount > 0 ? "blue" : "default"}
          />
          <StatusPill
            label={statusLoading ? "周辺を読み込み中" : "現在地ベース"}
            tone={statusLoading ? "blue" : "default"}
          />
        </div>

        {locationError && (
          <div className="mt-4 rounded-[22px] border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs leading-5 text-yellow-800">
            {locationError}
          </div>
        )}
      </div>
    </section>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "default";
}) {
  return (
    <span
      className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${
        tone === "blue"
          ? "bg-blue-50 text-blue-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}
