"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { SpaceScoreAverages } from "@/lib/types/space";

interface Props {
  scores: SpaceScoreAverages;
}

const SCORE_ITEMS = [
  { key: "avgQuietness" as const, label: "静粛性", icon: "focus" as const },
  { key: "avgWifiQuality" as const, label: "Wi-Fi品質", icon: "wifi" as const },
  { key: "avgPowerOutlet" as const, label: "電源の有無", icon: "power" as const },
  { key: "avgCongestion" as const, label: "混雑度", icon: "crowd" as const },
  { key: "avgPriceScore" as const, label: "料金", icon: "yen" as const },
  { key: "avgStayFriendly" as const, label: "長居しやすさ", icon: "clock" as const },
];

export function ScoreDisplay({ scores }: Props) {
  const focusScore = Math.round(
    ((scores.avgQuietness + scores.avgWifiQuality + scores.avgPowerOutlet + scores.avgStayFriendly) /
      20) *
      100,
  );

  return (
    <div className="space-y-4 rounded-[28px] border border-sky-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">集中できる度</p>
          <p className="mt-1 text-xs text-slate-500">作業向けの総合スコアを視覚化しています。</p>
        </div>
        <div className="rounded-2xl bg-sky-50 px-3 py-2 text-right">
          <p className="text-lg font-black tracking-[-0.03em] text-blue-700">{focusScore}%</p>
          <span className="text-[11px] font-semibold text-slate-500">{scores.scoreCount}件</span>
        </div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-sky-100">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#93c5fd_0%,#3b82f6_100%)]"
          style={{ width: `${focusScore}%` }}
        />
      </div>
      {SCORE_ITEMS.map(({ key, label, icon }) => {
        const value = scores[key] ?? 0;
        const pct = (value / 5) * 100;
        return (
          <div key={key} className="flex items-center gap-3">
            <div className="flex w-32 shrink-0 items-center gap-2 text-sky-700">
              <AppIcon name={icon} className="h-4 w-4" />
              <span className="text-xs font-medium text-slate-600">{label}</span>
            </div>
            <div className="h-2.5 flex-1 rounded-full bg-sky-100">
              <div
                className="h-2.5 rounded-full bg-[linear-gradient(90deg,#93c5fd_0%,#3b82f6_100%)] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-bold text-slate-700">
              {Number(value).toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
