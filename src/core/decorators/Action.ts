import type { ActionMetadata, ActionOptions, ControllerMetadata, IController, SpecialActionOptions } from '~core/types';

/**
 * Action decorator factory.
 *
 * @param options Action options.
 *
 * @returns Action decorator.
 */
export default function action(options?: Partial<ActionOptions>): MethodDecorator {
  const resolvedOptions = resolveOptions(options);

  return (target, propertyKey) => {
    const metadata = defineMetadata(target, propertyKey, resolvedOptions);
    registerAction(target, metadata);
  };
}

/**
 * Get Action decorator factory.
 *
 * @param options Get Action options.
 *
 * @returns Get Action decorator.
 */
export function getAction(options: SpecialActionOptions): MethodDecorator {
  return action({
    ...options,
    method: 'get',
  });
}

/**
 * Post Action decorator factory.
 *
 * @param options Post Action options.
 *
 * @returns Post Action decorator.
 */
export function postAction(options: SpecialActionOptions): MethodDecorator {
  return action({
    ...options,
    method: 'post',
  });
}

/**
 * Put Action decorator factory.
 *
 * @param options Put Action options.
 *
 * @returns Put Action decorator.
 */
export function putAction(options: SpecialActionOptions): MethodDecorator {
  return action({
    ...options,
    method: 'put',
  });
}

/**
 * Patch Action decorator factory.
 *
 * @param options Patch Action options.
 *
 * @returns Patch Action decorator.
 */
export function patchAction(options: SpecialActionOptions): MethodDecorator {
  return action({
    ...options,
    method: 'patch',
  });
}

/**
 * Delete Action decorator factory.
 *
 * @param options Delete Action options.
 *
 * @returns Delete Action decorator.
 */
export function deleteAction(options: SpecialActionOptions): MethodDecorator {
  return action({
    ...options,
    method: 'delete',
  });
}

/**
 * Resolve options.
 *
 * @param options Action options.
 *
 * @returns Resolved options.
 */
function resolveOptions({ method, path }: Partial<ActionOptions> = {}): ActionOptions {
  return {
    method: method || 'get',
    path: path || '',
  };
}

/**
 * Define metadata.
 *
 * @template C Controller type.
 * @template A Action type.
 * @param target Action method.
 * @param propertyKey Property key.
 * @param options Action options.
 *
 * @returns Action metadata.
 */
function defineMetadata<C extends IController, A extends object>(
  target: A,
  propertyKey: string | symbol,
  { method = 'get', path = '' }: ActionOptions,
): ActionMetadata<C> {
  const metadata: ActionMetadata<C> = {
    isAction: true,
    name: propertyKey.toString() as keyof C,
    path,
    method,
  };
  Object.entries(metadata).forEach(([key, value]) => {
    Reflect.defineMetadata(key, value, target);
  });

  return metadata;
}

/**
 * Register action in controller.
 *
 * @template C Controller type.
 * @template A Action type.
 * @param target Action method.
 * @param metadata Action metadata.
 */
function registerAction<C extends IController, A extends object>(target: A, metadata: ActionMetadata<C>): void {
  const { isAction } = metadata;
  if (!isAction) {
    return;
  }

  const actions = Reflect.getMetadata<ControllerMetadata<C>, 'actions'>('actions', target.constructor) || [];
  actions.push(metadata);
  Reflect.defineMetadata('actions', actions, target.constructor);
}
