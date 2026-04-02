import { NextRequest, NextResponse } from "next/server";
import { fetchPlaceDetails } from "@/lib/google-places/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;

  if (!placeId || typeof placeId !== "string") {
    return NextResponse.json({ error: "placeId は必須です" }, { status: 400 });
  }

  try {
    const detail = await fetchPlaceDetails(placeId);

    // Supabase から平均スコアを取得
    const supabase = await createClient();
    const { data: scores } = await supabase
      .from("space_score_averages")
      .select("*")
      .eq("place_id", placeId)
      .single();

    if (scores) {
      detail.scores = {
        scoreCount: scores.score_count,
        avgQuietness: scores.avg_quietness,
        avgWifiQuality: scores.avg_wifi_quality,
        avgPowerOutlet: scores.avg_power_outlet,
        avgCongestion: scores.avg_congestion,
        avgPriceScore: scores.avg_price_score,
        avgStayFriendly: scores.avg_stay_friendly,
      };
    }

    return NextResponse.json(detail);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[/api/places/${placeId}]`, message, err);
    return NextResponse.json(
      { error: `スペース詳細の取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
