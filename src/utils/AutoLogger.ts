import { gray } from 'ansis';

import Logger from '~utils/Logger';

/** AutoLogger. */
export default abstract class AutoLogger {
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
