import { controller } from '~core/decorators';
import AutoLogger from '~utils/AutoLogger';
import Logger from '~utils/Logger';

/** Base class for API controllers. */
@controller({
  path: '/api',
})
export default class ApiControllerBase extends AutoLogger {
  public constructor(logger: Logger) {
    super(logger);
  }
}
