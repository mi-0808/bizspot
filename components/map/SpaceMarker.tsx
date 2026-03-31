"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { CATEGORY_COLORS } from "@/lib/utils/categoryColors";
import type { Space } from "@/lib/types/space";

interface Props {
  space: Space;
  isSelected: boolean;
  onClick: (space: Space) => void;
}

export function SpaceMarker({ space, isSelected, onClick }: Props) {
  const color = CATEGORY_COLORS[space.category];

  return (
    <AdvancedMarker
      position={{ lat: space.lat, lng: space.lng }}
      onClick={() => onClick(space)}
      title={space.name}
      zIndex={isSelected ? 100 : 1}
    >
      <Pin
        background={color}
        borderColor={isSelected ? "#1d4ed8" : "#fff"}
        glyphColor="#fff"
        scale={isSelected ? 1.3 : 1}
      />
    </AdvancedMarker>
  );
}
