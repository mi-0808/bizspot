import type { Space } from "@/lib/types/space";
import type { FilterState } from "@/lib/types/filters";

/**
 * クライアントサイドでスペース一覧にフィルターを適用する
 */
export function filterSpaces(spaces: Space[], filters: FilterState): Space[] {
  return spaces.filter((space) => {
    // 営業中フィルター
    if (filters.openNow && space.isOpen === false) return false;

    // 料金フィルター
    if (filters.prices.length > 0) {
      const priceLevel = space.priceLevel ?? 0;
      const matchesPrice = filters.prices.some((p) => {
        if (p === "free") return priceLevel === 0;
        if (p === "one_drink") return priceLevel === 1;
        if (p === "paid") return priceLevel >= 2;
        return false;
      });
      if (!matchesPrice) return false;
    }

    // 用途フィルター: カテゴリと用途の対応（ざっくりマッピング）
    if (filters.purposes.length > 0) {
      const matchesPurpose = filters.purposes.some((purpose) => {
        if (purpose === "focus") return space.category === "cafe" || space.category === "coworking" || space.category === "library";
        if (purpose === "meeting") return space.category === "coworking" || space.category === "rental_space";
        if (purpose === "study") return space.category === "library" || space.category === "cafe";
        if (purpose === "relax") return space.category === "cafe" || space.category === "fast_food";
        return false;
      });
      if (!matchesPurpose) return false;
    }

    return true;
  });
}
