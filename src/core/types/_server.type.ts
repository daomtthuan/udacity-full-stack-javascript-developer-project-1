import type { Express } from 'express';

/** Server configuration. */
export interface IServerConfiguration {
  /** The host to listen on. */
  host: string;

  /** The port to listen on. */
  port: number;
}

/** Server. */
export interface IServer extends IServerConfiguration {
  /** The application instance. */
  app: Express;

  /** Starts the server. */
  start(): void;

  /** Stops the server. */
  stop(): void;

  /** Restarts the server. */
  restart(): void;
}
