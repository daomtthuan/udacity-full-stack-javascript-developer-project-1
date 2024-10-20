import type { Class } from 'type-fest';

import { injectable } from 'tsyringe';

import type { ControllerDecorator, ControllerMetadata, ControllerOptions, IController } from '~core/types';

import StringUtil from '~utils/String';

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
  const baseMetadata: ControllerMetadata<C> | undefined = Reflect.getMetadata('metadata', target);

  const metadata: ControllerMetadata<C> = {
    isController: true,
    name: target.name,
    path: StringUtil.resolvePath(baseMetadata?.path, path),
    actions: baseMetadata?.actions ?? [],
  };
  Reflect.defineMetadata('metadata', metadata, target);

  return metadata;
}
