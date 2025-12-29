import { Logger } from '../logger';
import { LogLevel } from '../types';
import type { LogData } from '../types';

export class ConsoleLogger extends Logger {
  public constructor(logLevel: LogLevel | string = LogLevel.INFO, metadata: Record<string, unknown> = {}) {
    super(logLevel, metadata);
  }

  protected static readonly consoleFunctionMap: Record<LogLevel, 'trace' | 'info' | 'warn' | 'error' | 'debug'> = {
    [LogLevel.TRACE]: 'trace',
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.INFO]: 'info',
    [LogLevel.WARN]: 'warn',
    [LogLevel.ERROR]: 'error',
    [LogLevel.PANIC]: 'error',
  };

  protected writeLog(level: LogLevel, key: string, logData?: LogData) {
    // eslint-disable-next-line no-console
    console[ConsoleLogger.consoleFunctionMap[level] || 'log'](
      key,
      logData,
    );
  }

  // clone logger with (optional) additional metadata
  public branch(metadata?: Record<string, unknown>) {
    return new ConsoleLogger(this.logLevel, { ...this.metadata, ...metadata });
  }
}
