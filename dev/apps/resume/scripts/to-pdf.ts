/* eslint-disable no-console, unicorn/no-process-exit */

import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import process from 'node:process';

import puppeteer from 'puppeteer';

const [url, out = 'out.pdf'] = process.argv.slice(2);

if (!url) {
  console.error('usage: to-pdf <url> [out.pdf]');
  process.exit(1);
}

let devProc: ChildProcess | undefined;

function killDev() {
  const p = devProc;

  if (!p?.pid) {
    return;
  }

  // Kill entire process group (detached spawn => pgid == pid on POSIX)
  try {
    process.kill(-p.pid, 'SIGTERM');
  } catch {
    // ignore (already dead / not supported)
  }
}

process.on('exit', killDev);

process.on('SIGINT', () => {
  killDev();
  process.exit(130);
});

process.on('SIGTERM', () => {
  killDev();
  process.exit(143);
});

async function sleep(ms: number) {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function waitForHttpOk(targetUrl: string, timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(targetUrl, { method: 'GET' });

      if (res.ok) {
        return;
      }
    } catch {
      // ignore
    }

    await sleep(250);
  }

  throw new Error(`Timed out waiting for server: ${targetUrl}`);
}

async function waitForClose(p: ChildProcess): Promise<void> {
  await new Promise<void>((resolve) => {
    if (p.exitCode !== null) {
      return resolve();
    }

    p.once('close', () => resolve());
  });
}

async function main(): Promise<void> {
  // Start pnpm dev in background (new process group)
  devProc = spawn('pnpm', ['dev'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    detached: true,
    env: process.env,
  });

  try {
    await waitForHttpOk(url);

    const browser = await puppeteer.launch({
      headless: true,
      // In CI/docker you may need:
      // args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });
      await page.bringToFront();

      await page.pdf({
        path: out,
        format: 'letter',
        landscape: false,
        printBackground: false,
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        waitForFonts: true,
      });

      console.log(out);
    } finally {
      await browser.close();
    }
  } finally {
    killDev();

    if (devProc) {
      await waitForClose(devProc);
    }
  }
}

try {
  await main();
} catch (error) {
  const msg = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(msg);
  process.exit(1);
}
