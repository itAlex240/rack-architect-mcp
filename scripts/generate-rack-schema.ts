#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { RackProjectSchema } from '../packages/core-domain/dist/index.js';

const RACK_SCHEMA_ID = 'https://mcp.rackarchitect.dev/schemas/rack.schema.json';
const RACK_SCHEMA_TITLE = 'RackArchitect MCP Project Schema';

const SCHEMA_KEYWORD_ORDER: ReadonlyMap<string, number> = new Map(
  [
    '$schema',
    '$id',
    'title',
    'description',
    'type',
    'const',
    'enum',
    'default',
    'format',
    'pattern',
    'minLength',
    'maxLength',
    'minimum',
    'exclusiveMinimum',
    'maximum',
    'exclusiveMaximum',
    'minItems',
    'maxItems',
    'items',
    'properties',
    'required',
    'additionalProperties'
  ].map((keyword, idx) => [keyword, idx] as const)
);

function sortJsonSchemaKeys(value: unknown, insidePropertiesMap = false): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortJsonSchemaKeys(item, false));
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort((a, b) => {
    if (!insidePropertiesMap) {
      const pa = SCHEMA_KEYWORD_ORDER.get(a);
      const pb = SCHEMA_KEYWORD_ORDER.get(b);
      if (pa !== undefined && pb !== undefined) {
        return pa - pb;
      }
      if (pa !== undefined) {
        return -1;
      }
      if (pb !== undefined) {
        return 1;
      }
    }
    return a < b ? -1 : a > b ? 1 : 0;
  });

  const sorted: Record<string, unknown> = {};
  for (const key of keys) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    const childValue = sortJsonSchemaKeys(
      record[key],
      !insidePropertiesMap && key === 'properties'
    );
    Object.defineProperty(sorted, key, {
      value: childValue,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  return sorted;
}

export function buildRackJsonSchema(): Record<string, unknown> {
  const generated = z.toJSONSchema(RackProjectSchema, {
    io: 'input',
    target: 'draft-2020-12'
  }) as Record<string, unknown>;

  const enriched: Record<string, unknown> = {
    ...generated,
    $schema:
      typeof generated['$schema'] === 'string'
        ? generated['$schema']
        : 'https://json-schema.org/draft/2020-12/schema',
    $id: RACK_SCHEMA_ID,
    title: RACK_SCHEMA_TITLE
  };

  return sortJsonSchemaKeys(enriched) as Record<string, unknown>;
}

function main(): void {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, '..');
  const outPath = path.join(repoRoot, 'schemas', 'rack.schema.json');

  const schema = buildRackJsonSchema();
  const jsonText = `${JSON.stringify(schema, null, 2)}\n`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const tmpPath = `${outPath}.tmp.${process.pid}`;
  fs.writeFileSync(tmpPath, jsonText, 'utf8');
  fs.renameSync(tmpPath, outPath);

  process.stdout.write(
    `Generated ${path.relative(repoRoot, outPath)} (${Buffer.byteLength(jsonText, 'utf8')} bytes).\n`
  );
}

main();
