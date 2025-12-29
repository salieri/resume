import { afterEach, describe, expect, it, vi } from 'vitest';

import { LogLevel } from '../types';
import type { LogData, LogPayload } from '../types';

import { ConsoleLogger } from './console.logger';

const TEST_KEY = 'console.test.key';
const TEST_METADATA = { app: 'console-logger-tests' };
const BRANCH_METADATA = { requestId: 'request-2' };
const TEST_VALUE = 'value';

const createPayload = (overrides: Partial<LogPayload> = {}): LogPayload => ({
  value: TEST_VALUE,
  ...overrides,
});

describe('ConsoleLogger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes to the mapped console method with metadata and payload', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    const logger = new ConsoleLogger(LogLevel.TRACE, TEST_METADATA);
    logger.info(TEST_KEY, createPayload());

    const logData = infoSpy.mock.calls[0]?.[1] as LogData | undefined;

    expect(logData).toMatchObject({
      metadata: TEST_METADATA,
      payload: { value: TEST_VALUE },
    });
  });

  it('uses console.error for panic logs', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const logger = new ConsoleLogger(LogLevel.TRACE, TEST_METADATA);
    logger.panic(TEST_KEY, createPayload());

    const logData = errorSpy.mock.calls[0]?.[1] as LogData | undefined;

    expect(logData).toMatchObject({
      metadata: TEST_METADATA,
      payload: { value: TEST_VALUE },
    });
  });

  it('branches with merged metadata', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    const logger = new ConsoleLogger(LogLevel.TRACE, TEST_METADATA);
    const branched = logger.branch(BRANCH_METADATA);

    branched.info(TEST_KEY, createPayload());

    const logData = infoSpy.mock.calls[0]?.[1] as LogData | undefined;

    expect(logData).toMatchObject({
      metadata: { ...TEST_METADATA, ...BRANCH_METADATA },
      payload: { value: TEST_VALUE },
    });
  });
});
