"use client";

const AVATAR_THEMES = [
  "from-sky-300 via-cyan-200 to-blue-100",
  "from-amber-300 via-orange-200 to-rose-100",
  "from-emerald-300 via-teal-200 to-cyan-100",
  "from-violet-300 via-fuchsia-200 to-pink-100",
] as const;

export function UserAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const initials = getInitials(name);
  const theme = AVATAR_THEMES[Math.abs(hashCode(name)) % AVATAR_THEMES.length];
  const sizeClassName = size === "sm" ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm";

  return (
    <div
      aria-hidden="true"
      className={`relative shrink-0 overflow-hidden rounded-full border border-white/80 bg-gradient-to-br ${theme} ${sizeClassName} shadow-[0_10px_24px_rgba(15,23,42,0.10)]`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_42%)]" />
      <div className="absolute inset-x-2 bottom-0 h-[48%] rounded-t-full bg-white/28" />
      <span className="relative flex h-full items-center justify-center font-semibold tracking-[0.08em] text-slate-700">
        {initials}
      </span>
    </div>
  );
}

function getInitials(name: string) {
  const compactName = name.replace(/\s+/g, "");
  return compactName.slice(0, 2);
}

function hashCode(value: string) {
  return value.split("").reduce((accumulator, character) => accumulator * 31 + character.charCodeAt(0), 7);
}
