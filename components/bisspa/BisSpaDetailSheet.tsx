"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FavoriteButton } from "@/components/space/FavoriteButton";
import { SignInButton } from "@/components/auth/SignInButton";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  getCategoryLabel,
  getPriceBadge,
  getSignalTone,
  getSpaceSignals,
  getStatusLabel,
  type SpaceSignalKey,
} from "@/lib/utils/spacePresentation";
import type { SpaceDetail } from "@/lib/types/space";

interface BisSpaDetailSheetProps {
  placeId: string;
  onClose: () => void;
}

const DETAIL_METRICS: Array<{ key: SpaceSignalKey; label: string; icon: React.ComponentProps<typeof AppIcon>["name"] }> = [
  { key: "wifi", label: "Wi-Fi", icon: "wifi" },
  { key: "power", label: "電源", icon: "power" },
  { key: "crowd", label: "混雑度", icon: "crowd" },
  { key: "focus", label: "集中度", icon: "focus" },
];

export function BisSpaDetailSheet({ placeId, onClose }: BisSpaDetailSheetProps) {
  const { data: session } = useSession();
  const [detail, setDetail] = useState<SpaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(`/api/places/${placeId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("スペース詳細の取得に失敗しました");
        }
        return response.json();
      })
      .then((data: SpaceDetail) => {
        if (!active) return;
        setDetail(data);
      })
      .catch((fetchError: unknown) => {
        if (!active) return;
        setError(fetchError instanceof Error ? fetchError.message : "スペース詳細の取得に失敗しました");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [placeId]);

  const photoUrl = detail?.photoReference
    ? `/api/places/photo?ref=${encodeURIComponent(detail.photoReference)}`
    : null;

  const signals = useMemo(() => (detail ? getSpaceSignals(detail) : null), [detail]);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[6px]" onClick={onClose} aria-hidden="true" />

      <aside className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[34px] bg-[#f8fbff] shadow-[0_-20px_60px_rgba(15,23,42,0.22)]">
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-14 rounded-full bg-sky-200" />
        </div>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-4 pb-8">
          {loading && (
            <div className="surface-card flex min-h-[240px] items-center justify-center rounded-[28px]">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            </div>
          )}

          {error && (
            <div className="surface-card rounded-[28px] px-5 py-8 text-center text-sm text-rose-500">
              {error}
            </div>
          )}

          {detail && signals && (
            <div className="space-y-4">
              <section className="surface-card overflow-hidden rounded-[32px]">
                <div className="relative h-64 w-full overflow-hidden bg-[linear-gradient(140deg,#dbeafe_0%,#e0f2fe_50%,#eff6ff_100%)]">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={detail.name}
                      fill
                      sizes="430px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_38%),linear-gradient(135deg,#bfdbfe_0%,#dbeafe_48%,#f0f9ff_100%)]" />
                  )}

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <div className="rounded-full bg-white/86 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-sky-700 backdrop-blur">
                      SPACE DETAIL
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur"
                      aria-label="閉じる"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.72)_100%)] px-5 pb-5 pt-14 text-white">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-sky-100">
                      <span className="rounded-full bg-white/16 px-2.5 py-1 backdrop-blur">
                        {getCategoryLabel(detail.category)}
                      </span>
                      <span className="rounded-full bg-white/16 px-2.5 py-1 backdrop-blur">
                        {getPriceBadge(detail.priceLevel)}
                      </span>
                    </div>
                    <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.04em]">
                      {detail.name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-100/92">{detail.address}</p>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-sky-700">現在の状態</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">{getStatusLabel(detail)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FavoriteButton
                        placeId={detail.placeId}
                        placeName={detail.name}
                        category={detail.category}
                        isLoggedIn={Boolean(session?.user)}
                        onNeedAuth={() => setNeedsLogin(true)}
                        variant="pill"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {DETAIL_METRICS.map((metric) => (
                      <div key={metric.key} className="rounded-[24px] bg-sky-50/85 p-4">
                        <div className="flex items-center gap-2 text-sky-700">
                          <AppIcon name={metric.icon} />
                          <span className="text-xs font-semibold">{metric.label}</span>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-2">
                          <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                            {signals[metric.key]}
                            <span className="ml-1 text-sm font-medium text-slate-400">/5</span>
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {getSignalTone(metric.key, signals[metric.key])}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoTile
                      icon="clock"
                      label="営業時間"
                      value={detail.openingHours?.[0] ?? "詳細で確認"}
                    />
                    <InfoTile
                      icon="yen"
                      label="料金の目安"
                      value={getPriceBadge(detail.priceLevel)}
                    />
                    <InfoTile
                      icon="spark"
                      label="長居しやすさ"
                      value={`${signals.stay}/5`}
                    />
                    <InfoTile
                      icon="pin"
                      label="場所"
                      value="駅・現在地から確認"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${detail.lat},${detail.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(180deg,#2563eb_0%,#1d4ed8_100%)] px-4 py-3.5 text-sm font-semibold text-white"
                    >
                      <AppIcon name="route" className="h-4 w-4" />
                      経路
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${detail.lat},${detail.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-[22px] border border-sky-100 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700"
                    >
                      <AppIcon name="go" className="h-4 w-4" />
                      地図
                    </a>
                    {detail.website ? (
                      <a
                        href={detail.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 rounded-[22px] border border-sky-100 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700"
                      >
                        Web
                      </a>
                    ) : (
                      <div className="flex items-center justify-center rounded-[22px] border border-dashed border-sky-100 bg-sky-50/60 px-4 py-3.5 text-sm font-semibold text-slate-400">
                        Webなし
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {detail.openingHours && detail.openingHours.length > 0 && (
                <section className="surface-card rounded-[28px] p-5">
                  <div className="flex items-center gap-2">
                    <AppIcon name="clock" className="h-4 w-4 text-sky-700" />
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">営業時間</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                    {detail.openingHours.map((line) => (
                      <li key={line} className="rounded-2xl bg-sky-50/80 px-3 py-2">
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="surface-card rounded-[28px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">使い心地サマリー</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {detail.scores
                        ? `${detail.scores.scoreCount}件の体験評価をもとに表示しています。`
                        : "評価データがない項目は、場所タイプと公開情報をもとに補完しています。"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <SignalBar label="Wi-Fi" value={signals.wifi} accentClass="bg-sky-500" />
                  <SignalBar label="電源" value={signals.power} accentClass="bg-blue-500" />
                  <SignalBar label="集中しやすさ" value={signals.focus} accentClass="bg-cyan-500" />
                  <SignalBar label="長居しやすさ" value={signals.stay} accentClass="bg-indigo-500" />
                </div>
              </section>

              <section className="surface-card rounded-[28px] p-5">
                <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">レビュー</h3>
                <div className="mt-4 space-y-3">
                  {detail.reviews.length > 0 ? (
                    detail.reviews.slice(0, 3).map((review) => (
                      <article key={`${review.authorName}-${review.relativeTime}`} className="rounded-[24px] bg-sky-50/70 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{review.authorName}</p>
                            <p className="text-xs text-slate-400">{review.relativeTime}</p>
                          </div>
                          <div className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-500">
                            ★ {review.rating}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{review.text || "コメントはまだありません。"}</p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[24px] bg-sky-50/70 px-4 py-6 text-sm text-slate-500">
                      まだレビューがありません。
                    </div>
                  )}
                </div>
              </section>

              {needsLogin && (
                <section className="surface-card rounded-[28px] p-5">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-950">保存や評価にはログインが必要です</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    お気に入り保存や今後の体験データ蓄積に参加できます。
                  </p>
                  <div className="mt-4">
                    <SignInButton className="flex w-full items-center justify-center gap-2 rounded-[22px] bg-[linear-gradient(180deg,#ffffff_0%,#f0f7ff_100%)] px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm" label="Googleでログイン" />
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(191,219,254,0.5)]">
      <div className="flex items-center gap-2 text-sky-700">
        <AppIcon name={icon} className="h-4 w-4" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function SignalBar({
  label,
  value,
  accentClass,
}: {
  label: string;
  value: number;
  accentClass: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{value}/5</span>
      </div>
      <div className="h-2 rounded-full bg-sky-100">
        <div className={`h-2 rounded-full ${accentClass}`} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );
}
