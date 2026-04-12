"use client";

import Link from "next/link";

type NavTab = "location" | "match" | "profile";

const NAV_ITEMS: Array<{
  href: string;
  label: string;
  tab: NavTab;
  icon: React.ReactNode;
}> = [
  { href: "/location", label: "Location", tab: "location", icon: <LocationIcon /> },
  { href: "/match", label: "Match", tab: "match", icon: <MatchIcon /> },
  { href: "/profile", label: "Profile", tab: "profile", icon: <ProfileIcon /> },
];

export function BizSpotBottomNav({ active }: { active: NavTab }) {
  const activeIndex = NAV_ITEMS.findIndex((item) => item.tab === active);

  return (
    <nav className="fixed inset-x-0 bottom-3 z-30 mx-auto w-[calc(100%-24px)] max-w-[406px] rounded-[32px] border border-white/55 bg-white/58 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-[24px]">
      <div className="relative grid grid-cols-3 gap-2">
        <div
          aria-hidden="true"
          className="absolute bottom-0 top-0 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(219,234,254,0.56)_100%)] shadow-[0_16px_32px_rgba(148,163,184,0.22),inset_0_1px_0_rgba(255,255,255,0.7)] transition-transform duration-300 ease-out"
          style={{
            width: "calc((100% - 1rem) / 3)",
            transform: `translateX(calc(${activeIndex} * (100% + 0.5rem)))`,
          }}
        />

        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.tab}
            href={item.href}
            label={item.label}
            active={item.tab === active}
            icon={item.icon}
          />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative z-10 flex min-h-[62px] flex-col items-center justify-center rounded-[24px] px-3 py-3 text-center transition-all duration-300 ${
        active
          ? "scale-[0.985] text-slate-950"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <span className={`transition-transform duration-300 ${active ? "translate-y-[-1px]" : ""}`}>{icon}</span>
      <span className={`mt-1 text-[11px] font-semibold transition-all duration-300 ${active ? "tracking-[0.02em]" : ""}`}>
        {label}
      </span>
    </Link>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  );
}

function MatchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9M7.5 12h6.75M6 18.75h9.75a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25H8.25A2.25 2.25 0 0 0 6 7.5v11.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 15.75 21 18.75" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18.75a3.75 3.75 0 0 0-7.5 0" />
      <circle cx="11.25" cy="8.25" r="2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 18.75a3.75 3.75 0 0 0-3-3.675" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.43a2.25 2.25 0 1 1 0 3.64" />
    </svg>
  );
}
