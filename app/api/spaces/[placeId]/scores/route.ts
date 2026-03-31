import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;

  const supabase = await createClient();

  const { data: averages } = await supabase
    .from("space_score_averages")
    .select("*")
    .eq("place_id", placeId)
    .single();

  const session = await auth();
  let userScore = null;

  if (session?.user?.id) {
    const { data } = await supabase
      .from("space_scores")
      .select("*")
      .eq("place_id", placeId)
      .eq("user_id", session.user.id)
      .single();
    userScore = data;
  }

  return NextResponse.json({ averages, userScore });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const { placeId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }

  const { quietness, wifiQuality, powerOutlet, congestion, priceScore, stayFriendly, note } =
    body as Record<string, unknown>;

  // バリデーション
  const scores = { quietness, wifiQuality: wifiQuality, powerOutlet, congestion, priceScore, stayFriendly };
  for (const [key, val] of Object.entries(scores)) {
    if (val !== undefined && (typeof val !== "number" || val < 1 || val > 5)) {
      return NextResponse.json(
        { error: `${key} は 1〜5 の数値で指定してください` },
        { status: 400 }
      );
    }
  }

  const supabase = await createClient();

  const { error } = await supabase.from("space_scores").upsert(
    {
      place_id: placeId,
      user_id: session.user.id,
      quietness: quietness ?? null,
      wifi_quality: wifiQuality ?? null,
      power_outlet: powerOutlet ?? null,
      congestion: congestion ?? null,
      price_score: priceScore ?? null,
      stay_friendly: stayFriendly ?? null,
      note: typeof note === "string" ? note : null,
    },
    { onConflict: "place_id,user_id" }
  );

  if (error) {
    console.error("[POST /api/spaces/scores]", error);
    return NextResponse.json({ error: "スコアの保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
