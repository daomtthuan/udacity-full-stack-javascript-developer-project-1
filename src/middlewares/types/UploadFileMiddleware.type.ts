import type { Multer } from 'multer';

import type { ExpressRequest, ExpressResponse } from '~core/types';

/** Resolved File. */
export type ResolvedFile = Express.Multer.File;

/** Multer Resolver. */
export type MulterResolver = Multer;

/** Upload File Handler. */
export interface IUploadFileMiddleware {
  /**
   * Resolve upload file.
   *
   * @param name Field name of form data.
   * @param req Request.
   * @param res Response.
   */
  resolve(req: ExpressRequest, res: ExpressResponse, name: string): Promise<ResolvedFile>;
}
