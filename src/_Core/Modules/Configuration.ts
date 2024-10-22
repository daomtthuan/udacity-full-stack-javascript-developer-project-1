import DotENV from 'dotenv';
import Path from 'path';
import { injectable } from 'tsyringe';

import type { DirectoryConfig, IConfiguration } from '~Core/Types/Configuration.type';
import type { ServerConfig } from '~Core/Types/Server.type';

/** Configuration. */
@injectable()
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
      loggerDir: Path.resolve(process.cwd(), process.env['LOGS_DIR'] || 'logs'),
      resourceDir: Path.resolve(process.cwd(), process.env['RESOURCES_DIR'] || 'resources'),
    };
  }

  public get serverConfig(): ServerConfig {
    return this.#serverConfig;
  }

  public get directoryConfig(): DirectoryConfig {
    return this.#directoryConfig;
  }
}
