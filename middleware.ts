import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 認証が必要なAPIルート
const PROTECTED_API_PATTERNS = [
  /^\/api\/favorites/,
  /^\/api\/history/,
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 保護されたAPIへの未認証リクエストを拒否
  if (PROTECTED_API_PATTERNS.some((pattern) => pattern.test(pathname))) {
    if (!req.auth) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }
  }

  // POST /api/spaces/[placeId]/scores も認証必須
  if (
    pathname.match(/^\/api\/spaces\/[^/]+\/scores$/) &&
    req.method === "POST"
  ) {
    if (!req.auth) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/api/favorites/:path*", "/api/history/:path*", "/api/spaces/:path*/scores"],
};
