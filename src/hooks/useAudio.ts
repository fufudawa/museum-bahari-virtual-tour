"use client";

/**
 * F52: implements the audio-guide playback this hook's signature was
 * always reserved for (see the prior stub's comment — "F1 stub... F5 will
 * own the dual audio graph"). This pass only wires up the audio-GUIDE half
 * (play/pause/restart/seek/state against a real `<audio>` element) for a
 * single collection's `audioUrl`; the ambience-ducking/mixing behavior
 * mentioned in that original comment is still out of scope here.
 *
 * No `audioUrl` (the current state for every collection in
 * `COLLECTION_RECORDS` — F4 never fabricated one) means no `<audio>`
 * element is ever created and every control is a no-op returning the same
 * static idle state as before: this must stay silent/inert, never attempt
 * a network request or throw, so `AudioGuidePlayer` can render its
 * existing disabled "coming soon" state exactly as it already did.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { AudioGuideState } from "@/types/virtual-tour";

export type UseAudioResult = {
  audioGuideState: AudioGuideState;
  play: () => void;
  pause: () => void;
  restart: () => void;
  seek: (seconds: number) => void;
};

const IDLE_STATE: AudioGuideState = { status: "idle", currentTime: 0, duration: 0 };

export function useAudio(audioUrl?: string): UseAudioResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioGuideState, setAudioGuideState] = useState<AudioGuideState>(IDLE_STATE);

  // (Re)creates the element only when the URL itself changes — not on
  // every render — and tears down its listeners/element on cleanup so
  // switching between two collections (or back to one with no audio)
  // never leaks a previous `<audio>` still firing events into state.
  useEffect(() => {
    // No `<audio>` element is created at all — the returned
    // `audioGuideState` below overrides to `IDLE_STATE` unconditionally
    // whenever there's no URL, so any state left over from a previous
    // `audioUrl` is simply never surfaced (no setState needed here).
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setAudioGuideState((prev) => ({ ...prev, duration: audio.duration || 0 }));
    };
    const handleTimeUpdate = () => {
      setAudioGuideState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };
    const handlePlay = () => {
      setAudioGuideState((prev) => ({ ...prev, status: "playing" }));
    };
    const handlePause = () => {
      // `ended` also fires a native `pause` first — the `ended` handler
      // below overrides this with the more specific status right after,
      // so a real user-initiated pause is the only case this leaves as
      // "paused".
      setAudioGuideState((prev) => (prev.status === "ended" ? prev : { ...prev, status: "paused" }));
    };
    const handleEnded = () => {
      setAudioGuideState((prev) => ({ ...prev, status: "ended" }));
    };
    // A bad/missing audio file must not surface as an app error — this
    // stays a silent no-op state, same contract as "no audioUrl at all".
    const handleError = () => {
      setAudioGuideState(IDLE_STATE);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
  }, [audioUrl]);

  const play = useCallback(() => {
    // `.play()` rejects if the browser blocks autoplay/the source is
    // invalid — swallowed deliberately (same "never throw into the app"
    // contract as `handleError` above), not left as an unhandled rejection.
    audioRef.current?.play().catch(() => {
      setAudioGuideState(IDLE_STATE);
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {
      setAudioGuideState(IDLE_STATE);
    });
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
  }, []);

  return { audioGuideState: audioUrl ? audioGuideState : IDLE_STATE, play, pause, restart, seek };
}
