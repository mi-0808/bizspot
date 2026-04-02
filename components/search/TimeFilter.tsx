"use client";

import { Toggle } from "@/components/ui/Toggle";

interface Props {
  openNow: boolean;
  startTime: string;
  endTime: string;
  onOpenNowChange: (value: boolean) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export function TimeFilter({
  openNow,
  startTime,
  endTime,
  onOpenNowChange,
  onStartTimeChange,
  onEndTimeChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-[28px] border border-sky-100 bg-sky-50/70 p-4">
      <div>
        <p className="text-sm font-bold text-slate-900">詳細条件</p>
        <p className="mt-1 text-xs text-slate-500">営業時間や使いたい時間帯まで細かく指定できます。</p>
      </div>
      <Toggle
        checked={openNow}
        onChange={onOpenNowChange}
        label="今すぐ使える（営業中のみ）"
      />
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-slate-500">利用開始</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="rounded-2xl border border-sky-100 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <span className="mt-4 text-slate-400">〜</span>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-medium text-slate-500">利用終了</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="rounded-2xl border border-sky-100 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
    </div>
  );
}
