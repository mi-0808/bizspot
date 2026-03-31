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
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">時間</p>
      <Toggle
        checked={openNow}
        onChange={onOpenNowChange}
        label="今すぐ使える（営業中のみ）"
      />
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-500">利用開始</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <span className="text-gray-400 mt-4">〜</span>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-500">利用終了</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
}
