import type { Express as ExpressInstance } from 'express';
import type { Server as HTTPServer } from 'http';

import Express from 'express';
import { singleton } from 'tsyringe';

import type { AppRunOptions, IApp } from '~core/types';

import Logger from '~utils/Logger';

/** Application. */
@singleton()
export default class App implements IApp {
  readonly #logger: Logger;

  readonly #instance: ExpressInstance;

  constructor(logger: Logger) {
    this.#logger = logger;

    this.#instance = Express();

    this.#logger.debug('Application created');
  }

  run({ host, port, onRun }: AppRunOptions): HTTPServer {
    return this.#instance.listen(port, host, onRun);
  }
}
