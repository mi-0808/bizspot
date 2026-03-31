"use client";

import { useState } from "react";
import type { SpaceScore } from "@/lib/types/space";

interface Props {
  placeId: string;
  initialScore?: SpaceScore | null;
  onSubmitted: () => void;
}

const FIELDS: { key: keyof Omit<SpaceScore, "note">; label: string }[] = [
  { key: "quietness", label: "静粛性" },
  { key: "wifiQuality", label: "Wi-Fi品質" },
  { key: "powerOutlet", label: "電源の有無" },
  { key: "congestion", label: "混雑度" },
  { key: "priceScore", label: "料金" },
  { key: "stayFriendly", label: "長居しやすさ" },
];

export function ScoreSubmitForm({ placeId, initialScore, onSubmitted }: Props) {
  const [scores, setScores] = useState<Omit<SpaceScore, "note">>({
    quietness: initialScore?.quietness ?? 3,
    wifiQuality: initialScore?.wifiQuality ?? 3,
    powerOutlet: initialScore?.powerOutlet ?? 3,
    congestion: initialScore?.congestion ?? 3,
    priceScore: initialScore?.priceScore ?? 3,
    stayFriendly: initialScore?.stayFriendly ?? 3,
  });
  const [note, setNote] = useState(initialScore?.note ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/spaces/${placeId}/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...scores, note }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "送信に失敗しました");
      return;
    }

    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">評価を投稿する</p>

      {FIELDS.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-28 shrink-0">{label}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setScores((s) => ({ ...s, [key]: v }))}
                className={`w-7 h-7 rounded-full text-xs font-semibold border transition-colors ${
                  scores[key] === v
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <label className="text-xs text-gray-500 block mb-1">コメント（任意）</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={300}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="自由にコメントを入力..."
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "送信中..." : "評価を送信"}
      </button>
    </form>
  );
}
