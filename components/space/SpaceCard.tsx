"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils/categoryColors";
import { formatOpenStatus } from "@/lib/utils/openingHours";
import type { Space } from "@/lib/types/space";

interface Props {
  space: Space;
  onViewDetail: (placeId: string) => void;
  onClose: () => void;
}

export function SpaceCard({ space, onViewDetail, onClose }: Props) {
  const quickMetrics = [
    {
      label: "集中度",
      value: space.rating ? `${Math.round(space.rating * 18)}%` : "評価待ち",
      icon: "focus" as const,
    },
    { label: "Wi-Fi", value: "確認可", icon: "wifi" as const },
    { label: "電源", value: "要確認", icon: "power" as const },
    {
      label: "料金",
      value:
        space.priceLevel === 0
          ? "無料寄り"
          : space.priceLevel
            ? `¥${"•".repeat(space.priceLevel)}`
            : "未設定",
      icon: "yen" as const,
    },
  ];

  return (
    <div className="absolute bottom-28 left-4 right-4 z-10 overflow-hidden rounded-[30px] border border-sky-100 bg-white/96 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="h-1.5 w-full bg-[linear-gradient(90deg,#93c5fd_0%,#3b82f6_55%,#bfdbfe_100%)]" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[space.category] }}
              />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700/75">
                {CATEGORY_LABELS[space.category]}
              </span>
            </div>
            <h3 className="truncate text-lg font-black tracking-[-0.03em] text-slate-900">
              {space.name}
            </h3>
            <p className="mt-1 truncate text-sm text-slate-500">{space.address}</p>

            <div className="mt-3 flex items-center gap-3">
              {space.rating && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold text-slate-700">{space.rating.toFixed(1)}</span>
                  {space.ratingCount && (
                    <span className="text-slate-400">({space.ratingCount})</span>
                  )}
                </span>
              )}
              <span
                className={`text-xs font-semibold ${
                  space.isOpen === true
                    ? "text-emerald-600"
                    : space.isOpen === false
                      ? "text-rose-500"
                      : "text-slate-400"
                }`}
              >
                {formatOpenStatus(space.isOpen)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-400 transition hover:text-slate-600"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {quickMetrics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3">
              <div className="flex items-center gap-2 text-sky-700">
                <AppIcon name={item.icon} />
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onViewDetail(space.placeId)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] py-3.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(59,130,246,0.25)] transition hover:brightness-105"
        >
          詳細を見る
          <AppIcon name="go" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
