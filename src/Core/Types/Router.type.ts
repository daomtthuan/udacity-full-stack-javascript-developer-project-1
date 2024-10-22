import type { Router } from 'express';

/** Express router. */
export type ExpressRouter = Router;

/** Route configuration. */
export type RouteConfig = [string, ExpressRouter];

/** Router. */
export interface IRouter {
  /** Routes Registered in the router. */
  routes: RouteConfig[];
}
