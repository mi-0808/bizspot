"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/utils/categoryColors";
import { formatOpenStatus } from "@/lib/utils/openingHours";
import type { Space } from "@/lib/types/space";

interface Props {
  spaces: Space[];
  selectedSpace: Space | null;
  onSelectSpace: (space: Space) => void;
  onOpenFilters: () => void;
  onViewDetail: (placeId: string) => void;
}

export function SpaceDiscoveryDeck({
  spaces,
  selectedSpace,
  onSelectSpace,
  onOpenFilters,
  onViewDetail,
}: Props) {
  const cards = spaces.slice(0, 5);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700/80">
            Compare
          </p>
          <h2 className="mt-1 text-lg font-black tracking-[-0.04em] text-slate-950">
            いま比較しやすい候補
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          className="text-sm font-semibold text-blue-700"
        >
          条件を変更
        </button>
      </div>

      {cards.length > 0 ? (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {cards.map((space) => {
            const isSelected = selectedSpace?.placeId === space.placeId;

            return (
              <button
                key={space.placeId}
                type="button"
                onClick={() => onSelectSpace(space)}
                className={`w-[18.75rem] shrink-0 snap-start rounded-[30px] border p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition ${
                  isSelected
                    ? "border-blue-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)]"
                    : "border-sky-100 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[space.category] }}
                      />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700/80">
                        {CATEGORY_LABELS[space.category]}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-[1rem] font-black leading-6 tracking-[-0.03em] text-slate-950">
                      {space.name}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {space.address}
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-white/90 px-3 py-2 text-center shadow-sm">
                    <p className="text-lg font-black tracking-[-0.04em] text-blue-700">
                      {space.rating ? `${Math.round(space.rating * 18)}` : "--"}
                    </p>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Focus
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <MetricTile icon="wifi" label="Wi-Fi" value="確認可" />
                  <MetricTile icon="power" label="電源" value="要確認" />
                  <MetricTile
                    icon="crowd"
                    label="営業状況"
                    value={formatOpenStatus(space.isOpen)}
                  />
                  <MetricTile
                    icon="yen"
                    label="料金感"
                    value={
                      space.priceLevel === 0
                        ? "無料寄り"
                        : space.priceLevel
                          ? `¥${"•".repeat(space.priceLevel)}`
                          : "未設定"
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onViewDetail(space.placeId);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] bg-slate-950 px-4 py-3.5 text-sm font-bold text-white"
                >
                  詳細を見る
                  <AppIcon name="go" className="h-4 w-4" />
                </button>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[30px] border border-sky-100 bg-white px-5 py-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <p className="text-base font-black tracking-[-0.03em] text-slate-950">
            条件に合う候補がありません
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            条件を少しゆるめると、近場の作業スポットが見つかりやすくなります。
          </p>
          <button
            type="button"
            onClick={onOpenFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-[22px] bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            <AppIcon name="spark" className="h-4 w-4" />
            条件を見直す
          </button>
        </div>
      )}
    </section>
  );
}

function MetricTile({
  icon,
  label,
  value,
}: {
  icon: "wifi" | "power" | "crowd" | "yen";
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] bg-sky-50/70 px-3 py-3">
      <div className="flex items-center gap-2 text-sky-700">
        <AppIcon name={icon} className="h-4 w-4" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
