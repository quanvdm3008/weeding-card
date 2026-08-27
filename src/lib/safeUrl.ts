const PARSE_BASE = "https://wedding-card.invalid";
const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const SAFE_MEDIA_PROTOCOLS = new Set(["http:", "https:", "blob:"]);
const SAFE_RASTER_DATA_URL = /^data:image\/(?:png|jpeg|gif|webp);base64,[a-z0-9+/=\s]+$/i;

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function safeLinkUrl(value: unknown): string | undefined {
  const raw = asNonEmptyString(value);
  if (!raw) return undefined;
  try {
    const parsed = new URL(raw, PARSE_BASE);
    return SAFE_LINK_PROTOCOLS.has(parsed.protocol) ? raw : undefined;
  } catch {
    return undefined;
  }
}

export function safeMediaUrl(value: unknown): string | undefined {
  const raw = asNonEmptyString(value);
  if (!raw) return undefined;
  if (SAFE_RASTER_DATA_URL.test(raw)) return raw;
  try {
    const parsed = new URL(raw, PARSE_BASE);
    return SAFE_MEDIA_PROTOCOLS.has(parsed.protocol) ? raw : undefined;
  } catch {
    return undefined;
  }
}
