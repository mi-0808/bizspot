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
      <div
        className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed bottom-0 left-0 right-0 z-40 max-h-[86vh] overflow-y-auto rounded-t-[32px] bg-white shadow-[0_-20px_60px_rgba(15,23,42,0.12)]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-12 rounded-full bg-sky-200" />
        </div>

        <div className="space-y-6 px-5 pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-slate-900">条件で探す</h2>
              <p className="mt-1 text-sm text-slate-500">3秒で絞れるよう、基本条件と詳細条件を分けています。</p>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-sky-100"
            >
              リセット
            </button>
          </div>

          <PurposeFilter selected={filters.purposes} onToggle={onTogglePurpose} />

          <TimeFilter
            openNow={filters.openNow}
            startTime={filters.startTime}
            endTime={filters.endTime}
            onOpenNowChange={onSetOpenNow}
            onStartTimeChange={onSetStartTime}
            onEndTimeChange={onSetEndTime}
          />

          <PriceFilterPanel selected={filters.prices} onToggle={onTogglePrice} />

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[22px] bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] py-4 text-sm font-bold text-white shadow-[0_14px_34px_rgba(59,130,246,0.3)] transition hover:brightness-105"
          >
            {resultCount}件を表示
          </button>
        </div>
      </div>
    </>
  );
}
