import type { ServerConfig } from '~core/types';
import type { LoggerConfig } from '~utils/types';

/** Configuration. */
export interface IConfiguration {
  /** Server configuration. */
  readonly serverConfig: ServerConfig;

  /** Logger configuration. */
  readonly loggerConfig: LoggerConfig;
}
