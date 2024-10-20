import Compression from 'compression';
import Express from 'express';
import Helmet from 'helmet';
import { singleton } from 'tsyringe';

import type { AppRunOptions, ExpressApp, HttpServer, IApp } from '~core/types';

import Router from '~core/modules/Router';
import Loggable from '~utils/Loggable';
import Logger from '~utils/Logger';

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

  #register(): void {
    this.#instance.use(Helmet());
    this.#instance.use(Express.json());
    this.#instance.use(Compression());

    this.#router.routes.forEach((routeConfig) => {
      this.#instance.use(...routeConfig);
    });
  }
}
