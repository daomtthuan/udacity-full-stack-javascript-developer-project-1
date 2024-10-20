import type { Class } from 'type-fest';

import type { ActionMetadata } from '~core/types/Action.type';

/** Controller options. */
export type ControllerOptions = {
  /** Path of the controller route. */
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
export interface IController {}

/** Controller decorator. */
export type ControllerDecorator = <C extends IController, A extends unknown[]>(target: Class<C, A>) => void;
