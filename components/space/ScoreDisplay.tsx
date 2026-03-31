"use client";

import type { SpaceScoreAverages } from "@/lib/types/space";

interface Props {
  scores: SpaceScoreAverages;
}

const SCORE_ITEMS = [
  { key: "avgQuietness" as const, label: "静粛性" },
  { key: "avgWifiQuality" as const, label: "Wi-Fi品質" },
  { key: "avgPowerOutlet" as const, label: "電源の有無" },
  { key: "avgCongestion" as const, label: "混雑度（低いほど良い）" },
  { key: "avgPriceScore" as const, label: "料金（安いほど高評価）" },
  { key: "avgStayFriendly" as const, label: "長居しやすさ" },
];

export function ScoreDisplay({ scores }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-gray-700">ユーザー評価</p>
        <span className="text-xs text-gray-400">{scores.scoreCount}件</span>
      </div>
      {SCORE_ITEMS.map(({ key, label }) => {
        const value = scores[key] ?? 0;
        const pct = (value / 5) * 100;
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-32 shrink-0">{label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 w-6 text-right">
              {Number(value).toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
