import type { Logger as LoggerInstance } from 'winston';

import { singleton } from 'tsyringe';
import Winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import type { ILogger, LoggerConfig } from '~utils/types';

import Configuration from '~core/Configuration';

const {
  format,
  transports: { Console },
} = Winston;

/** Logger. */
@singleton()
export default class Logger implements ILogger {
  readonly #config: LoggerConfig;

  readonly #instance: LoggerInstance;

  constructor(config: Configuration) {
    this.#config = config.loggerConfig;

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

    this.#instance = Winston.createLogger({
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
          dirname: this.#config.dir,
          filename: '%DATE%-debug.log',
          zippedArchive: true,
        }),
        new DailyRotateFile({
          dirname: this.#config.dir,
          filename: '%DATE%-error.log',
          level: 'error',
          zippedArchive: true,
          handleExceptions: true,
          handleRejections: true,
        }),
      ],

      exitOnError: false,
    });

    this.debug('Logger created');
  }

  error(message: string, ...meta: unknown[]): void {
    this.#instance.error(message, ...meta);
  }

  warn(message: string, ...meta: unknown[]): void {
    this.#instance.warn(message, ...meta);
  }

  info(message: string, ...meta: unknown[]): void {
    this.#instance.info(message, ...meta);
  }

  debug(message: string, ...meta: unknown[]): void {
    this.#instance.debug(message, ...meta);
  }
}
