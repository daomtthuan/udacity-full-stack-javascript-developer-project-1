import type { RequestHandler } from 'express';
import type { Multer } from 'multer';

/** Resolved File. */
export type ResolvedFile = Express.Multer.File;

/** Multer Resolver. */
export type MulterResolver = Multer;

/** Upload File Handler. */
export interface IUploadFileMiddleware {
  /**
   * Handle upload file.
   *
   * @param name Field name of form data.
   */
  handler(name: string): RequestHandler;
}
