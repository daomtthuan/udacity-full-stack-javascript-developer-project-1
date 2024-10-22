import type { ExpressResponse } from '~core/types';

import Loggable from '~utils/Loggable';
import Logger from '~utils/Logger';

/** Controller. */
export default abstract class Controller extends Loggable {
  protected constructor(logger: Logger) {
    super(logger);
  }

  /**
   * Send a not found response.
   *
   * @param res Response.
   * @param message Message.
   */
  protected notFound(res: ExpressResponse, message: string = 'Not found'): void {
    res.status(404).send(message);
  }

  /**
   * Send an OK response.
   *
   * @param res Response.
   * @param data Data.
   */
  protected ok(res: ExpressResponse, data: unknown): void {
    res.status(200).send(data);
  }

  /**
   * Send a created response.
   *
   * @param res Response.
   * @param data Data.
   */
  protected created(res: ExpressResponse, data: unknown): void {
    res.status(201).send(data);
  }

  /**
   * Send a bad request response.
   *
   * @param res Response.
   * @param message Message.
   */
  protected badRequest(res: ExpressResponse, message: string = 'Bad request'): void {
    res.status(400).send(message);
  }

  /**
   * Send a error response.
   *
   * @template E Error type.
   * @param res Response.
   * @param error Error.
   */
  protected serverError<E>(res: ExpressResponse, error: E, message: string = 'Internal server error'): void {
    this.logger.error(message, { error });
    res.status(500).send(message);
  }
}
