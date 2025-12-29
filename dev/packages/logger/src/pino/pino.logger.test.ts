import pino from 'pino';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LogLevel } from '../types';
import type { LogData, LogPayload } from '../types';

import { PinoLogger } from './pino.logger';

const TEST_KEY = 'pino.test.key';
const TEST_METADATA = { app: 'pino-logger-tests' };
const BRANCH_METADATA = { requestId: 'request-3' };
const TEST_VALUE = 'value';

const createPayload = (overrides: Partial<LogPayload> = {}): LogPayload => ({
  value: TEST_VALUE,
  ...overrides,
});

describe('PinoLogger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes to the mapped pino method with metadata and payload', () => {
    const pinoInstance = pino({ enabled: false });
    const debugSpy = vi.spyOn(pinoInstance, 'debug').mockImplementation(() => {});

    const logger = new PinoLogger(LogLevel.TRACE, TEST_METADATA, pinoInstance);
    logger.debug(TEST_KEY, createPayload());

    const [logData, key] = debugSpy.mock.calls[0] as [LogData, string];

    expect(key).toBe(TEST_KEY);

    expect(logData).toMatchObject({
      metadata: TEST_METADATA,
      payload: { value: TEST_VALUE },
    });
  });

  it('uses pino.fatal for panic logs', () => {
    const pinoInstance = pino({ enabled: false });
    const fatalSpy = vi.spyOn(pinoInstance, 'fatal').mockImplementation(() => {});

    const logger = new PinoLogger(LogLevel.TRACE, TEST_METADATA, pinoInstance);
    logger.panic(TEST_KEY, createPayload());

    const [logData, key] = fatalSpy.mock.calls[0] as [LogData, string];

    expect(key).toBe(TEST_KEY);

    expect(logData).toMatchObject({
      metadata: TEST_METADATA,
      payload: { value: TEST_VALUE },
    });
  });

  it('branches with merged metadata using the same pino instance', () => {
    const pinoInstance = pino({ enabled: false });
    const infoSpy = vi.spyOn(pinoInstance, 'info').mockImplementation(() => {});

    const logger = new PinoLogger(LogLevel.INFO, TEST_METADATA, pinoInstance);
    const branched = logger.branch(BRANCH_METADATA);

    branched.info(TEST_KEY, createPayload());

    const [logData, key] = infoSpy.mock.calls[0] as [LogData, string];

    expect(key).toBe(TEST_KEY);

    expect(logData).toMatchObject({
      metadata: { ...TEST_METADATA, ...BRANCH_METADATA },
      payload: { value: TEST_VALUE },
    });
  });
});
