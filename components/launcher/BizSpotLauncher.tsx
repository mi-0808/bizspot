import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

const APP_CARDS = [
  {
    href: "/location",
    eyebrow: "LOCATION",
    title: "ロケーション",
    description:
      "静かに作業できる場所や打ち合わせ向きのスペースを、地図と条件検索から素早く見つけるための体験です。",
    accent: "from-sky-100 via-white to-blue-50",
    orb:
      "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(125,211,252,0.35)_38%,rgba(37,99,235,0.12)_72%,transparent_74%)]",
    cta: "ロケーションを開く",
    points: ["スペースを地図で探す", "条件検索で絞り込む", "お気に入りや履歴で再訪しやすい"],
  },
  {
    href: "/match",
    eyebrow: "MATCH",
    title: "マッチ",
    description:
      "位置情報を起点に、近くにいるビジネスマンのプロフィールとハウリングから、今つながれる相手を見つける体験です。",
    accent: "from-amber-100 via-white to-orange-50",
    orb:
      "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.98),rgba(253,186,116,0.42)_34%,rgba(244,114,182,0.16)_72%,transparent_74%)]",
    cta: "マッチを開く",
    points: ["近い人から順にプロフィール表示", "位置からつながれる相手を見つける", "ハウリングを最新順で表示"],
  },
] as const;

export function BizSpotLauncher() {
  return (
    <main className="app-shell px-4 pb-10 pt-[max(env(safe-area-inset-top),24px)]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.28),transparent_38%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.26),transparent_28%),radial-gradient(circle_at_20%_28%,rgba(244,114,182,0.16),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.72)_100%)]" />

      <header className="surface-soft overflow-hidden rounded-[32px] px-5 py-5">
        <div className="absolute right-[-18px] top-[-12px] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.38),rgba(255,255,255,0)_72%)]" />
        <div className="absolute left-[-10px] bottom-[-24px] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22),rgba(255,255,255,0)_72%)]" />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-[24px] border border-white/80 bg-white/88 px-4 py-3 shadow-sm backdrop-blur">
              <BrandLogo />
            </div>
            <span className="rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-white">
              Location / Match
            </span>
          </div>

          <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.06em] text-slate-950 sm:text-[32px]">
            目的に合わせて、
            <br />
            体験を選ぶ
          </h1>

          <p className="mt-3 max-w-[30ch] text-sm leading-7 text-slate-600">
            スペースを探したい時はロケーション、近くの人と位置ベースでつながりたい時はマッチ。トップから分かれて入れるようにしています。
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700">地図で探す</span>
            <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">位置からつながる</span>
            <span className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">ハウリング投稿</span>
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">プロフィール公開</span>
          </div>
        </div>
      </header>

      <section className="mt-5 space-y-4">
        {APP_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`surface-card group relative block overflow-hidden rounded-[36px] bg-gradient-to-br ${card.accent} p-5 transition-transform duration-200 hover:-translate-y-0.5`}
          >
            <div className={`absolute right-[-12px] top-[-18px] h-32 w-32 rounded-full ${card.orb}`} />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-[28ch]">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500">{card.eyebrow}</p>
                  <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.05em] text-slate-950 sm:text-[28px]">{card.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
                <div className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-sm transition group-hover:scale-[1.02]">
                  {card.cta}
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {card.points.map((point) => (
                  <div
                    key={point}
                    className="rounded-[20px] border border-white/75 bg-white/72 px-3 py-3 text-sm font-medium leading-6 text-slate-700 backdrop-blur"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
