"use client";

import type { Session } from "next-auth";
import { SignInButton } from "@/components/auth/SignInButton";
import { UserMenu } from "@/components/auth/UserMenu";

export function AuthInlinePanel({
  session,
  signedOutLabel,
}: {
  session: Session | null | undefined;
  signedOutLabel: string;
}) {
  return (
    <section className="surface-soft mt-3 rounded-[24px] px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">ACCOUNT</p>
          {session ? (
            <p className="mt-1 truncate text-sm font-medium text-slate-700">
              Googleアカウントでログイン中
            </p>
          ) : (
            <p className="mt-1 text-sm leading-6 text-slate-600">{signedOutLabel}</p>
          )}
        </div>

        {session ? (
          <UserMenu session={session} compact />
        ) : (
          <SignInButton label="新規登録・ログイン" compact />
        )}
      </div>
    </section>
  );
}
