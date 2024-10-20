import { Router } from 'express';

import type { ControllerMetadata, ExpressRouter, IController } from '~core/types';

import { controller } from '~core/decorators';
import Logger from '~utils/Logger';

/** Base for all controllers. */
@controller({ isBase: true })
export default class Controller implements IController {
  readonly #logger: Logger;
  readonly #router: ExpressRouter;

  public constructor(logger: Logger) {
    this.#logger = logger;

    this.#router = Router();

    const actions = Reflect.getMetadata<ControllerMetadata<IController>, 'actions'>('actions', this.constructor);
    actions.forEach(({ isAction, path, method, name }) => {
      if (!isAction) {
        return;
      }

      const handler = this[name];
      if (!(handler instanceof Function)) {
        throw new Error(`Action ${name.toString()} must be a function.`);
      }

      this.#router[method](path, handler.bind(this));
    });

    this.#logger.debug(`${this.constructor.name} created`);
  }

  public get router(): ExpressRouter {
    return this.#router;
  }

  protected get logger(): Logger {
    return this.#logger;
  }
}
