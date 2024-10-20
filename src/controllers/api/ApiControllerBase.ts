import { controller } from '~core/decorators';
import Loggable from '~utils/Loggable';
import Logger from '~utils/Logger';

/** Base class for API controllers. */
@controller({
  path: '/api',
})
export default class ApiControllerBase extends Loggable {
  public constructor(logger: Logger) {
    super(logger);
  }
}
