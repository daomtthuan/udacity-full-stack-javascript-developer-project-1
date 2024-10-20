import { cyan } from 'ansis';
import { singleton } from 'tsyringe';

import type { HttpServer, IServer, ServerConfig } from '~core/types';

import App from '~core/modules/App';
import Configuration from '~core/modules/Configuration';
import Logger from '~utils/Logger';

/** Server. */
@singleton()
export default class Server implements IServer {
  readonly #config: ServerConfig;
  readonly #logger: Logger;
  readonly #app: App;

  #instance: HttpServer;

  public constructor(config: Configuration, logger: Logger, app: App) {
    this.#config = config.serverConfig;
    this.#logger = logger;
    this.#app = app;

    this.#instance = this.#run();

    this.#logger.debug('Server initialized');
  }

  public start(): void {
    if (this.#instance.listening) {
      this.#logger.warn(`Server is already running on ${cyan(this.#baseUrl)}`);
      return;
    }

    this.#instance = this.#run();
  }

  public stop(): void {
    if (!this.#instance.listening) {
      this.#logger.warn('Server is not running');
      return;
    }

    this.#instance.close();
  }

  public restart(): void {
    this.stop();
    this.start();
  }

  #run(): HttpServer {
    const server = this.#app
      .run({
        host: this.#config.host,
        port: this.#config.port,
        onRun: this.#onStart.bind(this),
      })
      .on('error', this.#onError.bind(this));

    return server;
  }

  #onStart(): void {
    this.#logger.info(`Server running on ${cyan(this.#baseUrl)}`);
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
