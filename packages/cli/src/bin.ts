#!/usr/bin/env node
import { parseCliArgs, runCli } from './index.js';

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const parsed = parseCliArgs(argv);
  const res = await runCli(argv);

  if (parsed.command === 'validate' || parsed.command === 'export') {
    if (res.exitCode === 0) {
      process.stdout.write(`${res.output}\n`);
    } else {
      process.stderr.write(`${res.output}\n`);
    }
    process.exit(res.exitCode);
  }
}

main().catch((err) => {
  const msg = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`[rack-mcp fatal error] ${msg}\n`);
  process.exit(1);
});
