import mapValues from 'lodash/mapValues';
import omitBy from 'lodash/omitBy';
import { serializeError } from 'serialize-error';

import type { LogData, LoggerApi, LogLevelName, LogPayload } from './types';
import { LogLevel } from './types';

export abstract class Logger implements LoggerApi {
  protected logLevel: LogLevel;

  // write log
  protected abstract writeLog(level: LogLevel, key: string, logData?: LogData): void;

  // clone logger with (optional) additional metadata
  public abstract branch(metadata?: Record<string, unknown>): Logger;

  protected constructor(logLevel: LogLevel | LogLevelName | string = LogLevel.INFO, protected metadata: Record<string, unknown> = {}) {
    this.logLevel = typeof logLevel === 'string' ? LogLevel[logLevel.toUpperCase() as keyof typeof LogLevel] || LogLevel.INFO : logLevel;
  }

  static cleanPayload(payload: Error | LogPayload | undefined): LogPayload | undefined {
    if (!payload) {
      return payload;
    }

    if (payload instanceof Error) {
      return { error: serializeError(payload) };
    }

    return mapValues(payload, (value) => {
      if (value instanceof Error) {
        return serializeError(value);
      }

      if (value instanceof Request) {
        return {
          type: 'Request (cleaned)',
          method: value.method,
          url: value.url,
        };
      }

      if (value instanceof Response) {
        return {
          type: 'Response (cleaned)',
          ok: value.ok,
          redirected: value.redirected,
          status: value.status,
          statusText: value.statusText,
          url: value.url,
        };
      }

      return value;
    });
  }

  protected tryToWriteLog(level: LogLevel, key: string, payload?: LogPayload): void {
    if (level >= this.logLevel) {
      this.writeLog(
        level,
        key,
        omitBy(
          { payload: Logger.cleanPayload(payload), metadata: this.metadata },
          (v) => v === undefined),
      );
    }
  }

  trace(key: string, payload?: LogPayload): void {
    this.tryToWriteLog(LogLevel.TRACE, key, payload);
  }

  debug(key: string, payload?: LogPayload): void {
    this.tryToWriteLog(LogLevel.DEBUG, key, payload);
  }

  info(key: string, payload?: LogPayload): void {
    this.tryToWriteLog(LogLevel.INFO, key, payload);
  }

  warn(key: string, payload?: LogPayload): void {
    this.tryToWriteLog(LogLevel.WARN, key, payload);
  }

  error(key: string, payload?: LogPayload): void {
    this.tryToWriteLog(LogLevel.ERROR, key, payload);
  }

  panic(key: string, payload?: LogPayload): void {
    this.tryToWriteLog(LogLevel.PANIC, key, payload);
  }
}
