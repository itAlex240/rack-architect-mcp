import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import {
  parseCliArgs,
  RACK_SCHEMA_ID,
  RACK_SCHEMA_TITLE,
  runCli
} from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');
const COMMITTED_SCHEMA_PATH = path.join(REPO_ROOT, 'schemas', 'rack.schema.json');
const EXAMPLE_RACK_YAML = path.resolve(
  __dirname,
  '../../../examples/10inch-homelab/rack.yaml'
);

describe('@rack-mcp/cli Subcommands & Argument Parser', () => {
  const tempDirs: string[] = [];
  let previousStepSummary: string | undefined;

  function createTempDir(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rack-cli-test-'));
    tempDirs.push(dir);
    return dir;
  }

  afterEach(() => {
    if (previousStepSummary === undefined) {
      delete process.env['GITHUB_STEP_SUMMARY'];
    } else {
      process.env['GITHUB_STEP_SUMMARY'] = previousStepSummary;
    }
    previousStepSummary = undefined;
    for (const dir of tempDirs.splice(0, tempDirs.length)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('parses CLI arguments for serve, validate, and export modes', () => {
    const def = parseCliArgs(['--stdio', '--port', '4100', '--project', 'my-rack.yaml']);
    expect(def.command).toBe('serve');
    expect(def.stdio).toBe(true);
    expect(def.port).toBe(4100);
    expect(def.projectPath).toBe('my-rack.yaml');

    const val = parseCliArgs(['validate', 'examples/10inch-homelab/rack.yaml']);
    expect(val.command).toBe('validate');
    expect(val.projectPath).toBe('examples/10inch-homelab/rack.yaml');

    const exp = parseCliArgs([
      'export',
      'examples/10inch-homelab/rack.yaml',
      '--out-dir',
      './dist-exports'
    ]);
    expect(exp.command).toBe('export');
    expect(exp.projectPath).toBe('examples/10inch-homelab/rack.yaml');
    expect(exp.outDir).toBe('./dist-exports');

    const rem = parseCliArgs(
      ['serve', '--remote-mcp', '--public-url', 'https://rack-mcp.example.test'],
      {}
    );
    expect(rem.command).toBe('serve');
    expect(rem.remoteMcp).toBe(true);
    expect(rem.stdio).toBe(false);
    expect(rem.publicBaseUrl).toBe('https://rack-mcp.example.test');
  });

  it('validates the reference 10inch-homelab rack.yaml with exitCode 0', async () => {
    const res = await runCli(['validate', EXAMPLE_RACK_YAML]);
    expect(res.exitCode).toBe(0);
    expect(res.output).toContain('=== RACK ELEVATION PLAN:');
    expect(res.output).toContain('VALID (0 Errors)');
  });

  it('exports all deliverables (SVG, BOM, GLB, OpenSCAD & STL) via rack-mcp export subcommand', async () => {
    const outDir = createTempDir();
    const res = await runCli(['export', EXAMPLE_RACK_YAML, '--out-dir', outDir]);
    expect(res.exitCode).toBe(0);
    expect(fs.existsSync(path.join(outDir, 'elevation.svg'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'wiring-schematic.svg'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'BOM.md'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'rack-scene.glb'))).toBe(true);
    expect(
      fs.existsSync(
        path.join(outDir, '3dprint-10inch-ucg-ultra-plus-3keystone.scad')
      )
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(outDir, '3dprint-10inch-ucg-ultra-plus-3keystone.stl')
      )
    ).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'labels.csv'))).toBe(true);
    expect(fs.existsSync(path.join(outDir, 'labels.svg'))).toBe(true);
  });

  it('imports NetBox, UniFi and Proxmox exports via rack-mcp import and generates valid custom blueprints via new-blueprint', async () => {
    const tmpDir = createTempDir();

    const netboxPath = path.join(tmpDir, 'netbox.json');
    fs.writeFileSync(
      netboxPath,
      JSON.stringify({
        rack: { name: 'CLI NetBox Import', u_height: 10, width: 10, mounting_depth: 240 },
        devices: [
          {
            name: 'sw-edge',
            position: 8,
            face: 'front',
            device_type: { manufacturer: { name: 'Ubiquiti' }, model: 'USW-Flex-2.5G-8-PoE' }
          }
        ]
      }),
      'utf8'
    );
    const outRackYaml = path.join(tmpDir, 'imported-rack.yaml');
    const impRes = await runCli(['import', netboxPath, '--out', outRackYaml]);
    expect(impRes.exitCode).toBe(0);
    expect(impRes.output).toContain('Imported NETBOX inventory');
    expect(fs.existsSync(outRackYaml)).toBe(true);

    const valRes = await runCli(['validate', outRackYaml]);
    expect(valRes.exitCode).toBe(0);

    const proxmoxPath = path.join(tmpDir, 'pve.json');
    fs.writeFileSync(
      proxmoxPath,
      JSON.stringify([{ node: 'pve-01', status: 'online', maxcpu: 16 }]),
      'utf8'
    );
    const pveRes = await runCli(['import', proxmoxPath]);
    expect(pveRes.exitCode).toBe(0);
    expect(pveRes.output).toContain('pve-01');

    const bpOutPath = path.join(tmpDir, 'custom-edge.yaml');
    const bpRes = await runCli([
      'new-blueprint',
      '--slug',
      'custom-cli-appliance',
      '--manufacturer',
      'EdgeCorp',
      '--model',
      'Box 1U',
      '--category',
      'compute-node',
      '--mount-type',
      'rackmount-10',
      '--watts',
      '28',
      '--rj45',
      '4',
      '--sfp',
      '1',
      '--power',
      'dc-5525',
      '--out',
      bpOutPath
    ]);
    expect(bpRes.exitCode).toBe(0);
    expect(fs.existsSync(bpOutPath)).toBe(true);
    const bpYaml = fs.readFileSync(bpOutPath, 'utf8');
    expect(bpYaml).toContain('slug: custom-cli-appliance');
    expect(bpYaml).toContain('sfp1');
  });

  it('parses schema and validate --ci CLI flags in any position', () => {
    const sch = parseCliArgs(['schema', '--out', './schemas/rack.schema.json']);
    expect(sch.command).toBe('schema');
    expect(sch.outFile).toBe('./schemas/rack.schema.json');

    const ciAfter = parseCliArgs(['validate', 'rack.yaml', '--ci']);
    expect(ciAfter.command).toBe('validate');
    expect(ciAfter.projectPath).toBe('rack.yaml');
    expect(ciAfter.ci).toBe(true);

    const ciBefore = parseCliArgs(['validate', '--ci', 'rack.yaml']);
    expect(ciBefore.command).toBe('validate');
    expect(ciBefore.projectPath).toBe('rack.yaml');
    expect(ciBefore.ci).toBe(true);
  });

  it('prints deterministic rack.schema.json matching committed schemas/rack.schema.json and writes safely with --out', async () => {
    const res = await runCli(['schema']);
    expect(res.exitCode).toBe(0);

    const committed = fs.readFileSync(COMMITTED_SCHEMA_PATH, 'utf8');
    expect(res.output).toBe(committed);

    const parsedSchema = JSON.parse(res.output) as Record<string, unknown>;
    expect(parsedSchema['$schema']).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(parsedSchema['$id']).toBe(RACK_SCHEMA_ID);
    expect(parsedSchema['title']).toBe(RACK_SCHEMA_TITLE);
    expect(parsedSchema['required']).toEqual(['project_name', 'rack']);

    const tmpDir = createTempDir();
    const outSchemaPath = path.join(tmpDir, 'nested', 'rack.schema.json');
    const writeRes = await runCli(['schema', '--out', outSchemaPath]);
    expect(writeRes.exitCode).toBe(0);
    expect(fs.readFileSync(outSchemaPath, 'utf8')).toBe(committed);

    const realTarget = path.join(tmpDir, 'real.json');
    fs.writeFileSync(realTarget, 'preserve', 'utf8');
    const symlinkPath = path.join(tmpDir, 'symlink.json');
    fs.symlinkSync(realTarget, symlinkPath);
    const symRes = await runCli(['schema', '--out', symlinkPath]);
    expect(symRes.exitCode).toBe(1);
    expect(symRes.output).toContain('symbolic link');
    expect(fs.readFileSync(realTarget, 'utf8')).toBe('preserve');
  });

  it('validates a passing rack in --ci mode and appends Markdown Step Summary', async () => {
    const tmpDir = createTempDir();
    const summaryPath = path.join(tmpDir, 'step-summary.md');
    previousStepSummary = process.env['GITHUB_STEP_SUMMARY'];
    process.env['GITHUB_STEP_SUMMARY'] = summaryPath;

    const res = await runCli(['validate', EXAMPLE_RACK_YAML, '--ci']);
    expect(res.exitCode).toBe(0);
    expect(res.output).not.toContain('::error');
    expect(res.output).toContain('## RackArchitect Validation Report');
    expect(res.output).toContain('VALID (0 Errors, 0 Warnings)');

    const summaryContent = fs.readFileSync(summaryPath, 'utf8');
    expect(summaryContent).toContain('## RackArchitect Validation Report');
    expect(summaryContent).toContain('8U 10-Inch Proxmox & UniFi Homelab');
  });

  it('emits GitHub Actions ::error and ::warning annotations in --ci mode for invalid racks and top-heavy warnings', async () => {
    const tmpDir = createTempDir();
    const summaryPath = path.join(tmpDir, 'ci-summary.md');
    previousStepSummary = process.env['GITHUB_STEP_SUMMARY'];
    process.env['GITHUB_STEP_SUMMARY'] = summaryPath;

    const invalidRackPath = path.join(tmpDir, 'colliding-rack.yaml');
    fs.writeFileSync(
      invalidRackPath,
      [
        'schema_version: "1.0"',
        'project_name: Collision & Top-Heavy Test',
        'rack:',
        '  standard: 10inch',
        '  u_height: 8',
        '  rail_depth_mm: 240',
        'mounted_devices:',
        '  - instance_id: ups-a',
        '    blueprint_slug: cyberpower-10inch-ups-1u',
        '    u_position: 7',
        '    face: front',
        '  - instance_id: ups-b',
        '    blueprint_slug: cyberpower-10inch-ups-1u',
        '    u_position: 7',
        '    face: front'
      ].join('\n'),
      'utf8'
    );

    const errRes = await runCli(['validate', invalidRackPath, '--ci']);
    expect(errRes.exitCode).toBe(1);
    expect(errRes.output).toContain(
      `::error file=${invalidRackPath},title=Rack Validation (CHASSIS_COLLISION)::`
    );
    expect(errRes.output).toContain(
      `::warning file=${invalidRackPath},title=Rack Validation (TOP_HEAVY_RACK)::`
    );
    expect(errRes.output).toContain('## RackArchitect Validation Report');

    const warningOnlyRackPath = path.join(tmpDir, 'top-heavy-rack.yaml');
    fs.writeFileSync(
      warningOnlyRackPath,
      [
        'schema_version: "1.0"',
        'project_name: Top Heavy Warning Only',
        'rack:',
        '  standard: 10inch',
        '  u_height: 8',
        '  rail_depth_mm: 240',
        'mounted_devices:',
        '  - instance_id: ups-top',
        '    blueprint_slug: cyberpower-10inch-ups-1u',
        '    u_position: 8',
        '    face: front'
      ].join('\n'),
      'utf8'
    );

    const warnRes = await runCli(['validate', warningOnlyRackPath, '--ci']);
    expect(warnRes.exitCode).toBe(0);
    expect(warnRes.output).not.toContain('::error');
    expect(warnRes.output).toContain(
      `::warning file=${warningOnlyRackPath},title=Rack Validation (TOP_HEAVY_RACK)::`
    );

    const badSchemaPath = path.join(tmpDir, 'bad-schema.yaml');
    fs.writeFileSync(
      badSchemaPath,
      [
        'project_name: Bad Standard',
        'rack:',
        '  standard: 99inch',
        '  u_height: 8',
        '  rail_depth_mm: 240'
      ].join('\n'),
      'utf8'
    );
    const schemaErrRes = await runCli(['validate', badSchemaPath, '--ci']);
    expect(schemaErrRes.exitCode).toBe(1);
    expect(schemaErrRes.output).toContain(
      `::error file=${badSchemaPath},title=Rack Validation (SCHEMA_VALIDATION_ERROR)::`
    );

    const summaryContent = fs.readFileSync(summaryPath, 'utf8');
    expect(summaryContent).toContain('CHASSIS_COLLISION');
    expect(summaryContent).toContain('SCHEMA_VALIDATION_ERROR');

    // Missing file and malformed YAML in --ci mode
    const missingPath = path.join(tmpDir, 'does-not-exist.yaml');
    const missingRes = await runCli(['validate', missingPath, '--ci']);
    expect(missingRes.exitCode).toBe(1);
    expect(missingRes.output).toContain(
      `::error file=${missingPath},title=Rack Validation (FILE_NOT_FOUND)::`
    );

    const malformedPath = path.join(tmpDir, 'malformed.yaml');
    fs.writeFileSync(malformedPath, 'rack:\n  standard: [unclosed', 'utf8');
    const parseErrRes = await runCli(['validate', malformedPath, '--ci']);
    expect(parseErrRes.exitCode).toBe(1);
    expect(parseErrRes.output).toContain(
      `::error file=${malformedPath},line=2,title=Rack Validation (YAML_PARSE_ERROR)::`
    );

    // Unset GITHUB_STEP_SUMMARY and missing --out value handled cleanly
    delete process.env['GITHUB_STEP_SUMMARY'];
    const noSummaryRes = await runCli(['validate', EXAMPLE_RACK_YAML, '--ci']);
    expect(noSummaryRes.exitCode).toBe(0);

    const missingOutRes = await runCli(['schema', '--out']);
    expect(missingOutRes.exitCode).toBe(1);
    expect(missingOutRes.output).toContain('--out requires');
  });
});
