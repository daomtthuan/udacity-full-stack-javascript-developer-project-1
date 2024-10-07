import type { Logger } from 'winston';

/** Server options. */
export type ServerOptions = {
  /** The host to listen on. */
  host: string;

  /** The port to listen on. */
  port: number;

  /** The logger. */
  logger: Logger;
};

/** Server. */
export type Server = {
  /** Starts the server. */
  start(): void;

  /** Stops the server. */
  stop(): void;

  /** Restarts the server. */
  restart(): void;
};
