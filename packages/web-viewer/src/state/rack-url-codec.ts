import {
  RackProjectSchema,
  type RackProjectInput,
} from '@rack-mcp/core-domain';

const RACK_HASH_PREFIX = 'rack=v1.';
const RACK_COMPRESSED_HASH_PREFIX = 'rack=v2.';
const MAX_DECOMPRESSED_BYTES = 256 * 1024;

function toExactArrayBufferUint8Array(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

async function readStreamBytesWithCap(
  readable: ReadableStream<Uint8Array>,
  maxBytes: number,
): Promise<Uint8Array> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new Error('Decompressed share payload exceeds size limit.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

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

/**
 * Encodes a validated `RackProjectInput` using browser-native `deflate-raw` compression (`#rack=v2.<base64url>`),
 * shrinking share hashes by ~75-85% with automatic fallback to `#rack=v1.` if `CompressionStream` is unavailable.
 */
export async function encodeRackProjectToCompressedHash(
  projectInput: RackProjectInput,
): Promise<string> {
  const parsed = RackProjectSchema.parse(projectInput);
  if (typeof CompressionStream !== 'function') {
    return encodeRackProjectToHash(parsed);
  }
  try {
    const json = JSON.stringify(parsed);
    const utf8Bytes = new TextEncoder().encode(json);
    const stream = new CompressionStream('deflate-raw');
    const writer = stream.writable.getWriter();
    const readPromise = readStreamBytesWithCap(
      stream.readable as ReadableStream<Uint8Array>,
      MAX_DECOMPRESSED_BYTES,
    );
    await writer.write(toExactArrayBufferUint8Array(utf8Bytes));
    await writer.close();
    const compressed = await readPromise;
    return `#${RACK_COMPRESSED_HASH_PREFIX}${bytesToBase64Url(compressed)}`;
  } catch {
    return encodeRackProjectToHash(parsed);
  }
}

/**
 * Asynchronously decodes either compressed (`#rack=v2.`) or uncompressed (`#rack=v1.`) URL hash payloads
 * with a strict 256 KB decompression size cap and full Zod validation.
 */
export async function decodeRackProjectFromHashAsync(
  hashOrUrl: string,
): Promise<RackProjectInput | null> {
  if (!hashOrUrl) return null;
  const hashIdx = hashOrUrl.indexOf('#');
  const rawFragment =
    hashIdx >= 0 ? hashOrUrl.slice(hashIdx + 1) : hashOrUrl.replace(/^#/, '');
  if (!rawFragment) return null;

  const params = rawFragment.split('&');
  const v2Param = params.find((segment) =>
    segment.startsWith(RACK_COMPRESSED_HASH_PREFIX),
  );
  if (v2Param && typeof DecompressionStream === 'function') {
    const payload = v2Param.slice(RACK_COMPRESSED_HASH_PREFIX.length).trim();
    if (!payload) return null;
    try {
      const compressedBytes = base64UrlToBytes(payload);
      const stream = new DecompressionStream('deflate-raw');
      const writer = stream.writable.getWriter();
      const readPromise = readStreamBytesWithCap(
        stream.readable as ReadableStream<Uint8Array>,
        MAX_DECOMPRESSED_BYTES,
      );
      await writer.write(toExactArrayBufferUint8Array(compressedBytes));
      await writer.close();
      const jsonBytes = await readPromise;
      const jsonText = new TextDecoder().decode(jsonBytes);
      const parsedJson: unknown = JSON.parse(jsonText);
      const validated = RackProjectSchema.safeParse(parsedJson);
      return validated.success ? validated.data : null;
    } catch {
      return null;
    }
  }

  return decodeRackProjectFromHash(hashOrUrl);
}
