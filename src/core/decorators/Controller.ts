import type { Class } from 'type-fest';

import { injectable } from 'tsyringe';

import type { ControllerDecorator, ControllerMetadata, ControllerOptions, IController } from '~core/types';

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
function resolveOptions({ path }: Partial<ControllerOptions> = {}): ControllerOptions {
  return {
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
function defineMetadata<C extends IController, A extends unknown[]>(target: Class<C, A>, { path }: ControllerOptions): ControllerMetadata<C> {
  const existingMetadata: ControllerMetadata<C> | undefined = Reflect.getMetadata('metadata', target);

  const metadata: ControllerMetadata<C> = {
    isController: true,
    name: target.name,
    path: resolvePath(path, existingMetadata?.path),
    actions: existingMetadata?.actions ?? [],
  };
  Reflect.defineMetadata('metadata', metadata, target);

  return metadata;
}

/**
 * Resolve path.
 *
 * @param path Path to resolve.
 * @param prefix Path prefix.
 *
 * @returns Resolved path.
 */
function resolvePath(path: string, prefix: string = ''): string {
  let resolvedPath = path.startsWith('/') ? path : `/${path}`;
  resolvedPath = resolvedPath.endsWith('/') ? resolvedPath.slice(0, -1) : resolvedPath;

  return `${prefix}${resolvedPath}`;
}
