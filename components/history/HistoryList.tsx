"use client";

import { useHistory } from "@/lib/hooks/useHistory";
import { CATEGORY_LABELS } from "@/lib/utils/categoryColors";
import type { SpaceCategory } from "@/lib/types/space";

interface Props {
  onSelectSpace: (placeId: string) => void;
}

export function HistoryList({ onSelectSpace }: Props) {
  const { history, loading } = useHistory();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">まだ履歴がありません</p>
        <p className="text-gray-300 text-xs mt-1">スペースを閲覧すると記録されます</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {history.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            onClick={() => onSelectSpace(entry.placeId)}
            className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{entry.placeName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {entry.placeType ? CATEGORY_LABELS[entry.placeType as SpaceCategory] ?? entry.placeType : ""}
                  {" "}
                  {entry.action === "visited" && (
                    <span className="text-green-600 font-medium">✓ 訪問済み</span>
                  )}
                </p>
              </div>
              <span className="text-xs text-gray-300 shrink-0 ml-2">
                {new Date(entry.occurredAt).toLocaleDateString("ja-JP", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
