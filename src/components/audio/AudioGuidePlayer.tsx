"use client";

import type { Collection } from "@/types/virtual-tour";
import { useAudio } from "@/hooks/useAudio";

type AudioGuidePlayerProps = {
  collection: Collection;
  compact?: boolean;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * F52: `collection.audioUrl` is the one thing that decides which of two
 * renders this shows — never a per-scene/per-collection special case in
 * this component. No `audioUrl` (still true for every collection in
 * `COLLECTION_RECORDS` today) keeps exactly the F3 disabled placeholder —
 * a clickable-yet-inert button is worse than an honestly disabled one.
 * Once any collection gets a real `audioUrl`, this same component renders
 * a real play/pause control against it via `useAudio` — no other file
 * needs to change for that to start working.
 */
export function AudioGuidePlayer({ collection, compact = false }: AudioGuidePlayerProps) {
  const { audioGuideState, play, pause } = useAudio(collection.audioUrl);
  const isPlaying = audioGuideState.status === "playing";
  const size = compact ? "h-8 w-8" : "h-13 w-13";

  if (!collection.audioUrl) {
    return (
      <div className="flex items-center gap-3 opacity-50">
        <button
          type="button"
          disabled
          aria-label="Panduan audio belum tersedia"
          className={`flex ${size} shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-deep text-on-deep`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="h-[3px] rounded-full bg-border">
            <div className="h-full w-0 rounded-full bg-brass" />
          </div>
          <p className="mt-1.5 text-[11px] text-ink-muted">Panduan audio segera hadir</p>
        </div>
      </div>
    );
  }

  const progress = audioGuideState.duration > 0 ? audioGuideState.currentTime / audioGuideState.duration : 0;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={isPlaying ? pause : play}
        aria-label={isPlaying ? "Jeda panduan audio" : "Putar panduan audio"}
        className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-deep text-on-deep active:scale-95`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          {isPlaying ? (
            <>
              <rect x="7" y="5" width="3.4" height="14" rx="1" fill="currentColor" />
              <rect x="13.6" y="5" width="3.4" height="14" rx="1" fill="currentColor" />
            </>
          ) : (
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          )}
        </svg>
      </button>
      <div className="flex-1">
        <div className="h-[3px] rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brass"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-ink-muted">
          {formatTime(audioGuideState.currentTime)} / {formatTime(audioGuideState.duration)}
        </p>
      </div>
    </div>
  );
}
