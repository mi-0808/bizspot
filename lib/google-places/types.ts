export interface PlacesNearbyResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  types: string[];
  opening_hours?: { open_now: boolean };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  photos?: { photo_reference: string }[];
}

export interface PlaceDetailsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  types: string[];
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
    periods: {
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }[];
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
    profile_photo_url?: string;
  }[];
  photos?: { photo_reference: string }[];
  formatted_phone_number?: string;
  website?: string;
}

export interface NearbySearchResponse {
  results: PlacesNearbyResult[];
  status: string;
  next_page_token?: string;
}

export interface PlaceDetailsResponse {
  result: PlaceDetailsResult;
  status: string;
}
