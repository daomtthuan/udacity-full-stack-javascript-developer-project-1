import { injectable } from 'tsyringe';

import Logger from '~utils/Logger';

/** FileHandler. */
@injectable()
export default class FileHandler {
  readonly $logger: Logger;

  public constructor(logger: Logger) {
    this.$logger = logger;

    this.$logger.info('FileHandler initialized.');
  }
}
