import type { Class } from 'type-fest';

import { cyan, gray, green } from 'ansis';
import Express from 'express';
import { container, singleton } from 'tsyringe';

import type { ControllerMetadata, IController, IRouter, RouteConfig } from '~core/types';

import ImageController from '~controllers/api/ImageController';
import StorageController from '~controllers/api/StorageController';
import AutoLogger from '~utils/AutoLogger';
import Logger from '~utils/Logger';

/** Router. */
@singleton()
export default class Router extends AutoLogger implements IRouter {
  readonly #routes: RouteConfig[];

  public constructor(logger: Logger) {
    super(logger);

    this.#routes = [this.#createRoute(StorageController), this.#createRoute(ImageController)];
  }

  #createRoute<C extends IController, A extends unknown[]>(target: Class<C, A>): RouteConfig {
    const controllerMetadata: ControllerMetadata<C> = Reflect.getMetadata(`metadata`, target);
    const controller = container.resolve(target);

    const router = Express.Router();
    controllerMetadata.actions.forEach(({ isAction, path, method, name, middleware }) => {
      if (!isAction) {
        return;
      }

      const handler = controller[name];
      if (!(handler instanceof Function)) {
        throw new Error(`Action ${name.toString()} must be a function.`);
      }

      router[method](path, ...middleware, handler.bind(controller));

      const url = `${controllerMetadata.path}${path}`;
      this.logger.debug(`  ${gray('Route:')} ${' '.repeat(8 - method.length)}${method.toUpperCase()} ${cyan(url)} ${gray('->')} ${green(name.toString())}`);
    });

    return [controllerMetadata.path, router];
  }

  public get routes(): RouteConfig[] {
    return this.#routes;
  }
}
