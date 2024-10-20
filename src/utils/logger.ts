import { singleton } from 'tsyringe';
import Winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

import type { DirectoryConfig } from '~core/types';
import type { ILogger, WinstonLogger } from '~utils/types';

import Configuration from '~core/modules/Configuration';

const {
  format: WinstonFormat,
  transports: { Console: WinstonConsole },
} = Winston;

/** Logger. */
@singleton()
export default class Logger implements ILogger {
  readonly #config: DirectoryConfig;

  readonly #instance: WinstonLogger;

  public constructor(config: Configuration) {
    this.#config = config.directoryConfig;

    const formats = WinstonFormat.combine(
      WinstonFormat.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      WinstonFormat.errors({
        stack: true,
      }),
      WinstonFormat.printf(({ timestamp, level, message, ...data }) => {
        const log = `${timestamp} ${level}: ${message}`;

        return Object.keys(data).length ? `${log}\n${JSON.stringify(data, null, 2)}` : log;
      }),
    );

    this.#instance = Winston.createLogger({
      level: 'debug',
      transports: [
        new WinstonConsole({
          format: WinstonFormat.combine(
            WinstonFormat.colorize({
              colors: {
                info: 'blue',
                warn: 'yellow',
                error: 'red',
              },
            }),
            formats,
          ),
        }),

        new WinstonDailyRotateFile({
          dirname: this.#config.loggerDir,
          filename: '%DATE%-debug.log',
          zippedArchive: true,
          format: WinstonFormat.combine(WinstonFormat.uncolorize(), formats),
        }),
        new WinstonDailyRotateFile({
          dirname: this.#config.loggerDir,
          filename: '%DATE%-error.log',
          level: 'error',
          zippedArchive: true,
          handleExceptions: true,
          handleRejections: true,
          format: WinstonFormat.combine(WinstonFormat.uncolorize(), formats),
        }),
      ],

      exitOnError: false,
    });

    this.debug('Logger initialized');
  }

  public error(message: string, ...meta: unknown[]): void {
    this.#instance.error(message, ...meta);
  }

  public warn(message: string, ...meta: unknown[]): void {
    this.#instance.warn(message, ...meta);
  }

  public info(message: string, ...meta: unknown[]): void {
    this.#instance.info(message, ...meta);
  }

  public debug(message: string, ...meta: unknown[]): void {
    this.#instance.debug(message, ...meta);
  }
}
