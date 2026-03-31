export type Purpose = "focus" | "meeting" | "study" | "relax";
export type PriceFilter = "free" | "one_drink" | "paid";

export interface FilterState {
  purposes: Purpose[];
  openNow: boolean;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  prices: PriceFilter[];
}

export const DEFAULT_FILTERS: FilterState = {
  purposes: [],
  openNow: false,
  startTime: "",
  endTime: "",
  prices: [],
};

export const PURPOSE_LABELS: Record<Purpose, string> = {
  focus: "もくもく作業",
  meeting: "ミーティング",
  study: "勉強",
  relax: "リラックス",
};

export const PRICE_LABELS: Record<PriceFilter, string> = {
  free: "無料",
  one_drink: "ワンドリンク制",
  paid: "有料",
};
