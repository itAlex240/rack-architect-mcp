import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { RackProjectInput } from '@rack-mcp/core-domain';
import {
  ProjectStateManager,
  RackShareStore,
  SHARE_ID_REGEX,
  startRackSidecarServer,
  type RackSidecarServer
} from '../src/index.js';

function makeSampleProject(name = 'Short Link Test Lab', uHeight = 8): RackProjectInput {
  return {
    schema_version: '1.0',
    project_name: name,
    rack: {
      standard: '10inch',
      u_height: uHeight,
      rail_depth_mm: 240,
      enclosure_type: 'closed-glass-front',
      front_door_clearance_mm: 40,
      rear_clearance_mm: 40
    },
    mounted_devices: [],
    cables: [],
    external_endpoints: []
  };
}

describe('@rack-mcp/mcp-server Short Share Store & Endpoints', () => {
  const tempDirs: string[] = [];
  const activeServers: RackSidecarServer[] = [];

  afterEach(async () => {
    while (activeServers.length > 0) {
      await activeServers.pop()!.close();
    }
    while (tempDirs.length > 0) {
      fs.rmSync(tempDirs.pop()!, { recursive: true, force: true });
    }
  });

  it('deduplicates identical projects, enforces LRU eviction and TTL expiration, and persists cleanly to disk', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rack-share-store-'));
    tempDirs.push(tmpDir);
    const shareFile = path.join(tmpDir, 'shares.json');

    const baseNow = Date.now() - 10_000;
    const store = new RackShareStore({
      filePath: shareFile,
      maxEntries: 2,
      ttlMs: 100_000
    });

    const p1 = makeSampleProject('Rack Alpha');
    const p2 = makeSampleProject('Rack Beta');
    const p3 = makeSampleProject('Rack Gamma');

    const r1 = store.save(p1, baseNow);
    expect(r1.created).toBe(true);
    expect(r1.id).toMatch(SHARE_ID_REGEX);

    // Content-addressed SHA-256 deduplication returns same ID
    const r1Dup = store.save(p1, baseNow + 100);
    expect(r1Dup).toEqual({ id: r1.id, created: false });

    const r2 = store.save(p2, baseNow + 200);
    expect(r2.created).toBe(true);
    expect(r2.id).not.toBe(r1.id);

    // Touch r1 via get() so r2 becomes least recently used before saving r3
    expect(store.get(r1.id, baseNow + 300)?.project_name).toBe('Rack Alpha');
    const r3 = store.save(p3, baseNow + 400);
    expect(store.size()).toBe(2);
    expect(store.get(r2.id, baseNow + 500)).toBeNull();
    expect(store.get(r1.id, baseNow + 500)?.project_name).toBe('Rack Alpha');
    expect(store.get(r3.id, baseNow + 500)?.project_name).toBe('Rack Gamma');

    // TTL expiration
    expect(store.get(r1.id, baseNow + 200_000)).toBeNull();

    // Flush and reload from disk
    store.close();
    const reloaded = new RackShareStore({
      filePath: shareFile,
      maxEntries: 2,
      ttlMs: 60_000_000
    });
    expect(reloaded.get(r3.id, baseNow + 500)?.project_name).toBe('Rack Gamma');
    reloaded.close();
  });

  it('serves POST /api/share, GET /api/share/:id, and GET /s/:id 302 redirects with strict validation & origin guards', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rack-share-http-'));
    tempDirs.push(tmpDir);
    const state = new ProjectStateManager({ watchFile: false });
    const server = await startRackSidecarServer(state, {
      port: 0,
      host: '127.0.0.1',
      remoteMcp: true,
      publicBaseUrl: 'https://rack-mcp.example.test',
      shareStoreFilePath: path.join(tmpDir, 'shares.json')
    });
    activeServers.push(server);

    const project = makeSampleProject('Remote Share Rack', 10);

    // 1. Forbidden cross-origin POST rejected with 403
    const evilOriginRes = await fetch(`${server.url}/api/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://evil.example.org'
      },
      body: JSON.stringify({ project })
    });
    expect(evilOriginRes.status).toBe(403);

    // 2. Invalid schema payload rejected with 400
    const badPayloadRes = await fetch(`${server.url}/api/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://rack-mcp.example.test'
      },
      body: JSON.stringify({ project: { not_a_rack: true } })
    });
    expect(badPayloadRes.status).toBe(400);

    // 3. Oversized payload (> 128 KB) rejected with 413
    const hugeRes = await fetch(`${server.url}/api/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://rack-mcp.example.test'
      },
      body: JSON.stringify({ pad: 'a'.repeat(132 * 1024) })
    });
    expect(hugeRes.status).toBe(413);

    // 4. Valid POST /api/share -> 201 Created + short URL
    const createRes = await fetch(`${server.url}/api/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://rack-mcp.example.test'
      },
      body: JSON.stringify({ project })
    });
    expect(createRes.status).toBe(201);
    const createdBody = (await createRes.json()) as {
      id: string;
      sharePath: string;
      shareUrl: string;
    };
    expect(createdBody.id).toMatch(SHARE_ID_REGEX);
    expect(createdBody.sharePath).toBe(`/?s=${createdBody.id}`);
    expect(createdBody.shareUrl).toBe(`https://rack-mcp.example.test/?s=${createdBody.id}`);

    // Duplicate POST returns 200 OK with same ID
    const dupRes = await fetch(`${server.url}/api/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://rack-mcp.example.test'
      },
      body: JSON.stringify(project)
    });
    expect(dupRes.status).toBe(200);
    const dupBody = (await dupRes.json()) as { id: string };
    expect(dupBody.id).toBe(createdBody.id);

    // 5. GET /api/share/:id returns the stored project (and 404 for unknown)
    const getRes = await fetch(`${server.url}/api/share/${createdBody.id}`);
    expect(getRes.status).toBe(200);
    const loadedBody = (await getRes.json()) as {
      id: string;
      project: RackProjectInput;
    };
    expect(loadedBody.id).toBe(createdBody.id);
    expect(loadedBody.project.project_name).toBe('Remote Share Rack');

    const missingRes = await fetch(`${server.url}/api/share/aaaa2222`);
    expect(missingRes.status).toBe(404);

    // 6. GET /s/:id returns 302 redirect to /?s=:id
    const redirectRes = await fetch(`${server.url}/s/${createdBody.id}`, {
      redirect: 'manual'
    });
    expect(redirectRes.status).toBe(302);
    expect(redirectRes.headers.get('location')).toBe(`/?s=${createdBody.id}`);
  });
});
