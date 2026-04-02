import { NextRequest } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? "";

export async function GET(request: NextRequest) {
  const photoRef = request.nextUrl.searchParams.get("ref");

  if (!photoRef) {
    return new Response("photo reference is required", { status: 400 });
  }

  if (!API_KEY) {
    return new Response("Google Places API key is not configured", { status: 500 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("maxwidth", "1200");
  url.searchParams.set("photo_reference", photoRef);
  url.searchParams.set("key", API_KEY);

  const response = await fetch(url.toString(), {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return new Response("failed to fetch photo", { status: response.status });
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = await response.arrayBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
