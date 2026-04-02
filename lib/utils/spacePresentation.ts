import { CATEGORY_LABELS } from "@/lib/utils/categoryColors";
import type { Space, SpaceDetail, SpaceScoreAverages } from "@/lib/types/space";

export type SpaceSignalKey = "wifi" | "power" | "crowd" | "focus" | "stay" | "price";

export type DiscoveryPurpose = "focus" | "meeting" | "study" | "relax";
export type DiscoveryDuration = "any" | "quick" | "long";

export interface DiscoveryFilters {
  query: string;
  purposes: DiscoveryPurpose[];
  prices: Array<"free" | "one_drink" | "paid">;
  openNow: boolean;
  requireWifi: boolean;
  requirePower: boolean;
  lowCrowd: boolean;
  highFocus: boolean;
  longStay: boolean;
  duration: DiscoveryDuration;
}

export interface SpaceSignals {
  wifi: number;
  power: number;
  crowd: number;
  focus: number;
  stay: number;
  price: number;
}

const CATEGORY_BASELINES: Record<Space["category"], SpaceSignals> = {
  cafe: { wifi: 4, power: 3, crowd: 3, focus: 3, stay: 3, price: 3 },
  fast_food: { wifi: 2, power: 2, crowd: 4, focus: 2, stay: 2, price: 4 },
  rental_space: { wifi: 5, power: 5, crowd: 2, focus: 4, stay: 5, price: 2 },
  coworking: { wifi: 5, power: 5, crowd: 2, focus: 5, stay: 5, price: 2 },
  library: { wifi: 3, power: 3, crowd: 2, focus: 5, stay: 4, price: 5 },
};

const PURPOSE_CATEGORY_MATCH: Record<DiscoveryPurpose, Space["category"][]> = {
  focus: ["coworking", "library", "cafe"],
  meeting: ["coworking", "rental_space", "cafe"],
  study: ["library", "coworking", "cafe"],
  relax: ["cafe", "fast_food"],
};

export const DEFAULT_DISCOVERY_FILTERS: DiscoveryFilters = {
  query: "",
  purposes: [],
  prices: [],
  openNow: false,
  requireWifi: false,
  requirePower: false,
  lowCrowd: false,
  highFocus: false,
  longStay: false,
  duration: "any",
};

function clampScore(value: number) {
  return Math.max(1, Math.min(5, value));
}

function createSeed(source: string) {
  return Array.from(source).reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 3), 0);
}

function jitter(seed: number, offset: number) {
  const raw = Math.sin(seed * 0.13 + offset * 1.97) * 0.7;
  return Math.round(raw);
}

function normalizePriceLevel(priceLevel?: number | null) {
  if (priceLevel === null || priceLevel === undefined) return 3;
  if (priceLevel <= 0) return 5;
  if (priceLevel === 1) return 4;
  if (priceLevel === 2) return 3;
  if (priceLevel === 3) return 2;
  return 1;
}

export function getSpaceSignals(space: Space | SpaceDetail) {
  if ("scores" in space && space.scores) {
    return scoresToSignals(space.scores, space.priceLevel);
  }

  const base = CATEGORY_BASELINES[space.category];
  const seed = createSeed(space.placeId);
  const ratingBoost = (space.rating ?? 4) >= 4.2 ? 1 : 0;

  return {
    wifi: clampScore(base.wifi + jitter(seed, 1)),
    power: clampScore(base.power + jitter(seed, 2)),
    crowd: clampScore(base.crowd + jitter(seed, 3)),
    focus: clampScore(base.focus + jitter(seed, 4) + ratingBoost),
    stay: clampScore(base.stay + jitter(seed, 5)),
    price: normalizePriceLevel(space.priceLevel),
  };
}

function scoresToSignals(scores: SpaceScoreAverages, priceLevel?: number) {
  return {
    wifi: clampScore(Math.round(scores.avgWifiQuality)),
    power: clampScore(Math.round(scores.avgPowerOutlet)),
    crowd: clampScore(Math.round(scores.avgCongestion)),
    focus: clampScore(Math.round((scores.avgQuietness + scores.avgWifiQuality + scores.avgPowerOutlet) / 3)),
    stay: clampScore(Math.round(scores.avgStayFriendly)),
    price: normalizePriceLevel(priceLevel),
  };
}

export function getCategoryLabel(category: Space["category"]) {
  return CATEGORY_LABELS[category];
}

export function getPriceBadge(priceLevel?: number) {
  if (priceLevel === 0) return "無料";
  if (priceLevel === 1) return "ワンドリンク";
  if (priceLevel === 2) return "標準";
  if (priceLevel === 3) return "やや高め";
  if (priceLevel === 4) return "高め";
  return "価格情報なし";
}

export function getStatusLabel(space: Space) {
  if (space.isOpen === true) return "営業中";
  if (space.isOpen === false) return "営業時間外";
  return "営業時間は要確認";
}

export function getSignalTone(key: SpaceSignalKey, value: number) {
  if (key === "crowd") {
    if (value <= 2) return "空いている";
    if (value === 3) return "ほどよい";
    return "混みやすい";
  }

  if (value >= 4) return "かなり良い";
  if (value === 3) return "ふつう";
  return "控えめ";
}

export function formatDistanceKm(distanceMeters: number | null) {
  if (distanceMeters === null) return "現在地未取得";
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)}m`;
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

export function calculateDistanceMeters(
  origin: { lat: number; lng: number } | null,
  target: { lat: number; lng: number },
) {
  if (!origin) return null;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRad(target.lat - origin.lat);
  const dLng = toRad(target.lng - origin.lng);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(target.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function filterDiscoverySpaces(
  spaces: Space[],
  filters: DiscoveryFilters,
  origin: { lat: number; lng: number } | null,
) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return spaces.filter((space) => {
    const signals = getSpaceSignals(space);
    const haystack = `${space.name} ${space.address}`.toLowerCase();

    if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
    if (filters.openNow && space.isOpen === false) return false;

    if (filters.prices.length > 0) {
      const badge =
        space.priceLevel === 0
          ? "free"
          : space.priceLevel === 1
            ? "one_drink"
            : "paid";
      if (!filters.prices.includes(badge)) return false;
    }

    if (
      filters.purposes.length > 0 &&
      !filters.purposes.some((purpose) => PURPOSE_CATEGORY_MATCH[purpose].includes(space.category))
    ) {
      return false;
    }

    if (filters.requireWifi && signals.wifi < 4) return false;
    if (filters.requirePower && signals.power < 4) return false;
    if (filters.lowCrowd && signals.crowd > 2) return false;
    if (filters.highFocus && signals.focus < 4) return false;
    if (filters.longStay && signals.stay < 4) return false;
    if (filters.duration === "long" && signals.stay < 4) return false;
    if (filters.duration === "quick" && signals.price < 2) return false;

    return true;
  }).sort((left, right) => {
    const leftDistance = calculateDistanceMeters(origin, { lat: left.lat, lng: left.lng }) ?? Number.MAX_SAFE_INTEGER;
    const rightDistance = calculateDistanceMeters(origin, { lat: right.lat, lng: right.lng }) ?? Number.MAX_SAFE_INTEGER;

    const leftSignals = getSpaceSignals(left);
    const rightSignals = getSpaceSignals(right);
    const leftScore = leftSignals.focus + leftSignals.wifi + leftSignals.power - leftSignals.crowd;
    const rightScore = rightSignals.focus + rightSignals.wifi + rightSignals.power - rightSignals.crowd;

    if (leftDistance !== rightDistance) return leftDistance - rightDistance;
    return rightScore - leftScore;
  });
}
