export type HistoryAction = "viewed" | "visited";

export interface HistoryEntry {
  id: string;
  placeId: string;
  placeName: string;
  placeType: string | null;
  action: HistoryAction;
  occurredAt: string;
}
