import { controller } from '~core/decorators';
import Controller from '~core/modules/Controller';

/** Base class for API controllers. */
@controller({
  isBase: true,
  path: '/api',
})
export default class ApiControllerBase extends Controller {}
