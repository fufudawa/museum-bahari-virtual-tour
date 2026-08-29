"use client";

import { useState } from "react";

type CollectionImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Renders a collection's `coverImage`/`detailImage`; on load failure,
 * falls back to the same abstract placeholder treatment used throughout
 * Hi-Fi Design v1.0 (a quiet ship-motif mark on a deep gradient) instead
 * of a broken-image icon or a raw browser error. Shared by CollectionPeek
 * and CollectionDetail so neither hardcodes an image URL or duplicates
 * the fallback logic.
 */
export function CollectionImage({ src, alt, className = "" }: CollectionImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-deep text-brass-soft ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg viewBox="0 0 64 44" className="h-8 w-12" aria-hidden="true">
          <path
            d="M4 34c6 6 50 6 56 0"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <path d="M18 34V10M40 34V6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          <path d="M18 12l14 6-14 4z" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M40 8l12 8-12 6z" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
          <path
            d="M6 34l6-10h34l8 10z"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- collection photos are runtime data (mock today, Supabase Storage later), not build-time static assets next/image expects
    <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} />
  );
}
