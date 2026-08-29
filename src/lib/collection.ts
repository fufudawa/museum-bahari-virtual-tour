import type { Collection } from "@/types/virtual-tour";

/**
 * Prefers curator-approved metadata once it exists; falls back to the
 * development title until then. `officialName` is always `undefined` in
 * the current prototype (F4) — nothing fabricates it — so today this
 * always resolves to `title`, but every call site already reads through
 * this function rather than `collection.title` directly, so nothing
 * downstream needs to change the day real metadata lands.
 */
export function getCollectionDisplayTitle(collection: Collection): string {
  return collection.officialName ?? collection.title;
}

/**
 * Same preference order for the description: curator-approved text first,
 * then the development description, `undefined` if neither exists.
 * Callers must handle the `undefined` case explicitly (hide the block, or
 * show a neutral "awaiting curator validation" note) — never invent text
 * here.
 */
export function getCollectionDisplayDescription(collection: Collection): string | undefined {
  return collection.officialDescription ?? collection.description;
}
