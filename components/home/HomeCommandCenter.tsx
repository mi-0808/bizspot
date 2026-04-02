"use client";

import { AppIcon } from "@/components/ui/AppIcon";

interface Props {
  resultCount: number;
  activeFilterCount: number;
  loading: boolean;
  onUseCurrentLocation: () => void;
  onOpenFilters: () => void;
}

export function HomeCommandCenter({
  resultCount,
  activeFilterCount,
  loading,
  onUseCurrentLocation,
  onOpenFilters,
}: Props) {
  return (
    <section className="rounded-[32px] border border-sky-100 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Start Here
          </span>
          <h1 className="mt-3 text-[1.75rem] font-black leading-[1.12] tracking-[-0.05em] text-slate-950">
            どこで作業するか、
            <br />
            すぐ決める
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            近くの候補を開くか、条件を決めて探すか。最初の操作だけを大きく見せています。
          </p>
        </div>

        <div className="rounded-[24px] bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] p-3.5 text-blue-700">
          <AppIcon name="spark" className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="flex min-h-14 w-full items-center justify-between rounded-[24px] bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] px-5 py-4 text-left text-white shadow-[0_14px_30px_rgba(59,130,246,0.24)]"
        >
          <div>
            <p className="text-sm font-bold">近くで探す</p>
            <p className="mt-1 text-xs text-blue-100">
              現在地から使いやすいスポットを更新
            </p>
          </div>
          <AppIcon name="pin" className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onOpenFilters}
          className="flex min-h-14 w-full items-center justify-between rounded-[24px] border border-sky-100 bg-sky-50/70 px-5 py-4 text-left text-slate-800"
        >
          <div>
            <p className="text-sm font-bold">条件から探す</p>
            <p className="mt-1 text-xs text-slate-500">
              用途・料金・営業時間をまとめて指定
            </p>
          </div>
          <AppIcon name="spark" className="h-5 w-5 text-blue-600" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <MetaPill label={`${resultCount}件見つかっています`} tone="blue" />
        <MetaPill
          label={activeFilterCount > 0 ? `条件 ${activeFilterCount}件を適用中` : "条件はまだ指定していません"}
          tone={activeFilterCount > 0 ? "blue" : "slate"}
        />
        <MetaPill label={loading ? "周辺データを更新中" : "現在地ベースで表示中"} tone="slate" />
      </div>
    </section>
  );
}

function MetaPill({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "slate";
}) {
  return (
    <span
      className={`rounded-full px-3.5 py-2 text-xs font-semibold ${
        tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}
