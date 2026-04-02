"use client";

import { useSession } from "next-auth/react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-5 pt-5">
      <div className="flex items-center justify-between">
        <div className="rounded-[24px] border border-sky-100/90 bg-white/94 px-4 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur">
          <BrandLogo />
        </div>
        {session ? (
          <UserMenu session={session} />
        ) : (
          <SignInButton className="rounded-2xl border border-sky-100 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-white" />
        )}
      </div>
    </header>
  );
}
