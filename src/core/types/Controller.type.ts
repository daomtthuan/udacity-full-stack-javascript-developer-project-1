import type { Router } from 'express';
import type { Class } from 'type-fest';

import type { ActionMetadata } from '~core/types/Action.type';

/** Express router. */
export type ExpressRouter = Router;

/** Controller options. */
export type ControllerOptions = {
  /**
   * Indicates that the target is a base controller.
   *
   * @default false
   */
  isBase: boolean;

  /**
   * Path of the controller route.
   *
   * @default ''
   */
  path: string;
};

/**
 * Controller metadata.
 *
 * @template C Controller type.
 */
export type ControllerMetadata<C extends IController> = {
  /** Indicates that the target is a controller. */
  isController: true;

  /** Name of the controller. */
  name: string;

  /** Path of the controller route. */
  path: string;

  /** Actions of the controller. */
  actions: ActionMetadata<C>[];
};

/** Controller. */
export interface IController {
  /** Router of the controller. */
  router: ExpressRouter;
}

/** Controller decorator. */
export type ControllerDecorator = <C extends IController, A extends unknown[]>(target: Class<C, A>) => void;
