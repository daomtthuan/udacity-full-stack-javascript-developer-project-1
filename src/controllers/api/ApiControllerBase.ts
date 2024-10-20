import { controller } from '~core/decorators';
import Controller from '~core/modules/Controller';

/** Base class for API controllers. */
@controller({
  path: '/api',
})
export default class ApiControllerBase extends Controller {}
