"use client";

import type { GoogleReview } from "@/lib/types/space";
import Image from "next/image";

interface Props {
  reviews: GoogleReview[];
}

export function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-400">レビューはまだありません</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">Googleレビュー</p>
      {reviews.map((review, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2">
            {review.profilePhotoUrl && (
              <Image
                src={review.profilePhotoUrl}
                alt={review.authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-xs font-medium text-gray-700">{review.authorName}</span>
            <span className="text-xs text-gray-400 ml-auto">{review.relativeTime}</span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <span
                key={j}
                className={j < review.rating ? "text-yellow-400" : "text-gray-200"}
              >
                ★
              </span>
            ))}
          </div>
          {review.text && (
            <p className="text-xs text-gray-600 line-clamp-3">{review.text}</p>
          )}
        </div>
      ))}
    </div>
  );
}
