"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { SpaceMarker } from "./SpaceMarker";
import { CategoryLegend } from "./CategoryLegend";
import type { Space } from "@/lib/types/space";

interface Props {
  spaces: Space[];
  selectedSpaceId: string | null;
  onSelectSpace: (space: Space) => void;
  center: { lat: number; lng: number };
  onCenterChanged?: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER = { lat: 35.6812362, lng: 139.7671248 }; // 東京駅

export function MapView({
  spaces,
  selectedSpaceId,
  onSelectSpace,
  center,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-full">
        <Map
          defaultCenter={center ?? DEFAULT_CENTER}
          center={center ?? DEFAULT_CENTER}
          defaultZoom={15}
          mapId="bisspa-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {spaces.map((space) => (
            <SpaceMarker
              key={space.placeId}
              space={space}
              isSelected={space.placeId === selectedSpaceId}
              onClick={onSelectSpace}
            />
          ))}
        </Map>
        <CategoryLegend />
      </div>
    </APIProvider>
  );
}
