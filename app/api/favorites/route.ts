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
    .from("favorites")
    .select("*")
    .eq("user_id", session.user.id)
    .order("added_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "お気に入りの取得に失敗しました" }, { status: 500 });
  }

  return NextResponse.json(
    data.map((f) => ({
      id: f.id,
      placeId: f.place_id,
      placeName: f.place_name,
      placeType: f.place_type,
      addedAt: f.added_at,
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

  const { placeId, placeName, placeType } = body as Record<string, unknown>;

  if (!placeId || typeof placeId !== "string") {
    return NextResponse.json({ error: "placeId は必須です" }, { status: 400 });
  }
  if (!placeName || typeof placeName !== "string") {
    return NextResponse.json({ error: "placeName は必須です" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("favorites").upsert(
    {
      user_id: session.user.id,
      place_id: placeId,
      place_name: placeName,
      place_type: typeof placeType === "string" ? placeType : null,
    },
    { onConflict: "user_id,place_id" }
  );

  if (error) {
    return NextResponse.json({ error: "お気に入りの追加に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
