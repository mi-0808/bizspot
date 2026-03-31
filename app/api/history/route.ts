import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", session.user.id)
    .order("occurred_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "履歴の取得に失敗しました" }, { status: 500 });
  }

  return NextResponse.json(
    data.map((h) => ({
      id: h.id,
      placeId: h.place_id,
      placeName: h.place_name,
      placeType: h.place_type,
      action: h.action,
      occurredAt: h.occurred_at,
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }

  const { placeId, placeName, placeType, action } = body as Record<string, unknown>;

  if (!placeId || typeof placeId !== "string") {
    return NextResponse.json({ error: "placeId は必須です" }, { status: 400 });
  }
  if (!placeName || typeof placeName !== "string") {
    return NextResponse.json({ error: "placeName は必須です" }, { status: 400 });
  }
  if (action !== "viewed" && action !== "visited") {
    return NextResponse.json({ error: "action は 'viewed' または 'visited' です" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("history").insert({
    user_id: session.user.id,
    place_id: placeId,
    place_name: placeName,
    place_type: typeof placeType === "string" ? placeType : null,
    action,
  });

  if (error) {
    return NextResponse.json({ error: "履歴の保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
