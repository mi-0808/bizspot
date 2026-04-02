import { NextRequest, NextResponse } from "next/server";
import { fetchNearbySpaces } from "@/lib/google-places/client";
import { filterSpaces } from "@/lib/utils/filterSpaces";
import type { FilterState } from "@/lib/types/filters";
import { DEFAULT_FILTERS } from "@/lib/types/filters";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = parseInt(searchParams.get("radius") ?? "1500", 10);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "lat と lng は必須です" },
      { status: 400 }
    );
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json(
      { error: "無効な座標です" },
      { status: 400 }
    );
  }

  if (radius < 1 || radius > 50000) {
    return NextResponse.json(
      { error: "radius は 1〜50000 の範囲で指定してください" },
      { status: 400 }
    );
  }

  // クエリパラメータからフィルターを復元
  const filters: FilterState = {
    ...DEFAULT_FILTERS,
    openNow: searchParams.get("openNow") === "true",
    startTime: searchParams.get("startTime") ?? "",
    endTime: searchParams.get("endTime") ?? "",
    purposes: (searchParams.get("purposes") ?? "").split(",").filter(Boolean) as FilterState["purposes"],
    prices: (searchParams.get("prices") ?? "").split(",").filter(Boolean) as FilterState["prices"],
  };

  try {
    const spaces = await fetchNearbySpaces(lat, lng, radius);
    const filtered = filterSpaces(spaces, filters);
    return NextResponse.json(filtered);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/places/nearby]", message, err);
    return NextResponse.json(
      { error: `スペースの取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
