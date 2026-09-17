"use client";

import { useEffect, useState } from "react";
import type { Collection } from "@/types/virtual-tour";
import { CollectionImage } from "@/components/collection/CollectionImage";
import { IconButton } from "@/components/ui/IconButton";
import { getCollectionDisplayTitle } from "@/lib/collection";

type ZoneCollectionsDrawerProps = {
  isOpen: boolean;
  collections: Collection[];
  onSelect: (collectionId: string) => void;
  onClose: () => void;
  /**
   * Fires whenever the drawer's real DOM presence changes — `true` the
   * instant it starts opening, `false` only once the close animation has
   * actually finished and it unmounts. page.tsx uses this (not `isOpen`
   * directly) to decide `suspendInteraction` on the panorama, so the
   * panorama stays frozen for the full closing animation, not just until
   * `isOpen` flips to false.
   */
  onVisibilityChange?: (isVisible: boolean) => void;
};

/** Slide+fade duration — deliberately within the 200-300ms "not springy,
 * not sluggish" range asked for; kept in one place so the CSS transition
 * and the unmount timer below can never drift apart. */
const TRANSITION_MS = 240;

/**
 * The persistent-access half of the zone-collection feature (see
 * ZoneCollectionsChip for the other half, and mock-tour.ts's
 * getZoneCollections for how membership is derived). Tapping an item opens
 * the exact same `CollectionSheet` a physical orange hotspot would, via
 * `onSelect` calling into page.tsx's shared open-collection handler — this
 * component never touches `CollectionSheet` state itself.
 *
 * Deliberately capped well short of full height (`maxHeight: "55%"`) and
 * carries no dark backdrop, matching `CollectionSheet`'s own restraint —
 * the panorama stays visible above it, same as every other sheet in this
 * app. Not a dialog/modal: it's a lightweight, dismissible list, so it
 * skips `CollectionSheet`'s focus-trap/Escape machinery.
 *
 * Open/close animation: a plain slide-up+fade on enter, slide-down+fade on
 * exit (translate-y + opacity, CSS transition only — no animation
 * library, matches this app's existing "no glass/heavy shadow/spring"
 * restraint). `shouldRender` keeps the drawer mounted for the *whole*
 * close animation instead of vanishing instantly the moment `isOpen`
 * turns false: the mount is delayed-unmount, not delayed-render, so
 * `onVisibilityChange(false)` — and therefore the panorama's
 * suspendInteraction release — only fires once the exit transition has
 * actually finished playing.
 *
 * The synchronizing effect below is a genuine external-system sync (CSS
 * transition timing via rAF/setTimeout), not a same-render state
 * derivation, so it stays an effect rather than the render-phase
 * "adjust state when a prop changes" pattern used elsewhere in this
 * codebase (e.g. PanoramaViewer's `trackedIsTransitioning`) — that
 * pattern was tried here first and did not reliably mount the drawer in
 * this app's current Next.js/React version, so this reverts to the
 * straightforward effect form. `setShouldRender(true)`/`setIsEntered(false)`
 * are direct, synchronous calls in the effect body (flagged by
 * `react-hooks/set-state-in-effect`) rather than something to route
 * through the render-phase pattern, precisely because that pattern proved
 * unreliable for this component.
 */
export function ZoneCollectionsDrawer({
  isOpen,
  collections,
  onSelect,
  onClose,
  onVisibilityChange,
}: ZoneCollectionsDrawerProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  // Separate from `shouldRender`: this is the class that actually drives
  // the slide/fade.
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    let frame: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see the doc comment above this component: this drives a CSS transition's mount timing (a real external-system sync), and the render-phase alternative did not work reliably here.
      setShouldRender(true);
      frame = requestAnimationFrame(() => setIsEntered(true));
    } else {
      setIsEntered(false);
      timer = setTimeout(() => setShouldRender(false), TRANSITION_MS);
    }
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    onVisibilityChange?.(shouldRender);
  }, [shouldRender, onVisibilityChange]);

  if (!shouldRender) return null;

  return (
    <div
      role="dialog"
      aria-label="Koleksi di area ini"
      className={`absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[var(--radius-sheet)] bg-sheet shadow-[0_-10px_30px_rgba(18,12,4,0.22)] transition-[transform,opacity] duration-[240ms] ${
        isEntered ? "translate-y-0 opacity-100 ease-out" : "translate-y-6 opacity-0 ease-in"
      }`}
      style={{ maxHeight: "55%" }}
    >
      {/* select-none: this row (title + close) sits directly over the
          panorama's own drag-to-look area — a swipe that starts here
          shouldn't leave a browser text-selection highlight behind. */}
      <div className="flex shrink-0 select-none items-center justify-between px-4 pt-3 pb-2">
        <h2 className="text-sm font-semibold tracking-wide text-ink">
          Koleksi di area ini ({collections.length})
        </h2>
        <IconButton
          label="Tutup"
          onClick={onClose}
          icon={
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </div>

      <ul className="min-h-0 flex-1 select-none overflow-y-auto px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {collections.map((collection) => {
          const title = getCollectionDisplayTitle(collection);
          return (
            <li key={collection.id}>
              <button
                type="button"
                onClick={() => onSelect(collection.id)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-media)] px-2 py-2 text-left hover:bg-parchment"
              >
                <CollectionImage
                  src={collection.coverImage}
                  alt={title}
                  className="h-12 w-12 shrink-0 rounded-[var(--radius-media)]"
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
