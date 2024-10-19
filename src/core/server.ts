import type { Server as HTTPServer } from 'http';

import { singleton } from 'tsyringe';

import type { IServer, ServerConfig } from '~core/types';

import App from '~core/App';
import Configuration from '~core/Configuration';
import Logger from '~utils/Logger';

/** Server. */
@singleton()
export default class Server implements IServer {
  readonly #config: ServerConfig;
  readonly #logger: Logger;
  readonly #app: App;

  #instance: HTTPServer;

  constructor(config: Configuration, logger: Logger, app: App) {
    this.#config = config.serverConfig;
    this.#logger = logger;
    this.#app = app;

    this.#instance = this.#createInstance();

    this.#logger.debug('Server created');
  }

  start(): void {
    if (this.#instance.listening) {
      this.#logger.warn(`Server is already running on ${this.#baseUrl}`);
      return;
    }

    this.#instance = this.#createInstance();
  }

  stop(): void {
    if (!this.#instance.listening) {
      this.#logger.warn('Server is not running');
      return;
    }

    this.#instance.close();
  }

  restart(): void {
    this.stop();
    this.start();
  }

  #createInstance(): HTTPServer {
    const server = this.#app
      .run({
        host: this.#config.host,
        port: this.#config.port,
        onRun: () => {
          this.#onStart();
        },
      })
      .on('error', (error) => {
        this.#onError(error);
      });

    return server;
  }

  #onStart(): void {
    this.#logger.info(`Server running on ${this.#baseUrl}`);
  }

  #onError(error: NodeJS.ErrnoException): void {
    if (error.syscall === 'listen') {
      if (error.code === 'EACCES') {
        this.#logger.error(`Port ${this.#config.port} requires elevated privileges`);
        process.exit(1);
      }

      if (error.code === 'EADDRINUSE') {
        this.#logger.error(`Port ${this.#config.port} is already in use`);
        process.exit(1);
      }
    }

    throw error;
  }

  get #baseUrl(): string {
    return `http://${this.#config.host}:${this.#config.port}`;
  }
}
