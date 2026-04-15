"use client";

import { useEffect, useState } from "react";

interface HeaderBadge {
  label: string;
  tone?: "warm" | "cool" | "neutral";
}

interface HeaderTab<T extends string> {
  id: T;
  label: string;
  description?: string;
}

interface AdaptiveGlassHeaderProps<T extends string> {
  eyebrow: string;
  title: string;
  description: string;
  badges?: HeaderBadge[];
  tabs?: HeaderTab<T>[];
  activeTab?: T;
  onTabChange?: (tab: T) => void;
}

export function AdaptiveGlassHeader<T extends string>({
  eyebrow,
  title,
  description,
  badges = [],
  tabs,
  activeTab,
  onTabChange,
}: AdaptiveGlassHeaderProps<T>) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const updateCompact = () => {
      setCompact(window.scrollY > 20);
    };

    updateCompact();
    window.addEventListener("scroll", updateCompact, { passive: true });

    return () => window.removeEventListener("scroll", updateCompact);
  }, []);

  return (
    <header
      className={`sticky top-[max(env(safe-area-inset-top),12px)] z-30 transition-all duration-300 ease-out ${
        compact ? "scale-[0.985]" : "scale-100"
      }`}
    >
      <div
        className={`surface-soft overflow-hidden rounded-[30px] border-white/45 px-4 transition-all duration-300 ease-out ${
          compact
            ? "bg-white/72 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur-2xl"
            : "bg-white/58 py-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.08)_100%)]" />

        <div className="relative">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-sky-700">{eyebrow}</p>
            <h1
              className={`mt-1 font-semibold tracking-[-0.05em] text-slate-950 transition-all duration-300 ease-out ${
                compact ? "text-[18px]" : "text-[24px]"
              }`}
            >
              {title}
            </h1>
            <div
              className={`grid transition-all duration-300 ease-out ${
                compact ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
              }`}
            >
              <div className="overflow-hidden">
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                {badges.length > 0 ? (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                    {badges.map((badge) => (
                      <HeaderBadgePill key={badge.label} label={badge.label} tone={badge.tone ?? "neutral"} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {tabs && activeTab && onTabChange ? (
            <div className={`${compact ? "mt-3" : "mt-4"} transition-all duration-300 ease-out`}>
              <div
                className={`flex gap-2 rounded-[24px] border border-white/55 bg-white/64 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur ${
                  compact ? "overflow-x-auto hide-scrollbar" : ""
                }`}
              >
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onTabChange(tab.id)}
                      className={`min-w-0 flex-1 rounded-[18px] px-3 transition-all duration-300 ease-out ${
                        compact ? "py-2.5" : "py-3"
                      } ${
                        isActive
                          ? "bg-white text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{tab.label}</span>
                      <span
                        className={`block overflow-hidden text-[11px] font-medium text-inherit/80 transition-all duration-300 ease-out ${
                          compact ? "mt-0 max-h-0 opacity-0" : "mt-1 max-h-8 opacity-100"
                        }`}
                      >
                        {tab.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function HeaderBadgePill({ label, tone }: { label: string; tone: "warm" | "cool" | "neutral" }) {
  const className =
    tone === "warm"
      ? "bg-amber-50/88 text-amber-800"
      : tone === "cool"
        ? "bg-sky-50/88 text-sky-700"
        : "bg-slate-100/88 text-slate-600";

  return <span className={`rounded-full px-3 py-2 text-xs font-semibold ${className}`}>{label}</span>;
}
