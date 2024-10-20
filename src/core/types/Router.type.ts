import type { ExpressRouter } from '~core/types/Controller.type';

/** Router. */
export interface IRouter {
  /** Routes to register. */
  routes: [string, ExpressRouter][];
}
