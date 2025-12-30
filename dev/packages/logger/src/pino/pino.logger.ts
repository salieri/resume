import pino from 'pino';

import { Logger } from '../logger';
import { LogLevel } from '../types';
import type { LogData, LogLevelName } from '../types';

export class PinoLogger extends Logger {
  constructor(
    logLevel: LogLevel | LogLevelName = LogLevel.INFO,
    metadata: Record<string, unknown> = {}, protected readonly pinoInstance: pino.Logger = pino(),
  ) {
    super(logLevel, metadata);
  }

  protected static readonly pinoFunctionMap: Record<LogLevel, 'fatal' | 'trace' | 'info' | 'warn' | 'error' | 'debug'> = {
    [LogLevel.TRACE]: 'trace',
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.INFO]: 'info',
    [LogLevel.WARN]: 'warn',
    [LogLevel.ERROR]: 'error',
    [LogLevel.PANIC]: 'fatal',
  };

  protected writeLog(level: LogLevel, key: string, logData?: LogData) {
    this.pinoInstance[PinoLogger.pinoFunctionMap[level] || 'info'](
      logData,
      key,
    );
  }

  // clone logger with (optional) additional metadata
  public branch(metadata?: Record<string, unknown>) {
    return new PinoLogger(this.logLevel, { ...this.metadata, ...metadata }, this.pinoInstance);
  }
}
