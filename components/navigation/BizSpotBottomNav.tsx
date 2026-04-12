"use client";

import Link from "next/link";

type NavTab = "location" | "match" | "profile";

export function BizSpotBottomNav({ active }: { active: NavTab }) {
  return (
    <nav className="surface-card fixed inset-x-0 bottom-3 z-30 mx-auto flex w-[calc(100%-24px)] max-w-[406px] items-center gap-2 rounded-[28px] px-3 py-3">
      <NavItem href="/location" label="Location" active={active === "location"} icon={<LocationIcon />} />
      <NavItem href="/match" label="Match" active={active === "match"} icon={<MatchIcon />} />
      <NavItem href="/profile" label="Profile" active={active === "profile"} icon={<ProfileIcon />} />
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
      className={`flex flex-1 flex-col items-center justify-center rounded-[22px] px-3 py-3 text-center transition ${
        active ? "bg-sky-600 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      {icon}
      <span className="mt-1 text-[11px] font-semibold">{label}</span>
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
