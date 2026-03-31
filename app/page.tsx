"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MapView } from "@/components/map/MapView";
import { SpaceCard } from "@/components/space/SpaceCard";
import { SpaceDetailSheet } from "@/components/space/SpaceDetailSheet";
import { SearchPanel } from "@/components/search/SearchPanel";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HistoryList } from "@/components/history/HistoryList";
import { FavoritesList } from "@/components/favorites/FavoritesList";
import { SignInButton } from "@/components/auth/SignInButton";
import { useCurrentLocation } from "@/lib/hooks/useCurrentLocation";
import { useNearbySpaces } from "@/lib/hooks/useNearbySpaces";
import { useFilters } from "@/lib/hooks/useFilters";
import { filterSpaces } from "@/lib/utils/filterSpaces";
import type { Space } from "@/lib/types/space";

const DEFAULT_CENTER = { lat: 35.6812362, lng: 139.7671248 };

export default function HomePage() {
  const { data: session } = useSession();
  const { lat, lng, loading: locationLoading, error: locationError, getCurrentLocation } =
    useCurrentLocation();
  const center = lat && lng ? { lat, lng } : DEFAULT_CENTER;

  const { spaces, loading: spacesLoading } = useNearbySpaces(lat, lng);
  const {
    filters,
    togglePurpose,
    togglePrice,
    setOpenNow,
    setStartTime,
    setEndTime,
    resetFilters,
    hasActiveFilters,
  } = useFilters();

  const filteredSpaces = filterSpaces(spaces, filters);

  const [activeTab, setActiveTab] = useState("map");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [detailPlaceId, setDetailPlaceId] = useState<string | null>(null);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [needAuthModal, setNeedAuthModal] = useState(false);

  // 初回マウント時に位置情報を取得
  useEffect(() => {
    getCurrentLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSpace = useCallback((space: Space) => {
    setSelectedSpace(space);
  }, []);

  const handleViewDetail = useCallback((placeId: string) => {
    setDetailPlaceId(placeId);
    setSelectedSpace(null);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSelectedSpace(null);
    setDetailPlaceId(null);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-100">
      <Header />

      {/* メインコンテンツ */}
      {activeTab === "map" && (
        <div className="absolute inset-0 pt-14 pb-16">
          <MapView
            spaces={filteredSpaces}
            selectedSpaceId={selectedSpace?.placeId ?? null}
            onSelectSpace={handleSelectSpace}
            center={center}
          />

          {/* ローディング・エラー表示 */}
          {(locationLoading || spacesLoading) && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow text-xs text-gray-600 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              {locationLoading ? "現在地を取得中..." : "スペースを検索中..."}
            </div>
          )}

          {locationError && (
            <div className="absolute top-20 left-3 right-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-4 py-2 rounded-xl">
              {locationError}
            </div>
          )}

          {/* 現在地ボタン */}
          <button
            type="button"
            onClick={getCurrentLocation}
            className="absolute bottom-24 left-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="現在地に移動"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </button>

          {/* 条件検索ボタン */}
          <button
            type="button"
            onClick={() => setSearchPanelOpen(true)}
            className={`absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-sm font-medium transition-colors z-10 ${
              hasActiveFilters
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            条件で絞り込む
            {hasActiveFilters && (
              <span className="ml-1 bg-white text-blue-600 rounded-full px-1.5 text-xs font-bold">
                {filteredSpaces.length}
              </span>
            )}
          </button>

          {/* スペースカード（ピン選択時） */}
          {selectedSpace && !detailPlaceId && (
            <SpaceCard
              space={selectedSpace}
              onViewDetail={handleViewDetail}
              onClose={() => setSelectedSpace(null)}
            />
          )}
        </div>
      )}

      {/* 履歴タブ */}
      {activeTab === "history" && (
        <div className="absolute inset-0 pt-14 pb-16 overflow-y-auto bg-white">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">閲覧・訪問履歴</h2>
          </div>
          {session?.user ? (
            <HistoryList onSelectSpace={(id) => { handleViewDetail(id); setActiveTab("map"); }} />
          ) : (
            <div className="text-center py-16 px-5">
              <p className="text-gray-500 text-sm mb-4">履歴を見るにはログインが必要です</p>
              <SignInButton />
            </div>
          )}
        </div>
      )}

      {/* お気に入りタブ */}
      {activeTab === "favorites" && (
        <div className="absolute inset-0 pt-14 pb-16 overflow-y-auto bg-white">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">お気に入り</h2>
          </div>
          {session?.user ? (
            <FavoritesList onSelectSpace={(id) => { handleViewDetail(id); setActiveTab("map"); }} />
          ) : (
            <div className="text-center py-16 px-5">
              <p className="text-gray-500 text-sm mb-4">お気に入りを見るにはログインが必要です</p>
              <SignInButton />
            </div>
          )}
        </div>
      )}

      {/* 検索パネル */}
      <SearchPanel
        isOpen={searchPanelOpen}
        onClose={() => setSearchPanelOpen(false)}
        filters={filters}
        onTogglePurpose={togglePurpose}
        onTogglePrice={togglePrice}
        onSetOpenNow={setOpenNow}
        onSetStartTime={setStartTime}
        onSetEndTime={setEndTime}
        onReset={resetFilters}
        resultCount={filteredSpaces.length}
      />

      {/* スペース詳細シート */}
      {detailPlaceId && (
        <SpaceDetailSheet
          placeId={detailPlaceId}
          onClose={() => setDetailPlaceId(null)}
          onNeedAuth={() => setNeedAuthModal(true)}
        />
      )}

      {/* 認証モーダル */}
      {needAuthModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setNeedAuthModal(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">ログインが必要です</h3>
            <p className="text-sm text-gray-500 mb-6">
              お気に入りや評価の投稿にはログインが必要です
            </p>
            <SignInButton
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
              label="Googleでログイン"
            />
            <button
              type="button"
              onClick={() => setNeedAuthModal(false)}
              className="mt-3 w-full py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              キャンセル
            </button>
          </div>
        </>
      )}

      {/* ボトムナビ */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
