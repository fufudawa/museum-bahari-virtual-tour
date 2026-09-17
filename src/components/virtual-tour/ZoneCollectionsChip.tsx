type ZoneCollectionsChipProps = {
  count: number;
  onClick: () => void;
};

/**
 * Persistent zone-collection access affordance (client request) — separate
 * from the physical orange `CollectionHotspot` markers, which stay exactly
 * as-is. This chip never disappears/changes on a scene change within the
 * same zone, and its badge count updates only when the active zone itself
 * changes (see page.tsx). Fixed top-center, clear of RoomControls' exit
 * (top-left) and ambience toggle (top-right) — the only other persistent
 * chrome over the panorama.
 *
 * Renders nothing when there's nothing to show (e.g. a scene outside both
 * zones), so it never occupies space with a meaningless "0".
 */
export function ZoneCollectionsChip({ count, onClick }: ZoneCollectionsChipProps) {
  if (count <= 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center p-4">
      <button
        type="button"
        onClick={onClick}
        aria-label={`Lihat ${count} koleksi di area ini`}
        className="pointer-events-auto flex h-9 items-center gap-2 rounded-full border border-white/25 bg-deep/40 pl-2.5 pr-3 text-sm font-semibold tracking-wide text-on-deep backdrop-blur-sm transition-colors hover:bg-deep/60"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brass text-ink" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
        </span>
        {count}
      </button>
    </div>
  );
}
