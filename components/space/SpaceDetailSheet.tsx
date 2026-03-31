"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ScoreDisplay } from "./ScoreDisplay";
import { ScoreSubmitForm } from "./ScoreSubmitForm";
import { ReviewList } from "./ReviewList";
import { FavoriteButton } from "./FavoriteButton";
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
        // 閲覧履歴を記録
        if (session?.user) {
          addHistory(data.placeId, data.name, data.category, "viewed").catch(() => {});
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, scoreRefreshKey]);

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/30 z-20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* シート本体 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-30 shadow-2xl max-h-[85vh] flex flex-col">
        {/* ドラッグハンドル */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-8 space-y-5">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="py-8 text-center text-sm text-red-500">{error}</div>
          )}

          {detail && (
            <>
              {/* ヘッダー */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[detail.category] }}
                    />
                    <span className="text-xs text-gray-500">{CATEGORY_LABELS[detail.category]}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{detail.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{detail.address}</p>
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
                    className="p-2 text-gray-400 hover:text-gray-600"
                    aria-label="閉じる"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* 基本情報 */}
              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className={`text-sm font-medium ${
                    detail.isOpen === true
                      ? "text-green-600"
                      : detail.isOpen === false
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {formatOpenStatus(detail.isOpen)}
                </span>
                {detail.rating && (
                  <span className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{detail.rating.toFixed(1)}</span>
                    {detail.ratingCount && (
                      <span className="text-gray-400 text-xs">({detail.ratingCount}件)</span>
                    )}
                  </span>
                )}
              </div>

              {/* 営業時間 */}
              {detail.openingHours && detail.openingHours.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">営業時間</p>
                  <ul className="space-y-0.5">
                    {detail.openingHours.map((line, i) => (
                      <li key={i} className="text-xs text-gray-600">{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 連絡先 */}
              {(detail.phoneNumber || detail.website) && (
                <div className="flex gap-3 flex-wrap">
                  {detail.phoneNumber && (
                    <a
                      href={`tel:${detail.phoneNumber}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      📞 {detail.phoneNumber}
                    </a>
                  )}
                  {detail.website && (
                    <a
                      href={detail.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      🌐 Webサイト
                    </a>
                  )}
                </div>
              )}

              {/* 経路案内 */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${detail.lat},${detail.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-semibold text-center hover:bg-blue-50 transition-colors"
              >
                経路案内を開く
              </a>

              <hr className="border-gray-100" />

              {/* スコア表示 */}
              {detail.scores ? (
                <ScoreDisplay scores={detail.scores} />
              ) : (
                <p className="text-sm text-gray-400">まだ評価がありません</p>
              )}

              {/* 訪問済みマーク */}
              {session?.user && (
                <button
                  type="button"
                  onClick={() =>
                    addHistory(detail.placeId, detail.name, detail.category, "visited")
                  }
                  className="text-xs text-gray-500 hover:text-gray-800 underline"
                >
                  ✓ 訪問済みとしてマーク
                </button>
              )}

              {/* 評価フォーム */}
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
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {detail.userScore ? "評価を編集する" : "このスペースを評価する"}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={onNeedAuth}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ログインして評価を投稿する
                </button>
              )}

              <hr className="border-gray-100" />

              {/* レビュー */}
              <ReviewList reviews={detail.reviews} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
