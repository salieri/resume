# @faust/logger
Structured logging utilities with a shared logger API and adapters for console and pino.

## Overview
- `Logger` base class with log-level filtering and safe payload cleaning.
- `ConsoleLogger` for browser/Node console output.
- `PinoLogger` for JSONL logging via `pino`.
- Optional metadata branching to enrich logs with shared context.
- Intended as lightweight, short-lived (e.g. request-scoped) loggers that are branched from longer-lived "root" loggers
- Designed to enforce structured logging practices.

## Usage
### Console logger
```ts
import { ConsoleLogger, LogLevel } from '@faust/logger/console';

// log level, metadata
const logger = new ConsoleLogger('info', { service: 'web' });

logger.info('web.request.start', { route: '/health' });
logger.warn('web.request.slow', { durationMs: 420 });
```

### Pino logger
```ts
import { PinoLogger, LogLevel } from '@faust/logger/pino';
import pino from 'pino';

const pinoInstance = pino();

// log level, metadata
const logger = new PinoLogger('debug', { service: 'api' }, pinoInstance);

logger.debug('api.cache.hit', { key: 'user:42' });
```

### Branching metadata
```ts
import { ConsoleLogger } from '@faust/logger';

const base = new ConsoleLogger('info', { service: 'worker' });
const scoped = base.branch({ jobId: 'job-123' });

scoped.info('worker.job.start');
```

## Exports
- `@faust/logger` for the base logger, console logger, pino logger, and types.
- `@faust/logger/console` for console-only export.
- `@faust/logger/pino` for pino-only export.

## Log payload cleaning
`Logger` automatically sanitizes payloads:
- `Error` instances are serialized using `serialize-error`.
- `Request` and `Response` objects are summarized to safe fields.

## Development
```bash
pnpm build
pnpm test:ci
pnpm lint:fix
pnpm docs
```
