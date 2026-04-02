"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils/categoryColors";
import { formatOpenStatus } from "@/lib/utils/openingHours";
import type { Space } from "@/lib/types/space";

interface Props {
  spaces: Space[];
  selectedSpace: Space | null;
  hasActiveFilters: boolean;
  onSelectSpace: (space: Space) => void;
  onClearSelection: () => void;
  onViewDetail: (placeId: string) => void;
  onOpenFilters: () => void;
}

export function MapBottomSheet({
  spaces,
  selectedSpace,
  hasActiveFilters,
  onSelectSpace,
  onClearSelection,
  onViewDetail,
  onOpenFilters,
}: Props) {
  return (
    <section className="absolute inset-x-5 bottom-24 z-20">
      <div className="overflow-hidden rounded-[34px] border border-sky-100/90 bg-white/98 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="flex justify-center pt-4">
          <div className="h-1 w-12 rounded-full bg-sky-200" />
        </div>

        {selectedSpace ? (
          <SelectedSpacePanel
            space={selectedSpace}
            onClearSelection={onClearSelection}
            onViewDetail={onViewDetail}
          />
        ) : (
          <NearbyListPanel
            spaces={spaces}
            hasActiveFilters={hasActiveFilters}
            onSelectSpace={onSelectSpace}
            onOpenFilters={onOpenFilters}
          />
        )}
      </div>
    </section>
  );
}

function NearbyListPanel({
  spaces,
  hasActiveFilters,
  onSelectSpace,
  onOpenFilters,
}: {
  spaces: Space[];
  hasActiveFilters: boolean;
  onSelectSpace: (space: Space) => void;
  onOpenFilters: () => void;
}) {
  const visibleSpaces = spaces.slice(0, 2);

  return (
    <div className="px-5 pb-5 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black tracking-[-0.04em] text-slate-900">
            近くの作業スポット
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            地図のピンか下のカードをタップすると、すぐ比較できます。
          </p>
        </div>
        <div className="rounded-2xl bg-sky-50 px-3.5 py-2.5 text-right">
          <p className="text-base font-black tracking-[-0.03em] text-blue-700">{spaces.length}</p>
          <span className="text-[11px] font-semibold text-slate-500">spots</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2.5">
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          集中度をすぐ比較
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
          {hasActiveFilters ? "条件適用中" : "おすすめ順"}
        </span>
      </div>

      {visibleSpaces.length > 0 ? (
        <div className="mt-5 space-y-4">
          {visibleSpaces.map((space, index) => (
            <button
              key={space.placeId}
              type="button"
              onClick={() => onSelectSpace(space)}
              className={`w-full rounded-[26px] border p-4 text-left transition ${
                index === 0
                  ? "border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)]"
                  : "border-sky-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[space.category] }}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700/80">
                      {CATEGORY_LABELS[space.category]}
                    </span>
                  </div>
                  <p className="truncate text-[15px] font-bold text-slate-900">{space.name}</p>
                  <p className="mt-1.5 truncate text-xs text-slate-500">{space.address}</p>
                </div>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-blue-700 shadow-sm">
                  {space.rating ? `${Math.round(space.rating * 18)}%` : "NEW"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Metric icon="wifi" label="Wi-Fi" value="確認可" />
                  <Metric icon="power" label="電源" value="要確認" />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>
                    {space.priceLevel === 0 ? "無料寄り" : space.priceLevel ? `¥${"•".repeat(space.priceLevel)}` : "未設定"}
                  </span>
                  <span
                    className={
                      space.isOpen === true
                        ? "text-emerald-600"
                        : space.isOpen === false
                          ? "text-rose-500"
                          : "text-slate-400"
                    }
                  >
                    {formatOpenStatus(space.isOpen)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[26px] border border-sky-100 bg-sky-50/60 p-5 text-center">
          <p className="text-sm font-bold text-slate-900">条件に合う場所がまだ見つかっていません</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            条件を少しゆるめると、近くの候補が見つかりやすくなります。
          </p>
          <button
            type="button"
            onClick={onOpenFilters}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-sm"
          >
            <AppIcon name="spark" className="h-4 w-4" />
            条件を見直す
          </button>
        </div>
      )}
    </div>
  );
}

function SelectedSpacePanel({
  space,
  onClearSelection,
  onViewDetail,
}: {
  space: Space;
  onClearSelection: () => void;
  onViewDetail: (placeId: string) => void;
}) {
  return (
    <div className="px-5 pb-5 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700/80">
            Selected Spot
          </p>
          <p className="mt-1 text-lg font-black tracking-[-0.04em] text-slate-900">
            {space.name}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{space.address}</p>
        </div>
        <button
          type="button"
          onClick={onClearSelection}
          className="rounded-full bg-slate-100 p-2 text-slate-400 transition hover:text-slate-600"
          aria-label="選択解除"
        >
          ✕
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <SummaryTile
          icon="focus"
          label="集中度"
          value={space.rating ? `${Math.round(space.rating * 18)}%` : "評価待ち"}
        />
        <SummaryTile icon="wifi" label="Wi-Fi" value="確認可" />
        <SummaryTile icon="power" label="電源" value="要確認" />
        <SummaryTile
          icon="yen"
          label="料金"
          value={space.priceLevel === 0 ? "無料寄り" : space.priceLevel ? `¥${"•".repeat(space.priceLevel)}` : "未設定"}
        />
      </div>

      <button
        type="button"
        onClick={() => onViewDetail(space.placeId)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[24px] bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(59,130,246,0.28)] transition hover:brightness-105"
      >
        詳細を見る
        <AppIcon name="go" className="h-4 w-4" />
      </button>
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: "wifi" | "power" | "yen" | "focus";
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-sky-100 bg-sky-50/60 p-3.5">
      <div className="flex items-center gap-2 text-sky-700">
        <AppIcon name={icon} />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: "wifi" | "power";
  label: string;
  value: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <AppIcon name={icon} className="h-3.5 w-3.5" />
      <span>{label}</span>
      <span className="text-slate-400">{value}</span>
    </span>
  );
}
