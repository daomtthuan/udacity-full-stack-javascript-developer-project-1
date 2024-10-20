import type { RequestHandler } from 'express';
import type { Except } from 'type-fest';

import type { IController } from '~core/types';

/** Action method type. */
export type ActionMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

/** Action options. */
export type ActionOptions = {
  /** Method type of the action. */
  method: ActionMethod;

  /** Path of the action route. */
  path: string;

  /** Middleware for the action. */
  middleware: RequestHandler[];
};

/** Special action options. */
export type SpecialActionOptions = Except<ActionOptions, 'method'>;

/**
 * Action metadata.
 *
 * @template C Controller type.
 */
export type ActionMetadata<C extends IController> = {
  /** Indicates that the target is an action. */
  isAction: true;

  /** Name of the action. */
  name: keyof C;

  /** Path of the action route. */
  path: string;

  /** Method of the action. */
  method: ActionMethod;

  /** Middleware for the action. */
  middleware: RequestHandler[];
};
