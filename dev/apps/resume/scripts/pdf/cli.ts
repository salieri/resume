import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import process from 'node:process';

import { PinoLogger } from '@faust/logger';
import { Command } from 'commander';
import { launch } from 'puppeteer';

const logger = new PinoLogger('info');

let devProc: ChildProcess | undefined;

function killDev() {
  const p = devProc;

  if (!p?.pid) {
    return;
  }

  try {
    // Kill entire process group (detached spawn => pgid == pid on POSIX)
    process.kill(-p.pid, 'SIGTERM');
  } catch (error) {
    logger.warn('resume.pdf.dev.kill_failed', { error });
  }
}

process.on('exit', killDev);

const createSignalHandler = (signal: NodeJS.Signals, exitCode: number) => {
  const handler = () => {
    killDev();
    process.exitCode = exitCode;
    process.removeListener(signal, handler);
    process.kill(process.pid, signal);
  };

  return handler;
};

process.on('SIGINT', createSignalHandler('SIGINT', 130));
process.on('SIGTERM', createSignalHandler('SIGTERM', 143));

async function sleep(ms: number) {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function waitForHttpOk(targetUrl: string, timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(targetUrl, { method: 'GET' });

      if (res.ok) {
        return;
      }

      lastError = new Error(`Unexpected response status: ${res.status}`);
    } catch (error) {
      lastError = error;
    }

    await sleep(250);
  }

  logger.warn('resume.pdf.dev.wait_timeout', { url: targetUrl, error: lastError });
  throw new Error(`Timed out waiting for server: ${targetUrl}`, { cause: lastError });
}

async function waitForClose(p: ChildProcess): Promise<void> {
  await new Promise<void>((resolve) => {
    if (p.exitCode !== null) {
      return resolve();
    }

    p.once('close', () => resolve());
  });
}

// eslint-disable-next-line max-statements
async function main(url: string, out: string): Promise<void> {
  // Start pnpm dev in background (new process group)
  devProc = spawn('pnpm', ['dev'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    detached: true,
  });

  try {
    logger.info('resume.pdf.dev.waiting', { url });
    await waitForHttpOk(url);

    const browser = await launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });
      await page.bringToFront();
      await page.emulateMediaType('print');
      await page.waitForFunction(() => globalThis.matchMedia('print').matches);

      await sleep(1000);

      await page.pdf({
        path: out,
        format: 'letter',
        landscape: false,
        printBackground: false,
        displayHeaderFooter: false,
        preferCSSPageSize: true,
        waitForFonts: true,
      });

      logger.info('resume.pdf.saved', { out });
    } finally {
      await browser.close();
    }
  } finally {
    logger.info('resume.pdf.dev.shutdown');
    killDev();

    if (devProc) {
      logger.info('resume.pdf.dev.wait_close');
      await waitForClose(devProc);
      logger.info('resume.pdf.dev.closed', { note: 'ELIFECYCLE 143 expected.' });
    }
  }
}

try {
  const program = new Command()
    .name('to-pdf')
    .description('Render resume to a PDF using Puppeteer.')
    .requiredOption('--url <url>', 'URL to render')
    .requiredOption('--out <path>', 'Output PDF path')
    .action(async (opts: { url: string; out: string }) => {
      await main(opts.url, opts.out);
    });

  await program.parseAsync();
  logger.info('resume.pdf.done');
} catch (error) {
  logger.error('resume.pdf.failed', { error });
  process.exitCode = 1;
}
