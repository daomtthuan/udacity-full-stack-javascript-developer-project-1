import { cyan } from 'ansis';
import { singleton } from 'tsyringe';

import type { HttpServer, IServer, ServerConfig } from '~Core/Types/Server.type';

import App from '~Core/Modules/App';
import Configuration from '~Core/Modules/Configuration';
import Loggable from '~Utils/Modules/Logger/Loggable';
import Logger from '~Utils/Modules/Logger/Logger';

/** Server. */
@singleton()
export default class Server extends Loggable implements IServer {
  readonly #config: ServerConfig;
  readonly #app: App;

  #instance: HttpServer;

  public constructor(config: Configuration, logger: Logger, app: App) {
    super(logger);

    this.#config = config.serverConfig;
    this.#app = app;

    this.#instance = this.#run();
  }

  public start(): void {
    if (this.#instance.listening) {
      this.logger.warn(`Server is already running on ${cyan(this.#baseUrl)}`);
      return;
    }

    this.#instance = this.#run();
  }

  public stop(): void {
    if (!this.#instance.listening) {
      this.logger.warn('Server is not running');
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
    this.logger.info(`Server running on ${cyan(this.#baseUrl)}`);
  }

  #onError(error: NodeJS.ErrnoException): void {
    if (error.syscall === 'listen') {
      if (error.code === 'EACCES') {
        this.logger.error(`Port ${this.#config.port} requires elevated privileges`);
        process.exit(1);
      }

      if (error.code === 'EADDRINUSE') {
        this.logger.error(`Port ${this.#config.port} is already in use`);
        process.exit(1);
      }
    }

    throw error;
  }

  get #baseUrl(): string {
    return `http://${this.#config.host}:${this.#config.port}`;
  }
}
