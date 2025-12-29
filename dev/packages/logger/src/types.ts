export enum LogLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  PANIC = 60,
}

export enum LogLevelName {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  PANIC = 'panic',
}

export const logLevelNameMap: Record<string, LogLevel> = {
  trace: LogLevel.TRACE,
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  panic: LogLevel.PANIC,
};

export type LogPayload = Record<string, unknown> | Error;

export interface LogData {
  metadata?: LogPayload;
  payload?: LogPayload;
}

export interface LoggerApi {
  info: (key: string, payload?: LogPayload) => void;
  debug: (key: string, payload?: LogPayload) => void;
  trace: (key: string, payload?: LogPayload) => void;
  warn: (key: string, payload?: LogPayload) => void;
  error: (key: string, payload?: LogPayload) => void;
  panic: (key: string, payload?: LogPayload) => void;
}
