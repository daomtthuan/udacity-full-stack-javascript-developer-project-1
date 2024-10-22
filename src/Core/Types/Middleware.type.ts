import type { RequestHandler } from 'express';

/**
 * Middleware.
 *
 * @template A Arguments.
 * @template R Request handler.
 */
export interface IMiddleware<A extends unknown[] = unknown[], R extends RequestHandler = RequestHandler> {
  /**
   * Middleware handler factory.
   *
   * @param args Arguments.
   *
   * @returns Middleware handler.
   */
  handler(...args: A): R;
}
