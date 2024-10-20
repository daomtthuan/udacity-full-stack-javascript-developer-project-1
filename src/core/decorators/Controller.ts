import type { Class } from 'type-fest';

import { injectable } from 'tsyringe';

import type { ActionMetadata, ControllerDecorator, ControllerMetadata, ControllerOptions, IController } from '~core/types';

/**
 * Controller decorator factory.
 *
 * @param options Controller options.
 *
 * @returns Controller decorator.
 */
export default function controller(options?: Partial<ControllerOptions>): ControllerDecorator {
  const resolvedOptions = resolveOptions(options);

  return (target) => {
    injectable()(target);

    defineMetadata(target, resolvedOptions);
  };
}

/**
 * Resolve options.
 *
 * @param options Controller options.
 *
 * @returns Resolved options.
 */
function resolveOptions({ isBase, path }: Partial<ControllerOptions> = {}): ControllerOptions {
  return {
    isBase: isBase || false,
    path: path || '',
  };
}

/**
 * Define metadata.
 *
 * @template C Controller type.
 * @template A Arguments type.
 * @param target Controller class.
 * @param options Controller options.
 *
 * @returns Controller metadata.
 */
function defineMetadata<C extends IController, A extends unknown[]>(target: Class<C, A>, { path = '' }: ControllerOptions): ControllerMetadata<C> {
  const metadata: ControllerMetadata<C> = {
    isController: true,
    name: target.name,
    path: resolvePath(target, path),
    actions: resolveActions(target),
  };
  Object.entries(metadata).forEach(([key, value]) => {
    Reflect.defineMetadata(key, value, target);
  });

  return metadata;
}

/**
 * Resolve path.
 *
 * @template C Controller type.
 * @template A Arguments type.
 * @param target Controller class.
 * @param path Path to resolve.
 *
 * @returns Resolved path.
 */
function resolvePath<C extends IController, A extends unknown[]>(target: Class<C, A>, path: string): string {
  const prefix = Reflect.getMetadata<ControllerMetadata<C>, 'path'>('path', target) || '';

  let resolvedPath = path.startsWith('/') ? path : `/${path}`;
  resolvedPath = resolvedPath.endsWith('/') ? resolvedPath.slice(0, -1) : resolvedPath;

  return `${prefix}${resolvedPath}`;
}

/**
 * Resolve actions.
 *
 * @template C Controller type.
 * @template A Arguments type.
 * @param target Controller class.
 * @param path Path to resolve.
 *
 * @returns Resolved actions.
 */
function resolveActions<C extends IController, A extends unknown[]>(target: Class<C, A>): ActionMetadata<C>[] {
  const actions = Reflect.getMetadata<ControllerMetadata<C>, 'actions'>('actions', target) || [];

  return actions;
}
