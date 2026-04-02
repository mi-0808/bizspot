"use client";

import { useState, useCallback } from "react";

interface LocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useCurrentLocation() {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "位置情報がサポートされていません" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "位置情報へのアクセスが拒否されました",
          2: "位置情報の取得に失敗しました",
          3: "位置情報の取得がタイムアウトしました",
        };
        setState((s) => ({
          ...s,
          error: messages[err.code] ?? "位置情報の取得に失敗しました",
          loading: false,
        }));
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, getCurrentLocation };
}
