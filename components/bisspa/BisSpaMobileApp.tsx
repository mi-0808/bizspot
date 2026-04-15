"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthInlinePanel } from "@/components/auth/AuthInlinePanel";
import { BizSpotBottomNav } from "@/components/navigation/BizSpotBottomNav";
import { MapView } from "@/components/map/MapView";
import { AdaptiveGlassHeader } from "@/components/ui/AdaptiveGlassHeader";
import { AppIcon } from "@/components/ui/AppIcon";
import { BisSpaDetailSheet } from "@/components/bisspa/BisSpaDetailSheet";
import { useCurrentLocation } from "@/lib/hooks/useCurrentLocation";
import { useNearbySpaces } from "@/lib/hooks/useNearbySpaces";
import type { Space } from "@/lib/types/space";
import {
  DEFAULT_DISCOVERY_FILTERS,
  calculateDistanceMeters,
  filterDiscoverySpaces,
  formatDistanceKm,
  getCategoryLabel,
  getPriceBadge,
  getSignalTone,
  getSpaceSignals,
  getStatusLabel,
  type DiscoveryDuration,
  type DiscoveryFilters,
  type DiscoveryPurpose,
  type SpaceSignalKey,
} from "@/lib/utils/spacePresentation";

const DEFAULT_CENTER = { lat: 35.6812362, lng: 139.7671248 };

const PURPOSE_OPTIONS: Array<{ value: DiscoveryPurpose; label: string }> = [
  { value: "focus", label: "集中したい" },
  { value: "meeting", label: "打ち合わせ" },
  { value: "study", label: "勉強" },
  { value: "relax", label: "軽作業" },
];

const DURATION_OPTIONS: Array<{ value: DiscoveryDuration; label: string }> = [
  { value: "any", label: "時間は問わない" },
  { value: "quick", label: "90分前後" },
  { value: "long", label: "半日以上" },
];

const PRICE_OPTIONS: Array<{ value: DiscoveryFilters["prices"][number]; label: string }> = [
  { value: "free", label: "無料" },
  { value: "one_drink", label: "ワンドリンク" },
  { value: "paid", label: "有料" },
];

const HIGHLIGHT_FILTERS = [
  { key: "requireWifi", label: "Wi-Fi強め" },
  { key: "requirePower", label: "電源あり" },
  { key: "lowCrowd", label: "混雑少なめ" },
  { key: "highFocus", label: "集中しやすい" },
  { key: "longStay", label: "長居しやすい" },
] as const;

const CARD_METRICS: Array<{ key: SpaceSignalKey; label: string; icon: React.ComponentProps<typeof AppIcon>["name"] }> = [
  { key: "wifi", label: "Wi-Fi", icon: "wifi" },
  { key: "power", label: "電源", icon: "power" },
  { key: "crowd", label: "混雑度", icon: "crowd" },
  { key: "focus", label: "集中度", icon: "focus" },
];

const FALLBACK_SPACES: Space[] = [
  {
    placeId: "tokyo-work-lounge",
    name: "Tokyo Work Lounge",
    address: "丸の内1-6-3",
    lat: 35.6817,
    lng: 139.7652,
    category: "coworking",
    isOpen: true,
    rating: 4.6,
    ratingCount: 128,
    priceLevel: 2,
  },
  {
    placeId: "studio-blue-cafe",
    name: "Studio Blue Cafe",
    address: "八重洲2-4-10",
    lat: 35.6797,
    lng: 139.7708,
    category: "cafe",
    isOpen: true,
    rating: 4.3,
    ratingCount: 88,
    priceLevel: 1,
  },
  {
    placeId: "yaesu-library-hub",
    name: "Yaesu Library Hub",
    address: "八重洲1-4-8",
    lat: 35.684,
    lng: 139.7702,
    category: "library",
    isOpen: true,
    rating: 4.4,
    ratingCount: 64,
    priceLevel: 0,
  },
];

export function BisSpaMobileApp() {
  const { data: session } = useSession();
  const { lat, lng, loading: locationLoading, error: locationError, getCurrentLocation } = useCurrentLocation();
  const [filters, setFilters] = useState<DiscoveryFilters>(DEFAULT_DISCOVERY_FILTERS);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [detailPlaceId, setDetailPlaceId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const center = useMemo(
    () => (lat !== null && lng !== null ? { lat, lng } : DEFAULT_CENTER),
    [lat, lng],
  );
  const origin = useMemo(
    () => (lat !== null && lng !== null ? { lat, lng } : null),
    [lat, lng],
  );
  const { spaces, loading: spacesLoading, error: spacesError } = useNearbySpaces(center.lat, center.lng);

  const sourceSpaces = spaces.length > 0 ? spaces : FALLBACK_SPACES;
  const deferredQuery = useDeferredValue(filters.query);

  const filteredSpaces = useMemo(
    () =>
      filterDiscoverySpaces(sourceSpaces, { ...filters, query: deferredQuery }, origin ?? center).slice(0, 20),
    [center, deferredQuery, filters, origin, sourceSpaces],
  );

  const activeSpace = useMemo(
    () => filteredSpaces.find((space) => space.placeId === selectedPlaceId) ?? filteredSpaces[0] ?? null,
    [filteredSpaces, selectedPlaceId],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.purposes.length > 0) count += filters.purposes.length;
    if (filters.prices.length > 0) count += filters.prices.length;
    if (filters.openNow) count += 1;
    if (filters.duration !== "any") count += 1;
    if (filters.requireWifi) count += 1;
    if (filters.requirePower) count += 1;
    if (filters.lowCrowd) count += 1;
    if (filters.highFocus) count += 1;
    if (filters.longStay) count += 1;
    return count;
  }, [filters]);

  const heroCopy = activeSpace
    ? `${activeSpace.name} を中心に、今の条件に合う場所を表示しています。`
    : "近くで使いやすい作業場所をすぐ探せます。";

  return (
    <>
      <main className="app-shell px-3 pb-[calc(104px+env(safe-area-inset-bottom))] pt-[max(env(safe-area-inset-top),18px)]">
        <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_top,rgba(186,230,253,0.85),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.5)_100%)]" />

        <AdaptiveGlassHeader
          eyebrow="BIZSPOT / LOCATION"
          title="作業場所を、直感で。"
          description="移動中でも片手で探しやすい、軽めの検索ビューです。"
          badges={[
            { label: origin ? "現在地周辺" : "東京駅周辺", tone: "cool" },
            { label: `${filteredSpaces.length}件を表示`, tone: "neutral" },
            { label: locationLoading || spacesLoading ? "検索を更新中" : "すぐ検索可能", tone: "warm" },
          ]}
        />

        <AuthInlinePanel
          session={session}
          signedOutLabel="保存・履歴・スコア投稿はログイン後に使えます。"
        />

        <section className="surface-card mt-4 rounded-[32px] p-4">
          <div className="flex items-center gap-3 rounded-[24px] bg-sky-50/90 px-4 py-3">
            <AppIcon name="pin" className="h-5 w-5 text-sky-700" />
            <input
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="駅名・エリア・スペース名で探す"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => setFilters((current) => ({ ...current, query: "" }))}
                className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-500"
              >
                クリア
              </button>
            )}
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-sky-700">DISCOVERY</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{heroCopy}</p>
            </div>
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="rounded-[20px] bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] px-4 py-3 text-sm font-semibold text-sky-900 shadow-sm"
            >
              条件検索
              {activeFilterCount > 0 && (
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-sky-700">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </section>

        <section className="mt-4 flex items-center gap-2 rounded-[24px] bg-white/70 p-1 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
          <ViewToggle active={viewMode === "map"} label="マップ" onClick={() => setViewMode("map")} />
          <ViewToggle active={viewMode === "list"} label="一覧" onClick={() => setViewMode("list")} />
        </section>

        {viewMode === "map" ? (
          <section className="surface-card mt-4 overflow-hidden rounded-[34px]">
            <div className="relative h-[330px]">
              <MapCanvas
                spaces={filteredSpaces}
                center={center}
                selectedPlaceId={activeSpace?.placeId ?? null}
                onSelectSpace={(space) => setSelectedPlaceId(space.placeId)}
              />

              <div className="absolute inset-x-0 top-0 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-full bg-white/92 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                    地図から直感で探す
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="rounded-full bg-white/92 px-3 py-2 text-xs font-semibold text-sky-700 shadow-sm"
                  >
                    現在地
                  </button>
                </div>
              </div>

              {activeSpace && (
                <button
                  type="button"
                  onClick={() => setDetailPlaceId(activeSpace.placeId)}
                  className="absolute inset-x-4 bottom-4 rounded-[28px] bg-white/94 p-4 text-left shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                          {getCategoryLabel(activeSpace.category)}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {formatDistanceKm(
                            calculateDistanceMeters(origin, { lat: activeSpace.lat, lng: activeSpace.lng }),
                          )}
                        </span>
                      </div>
                      <h2 className="mt-2 truncate text-lg font-semibold tracking-[-0.04em] text-slate-950">
                        {activeSpace.name}
                      </h2>
                      <p className="mt-1 truncate text-sm text-slate-500">{activeSpace.address}</p>
                    </div>
                    <div className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                      詳細へ
                    </div>
                  </div>
                </button>
              )}
            </div>
          </section>
        ) : null}

        <section className={`surface-card ${viewMode === "map" ? "-mt-2" : "mt-4"} rounded-[34px] px-4 pb-4 pt-5`}>
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-sky-200" />

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-sky-700">SPACE LIST</p>
              <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.05em] text-slate-950">
                いま選びやすい場所
              </h2>
            </div>
            <p className="text-sm font-medium text-slate-400">{filteredSpaces.length}件</p>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {filters.purposes.map((purpose) => (
              <FilterBadge key={purpose} label={PURPOSE_OPTIONS.find((option) => option.value === purpose)?.label ?? purpose} />
            ))}
            {HIGHLIGHT_FILTERS.filter((item) => filters[item.key]).map((item) => (
              <FilterBadge key={item.key} label={item.label} />
            ))}
            {filters.openNow && <FilterBadge label="営業中のみ" />}
            {filters.duration !== "any" && (
              <FilterBadge label={DURATION_OPTIONS.find((option) => option.value === filters.duration)?.label ?? "時間指定"} />
            )}
            {activeFilterCount === 0 && <FilterBadge label="おすすめ順" />}
          </div>

          {(locationError || spacesError) && (
            <div className="mt-4 rounded-[24px] bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
              {locationError ?? spacesError}
              {spaces.length === 0 ? " 現在はサンプルデータで表示しています。" : ""}
            </div>
          )}

          <div className="mt-4 space-y-3">
            {filteredSpaces.map((space, index) => (
              <SpaceCard
                key={space.placeId}
                space={space}
                distanceMeters={calculateDistanceMeters(origin, { lat: space.lat, lng: space.lng })}
                active={space.placeId === activeSpace?.placeId}
                index={index}
                onSelect={() => {
                  setSelectedPlaceId(space.placeId);
                  setViewMode("map");
                }}
                onOpenDetail={() => setDetailPlaceId(space.placeId)}
              />
            ))}
          </div>

          {filteredSpaces.length === 0 && (
            <div className="mt-4 rounded-[28px] bg-sky-50/85 px-5 py-10 text-center">
              <p className="text-base font-semibold tracking-[-0.02em] text-slate-900">条件に合う場所が見つかりませんでした</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                条件を少し緩めるか、検索ワードを変えてもう一度探してみてください。
              </p>
            </div>
          )}
        </section>

        <BizSpotBottomNav active="location" />
      </main>

      {filterSheetOpen && (
        <FilterSheet
          filters={filters}
          onClose={() => setFilterSheetOpen(false)}
          onReset={() => setFilters(DEFAULT_DISCOVERY_FILTERS)}
          onTogglePurpose={(purpose) =>
            setFilters((current) => ({
              ...current,
              purposes: current.purposes.includes(purpose)
                ? current.purposes.filter((value) => value !== purpose)
                : [...current.purposes, purpose],
            }))
          }
          onTogglePrice={(price) =>
            setFilters((current) => ({
              ...current,
              prices: current.prices.includes(price)
                ? current.prices.filter((value) => value !== price)
                : [...current.prices, price],
            }))
          }
          onToggleFlag={(key) =>
            setFilters((current) => ({
              ...current,
              [key]: !current[key],
            }))
          }
          onDurationChange={(duration) =>
            setFilters((current) => ({
              ...current,
              duration,
            }))
          }
          onOpenNowToggle={() =>
            setFilters((current) => ({
              ...current,
              openNow: !current.openNow,
            }))
          }
        />
      )}

      {detailPlaceId && (
        <BisSpaDetailSheet
          key={detailPlaceId}
          placeId={detailPlaceId}
          onClose={() => setDetailPlaceId(null)}
        />
      )}
    </>
  );
}

function MapCanvas({
  spaces,
  center,
  selectedPlaceId,
  onSelectSpace,
}: {
  spaces: Space[];
  center: { lat: number; lng: number };
  selectedPlaceId: string | null;
  onSelectSpace: (space: Space) => void;
}) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_45%,#e0f2fe_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.85),transparent_20%),radial-gradient(circle_at_80%_26%,rgba(125,211,252,0.34),transparent_18%),linear-gradient(120deg,rgba(37,99,235,0.09)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="absolute left-6 top-12 h-28 w-28 rounded-full border border-white/70 bg-white/40" />
        <div className="absolute right-8 top-24 h-16 w-40 rounded-full border border-white/70 bg-white/30" />
        <div className="absolute bottom-16 left-12 h-20 w-48 rounded-full border border-white/70 bg-white/30" />
      </div>
    );
  }

  return (
    <MapView
      spaces={spaces}
      center={center}
      selectedSpaceId={selectedPlaceId}
      onSelectSpace={onSelectSpace}
    />
  );
}

function SpaceCard({
  space,
  distanceMeters,
  active,
  index,
  onSelect,
  onOpenDetail,
}: {
  space: Space;
  distanceMeters: number | null;
  active: boolean;
  index: number;
  onSelect: () => void;
  onOpenDetail: () => void;
}) {
  const signals = getSpaceSignals(space);
  const photoUrl = space.photoReference
    ? `/api/places/photo?ref=${encodeURIComponent(space.photoReference)}`
    : null;

  return (
    <article
      className={`overflow-hidden rounded-[30px] border transition-all ${
        active
          ? "border-sky-200 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] shadow-[0_22px_42px_rgba(37,99,235,0.12)]"
          : "border-sky-50 bg-white"
      }`}
    >
      <div className="flex gap-4 p-4">
        <button type="button" onClick={onSelect} className="relative h-[110px] w-[104px] shrink-0 overflow-hidden rounded-[24px] bg-sky-100">
          {photoUrl ? (
            <Image src={photoUrl} alt={space.name} fill sizes="104px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_36%),linear-gradient(135deg,#bfdbfe_0%,#dbeafe_50%,#f0f9ff_100%)]" />
          )}
          <div className="absolute left-2 top-2 rounded-full bg-white/88 px-2 py-1 text-[10px] font-semibold text-sky-700">
            #{index + 1}
          </div>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                  {getCategoryLabel(space.category)}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{getPriceBadge(space.priceLevel)}</span>
              </div>
              <h3 className="mt-2 truncate text-lg font-semibold tracking-[-0.04em] text-slate-950">{space.name}</h3>
            </div>
            <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
              {formatDistanceKm(distanceMeters)}
            </div>
          </div>

          <p className="mt-1 truncate text-sm text-slate-500">{space.address}</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {CARD_METRICS.map((metric) => (
              <MetricChip key={metric.key} icon={metric.icon} label={metric.label} value={signals[metric.key]} tone={getSignalTone(metric.key, signals[metric.key])} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-400">{getStatusLabel(space)}</p>
              {space.rating ? (
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  ★ {space.rating.toFixed(1)}
                  {space.ratingCount ? <span className="ml-1 text-xs font-medium text-slate-400">({space.ratingCount})</span> : null}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onOpenDetail}
              className="rounded-[20px] bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            >
              詳細を見る
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function MetricChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-[18px] bg-sky-50/80 px-3 py-2.5">
      <div className="flex items-center gap-2 text-sky-700">
        <AppIcon name={icon} className="h-4 w-4" />
        <span className="text-[11px] font-semibold">{label}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-900">{value}/5</span>
        <span className="text-[11px] font-medium text-slate-500">{tone}</span>
      </div>
    </div>
  );
}

function FilterSheet({
  filters,
  onClose,
  onReset,
  onTogglePurpose,
  onTogglePrice,
  onToggleFlag,
  onDurationChange,
  onOpenNowToggle,
}: {
  filters: DiscoveryFilters;
  onClose: () => void;
  onReset: () => void;
  onTogglePurpose: (purpose: DiscoveryPurpose) => void;
  onTogglePrice: (price: DiscoveryFilters["prices"][number]) => void;
  onToggleFlag: (key: keyof Pick<DiscoveryFilters, "requireWifi" | "requirePower" | "lowCrowd" | "highFocus" | "longStay">) => void;
  onDurationChange: (duration: DiscoveryDuration) => void;
  onOpenNowToggle: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/32 backdrop-blur-[4px]" onClick={onClose} aria-hidden="true" />
      <aside className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] rounded-t-[34px] bg-[#f8fbff] px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_60px_rgba(15,23,42,0.2)]">
        <div className="mx-auto h-1.5 w-14 rounded-full bg-sky-200" />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-sky-700">FILTERS</p>
            <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.05em] text-slate-950">条件検索</h2>
          </div>
          <button type="button" onClick={onReset} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-500">
            リセット
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <FilterSection title="用途">
            <div className="flex flex-wrap gap-2">
              {PURPOSE_OPTIONS.map((option) => (
                <SelectableChip
                  key={option.value}
                  active={filters.purposes.includes(option.value)}
                  label={option.label}
                  onClick={() => onTogglePurpose(option.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="利用時間">
            <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-white p-1 shadow-[inset_0_0_0_1px_rgba(191,219,254,0.52)]">
              {DURATION_OPTIONS.map((option) => (
                <SegmentButton
                  key={option.value}
                  active={filters.duration === option.value}
                  label={option.label}
                  onClick={() => onDurationChange(option.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="料金">
            <div className="flex flex-wrap gap-2">
              {PRICE_OPTIONS.map((option) => (
                <SelectableChip
                  key={option.value}
                  active={filters.prices.includes(option.value)}
                  label={option.label}
                  onClick={() => onTogglePrice(option.value)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="こだわり条件">
            <div className="grid grid-cols-2 gap-2">
              {HIGHLIGHT_FILTERS.map((item) => (
                <ToggleTile
                  key={item.key}
                  active={filters[item.key]}
                  label={item.label}
                  onClick={() => onToggleFlag(item.key)}
                />
              ))}
            </div>
          </FilterSection>

          <button
            type="button"
            onClick={onOpenNowToggle}
            className={`flex w-full items-center justify-between rounded-[24px] px-4 py-4 text-left ${
              filters.openNow ? "bg-slate-950 text-white" : "bg-white text-slate-700"
            }`}
          >
            <div>
              <p className="text-sm font-semibold">営業中のみ表示</p>
              <p className={`mt-1 text-xs ${filters.openNow ? "text-slate-300" : "text-slate-400"}`}>
                今すぐ行ける場所に絞り込みます
              </p>
            </div>
            <span className={`h-6 w-11 rounded-full p-1 transition ${filters.openNow ? "bg-white/20" : "bg-sky-100"}`}>
              <span className={`block h-4 w-4 rounded-full bg-white shadow-sm transition ${filters.openNow ? "translate-x-5" : ""}`} />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#2563eb_0%,#1d4ed8_100%)] px-4 py-4 text-sm font-semibold text-white"
        >
          条件を反映する
        </button>
      </aside>
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function SelectableChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-slate-950 text-white" : "bg-white text-slate-600 shadow-[inset_0_0_0_1px_rgba(191,219,254,0.62)]"
      }`}
    >
      {label}
    </button>
  );
}

function ToggleTile({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[22px] px-4 py-4 text-left text-sm font-semibold transition ${
        active ? "bg-[linear-gradient(180deg,#2563eb_0%,#1d4ed8_100%)] text-white" : "bg-white text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

function SegmentButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[18px] px-3 py-3 text-center text-xs font-semibold leading-5 transition ${
        active ? "bg-slate-950 text-white" : "text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

function FilterBadge({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
      {label}
    </div>
  );
}

function ViewToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-[20px] px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-slate-950 text-white" : "text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
