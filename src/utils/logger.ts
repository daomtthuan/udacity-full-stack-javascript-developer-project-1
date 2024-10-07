import type { Logger } from 'winston';

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import type { LoggerOptions } from '~utils/logger.type';

const {
  format: { combine, timestamp, prettyPrint, printf },
  transports: { Console },
} = winston;

/**
 * Create the logger.
 *
 * @param options The logger options.
 *
 * @returns The logger.
 */
export default function createLogger({ dirname }: LoggerOptions): Logger {
  const instance = winston.createLogger({
    level: 'debug',
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      prettyPrint(),
      printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}] ${message}`;
      }),
    ),

    transports: [
      new Console(),
      new DailyRotateFile({
        dirname,
        filename: '%DATE%/debug.log',
        level: 'info',
      }),
      new DailyRotateFile({
        dirname,
        filename: '%DATE%/errors.log',
        level: 'error',
      }),
    ],

    exceptionHandlers: [
      new DailyRotateFile({
        dirname,
        filename: '%DATE%/exceptions.log',
      }),
    ],
  });

  return instance;
}
