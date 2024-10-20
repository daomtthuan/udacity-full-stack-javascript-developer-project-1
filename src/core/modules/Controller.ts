import { injectable } from 'tsyringe';

import type { IController } from '~core/types';

import Logger from '~utils/Logger';

/** Base for all controllers. */
@injectable()
export default class Controller implements IController {
  readonly #logger: Logger;

  public constructor(logger: Logger) {
    this.#logger = logger;

    this.#logger.debug(`${this.constructor.name} initialized`);
  }

  protected get logger(): Logger {
    return this.#logger;
  }
}
