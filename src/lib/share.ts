import { blankProfile } from "../types";
import type { BusinessProfile, Quote } from "../types";

/**
 * Shareable quote links.
 * The quote AND the business profile are serialized as JSON, then
 * base64url-encoded into the URL hash:
 *   https://example.com/#q=<base64url>
 * No server involved — anyone opening the link sees the read-only quote.
 */

export interface SharedPayload {
  quote: Quote;
  biz: BusinessProfile;
}

function toBase64Url(json: string): string {
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  return decodeURIComponent(escape(atob(b64)));
}

/** Build the full share URL for a quote, given the app's base URL. */
export function encodeShareLink(q: Quote, biz: BusinessProfile, baseUrl: string): string {
  const payload: SharedPayload = { quote: q, biz };
  const encoded = toBase64Url(JSON.stringify(payload));
  const base = baseUrl.replace(/#.*$/, "");
  return `${base}#q=${encoded}`;
}

/** Decode a `#q=...` hash. Returns null when the hash is absent or invalid. */
export function decodeShareHash(hash: string): SharedPayload | null {
  try {
    const m = /^#q=(.+)$/.exec(hash.trim());
    if (!m) return null;
    const raw = JSON.parse(fromBase64Url(m[1])) as SharedPayload;
    if (!raw || typeof raw !== "object") return null;
    const quote = raw.quote as Quote;
    if (!quote || typeof quote !== "object" || !Array.isArray(quote.materials)) return null;
    const biz: BusinessProfile = {
      ...blankProfile(),
      ...(raw.biz && typeof raw.biz === "object" ? raw.biz : {}),
    };
    return { quote, biz };
  } catch {
    return null;
  }
}
