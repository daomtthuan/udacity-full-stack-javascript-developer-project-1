import type { Express, Request, Response } from 'express';

import type { HttpServer } from '~Core/Types/Server.type';

/** Express application. */
export type ExpressApp = Express;

/** Express request. */
export type ExpressRequest = Request;

/** Express response. */
export type ExpressResponse = Response;

/** Application run options. */
export type AppRunOptions = {
  /** Host. */
  host: string;

  /** Port. */
  port: number;

  /** Callback to run after the application is started. */
  onRun?: () => void;
};

/** Application. */
export interface IApp {
  /**
   * Run the application.
   *
   * @param options The application run options.
   *
   * @returns The HTTP server instance.
   */
  run(options: AppRunOptions): HttpServer;
}
