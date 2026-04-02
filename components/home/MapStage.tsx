"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { MapView } from "@/components/map/MapView";
import type { Space } from "@/lib/types/space";

interface Props {
  spaces: Space[];
  selectedSpace: Space | null;
  center: { lat: number; lng: number };
  onSelectSpace: (space: Space) => void;
  onUseCurrentLocation: () => void;
  onOpenFilters: () => void;
}

export function MapStage({
  spaces,
  selectedSpace,
  center,
  onSelectSpace,
  onUseCurrentLocation,
  onOpenFilters,
}: Props) {
  return (
    <section className="rounded-[34px] border border-sky-100 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700/80">
            Map Stage
          </p>
          <h2 className="mt-1 text-lg font-black tracking-[-0.04em] text-slate-950">
            地図で場所感をつかむ
          </h2>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          {spaces.length} spots
        </span>
      </div>

      <div className="relative h-[22rem] overflow-hidden rounded-[28px] bg-sky-50">
        <MapView
          spaces={spaces}
          selectedSpaceId={selectedSpace?.placeId ?? null}
          onSelectSpace={onSelectSpace}
          center={center}
        />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_24%,rgba(255,255,255,0)_76%,rgba(255,255,255,0.22)_100%)]" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="rounded-2xl bg-white/92 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
            ピンを選ぶと、下のカードが切り替わります
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onUseCurrentLocation}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-blue-600 shadow-sm backdrop-blur"
              aria-label="現在地を取得"
            >
              <AppIcon name="pin" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenFilters}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-blue-600 shadow-sm backdrop-blur"
              aria-label="条件を開く"
            >
              <AppIcon name="spark" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
