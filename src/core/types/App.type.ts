import type { Server as HTTPServer } from 'http';

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
   * Runs the application.
   *
   * @param options The application run options.
   *
   * @returns The HTTP server instance.
   */
  run(options: AppRunOptions): HTTPServer;
}
