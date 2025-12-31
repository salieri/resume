import { describe, expect, it } from 'vitest';

import { Logger } from './logger';
import { LogLevel } from './types';
import type { LogData, LogPayload } from './types';

const TEST_KEY = 'logger.test.key';
const TEST_METADATA = { app: 'logger-tests' };
const BRANCH_METADATA = { requestId: 'request-1' };
const TEST_VALUE = 'value';
const TEST_URL = 'https://example.com';

const createError = (): Error => new Error('test error');

const createPayload = (overrides: Partial<LogPayload> = {}): LogPayload => ({
  value: TEST_VALUE,
  ...overrides,
});

class TestLogger extends Logger {
  public readonly logs: { level: LogLevel; key: string; data?: LogData }[] = [];

  public constructor(logLevel: LogLevel | string = LogLevel.INFO, metadata: Record<string, unknown> = {}) {
    super(logLevel, metadata);
  }

  protected writeLog(level: LogLevel, key: string, logData?: LogData): void {
    this.logs.push({ level, key, data: logData });
  }

  public branch(metadata?: Record<string, unknown>): Logger {
    return new TestLogger(this.logLevel, { ...this.metadata, ...metadata });
  }
}

describe('Logger', () => {
  it('cleans payloads when payload is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(Logger.cleanPayload(undefined)).toBeUndefined();
  });

  it('cleans payloads when payload is an Error', () => {
    const error = createError();
    const cleaned = Logger.cleanPayload(error);

    expect(cleaned).toMatchObject({ error: { message: error.message, name: error.name } });
  });

  it('cleans payload values with Error, Request, and Response', () => {
    const error = createError();
    const request = new Request(TEST_URL, { method: 'GET' });
    const response = new Response(null, { status: 201, statusText: 'Created' });
    const payload = createPayload({ error, request, response });

    const cleaned = Logger.cleanPayload(payload);

    expect(cleaned).toMatchObject({
      value: TEST_VALUE,
      error: { message: error.message },
      request: { type: 'Request (cleaned)', method: 'GET', url: request.url },
      response: { type: 'Response (cleaned)', status: 201, statusText: 'Created', url: response.url },
    });
  });

  it('logs only when level meets the configured threshold', () => {
    const logger = new TestLogger(LogLevel.INFO, TEST_METADATA);

    logger.debug(TEST_KEY, createPayload());
    logger.info(TEST_KEY, createPayload({ metadata: BRANCH_METADATA }));

    expect(logger.logs).toHaveLength(1);

    expect(logger.logs[0]).toMatchObject({
      level: LogLevel.INFO,
      key: TEST_KEY,
      data: {
        payload: { value: TEST_VALUE, metadata: BRANCH_METADATA },
        metadata: TEST_METADATA,
      },
    });
  });
});
