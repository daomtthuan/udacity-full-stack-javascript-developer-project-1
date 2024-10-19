import DotENV from 'dotenv';
import { singleton } from 'tsyringe';

import type { IConfiguration, ServerConfig } from '~core/types';
import type { LoggerConfig } from '~utils/types';

/** Configuration. */
@singleton()
export default class Configuration implements IConfiguration {
  readonly #serverConfig: ServerConfig;
  readonly #loggerConfig: LoggerConfig;

  constructor() {
    DotENV.config();

    this.#serverConfig = {
      host: process.env['HOST'] || 'localhost',
      port: Number(process.env['PORT']) || 3000,
    };

    this.#loggerConfig = {
      dir: process.env['LOGS_DIR'] || 'logs',
    };

    console.log('Configuration created');
  }

  get serverConfig(): ServerConfig {
    return this.#serverConfig;
  }

  get loggerConfig(): LoggerConfig {
    return this.#loggerConfig;
  }
}
