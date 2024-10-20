import DotENV from 'dotenv';
import { singleton } from 'tsyringe';

import type { DirectoryConfig, IConfiguration, ServerConfig } from '~core/types';

/** Configuration. */
@singleton()
export default class Configuration implements IConfiguration {
  readonly #serverConfig: ServerConfig;
  readonly #directoryConfig: DirectoryConfig;

  public constructor() {
    DotENV.config();

    this.#serverConfig = {
      host: process.env['HOST'] || 'localhost',
      port: Number(process.env['PORT']) || 3000,
    };

    this.#directoryConfig = {
      loggerDir: process.env['LOGS_DIR'] || 'logs',
      resourceDir: process.env['RESOURCES_DIR'] || 'resources',
    };
  }

  public get serverConfig(): ServerConfig {
    return this.#serverConfig;
  }

  public get directoryConfig(): DirectoryConfig {
    return this.#directoryConfig;
  }
}
