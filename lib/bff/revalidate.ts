/**
 * Called after every admin mutation to purge the relevant cache tag.
 * Fire-and-forget: we don't block the UI waiting for this.
 */
export type CacheTag =
  | "settings"
  | "hero"
  | "navigation"
  | "statistics"
  | "courses"
  | "results"
  | "achievements"
  | "gallery"
  | "testimonials"
  | "faculty"
  | "announcements";

export async function revalidateCache(tag: CacheTag): Promise<void> {
  try {
    await fetch(`/api/revalidate?tag=${tag}`, { method: "POST" });
  } catch {
    // Non-critical — cache will expire naturally via TTL
    console.warn(`Cache revalidation failed for tag: ${tag}`);
  }
}
