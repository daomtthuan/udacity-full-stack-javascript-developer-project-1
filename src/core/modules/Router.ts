import type { Class } from 'type-fest';

import { container, singleton } from 'tsyringe';

import type { ControllerMetadata, ExpressRouter, IController, IRouter } from '~core/types';

import StorageController from '~controllers/api/StorageController';
import Logger from '~utils/Logger';

/** Router. */
@singleton()
export default class Router implements IRouter {
  readonly #logger: Logger;

  readonly #routes: [string, ExpressRouter][] = [];

  public constructor(logger: Logger) {
    this.#logger = logger;

    this.#routes = [this.#createRoute(StorageController)];

    this.#logger.debug('Router created');
  }

  #createRoute<C extends IController, A extends unknown[]>(target: Class<C, A>): [string, ExpressRouter] {
    const controller = container.resolve(target);
    const path = Reflect.getMetadata<ControllerMetadata<C>, 'path'>('path', target);

    return [path, controller.router];
  }

  public get routes(): [string, ExpressRouter][] {
    return this.#routes;
  }
}
