import { LogLevel } from '@faust/logger';
import { PinoLogger } from '@faust/logger/pino';

/**
 * Creates a structured logger for release-scripts CLI tools.
 */
export const createScriptLogger = (script: string) => {
  return new PinoLogger(LogLevel.INFO, { service: 'release-scripts', script });
};
