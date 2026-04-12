"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { BizSpotBottomNav } from "@/components/navigation/BizSpotBottomNav";
import { useCurrentLocation } from "@/lib/hooks/useCurrentLocation";

type MatchTab = "nearby" | "howling";

interface MemberProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  lat: number;
  lng: number;
  seeking: string;
  badges: string[];
  availability: string;
}

interface HowlingPost {
  id: string;
  author: string;
  role: string;
  lat: number;
  lng: number;
  message: string;
  mood: "quick" | "casual" | "serious";
  createdAt: string;
}

interface HowlingDraft {
  area: string;
  timing: string;
  purpose: string;
}

const DEFAULT_CENTER = { lat: 35.6812362, lng: 139.7671248 };

const PROFILES: MemberProfile[] = [
  {
    id: "1",
    name: "中原 健太",
    role: "SaaS Founder",
    company: "North Metric",
    bio: "B2B SaaS の価格設計と営業資料の壁打ちが得意です。",
    lat: 35.6804,
    lng: 139.7668,
    seeking: "シリーズA前の営業戦略ディスカッション歓迎",
    badges: ["事業計画", "SaaS", "資金調達"],
    availability: "15分ならすぐ",
  },
  {
    id: "2",
    name: "瀬戸 綾乃",
    role: "Brand Strategist",
    company: "Layer Studio",
    bio: "新規事業のブランド整理と LP メッセージ設計を支援しています。",
    lat: 35.6822,
    lng: 139.7691,
    seeking: "ブランド言語化の相談相手を探しています",
    badges: ["ブランディング", "D2C", "コピー"],
    availability: "コーヒー 30分OK",
  },
  {
    id: "3",
    name: "横山 亮",
    role: "CFO Partner",
    company: "Forward Axis",
    bio: "資本政策、管理会計、経営会議の設計が専門です。",
    lat: 35.6799,
    lng: 139.7709,
    seeking: "PL の見せ方と KPI 設計の壁打ち歓迎",
    badges: ["管理会計", "資本政策", "経営管理"],
    availability: "18時まで可",
  },
  {
    id: "4",
    name: "高橋 未来",
    role: "Community Builder",
    company: "Open Port",
    bio: "オフラインイベントと会員制コミュニティの立ち上げをしています。",
    lat: 35.6841,
    lng: 139.7648,
    seeking: "交流設計やコミュニティ導線の相談歓迎",
    badges: ["コミュニティ", "イベント", "紹介"],
    availability: "今から合流可",
  },
] as const;

const HOWLINGS: HowlingPost[] = [
  {
    id: "h1",
    author: "高橋 未来",
    role: "Community Builder",
    lat: 35.6841,
    lng: 139.7648,
    message: "軽くお茶しませんか。交流会の導線設計を10分だけ相談したいです。",
    mood: "casual",
    createdAt: "2026-04-12T10:40:00+09:00",
  },
  {
    id: "h2",
    author: "横山 亮",
    role: "CFO Partner",
    lat: 35.6799,
    lng: 139.7709,
    message: "今すぐ経営計画をフィードバックしてください。3枚の数字整理だけ見てほしいです。",
    mood: "serious",
    createdAt: "2026-04-12T10:55:00+09:00",
  },
  {
    id: "h3",
    author: "瀬戸 綾乃",
    role: "Brand Strategist",
    lat: 35.6822,
    lng: 139.7691,
    message: "新規 LP の一言目だけ壁打ちしたいので、近くの方いたらぜひ。",
    mood: "quick",
    createdAt: "2026-04-12T11:05:00+09:00",
  },
  {
    id: "h4",
    author: "中原 健太",
    role: "SaaS Founder",
    lat: 35.6804,
    lng: 139.7668,
    message: "積極的にビジパ募集中。今日の午後に GTM を話せる人を探しています。",
    mood: "serious",
    createdAt: "2026-04-12T11:18:00+09:00",
  },
] as const;

const MATCH_TABS: Array<{ id: MatchTab; label: string; description: string }> = [
  { id: "nearby", label: "近所", description: "近い人をすぐ見る" },
  { id: "howling", label: "ハウリング", description: "今の募集をすぐ見る" },
];

const HOWLING_TEMPLATES: Array<{ label: string; value: HowlingDraft }> = [
  {
    label: "経営計画",
    value: {
      area: "東京駅",
      timing: "今から30分",
      purpose: "経営計画をフィードバックしてほしい",
    },
  },
  {
    label: "軽くお茶",
    value: {
      area: "有楽町",
      timing: "このあと",
      purpose: "軽くお茶しながら近況交換したい",
    },
  },
  {
    label: "ビジパ募集",
    value: {
      area: "大手町",
      timing: "今日の午後",
      purpose: "積極的にビジパ募集中。GTMを話せる人歓迎",
    },
  },
] as const;

export function MatchHubApp() {
  const { data: session } = useSession();
  const { lat, lng, error, loading, getCurrentLocation } = useCurrentLocation();
  const [activeTab, setActiveTab] = useState<MatchTab>("nearby");
  const [howlingDraft, setHowlingDraft] = useState<HowlingDraft>({
    area: "東京駅",
    timing: "今から30分",
    purpose: "事業計画をフィードバックしてほしい",
  });

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const origin = lat !== null && lng !== null ? { lat, lng } : DEFAULT_CENTER;

  const nearbyProfiles = useMemo(
    () =>
      [...PROFILES]
        .map((profile) => ({
          ...profile,
          distanceKm: calculateDistanceKm(origin, { lat: profile.lat, lng: profile.lng }),
        }))
        .sort((left, right) => left.distanceKm - right.distanceKm),
    [origin],
  );

  const howlingFeed = useMemo(
    () =>
      [...HOWLINGS]
        .map((post) => ({
          ...post,
          distanceKm: calculateDistanceKm(origin, { lat: post.lat, lng: post.lng }),
        }))
        .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)),
    [origin],
  );

  return (
    <main className="app-shell px-3 pb-[calc(104px+env(safe-area-inset-bottom))] pt-[max(env(safe-area-inset-top),18px)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.30),transparent_40%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_100%)]" />

      <header className="surface-soft rounded-[30px] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-amber-700">BIZSPOT / MATCH</p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-950">
              位置から、今つながれる相手を見つける
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              近くにいる人を見るか、今出ている募集に反応するか。ヘビーに使えるように最短導線で置いています。
            </p>
          </div>
          {session ? <UserMenu session={session} /> : <SignInButton label="参加する" />}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <MetaChip label={loading ? "現在地を確認中" : "位置が近い順で表示"} tone="warm" />
          <MetaChip label="ハウリングは最新順" tone="cool" />
          <MetaChip label="位置からつながる" tone="neutral" />
        </div>
      </header>

      <section className="surface-card mt-4 rounded-[34px] p-4">
        <div className="flex gap-2 rounded-[24px] bg-slate-100 p-1">
          {MATCH_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-[18px] px-3 py-3 text-sm font-semibold leading-5 transition ${
                activeTab === tab.id ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
            >
              {tab.label}
              <span className="mt-1 block text-[11px] font-medium text-inherit/80">{tab.description}</span>
            </button>
          ))}
        </div>
      </section>

      {error ? (
        <section className="mt-4 rounded-[26px] bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          {error} 現在は東京駅周辺のサンプル位置で表示しています。
        </section>
      ) : null}

      {activeTab === "nearby" ? (
        <section className="mt-4 space-y-3">
          {nearbyProfiles.map((profile) => (
            <article key={profile.id} className="surface-card rounded-[30px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      {formatDistance(profile.distanceKm)}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{profile.role}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">{profile.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{profile.company}</p>
                </div>
                <div className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                  プロフィール
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">{profile.bio}</p>
              <p className="mt-3 rounded-[22px] bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-700">
                {profile.seeking}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.badges.map((badge) => (
                  <span key={badge} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                    {badge}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "howling" ? (
        <section className="mt-4 space-y-3">
          <article className="surface-card rounded-[30px] p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">HOWLING</p>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.05em] text-slate-950">
              今すぐ募集する
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              短く、場所と時間と目的だけを書くと反応されやすい想定です。
            </p>

            <div className="mt-4 grid gap-3">
              <HowlingField
                label="場所"
                value={howlingDraft.area}
                onChange={(value) => setHowlingDraft((current) => ({ ...current, area: value }))}
              />
              <HowlingField
                label="時間"
                value={howlingDraft.timing}
                onChange={(value) => setHowlingDraft((current) => ({ ...current, timing: value }))}
              />
              <HowlingField
                label="目的"
                value={howlingDraft.purpose}
                onChange={(value) => setHowlingDraft((current) => ({ ...current, purpose: value }))}
              />
            </div>

            <div className="mt-4 rounded-[24px] bg-amber-50 px-4 py-4">
              <p className="text-xs font-semibold tracking-[0.16em] text-amber-800">プレビュー</p>
              <p className="mt-2 text-sm font-medium leading-7 text-amber-950">
                {formatHowlingDraft(howlingDraft)}
              </p>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {HOWLING_TEMPLATES.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => setHowlingDraft(template.value)}
                  className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
                >
                  {template.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#f59e0b_0%,#ea580c_100%)] px-4 py-4 text-sm font-semibold text-white"
            >
              ハウリングを投稿する
            </button>
          </article>

          {howlingFeed.map((post) => (
            <article key={post.id} className="surface-card rounded-[30px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getMoodClassName(post.mood)}`}>
                      {getMoodLabel(post.mood)}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{formatRelativeTime(post.createdAt)}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">{post.author}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {post.role} ・ {formatDistance(post.distanceKm)}
                  </p>
                </div>
                <button type="button" className="rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">
                  この人に会いたい
                </button>
              </div>

              <p className="mt-4 text-[15px] font-medium leading-7 text-slate-800">{post.message}</p>
            </article>
          ))}
        </section>
      ) : null}

      <BizSpotBottomNav active="match" />
    </main>
  );
}

function MetaChip({ label, tone }: { label: string; tone: "warm" | "cool" | "neutral" }) {
  const className =
    tone === "warm"
      ? "bg-amber-50 text-amber-800"
      : tone === "cool"
        ? "bg-sky-50 text-sky-700"
        : "bg-slate-100 text-slate-600";

  return <span className={`rounded-full px-3 py-2 text-xs font-semibold ${className}`}>{label}</span>;
}

function HowlingField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-[24px] bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">{label}</p>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-0 bg-transparent p-0 text-sm leading-7 text-slate-800 outline-none"
      />
    </label>
  );
}

function calculateDistanceKm(
  origin: { lat: number; lng: number },
  target: { lat: number; lng: number },
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDiff = toRadians(target.lat - origin.lat);
  const lngDiff = toRadians(target.lng - origin.lng);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(target.lat);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }

  return `${distanceKm.toFixed(1)}km`;
}

function formatRelativeTime(createdAt: string) {
  const diffMinutes = Math.max(1, Math.round((Date.now() - Date.parse(createdAt)) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  return `${diffHours}時間前`;
}

function getMoodLabel(mood: HowlingPost["mood"]) {
  switch (mood) {
    case "quick":
      return "クイック相談";
    case "casual":
      return "軽く会う";
    case "serious":
      return "本気で募集中";
    default:
      return "ハウリング";
  }
}

function getMoodClassName(mood: HowlingPost["mood"]) {
  switch (mood) {
    case "quick":
      return "bg-sky-50 text-sky-700";
    case "casual":
      return "bg-emerald-50 text-emerald-700";
    case "serious":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatHowlingDraft(draft: HowlingDraft) {
  return `${draft.area}。${draft.timing}。${draft.purpose}`;
}
