/**
 * R2 / CDN origin for images (no trailing slash).
 * Set PUBLIC_ASSETS_URL, or CLOUDFLARE_R2_PUBLIC_URL (wired in astro.config), or it falls back to assets.huntermussel.com.
 */
export const ASSETS_BASE_URL = (
  import.meta.env.PUBLIC_ASSETS_URL as string | undefined
)?.replace(/\/$/, "") || "https://assets.huntermussel.com";

/** Absolute URL for a site asset path, or pass through full URLs. */
export function assetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${ASSETS_BASE_URL}${normalized}`;
}
