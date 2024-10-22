import { controller } from '~core/decorators';
import Controller from '~core/modules/Controller';
import Logger from '~utils/Logger';

/** Base class for API controllers. */
@controller({
  path: '/api',
})
export default class ApiControllerBase extends Controller {
  public constructor(logger: Logger) {
    super(logger);
  }
}
