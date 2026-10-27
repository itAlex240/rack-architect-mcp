import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { parseCliArgs, runCli } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXAMPLE_RACK_YAML = path.resolve(
  __dirname,
  '../../../examples/10inch-homelab/rack.yaml'
);

describe('@rack-mcp/cli Subcommands & Argument Parser', () => {
  const tempDirs: string[] = [];

  function createTempDir(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rack-cli-test-'));
    tempDirs.push(dir);
    return dir;
  }

  afterEach(() => {
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
  });
});
