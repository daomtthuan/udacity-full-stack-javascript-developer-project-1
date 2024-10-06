import type { Express } from 'express';

import type IServerConfiguration from '~/core/types/IServerConfiguration';

/** Represents the server. */
export default interface IServer extends IServerConfiguration {
  /** The application instance. */
  app: Express;

  /** Starts the server. */
  start(): void;

  /** Stops the server. */
  stop(): void;

  /** Restarts the server. */
  restart(): void;
}
