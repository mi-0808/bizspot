"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import type { Session } from "next-auth";

interface Props {
  session: Session;
  compact?: boolean;
}

export function UserMenu({ session, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const user = session.user;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 overflow-hidden rounded-full border bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          compact
            ? "border-white/60 p-0.5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-sky-100 p-1"
        }`}
        aria-label="ユーザーメニュー"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "ユーザー"}
            width={compact ? 28 : 32}
            height={compact ? 28 : 32}
            className="rounded-full"
          />
        ) : (
          <div
            className={`flex items-center justify-center rounded-full bg-blue-500 font-bold text-white ${
              compact ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm"
            }`}
          >
            {user?.name?.[0] ?? "U"}
          </div>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-12 z-20 w-56 rounded-3xl border border-sky-100 bg-white/95 py-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="border-b border-sky-50 px-4 py-3">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-sky-50"
            >
              ログアウト
            </button>
          </div>
        </>
      )}
    </div>
  );
}
