import Compression from 'compression';
import Express, { type IRouterMatcher } from 'express';
import Helmet from 'helmet';
import { singleton } from 'tsyringe';

import type { AppRunOptions, ExpressApp, HttpServer, IApp } from '~core/types';

import Router from '~core/modules/Router';
import Logger from '~utils/Logger';

/** Application. */
@singleton()
export default class App implements IApp {
  readonly #logger: Logger;
  readonly #router: Router;

  readonly #instance: ExpressApp;

  public constructor(logger: Logger, router: Router) {
    this.#logger = logger;
    this.#router = router;

    this.#instance = Express();
    this.#register();

    this.#logger.debug('Application created');
  }

  public run({ host, port, onRun }: AppRunOptions): HttpServer {
    return this.#instance.listen(port, host, onRun);
  }

  public get register(): IRouterMatcher<unknown> {
    return this.#instance.use.bind(this.#instance);
  }

  #register(): void {
    this.#instance.use(Helmet());
    this.#instance.use(Express.json());
    this.#instance.use(Compression());
    this.#router.routes.forEach(([path, router]) => this.#instance.use(path, router));
  }
}
