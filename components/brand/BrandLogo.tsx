"use client";

interface Props {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-sky-200/80 bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_45%,#bfdbfe_100%)] shadow-sm shadow-sky-200/60">
        <div className="absolute inset-[5px] rounded-[18px] bg-white/85" />
        <div className="relative flex items-center gap-1.5">
          <span className="h-5 w-2 rounded-full bg-sky-500 shadow-[0_0_0_3px_rgba(191,219,254,0.7)]" />
          <span className="h-3.5 w-3.5 rounded-full border-[3px] border-blue-600 bg-transparent" />
        </div>
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="text-[1.05rem] font-black leading-none tracking-[-0.04em] text-slate-900">
            Bizspot
          </p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-700/80">
            Bizspo
          </p>
        </div>
      )}
    </div>
  );
}
