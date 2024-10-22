import { gray } from 'ansis';

import Logger from '~Utils/Modules/Logger/Logger';

/** Loggable. */
export default abstract class Loggable {
  readonly #logger: Logger;

  protected constructor(logger: Logger) {
    this.#logger = logger;

    this.#logger.debug(`${this.constructor.name} ${gray('initialized')}`);
  }

  /** Logger. */
  protected get logger(): Logger {
    return this.#logger;
  }
}
