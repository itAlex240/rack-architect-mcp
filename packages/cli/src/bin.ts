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

  const shutdown = async () => {
    try {
      await res.sidecarServer?.close();
      await res.mcpServer?.close();
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => {
    void shutdown();
  });
  process.on('SIGINT', () => {
    void shutdown();
  });
}

main().catch((err) => {
  const msg = err instanceof Error ? err.stack ?? err.message : String(err);
  process.stderr.write(`[rack-mcp fatal error] ${msg}\n`);
  process.exit(1);
});
