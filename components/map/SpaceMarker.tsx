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
      <div className="relative">
        <div
          className={`rounded-full border border-white/90 px-3 py-1.5 shadow-lg transition-all ${
            isSelected ? "scale-105 shadow-blue-200" : ""
          }`}
          style={{
            background: isSelected
              ? "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)"
              : "rgba(255,255,255,0.96)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="max-w-[120px] truncate text-xs font-bold text-slate-800">
              {space.name}
            </span>
          </div>
        </div>
        <Pin
          background={color}
          borderColor={isSelected ? "#2563eb" : "#ffffff"}
          glyphColor="#fff"
          scale={isSelected ? 1.15 : 0.95}
        />
      </div>
    </AdvancedMarker>
  );
}
