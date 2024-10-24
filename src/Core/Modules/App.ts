import Compression from 'compression';
import Express from 'express';
import Helmet from 'helmet';
import { singleton } from 'tsyringe';

import type { AppRunOptions, ExpressApp, IApp } from '~Core/Types/App.type';
import type { HttpServer } from '~Core/Types/Server.type';

import Router from '~Core/Modules/Router';
import Loggable from '~Utils/Modules/Logger/Loggable';
import Logger from '~Utils/Modules/Logger/Logger';

/** Application. */
@singleton()
export default class App extends Loggable implements IApp {
  readonly #router: Router;

  readonly #instance: ExpressApp;

  public constructor(logger: Logger, router: Router) {
    super(logger);

    this.#router = router;

    this.#instance = Express();
    this.#register();
  }

  public run({ host, port, onRun }: AppRunOptions): HttpServer {
    return this.#instance.listen(port, host, onRun);
  }

  public get instance(): ExpressApp {
    return this.#instance;
  }

  #register(): void {
    this.#instance.use(Helmet());
    this.#instance.use(Express.json());
    this.#instance.use(Express.urlencoded({ extended: true }));
    this.#instance.use(Compression());

    this.#router.routes.forEach((routeConfig) => {
      this.#instance.use(...routeConfig);
    });
  }
}
