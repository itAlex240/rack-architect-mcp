#!/usr/bin/env node
import { parseCliArgs, runCli } from './index.js';

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const parsed = parseCliArgs(argv);
  const res = await runCli(argv);

  if (
    parsed.command === 'validate' ||
    parsed.command === 'export' ||
    parsed.command === 'import' ||
    parsed.command === 'new-blueprint' ||
    parsed.command === 'schema'
  ) {
    const line = res.output.endsWith('\n') ? res.output : `${res.output}\n`;
    if (res.exitCode === 0) {
      process.stdout.write(line);
    } else {
      process.stderr.write(line);
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
