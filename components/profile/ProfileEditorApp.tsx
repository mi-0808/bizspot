"use client";

import { useState } from "react";
import { BizSpotBottomNav } from "@/components/navigation/BizSpotBottomNav";

const STORAGE_KEY = "bizspot-profile";

interface ProfileDraft {
  displayName: string;
  headline: string;
  bio: string;
  seeking: string;
  availability: string;
  socialLinks: string;
}

const DEFAULT_PROFILE: ProfileDraft = {
  displayName: "あなたの名前",
  headline: "Founder / BizDev",
  bio: "何をやっている人か、どんなテーマなら話せるかを短くまとめます。",
  seeking: "今ほしい交流や相談内容を書きます。",
  availability: "今から20分なら可",
  socialLinks: "X / LinkedIn / note",
};

export function ProfileEditorApp() {
  const [profile, setProfile] = useState<ProfileDraft>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_PROFILE;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PROFILE;
    }

    try {
      return JSON.parse(stored) as ProfileDraft;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return DEFAULT_PROFILE;
    }
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="app-shell px-3 pb-[calc(104px+env(safe-area-inset-bottom))] pt-[max(env(safe-area-inset-top),18px)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.24),transparent_38%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.72)_100%)]" />

      <header className="surface-soft rounded-[30px] px-4 py-4">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500">PROFILE</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.05em] text-slate-950">
          公開プロフィールを整える
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          マッチで近くの人に見せるプロフィールを編集します。ここでは近所やハウリングには切り替えず、公開内容の調整だけに集中できます。
        </p>
      </header>

      <section className="surface-card mt-4 rounded-[32px] p-5">
        <div className="space-y-3">
          <ProfileInput label="表示名" value={profile.displayName} onChange={(value) => setProfile((current) => ({ ...current, displayName: value }))} />
          <ProfileInput label="肩書き" value={profile.headline} onChange={(value) => setProfile((current) => ({ ...current, headline: value }))} />
          <ProfileTextarea label="自己紹介" value={profile.bio} onChange={(value) => setProfile((current) => ({ ...current, bio: value }))} />
          <ProfileTextarea label="今ほしい交流" value={profile.seeking} onChange={(value) => setProfile((current) => ({ ...current, seeking: value }))} />
          <ProfileInput label="会える温度感" value={profile.availability} onChange={(value) => setProfile((current) => ({ ...current, availability: value }))} />
          <ProfileInput label="SNSリンク" value={profile.socialLinks} onChange={(value) => setProfile((current) => ({ ...current, socialLinks: value }))} />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-5 flex w-full items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)] px-4 py-4 text-sm font-semibold text-white"
        >
          プロフィールを保存する
        </button>

        {saved ? (
          <p className="mt-3 text-center text-sm font-medium text-emerald-700">プロフィールを保存しました。</p>
        ) : null}
      </section>

      <section className="surface-card mt-4 rounded-[32px] p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">PREVIEW</p>
        <div className="mt-3 rounded-[28px] bg-[linear-gradient(135deg,#fef3c7_0%,#fff7ed_55%,#ffffff_100%)] p-4">
          <p className="text-xl font-semibold tracking-[-0.04em] text-slate-950">{profile.displayName}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">{profile.headline}</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{profile.bio}</p>
          <p className="mt-3 rounded-[22px] bg-white/75 px-3 py-3 text-sm leading-6 text-slate-700">{profile.seeking}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">{profile.availability}</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{profile.socialLinks}</span>
          </div>
        </div>
      </section>

      <BizSpotBottomNav active="profile" />
    </main>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[24px] bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">{label}</p>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-0 bg-transparent p-0 text-sm leading-7 text-slate-800 outline-none"
      />
    </label>
  );
}

function ProfileTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-[24px] bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">{label}</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none border-0 bg-transparent p-0 text-sm leading-7 text-slate-800 outline-none"
      />
    </label>
  );
}
