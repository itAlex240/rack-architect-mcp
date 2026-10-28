import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EMBEDDED_YAML_CATALOG } from './embedded-catalog.js';
import {
  parseAndValidateBlueprintYaml,
  type BlueprintIntegrityIssue,
} from './catalog-validator.js';

export interface DiskCatalogValidationReport {
  readonly totalFiles: number;
  readonly validFiles: number;
  readonly issues: BlueprintIntegrityIssue[];
}

export function validateCatalogDirectory(catalogRootDir?: string): DiskCatalogValidationReport {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const rootDir = catalogRootDir ?? resolve(currentDir, '..', 'catalog');
  const subdirs = ['10inch', '19inch', '6inch', 'carriers', 'sub-modules'] as const;

  const issues: BlueprintIntegrityIssue[] = [];
  let totalFiles = 0;
  let validFiles = 0;

  for (const subdir of subdirs) {
    const fullSubdir = join(rootDir, subdir);
    const files = readdirSync(fullSubdir)
      .filter((f) => f.endsWith('.yaml'))
      .sort();

    for (const file of files) {
      totalFiles += 1;
      const relPath = `catalog/${subdir}/${file}`;
      const rawYaml = readFileSync(join(fullSubdir, file), 'utf8');
      const result = parseAndValidateBlueprintYaml(rawYaml, relPath);
      if (result.valid) {
        validFiles += 1;
      } else {
        issues.push(...result.issues);
      }

      const embeddedMatch = EMBEDDED_YAML_CATALOG.find(
        (e) => e.relativePath === relPath,
      );
      if (embeddedMatch === undefined || embeddedMatch.rawYaml !== rawYaml) {
        issues.push({
          slug: file.replace(/\.yaml$/, ''),
          source: relPath,
          code: 'YAML_PARSE_ERROR',
          message: `Embedded catalog entry for '${relPath}' is out of sync with disk YAML file.`,
        });
      }
    }
  }

  return {
    totalFiles,
    validFiles,
    issues,
  };
}

// Run when invoked directly via `node dist/validate-cli.js`
const isMain =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const report = validateCatalogDirectory();
  if (report.issues.length > 0) {
    console.error(
      `❌ Hardware catalog validation failed (${report.issues.length} issue(s) across ${report.totalFiles} files):`,
    );
    for (const issue of report.issues) {
      console.error(`  - [${issue.code}] (${issue.source}): ${issue.message}`);
    }
    process.exitCode = 1;
  } else {
    console.log(
      `✅ Hardware catalog validated cleanly: ${report.validFiles}/${report.totalFiles} YAML blueprints passed schema, port bounds/overlap, and carrier slot aperture checks.`,
    );
  }
}
