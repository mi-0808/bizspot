import type {
  NearbySearchResponse,
  PlaceDetailsResponse,
  PlacesNearbyResult,
} from "./types";
import type { Space, SpaceDetail, GoogleReview } from "@/lib/types/space";
import {
  placeTypesToCategory,
  isRentalSpace,
} from "@/lib/utils/categoryColors";

const PLACES_BASE = "https://maps.googleapis.com/maps/api/place";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

// 検索対象のスペースタイプ
const SEARCH_TYPES = ["cafe", "restaurant", "library"] as const;
const COWORKING_KEYWORD = "コワーキング コワーキングスペース";
const RENTAL_KEYWORD = "レンタルスペース 貸し会議室";

export async function fetchNearbySpaces(
  lat: number,
  lng: number,
  radius = 1500
): Promise<Space[]> {
  const location = `${lat},${lng}`;

  // 並列でリクエスト
  const requests = [
    ...SEARCH_TYPES.map((type) =>
      fetchNearbyByType(location, radius, type)
    ),
    fetchNearbyByKeyword(location, radius, COWORKING_KEYWORD),
    fetchNearbyByKeyword(location, radius, RENTAL_KEYWORD),
  ];

  const results = await Promise.allSettled(requests);
  const allPlaces: PlacesNearbyResult[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      allPlaces.push(...result.value);
    }
  }

  // place_id で重複除去
  const seen = new Set<string>();
  const unique = allPlaces.filter((p) => {
    if (seen.has(p.place_id)) return false;
    seen.add(p.place_id);
    return true;
  });

  return unique.map(normalizePlace);
}

async function fetchNearbyByType(
  location: string,
  radius: number,
  type: string
): Promise<PlacesNearbyResult[]> {
  const url = new URL(`${PLACES_BASE}/nearbysearch/json`);
  url.searchParams.set("location", location);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("type", type);
  url.searchParams.set("language", "ja");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  const data: NearbySearchResponse = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Places API status: ${data.status}`);
  }
  return data.results;
}

async function fetchNearbyByKeyword(
  location: string,
  radius: number,
  keyword: string
): Promise<PlacesNearbyResult[]> {
  const url = new URL(`${PLACES_BASE}/nearbysearch/json`);
  url.searchParams.set("location", location);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("language", "ja");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  const data: NearbySearchResponse = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Places API status: ${data.status}`);
  }
  return data.results;
}

export async function fetchPlaceDetails(placeId: string): Promise<SpaceDetail> {
  const url = new URL(`${PLACES_BASE}/details/json`);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "place_id,name,formatted_address,geometry,types,opening_hours,rating,user_ratings_total,price_level,reviews,photos,formatted_phone_number,website"
  );
  url.searchParams.set("language", "ja");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Places Details API error: ${res.status}`);
  const data: PlaceDetailsResponse = await res.json();
  if (data.status !== "OK") {
    throw new Error(`Places Details API status: ${data.status}`);
  }

  const p = data.result;
  const category = isRentalSpace(p.name)
    ? "rental_space"
    : placeTypesToCategory(p.types);

  const reviews: GoogleReview[] = (p.reviews ?? []).map((r) => ({
    authorName: r.author_name,
    rating: r.rating,
    text: r.text,
    relativeTime: r.relative_time_description,
    profilePhotoUrl: r.profile_photo_url,
  }));

  return {
    placeId: p.place_id,
    name: p.name,
    address: p.formatted_address,
    lat: p.geometry.location.lat,
    lng: p.geometry.location.lng,
    category,
    isOpen: p.opening_hours?.open_now ?? null,
    openingHours: p.opening_hours?.weekday_text,
    rating: p.rating,
    ratingCount: p.user_ratings_total,
    priceLevel: p.price_level,
    photoReference: p.photos?.[0]?.photo_reference,
    phoneNumber: p.formatted_phone_number,
    website: p.website,
    reviews,
    scores: null,
    userScore: null,
  };
}

function normalizePlace(p: PlacesNearbyResult): Space {
  const category = isRentalSpace(p.name)
    ? "rental_space"
    : placeTypesToCategory(p.types);

  return {
    placeId: p.place_id,
    name: p.name,
    address: p.vicinity,
    lat: p.geometry.location.lat,
    lng: p.geometry.location.lng,
    category,
    isOpen: p.opening_hours?.open_now ?? null,
    rating: p.rating,
    ratingCount: p.user_ratings_total,
    priceLevel: p.price_level,
    photoReference: p.photos?.[0]?.photo_reference,
  };
}
