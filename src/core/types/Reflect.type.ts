/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace Reflect {
    function getMetadata<M extends object, K extends keyof M = keyof M>(metadataKey: K, target: object): M[K];
  }
}

export {};
