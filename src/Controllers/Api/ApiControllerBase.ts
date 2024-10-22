import controller from '~Core/Decorators/Controller';
import Controller from '~Core/Modules/Controller';
import Logger from '~Utils/Modules/Logger/Logger';

/** Base class for API controllers. */
@controller({
  path: '/api',
})
export default class ApiControllerBase extends Controller {
  public constructor(logger: Logger) {
    super(logger);
  }
}
