"use client";

/**
 * Background ambience for the whole `/virtual-tour` session — a single
 * looping `<audio>` element created once and left alone across every scene
 * change. Deliberately a separate hook/file from `useAudio.ts`: that hook
 * owns the per-collection audio GUIDE (`Collection.audioUrl`, played from
 * inside `CollectionSheet`), a fully independent concern this hook must
 * never touch or coordinate with (no ducking/mixing — out of scope here,
 * same as `AmbienceController`'s original stub noted).
 *
 * Mounted once at the `virtual-tour/page.tsx` level (not per-room/per-
 * `PanoramaViewer`), so scene navigation (`currentRoomId` changing as the
 * visitor moves S01->S32) never re-runs this hook's effect and never
 * recreates or restarts the element — the effect's dependency array is
 * `[url]` only, and `url` is a fixed prop the caller passes once.
 *
 * Autoplay: no bypass attempted. The mount-time `.play()` call below
 * either succeeds (Chrome's "sticky user activation" from the visitor's
 * own prior tap on the homepage's "Masuk" link — a real `<Link>` click —
 * persists across this client-side route change, since it's the same
 * Document/top-level browsing context the whole time, not a full reload)
 * or is silently rejected by the browser (no prior gesture, e.g. a direct
 * URL load) — swallowed exactly like `useAudio.ts`'s own `play()` does,
 * never surfaced as an app error. Either way, `isPlaying` (driven by the
 * element's own `play`/`pause` events, not an assumed/optimistic flag)
 * reflects reality: it starts `false` and only flips `true` once sound is
 * actually audible. The room-controls speaker button's `toggle()` is a
 * second, always-available real click handler — the "atau tombol ambience
 * pertama kali" path — that starts playback for a visitor whose first
 * gesture on this page IS that tap.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const AMBIENCE_VOLUME = 0.25;

export type UseAmbienceResult = {
  /** True only once the element is genuinely producing sound. */
  isPlaying: boolean;
  /** Real play/pause of the one ambience element — never recreates it. */
  toggle: () => void;
  /**
   * QR/deep-link audio-entry prompt support: an explicit `play()` that
   * resolves to whether playback genuinely started, instead of the
   * silently-swallowed fire-and-forget the mount-time attempt and
   * `toggle()` both use. A caller that needs to know for certain (e.g. only
   * dismiss a UI prompt once sound is *actually* audible, never
   * optimistically) calls this from its own real click handler — same
   * `audio.play()` call, same browser gesture requirement, no bypass —
   * and awaits the result instead of assuming success.
   */
  play: () => Promise<boolean>;
};

export function useAmbience(url: string): UseAmbienceResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = AMBIENCE_VOLUME;
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Best-effort only — see the module doc comment above for why this can
    // legitimately succeed (sticky activation carried over from "Masuk")
    // without this being an autoplay-policy bypass.
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audioRef.current = null;
    };
  }, [url]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const play = useCallback((): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve(false);
    return audio
      .play()
      .then(() => true)
      .catch(() => false);
  }, []);

  return { isPlaying, toggle, play };
}
