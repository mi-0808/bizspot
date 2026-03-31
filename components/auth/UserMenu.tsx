"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import type { Session } from "next-auth";

interface Props {
  session: Session;
}

export function UserMenu({ session }: Props) {
  const [open, setOpen] = useState(false);
  const user = session.user;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="ユーザーメニュー"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "ユーザー"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
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
          <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-20">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </>
      )}
    </div>
  );
}
