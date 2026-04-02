"use client";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MAP_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
  </svg>
);

const HISTORY_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const FAVORITE_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const TABS: Tab[] = [
  { id: "map", label: "マップ", icon: MAP_ICON },
  { id: "history", label: "履歴", icon: HISTORY_ICON },
  { id: "favorites", label: "お気に入り", icon: FAVORITE_ICON },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-4 pb-safe">
      <div className="flex rounded-[30px] border border-sky-100/90 bg-white/98 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 rounded-3xl px-3.5 py-3 transition-all ${
              activeTab === tab.id
                ? "bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] text-blue-700 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="mx-auto flex w-fit flex-col items-center gap-1">
              {tab.icon}
              <span className="text-[11px] font-semibold">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
