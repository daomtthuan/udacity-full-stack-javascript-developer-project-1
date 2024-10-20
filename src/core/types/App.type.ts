import type { Express, IRouterMatcher } from 'express';

import type { HttpServer } from '~core/types';

/** Express application. */
export type ExpressApp = Express;

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

  /** Register module. */
  register: IRouterMatcher<unknown>;
}
