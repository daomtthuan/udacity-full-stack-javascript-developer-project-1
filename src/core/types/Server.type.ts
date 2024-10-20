import type { Server } from 'http';

/** HTTP server. */
export type HttpServer = Server;

/** Server configuration. */
export type ServerConfig = {
  /** Host. */
  readonly host: string;

  /** Port. */
  readonly port: number;
};

/** Server. */
export interface IServer {
  /** Start the server. */
  start(): void;

  /** Stop the server. */
  stop(): void;

  /** Restart the server. */
  restart(): void;
}
