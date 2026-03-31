"use client";

import { PurposeFilter } from "./PurposeFilter";
import { TimeFilter } from "./TimeFilter";
import { PriceFilterPanel } from "./PriceFilter";
import type { FilterState, Purpose, PriceFilter } from "@/lib/types/filters";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onTogglePurpose: (p: Purpose) => void;
  onTogglePrice: (p: PriceFilter) => void;
  onSetOpenNow: (v: boolean) => void;
  onSetStartTime: (v: string) => void;
  onSetEndTime: (v: string) => void;
  onReset: () => void;
  resultCount: number;
}

export function SearchPanel({
  isOpen,
  onClose,
  filters,
  onTogglePurpose,
  onTogglePrice,
  onSetOpenNow,
  onSetStartTime,
  onSetEndTime,
  onReset,
  resultCount,
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/30 z-20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* パネル本体 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-30 shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* ドラッグハンドル */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 pb-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">条件で絞り込む</h2>
            <button
              type="button"
              onClick={onReset}
              className="text-sm text-blue-600 hover:underline"
            >
              リセット
            </button>
          </div>

          <PurposeFilter selected={filters.purposes} onToggle={onTogglePurpose} />

          <hr className="border-gray-100" />

          <TimeFilter
            openNow={filters.openNow}
            startTime={filters.startTime}
            endTime={filters.endTime}
            onOpenNowChange={onSetOpenNow}
            onStartTimeChange={onSetStartTime}
            onEndTimeChange={onSetEndTime}
          />

          <hr className="border-gray-100" />

          <PriceFilterPanel selected={filters.prices} onToggle={onTogglePrice} />

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            {resultCount}件を表示
          </button>
        </div>
      </div>
    </>
  );
}
