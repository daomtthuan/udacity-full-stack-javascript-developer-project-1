import { blue, gray, red, yellow } from 'ansis';
import { singleton } from 'tsyringe';
import Winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

import type { DirectoryConfig } from '~Core/Types/Configuration.type';
import type { ILogger, WinstonLogger } from '~Utils/Types/Logger.type';

import Configuration from '~Core/Modules/Configuration';

const {
  format: WinstonFormat,
  transports: { Console: WinstonConsole },
} = Winston;

const levelColor: Record<string, string> = {
  debug: gray('DEBUG'),
  info: blue('INFO'),
  warn: yellow('WARN'),
  error: red('ERROR'),
};

/** Logger. */
@singleton()
export default class Logger implements ILogger {
  readonly #config: DirectoryConfig;

  readonly #instance: WinstonLogger;

  public constructor(config: Configuration) {
    this.#config = config.directoryConfig;

    const format = WinstonFormat.combine(
      WinstonFormat.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      WinstonFormat.errors({
        stack: true,
      }),
      WinstonFormat.printf(({ timestamp, level, message, ...data }) => {
        const log = `${timestamp}${' '.repeat(7 - level.length)}${levelColor[level] || level}:  ${message}`;
        return Object.keys(data).length ? `${log}\n${JSON.stringify(data, null, 2)}` : log;
      }),
    );
    const formatWithUncolorize = WinstonFormat.combine(format, WinstonFormat.uncolorize());

    this.#instance = Winston.createLogger({
      level: 'debug',
      transports: [
        new WinstonConsole({
          format,
        }),
        new WinstonDailyRotateFile({
          dirname: this.#config.loggerDir,
          filename: '%DATE%-debug.log',
          format: formatWithUncolorize,
          zippedArchive: true,
        }),
        new WinstonDailyRotateFile({
          dirname: this.#config.loggerDir,
          filename: '%DATE%-error.log',
          level: 'error',
          format: formatWithUncolorize,
          zippedArchive: true,
          handleExceptions: true,
          handleRejections: true,
        }),
      ],

      exitOnError: false,
    });

    this.debug(`Logger ${gray('initialized')}`);
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
