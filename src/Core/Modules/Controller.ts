import type { ExpressResponse } from '~Core/Types/App.type';

import Loggable from '~Utils/Modules/Logger/Loggable';
import Logger from '~Utils/Modules/Logger/Logger';

/** Controller base. */
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
   * Send a no content response.
   *
   * @param res Response.
   */
  protected noContent(res: ExpressResponse): void {
    res.status(204).send();
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
   * Send a conflict response.
   *
   * @param res Response.
   * @param message Message.
   */
  protected conflict(res: ExpressResponse, message: string = 'Conflict'): void {
    res.status(409).send(message);
  }

  /**
   * Send a error response.
   *
   * @param res Response.
   * @param error Error.
   */
  protected serverError(res: ExpressResponse, message: string = 'Internal server error'): void {
    res.status(500).send(message);
  }
}
