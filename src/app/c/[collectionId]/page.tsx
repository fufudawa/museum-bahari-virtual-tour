import { redirect } from "next/navigation";

/**
 * Permanent QR/deep-link entry point — the URL printed on a physical
 * collection's QR sticker, e.g. `/c/COL-14`. Deliberately a thin,
 * server-rendered resolver with NO client JS of its own: it never reads or
 * carries yaw/pitch/sceneId itself (see the architecture rule this route
 * exists under — QR only ever encodes a stable `collectionId`), and it
 * never looks up the collection or its placement either. All of that
 * (resolving `primarySceneId`, pulling yaw/pitch from
 * `DEV_COLLECTION_PLACEMENTS` via `getCollectionPlacement`, and handling an
 * unknown id) lives in exactly one place — `virtual-tour/page.tsx` — so
 * there is no second copy of that resolution logic to drift out of sync.
 * This route's only job is to turn a stable id into the deep-link query
 * param `/virtual-tour` already knows how to read.
 *
 * No 404/`notFound()` here even for an id that doesn't exist: forwarding
 * unconditionally keeps this resolver free of any lookup logic, and
 * `virtual-tour/page.tsx`'s existing `openCollection()` already has a
 * real, tested "not found" state (`CollectionSheet` renders
 * `CollectionNotFound`) for exactly this case — reusing it here rather
 * than inventing a second "collection not found" UI.
 */
export default async function CollectionDeepLinkPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  redirect(`/virtual-tour?collection=${encodeURIComponent(collectionId)}`);
}
