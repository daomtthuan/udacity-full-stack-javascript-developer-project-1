import type { ActionDecorator, ActionMetadata, ActionMethod, ActionOptions, SpecialActionOptions } from '~Core/Types/Action.type';
import type { ControllerMetadata, IController } from '~Core/Types/Controller.type';

/**
 * Action decorator factory base.
 *
 * @param options Action options.
 *
 * @returns Action decorator.
 */
function actionBase(options?: Partial<ActionOptions>): ActionDecorator {
  const resolvedOptions = resolveOptions(options);

  return (target, propertyKey) => {
    const metadata = defineMetadata(target, propertyKey, resolvedOptions);
    registerAction(target, metadata);
  };
}

const specificAction = (['get', 'post', 'put', 'patch', 'delete'] satisfies ActionMethod[]).reduce(
  (prev, method) => {
    prev[method] = (options?: Partial<SpecialActionOptions>): ActionDecorator => {
      return actionBase({
        ...options,
        method,
      });
    };

    return prev;
  },
  {} as Record<ActionMethod, (options?: Partial<SpecialActionOptions>) => ActionDecorator>,
);

/**
 * Action decorator factory.
 *
 * @param options Action options.
 *
 * @returns Action decorator.
 */
const action = Object.assign(actionBase, specificAction);
export default action;

/**
 * Resolve options.
 *
 * @param options Action options.
 *
 * @returns Resolved options.
 */
function resolveOptions({ method, path, middleware }: Partial<ActionOptions> = {}): ActionOptions {
  return {
    method: method || 'get',
    path: path || '',
    middleware: middleware || [],
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
  { method, path, middleware }: ActionOptions,
): ActionMetadata<C> {
  const metadata: ActionMetadata<C> = {
    isAction: true,
    name: propertyKey.toString() as keyof C,
    path,
    method,
    middleware,
  };
  Reflect.defineMetadata('metadata', metadata, target, propertyKey);

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

  const controllerMetadata: ControllerMetadata<C> | undefined = Reflect.getMetadata('metadata', target.constructor);
  if (!controllerMetadata) {
    throw new Error(`Controller ${target.constructor.name} not decorated.`);
  }

  Reflect.defineMetadata(
    'metadata',
    {
      ...controllerMetadata,
      actions: [...controllerMetadata.actions, metadata],
    },
    target.constructor,
  );
}
