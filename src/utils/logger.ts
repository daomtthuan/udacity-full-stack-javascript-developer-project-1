import type { Logger } from 'winston';

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import type { LoggerOptions } from '~utils/logger.type';

const {
  format,
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
  const formats = format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({
      stack: true,
    }),
    format.printf(({ timestamp, level, message, ...data }) => {
      const log = `${timestamp} ${level}: ${message}`;

      return Object.keys(data).length ? `${log}\n${JSON.stringify(data, null, 2)}` : log;
    }),
  );

  const instance = winston.createLogger({
    level: 'debug',
    format: formats,

    transports: [
      new Console({
        format: format.combine(
          format.colorize({
            colors: {
              info: 'blue',
              warn: 'yellow',
              error: 'red',
            },
          }),
          formats,
        ),
      }),

      new DailyRotateFile({
        dirname,
        filename: '%DATE%.debug.log',
        level: 'info',
        zippedArchive: true,
      }),
      new DailyRotateFile({
        dirname,
        filename: '%DATE%.error.log',
        level: 'error',
        zippedArchive: true,
        handleExceptions: true,
        handleRejections: true,
      }),
    ],

    exitOnError: false,
  });

  return instance;
}
