"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ScoreDisplay } from "./ScoreDisplay";
import { ScoreSubmitForm } from "./ScoreSubmitForm";
import { ReviewList } from "./ReviewList";
import { FavoriteButton } from "./FavoriteButton";
import { AppIcon } from "@/components/ui/AppIcon";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils/categoryColors";
import { formatOpenStatus } from "@/lib/utils/openingHours";
import { useHistory } from "@/lib/hooks/useHistory";
import type { SpaceDetail } from "@/lib/types/space";

interface Props {
  placeId: string;
  onClose: () => void;
  onNeedAuth: () => void;
}

export function SpaceDetailSheet({ placeId, onClose, onNeedAuth }: Props) {
  const { data: session } = useSession();
  const { addHistory } = useHistory();
  const [detail, setDetail] = useState<SpaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [scoreRefreshKey, setScoreRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/places/${placeId}`)
      .then((r) => {
        if (!r.ok) throw new Error("スペース詳細の取得に失敗しました");
        return r.json();
      })
      .then((data: SpaceDetail) => {
        setDetail(data);
        if (session?.user) {
          addHistory(data.placeId, data.name, data.category, "viewed").catch(() => {});
        }
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "スペース詳細の取得に失敗しました");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, scoreRefreshKey]);

  const photoUrl = detail?.photoReference
    ? `/api/places/photo?ref=${encodeURIComponent(detail.photoReference)}`
    : null;

  const summaryCards = useMemo(() => {
    if (!detail) return [];

    const focusValue = detail.scores
      ? `${Math.round(
          ((detail.scores.avgQuietness +
            detail.scores.avgWifiQuality +
            detail.scores.avgPowerOutlet +
            detail.scores.avgStayFriendly) /
            20) *
            100,
        )}%`
      : "評価待ち";

    return [
      { label: "集中度", value: focusValue, icon: "focus" as const },
      {
        label: "Wi-Fi",
        value: detail.scores ? `${detail.scores.avgWifiQuality.toFixed(1)}/5` : "未評価",
        icon: "wifi" as const,
      },
      {
        label: "電源",
        value: detail.scores ? `${detail.scores.avgPowerOutlet.toFixed(1)}/5` : "未評価",
        icon: "power" as const,
      },
      {
        label: "混雑度",
        value: detail.scores ? `${detail.scores.avgCongestion.toFixed(1)}/5` : "未評価",
        icon: "crowd" as const,
      },
    ];
  }, [detail]);

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed bottom-0 left-0 right-0 z-40 flex max-h-[90vh] flex-col rounded-t-[32px] bg-white shadow-[0_-20px_60px_rgba(15,23,42,0.16)]">
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-12 rounded-full bg-sky-200" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          )}

          {error && <div className="py-8 text-center text-sm text-red-500">{error}</div>}

          {detail && (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-[30px] border border-sky-100 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_60%)]">
                <div className="relative h-52 w-full bg-[linear-gradient(135deg,#e0f2fe_0%,#dbeafe_35%,#bfdbfe_100%)]">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={detail.name}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent_35%),linear-gradient(135deg,#e0f2fe_0%,#dbeafe_35%,#bfdbfe_100%)] p-5">
                      <div className="rounded-2xl bg-white/75 px-3 py-2 text-sm font-semibold text-sky-700 backdrop-blur">
                        写真準備中
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[detail.category] }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700/75">
                          {CATEGORY_LABELS[detail.category]}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">
                        {detail.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">{detail.address}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <FavoriteButton
                        placeId={detail.placeId}
                        placeName={detail.name}
                        category={detail.category}
                        isLoggedIn={!!session?.user}
                        onNeedAuth={onNeedAuth}
                      />
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full bg-slate-100 p-2 text-slate-400 transition hover:text-slate-600"
                        aria-label="閉じる"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className={`text-sm font-bold ${
                        detail.isOpen === true
                          ? "text-emerald-600"
                          : detail.isOpen === false
                            ? "text-rose-500"
                            : "text-slate-400"
                      }`}
                    >
                      {formatOpenStatus(detail.isOpen)}
                    </span>
                    {detail.rating && (
                      <span className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold">{detail.rating.toFixed(1)}</span>
                        {detail.ratingCount && (
                          <span className="text-xs text-slate-400">({detail.ratingCount}件)</span>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {summaryCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-sky-100 bg-white p-3 shadow-sm"
                      >
                        <div className="flex items-center gap-2 text-sky-700">
                          <AppIcon name={item.icon} />
                          <span className="text-xs font-semibold">{item.label}</span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-slate-800">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] px-3 py-3 text-sm font-bold text-white"
                    >
                      <AppIcon name="go" className="h-4 w-4" />
                      行く
                    </a>
                    <FavoriteButton
                      placeId={detail.placeId}
                      placeName={detail.name}
                      category={detail.category}
                      isLoggedIn={!!session?.user}
                      onNeedAuth={onNeedAuth}
                      variant="pill"
                    />
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${detail.lat},${detail.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-3 py-3 text-sm font-bold text-slate-700"
                    >
                      <AppIcon name="route" className="h-4 w-4" />
                      経路
                    </a>
                  </div>
                </div>
              </div>

              {detail.openingHours && detail.openingHours.length > 0 && (
                <div className="rounded-[28px] border border-sky-100 bg-white p-4 shadow-sm">
                  <p className="mb-2 text-sm font-bold text-slate-900">営業時間</p>
                  <ul className="space-y-1">
                    {detail.openingHours.map((line, i) => (
                      <li key={i} className="text-sm text-slate-600">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(detail.phoneNumber || detail.website) && (
                <div className="flex flex-wrap gap-3 rounded-[28px] border border-sky-100 bg-sky-50/65 p-4">
                  {detail.phoneNumber && (
                    <a
                      href={`tel:${detail.phoneNumber}`}
                      className="text-sm font-semibold text-blue-700 hover:underline"
                    >
                      電話: {detail.phoneNumber}
                    </a>
                  )}
                  {detail.website && (
                    <a
                      href={detail.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-700 hover:underline"
                    >
                      Webサイト
                    </a>
                  )}
                </div>
              )}

              {detail.scores ? (
                <ScoreDisplay scores={detail.scores} />
              ) : (
                <p className="text-sm text-slate-400">まだ評価がありません</p>
              )}

              {session?.user && (
                <button
                  type="button"
                  onClick={() => addHistory(detail.placeId, detail.name, detail.category, "visited")}
                  className="text-sm font-semibold text-slate-500 underline decoration-sky-200 underline-offset-4 hover:text-slate-800"
                >
                  ✓ 訪問済みとしてマーク
                </button>
              )}

              {session?.user ? (
                showScoreForm ? (
                  <ScoreSubmitForm
                    placeId={placeId}
                    initialScore={detail.userScore}
                    onSubmitted={() => {
                      setShowScoreForm(false);
                      setScoreRefreshKey((k) => k + 1);
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowScoreForm(true)}
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    {detail.userScore ? "評価を編集する" : "このスペースを評価する"}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={onNeedAuth}
                  className="text-sm font-semibold text-blue-700 hover:underline"
                >
                  ログインして評価を投稿する
                </button>
              )}

              <ReviewList reviews={detail.reviews} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
