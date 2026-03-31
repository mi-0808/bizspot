import type { SpaceCategory } from "@/lib/types/space";

export const CATEGORY_COLORS: Record<SpaceCategory, string> = {
  cafe: "#FBBF24",         // 黄色
  fast_food: "#EF4444",    // 赤
  rental_space: "#22C55E", // 緑
  coworking: "#6B7280",    // 灰色
  library: "#3B82F6",      // 青
};

export const CATEGORY_LABELS: Record<SpaceCategory, string> = {
  cafe: "カフェ",
  fast_food: "ファストフード",
  rental_space: "レンタルスペース",
  coworking: "コワーキング",
  library: "図書館・公共施設",
};

// Google Places の type -> SpaceCategory マッピング
export function placeTypesToCategory(types: string[]): SpaceCategory {
  if (types.includes("library") || types.includes("city_hall") || types.includes("local_government_office")) {
    return "library";
  }
  if (types.includes("cafe") || types.includes("coffee_shop")) {
    return "cafe";
  }
  // fast food: restaurant + 名前ベースのヒューリスティックは呼び出し側で対応
  if (types.includes("restaurant") || types.includes("food")) {
    return "fast_food";
  }
  return "coworking";
}

// キーワード検索でレンタルスペース判定
export function isRentalSpace(name: string): boolean {
  const keywords = ["レンタル", "貸し会議", "シェアスペース", "会議室", "スタジオ"];
  return keywords.some((k) => name.includes(k));
}
