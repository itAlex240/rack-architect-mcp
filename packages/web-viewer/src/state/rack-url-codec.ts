import {
  RackProjectSchema,
  type RackProjectInput,
} from '@rack-mcp/core-domain';

const RACK_HASH_PREFIX = 'rack=v1.';

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_');
  let end = encoded.length;
  while (end > 0 && encoded.charCodeAt(end - 1) === 61) {
    end--;
  }
  return encoded.slice(0, end);
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const normalized = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLen);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

/**
 * Encodes a validated `RackProjectInput` into a zero-backend shareable URL hash fragment (`#rack=v1.<base64url>`).
 * Because URL fragments are never sent to HTTP servers, full rack topologies can be shared on static GitHub Pages.
 */
export function encodeRackProjectToHash(projectInput: RackProjectInput): string {
  const parsed = RackProjectSchema.parse(projectInput);
  const json = JSON.stringify(parsed);
  const utf8Bytes = new TextEncoder().encode(json);
  return `#${RACK_HASH_PREFIX}${bytesToBase64Url(utf8Bytes)}`;
}

/**
 * Decodes and validates a `RackProjectInput` from a URL hash fragment (`#rack=v1.<base64url>`) or full URL string.
 * Returns `null` if no `#rack=v1.` payload is present or if Zod schema validation fails.
 */
export function decodeRackProjectFromHash(
  hashOrUrl: string,
): RackProjectInput | null {
  if (!hashOrUrl) return null;
  const hashIdx = hashOrUrl.indexOf('#');
  const rawFragment =
    hashIdx >= 0 ? hashOrUrl.slice(hashIdx + 1) : hashOrUrl.replace(/^#/, '');
  if (!rawFragment) return null;

  const params = rawFragment.split('&');
  const rackParam = params.find((segment) =>
    segment.startsWith(RACK_HASH_PREFIX),
  );
  if (!rackParam) return null;

  const payload = rackParam.slice(RACK_HASH_PREFIX.length).trim();
  if (!payload) return null;

  try {
    const bytes = base64UrlToBytes(payload);
    const jsonText = new TextDecoder().decode(bytes);
    const parsedJson: unknown = JSON.parse(jsonText);
    const validated = RackProjectSchema.safeParse(parsedJson);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}
