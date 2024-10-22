import type { ServerConfig } from '~Core/Types/Server.type';

/** Directory configuration. */
export type DirectoryConfig = {
  /** Logger directory. */
  readonly loggerDir: string;

  /** Resource directory. */
  readonly resourceDir: string;
};

/** Configuration. */
export interface IConfiguration {
  /** Server configuration. */
  readonly serverConfig: ServerConfig;

  /** Directory configuration. */
  readonly directoryConfig: DirectoryConfig;
}
