export type SpaceCategory =
  | "cafe"
  | "fast_food"
  | "rental_space"
  | "coworking"
  | "library";

export interface Space {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: SpaceCategory;
  isOpen: boolean | null;
  openingHours?: string[];
  rating?: number;
  ratingCount?: number;
  priceLevel?: number; // 0-4 (Google Places)
  photoReference?: string;
}

export interface SpaceDetail extends Space {
  reviews: GoogleReview[];
  scores: SpaceScoreAverages | null;
  userScore: SpaceScore | null;
  phoneNumber?: string;
  website?: string;
}

export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl?: string;
}

export interface SpaceScore {
  quietness: number;      // 静粛性 1-5
  wifiQuality: number;    // Wi-Fi品質 1-5
  powerOutlet: number;    // 電源の有無 1-5
  congestion: number;     // 混雑度 1-5
  priceScore: number;     // 料金 1-5
  stayFriendly: number;   // 長居しやすさ 1-5
  note?: string;
}

export interface SpaceScoreAverages {
  scoreCount: number;
  avgQuietness: number;
  avgWifiQuality: number;
  avgPowerOutlet: number;
  avgCongestion: number;
  avgPriceScore: number;
  avgStayFriendly: number;
}
