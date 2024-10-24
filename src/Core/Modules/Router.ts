import type { Class } from 'type-fest';

import { cyan, gray, green } from 'ansis';
import Express from 'express';
import { container, singleton } from 'tsyringe';

import type { ControllerMetadata, IController } from '~Core/Types/Controller.type';
import type { IRouter, RouteConfig } from '~Core/Types/Router.type';

import ImageController from '~Controllers/Api/ImageController';
import StorageController from '~Controllers/Api/StorageController';
import Loggable from '~Utils/Modules/Logger/Loggable';
import Logger from '~Utils/Modules/Logger/Logger';

/** Router. */
@singleton()
export default class Router extends Loggable implements IRouter {
  readonly #routes: RouteConfig[];

  public constructor(logger: Logger) {
    super(logger);

    this.#routes = [this.#createRoute(StorageController), this.#createRoute(ImageController)];
  }

  #createRoute<C extends IController, A extends unknown[]>(target: Class<C, A>): RouteConfig {
    const controllerMetadata: ControllerMetadata<C> | undefined = Reflect.getMetadata(`metadata`, target);
    if (!controllerMetadata) {
      throw new Error(`Controller ${target.name} is not decorated.`);
    }

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
