"use client";

import { useSession } from "next-auth/react";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 text-xl font-black tracking-tight">BisSpa</span>
          <span className="text-gray-400 text-xs hidden sm:block">ビジスペ</span>
        </div>
        {session ? (
          <UserMenu session={session} />
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
}
