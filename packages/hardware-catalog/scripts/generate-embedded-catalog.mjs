#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgRoot = path.resolve(__dirname, '..');
const catalogRoot = path.join(pkgRoot, 'catalog');
const outputFile = path.join(pkgRoot, 'src', 'embedded-catalog.ts');

const CATEGORY_DIRS = ['10inch', '19inch', '6inch', 'carriers', 'sub-modules'];

const entries = [];
for (const categoryDir of CATEGORY_DIRS) {
  const dirPath = path.join(catalogRoot, categoryDir);
  if (!fs.existsSync(dirPath)) continue;
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort((a, b) => a.localeCompare(b));
  for (const filename of files) {
    const absPath = path.join(dirPath, filename);
    const rawYaml = fs.readFileSync(absPath, 'utf8').replace(/\r\n/g, '\n');
    entries.push({
      relativePath: `catalog/${categoryDir}/${filename}`,
      categoryDir,
      rawYaml
    });
  }
}

const header = `/**
 * Auto-generated embedded YAML hardware catalog so @rack-mcp/hardware-catalog
 * runs identically in Node.js and Browser (@rack-mcp/web-viewer) without fs dependency.
 */
export interface EmbeddedYamlEntry {
  readonly relativePath: string;
  readonly categoryDir: "10inch" | "19inch" | "6inch" | "carriers" | "sub-modules";
  readonly rawYaml: string;
}

export const EMBEDDED_YAML_CATALOG: readonly EmbeddedYamlEntry[] = ${JSON.stringify(entries, null, 2)};
`;

fs.writeFileSync(outputFile, header, 'utf8');
console.log(
  `Generated ${path.relative(pkgRoot, outputFile)} with ${entries.length} embedded YAML blueprints.`
);
