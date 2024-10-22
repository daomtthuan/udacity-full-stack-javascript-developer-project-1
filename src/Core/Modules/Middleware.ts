import type { RequestHandler } from 'express';

import type { IMiddleware } from '~Core/Types/Middleware.type';

import Loggable from '~Utils/Modules/Logger/Loggable';

/**
 * Middleware base.
 *
 * @template A Arguments.
 * @template R Request handler.
 */
export default abstract class Middleware<A extends unknown[] = unknown[], R extends RequestHandler = RequestHandler>
  extends Loggable
  implements IMiddleware<A, R>
{
  public abstract handler(...args: A): R;
}
