"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Collection, CollectionSheetState } from "@/types/virtual-tour";
import { CollectionPeek } from "./CollectionPeek";
import { CollectionDetail } from "./CollectionDetail";
import { Transcript } from "./Transcript";
import { CollectionNotFound } from "./CollectionNotFound";
import { getCollectionDisplayTitle } from "@/lib/collection";

type CollectionSheetProps = {
  state: CollectionSheetState;
  collection: Collection | null;
  onExpand: () => void;
  onClose: () => void;
  onOpenTranscript: () => void;
  onCollapseTranscript: () => void;
};

/** Minimum vertical drag distance, in px, before a swipe counts as intentional. */
const SWIPE_THRESHOLD_PX = 48;

/**
 * Owns which of peek / full / transcript renders — never a fourth state.
 * "closed" renders nothing; the panorama stays fully visible, matching
 * the locked wireframe rule that the room is always visible behind the
 * sheet in every open state. A resolved-but-missing `collection` (state
 * open, lookup failed) renders `CollectionNotFound` instead of silently
 * closing — see virtual-tour/page.tsx's `handleHotspotActivate`.
 *
 * F3 additions: dialog semantics (role, focus management, Escape-to-close)
 * and a swipe gesture anchored on the drag handle — swipe up expands from
 * peek, swipe down closes from either open state. The handle is
 * deliberately the *only* drag zone (not the whole card): it keeps this
 * gesture simple (no need to distinguish a drag from a tap on interactive
 * content underneath) and matches the "clear drag handle" requirement
 * directly, without touching CollectionPeek/CollectionDetail's own tap
 * targets at all.
 */
export function CollectionSheet({
  state,
  collection,
  onExpand,
  onClose,
  onOpenTranscript,
  onCollapseTranscript,
}: CollectionSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const dragStartYRef = useRef<number | null>(null);

  const isOpen = state !== "closed";

  // Move focus into the sheet when it opens; restore whatever had focus
  // before (typically the hotspot button that opened it) when it closes.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      sheetRef.current?.focus();
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [isOpen]);

  // Desktop convenience, as requested: Escape closes the sheet.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  function handleDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    dragStartYRef.current = event.clientY;
  }

  function handleDragEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const startY = dragStartYRef.current;
    dragStartYRef.current = null;
    if (startY === null) return;
    const deltaY = event.clientY - startY;

    if (state === "peek") {
      if (deltaY <= -SWIPE_THRESHOLD_PX) onExpand();
      else if (deltaY >= SWIPE_THRESHOLD_PX) onClose();
    } else if (state === "full") {
      if (deltaY >= SWIPE_THRESHOLD_PX) onClose();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label={collection ? getCollectionDisplayTitle(collection) : "Koleksi"}
      tabIndex={-1}
      className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[var(--radius-sheet)] bg-sheet shadow-[0_-10px_30px_rgba(18,12,4,0.22)] outline-none"
      style={{ maxHeight: state === "peek" ? "34%" : "91%" }}
    >
      <div
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerCancel={() => {
          dragStartYRef.current = null;
        }}
        className="flex shrink-0 touch-none items-center justify-center py-2.5"
        aria-hidden="true"
      >
        <span className="h-1 w-9 rounded-full bg-brass-line/60" />
      </div>

      {!collection && <CollectionNotFound onClose={onClose} />}

      {collection && state === "peek" && (
        <CollectionPeek collection={collection} onExpand={onExpand} onClose={onClose} />
      )}
      {collection && state === "full" && (
        <CollectionDetail collection={collection} onClose={onClose} onOpenTranscript={onOpenTranscript} />
      )}
      {collection && state === "transcript" && (
        <Transcript collection={collection} onCollapse={onCollapseTranscript} />
      )}
    </div>
  );
}
