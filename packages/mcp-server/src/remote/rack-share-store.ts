import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { RackProjectSchema, type RackProjectInput } from '@rack-mcp/core-domain';

export const SHARE_ID_REGEX = /^[a-z0-9]{8}$/;

// 32-char unambiguous lowercase alphanumeric alphabet (omits i, l, o, 1 for 0-modulo-bias 5-bit indexing)
const SHARE_ID_ALPHABET = 'abcdefghjkmnpqrstuvwxyz023456789';
const SHARE_ID_LENGTH = 8;
const DEFAULT_MAX_ENTRIES = 5000;
const DEFAULT_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const DEFAULT_MAX_SERIALIZED_BYTES = 128 * 1024;
const FLUSH_DEBOUNCE_MS = 2000;

interface ShareEntry {
  readonly id: string;
  readonly hash: string;
  readonly project: RackProjectInput;
  readonly createdAt: number;
}

interface PersistedShareFile {
  readonly schemaVersion: 1;
  readonly entries: readonly ShareEntry[];
}

export interface RackShareStoreOptions {
  readonly filePath?: string | undefined;
  readonly maxEntries?: number | undefined;
  readonly ttlMs?: number | undefined;
  readonly maxSerializedBytes?: number | undefined;
}

export interface SaveShareResult {
  readonly id: string;
  readonly created: boolean;
}

/**
 * Privacy-first, zero-PII LRU store mapping short 8-char IDs (`?s=<id>` / `/s/<id>`)
 * to Zod-validated `RackProjectInput` snapshots with content-addressed SHA-256 deduplication.
 */
export class RackShareStore {
  private readonly filePath: string | undefined;
  private readonly maxEntries: number;
  private readonly ttlMs: number;
  private readonly maxSerializedBytes: number;
  private readonly entriesById = new Map<string, ShareEntry>();
  private readonly idByHash = new Map<string, string>();
  private dirty = false;
  private flushTimer: ReturnType<typeof setTimeout> | undefined;

  public constructor(options: RackShareStoreOptions = {}) {
    this.filePath =
      options.filePath !== undefined && options.filePath.trim().length > 0
        ? options.filePath.trim()
        : undefined;
    this.maxEntries = Math.max(1, options.maxEntries ?? DEFAULT_MAX_ENTRIES);
    this.ttlMs = Math.max(1, options.ttlMs ?? DEFAULT_TTL_MS);
    this.maxSerializedBytes = Math.max(
      1024,
      options.maxSerializedBytes ?? DEFAULT_MAX_SERIALIZED_BYTES
    );

    if (this.filePath !== undefined) {
      this.loadFromDiskIfPresent(this.filePath);
    }
  }

  public save(
    projectInput: RackProjectInput,
    nowMs = Date.now()
  ): SaveShareResult {
    const validated = RackProjectSchema.parse(projectInput);
    const canonicalJson = JSON.stringify(validated);
    if (Buffer.byteLength(canonicalJson, 'utf8') > this.maxSerializedBytes) {
      throw new Error('Shared rack project exceeds maxSerializedBytes cap.');
    }

    const hash = crypto
      .createHash('sha256')
      .update(canonicalJson)
      .digest('hex');

    const existingId = this.idByHash.get(hash);
    if (existingId !== undefined) {
      const existing = this.entriesById.get(existingId);
      if (existing !== undefined && nowMs - existing.createdAt <= this.ttlMs) {
        // Refresh LRU order
        this.entriesById.delete(existingId);
        this.entriesById.set(existingId, existing);
        return { id: existingId, created: false };
      }
      if (existing !== undefined) {
        this.deleteEntry(existingId, existing.hash);
      } else {
        this.idByHash.delete(hash);
      }
    }

    this.pruneExpired(nowMs);
    while (this.entriesById.size >= this.maxEntries) {
      const oldestKey = this.entriesById.keys().next().value;
      if (oldestKey === undefined) break;
      const oldest = this.entriesById.get(oldestKey);
      this.deleteEntry(oldestKey, oldest?.hash);
    }

    const id = this.generateUniqueId();
    const record: ShareEntry = {
      id,
      hash,
      project: structuredClone(validated),
      createdAt: nowMs
    };
    this.entriesById.set(id, record);
    this.idByHash.set(hash, id);
    this.dirty = true;
    this.scheduleFlush();
    return { id, created: true };
  }

  public get(id: string, nowMs = Date.now()): RackProjectInput | null {
    if (!SHARE_ID_REGEX.test(id)) {
      return null;
    }
    const entry = this.entriesById.get(id);
    if (entry === undefined) {
      return null;
    }
    if (nowMs - entry.createdAt > this.ttlMs) {
      this.deleteEntry(id, entry.hash);
      this.dirty = true;
      this.scheduleFlush();
      return null;
    }
    // Refresh LRU order without rewriting file unless needed
    this.entriesById.delete(id);
    this.entriesById.set(id, entry);
    return structuredClone(entry.project);
  }

  public size(): number {
    return this.entriesById.size;
  }

  public flushSync(): void {
    if (this.flushTimer !== undefined) {
      clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
    }
    if (this.filePath === undefined || !this.dirty) {
      return;
    }
    try {
      const dir = path.dirname(this.filePath);
      fs.mkdirSync(dir, { recursive: true });
      const payload: PersistedShareFile = {
        schemaVersion: 1,
        entries: Array.from(this.entriesById.values())
      };
      const tmpPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(payload), 'utf8');
      fs.renameSync(tmpPath, this.filePath);
      this.dirty = false;
    } catch {
      // Fail-open silently on read-only filesystems (e.g. Docker root_ro without mount)
    }
  }

  public close(): void {
    this.flushSync();
  }

  private generateUniqueId(): string {
    for (let attempt = 0; attempt < 32; attempt++) {
      const buf = crypto.randomBytes(SHARE_ID_LENGTH);
      let candidate = '';
      for (let i = 0; i < SHARE_ID_LENGTH; i++) {
        candidate += SHARE_ID_ALPHABET[buf[i]! & 31]!;
      }
      if (!this.entriesById.has(candidate)) {
        return candidate;
      }
    }
    throw new Error('Unable to allocate unique share ID.');
  }

  private deleteEntry(id: string, hash: string | undefined): void {
    this.entriesById.delete(id);
    if (hash !== undefined) {
      const mapped = this.idByHash.get(hash);
      if (mapped === id) {
        this.idByHash.delete(hash);
      }
    }
  }

  private pruneExpired(nowMs: number): void {
    for (const [id, entry] of this.entriesById.entries()) {
      if (nowMs - entry.createdAt > this.ttlMs) {
        this.deleteEntry(id, entry.hash);
        this.dirty = true;
      }
    }
  }

  private scheduleFlush(): void {
    if (this.filePath === undefined || this.flushTimer !== undefined) {
      return;
    }
    this.flushTimer = setTimeout(() => {
      this.flushTimer = undefined;
      this.flushSync();
    }, FLUSH_DEBOUNCE_MS);
    this.flushTimer.unref();
  }

  private loadFromDiskIfPresent(filePath: string): void {
    try {
      if (!fs.existsSync(filePath)) {
        return;
      }
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<PersistedShareFile>;
      if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.entries)) {
        return;
      }
      const nowMs = Date.now();
      for (const item of parsed.entries) {
        if (
          typeof item?.id !== 'string' ||
          !SHARE_ID_REGEX.test(item.id) ||
          typeof item.createdAt !== 'number' ||
          nowMs - item.createdAt > this.ttlMs
        ) {
          continue;
        }
        const validated = RackProjectSchema.safeParse(item.project);
        if (!validated.success) {
          continue;
        }
        const canonicalJson = JSON.stringify(validated.data);
        const hash = crypto
          .createHash('sha256')
          .update(canonicalJson)
          .digest('hex');
        const entry: ShareEntry = {
          id: item.id,
          hash,
          project: validated.data,
          createdAt: item.createdAt
        };
        this.entriesById.set(entry.id, entry);
        this.idByHash.set(hash, entry.id);
      }
      while (this.entriesById.size > this.maxEntries) {
        const oldestKey = this.entriesById.keys().next().value;
        if (oldestKey === undefined) break;
        const oldest = this.entriesById.get(oldestKey);
        this.deleteEntry(oldestKey, oldest?.hash);
      }
    } catch {
      // Ignore corrupt or unreadable persisted share file
    }
  }
}
