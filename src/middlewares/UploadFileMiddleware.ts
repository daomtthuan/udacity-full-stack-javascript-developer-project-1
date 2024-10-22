import Multer from 'multer';
import { inject, injectable } from 'tsyringe';

import type { ExpressRequest, ExpressResponse } from '~core/types';
import type { IFileStorage, IUploadFileMiddleware, MulterResolver, ResolvedFile } from '~middlewares/types';

import NotFoundError from '~core/errors/NotFoundError';
import { MiddlewareToken } from '~middlewares/constants/MiddlewareToken';
import Loggable from '~utils/Loggable';
import Logger from '~utils/Logger';

/** UploadFile Handler. */
@injectable()
export default class UploadFileMiddleware extends Loggable implements IUploadFileMiddleware {
  readonly #instance: MulterResolver;

  public constructor(logger: Logger, @inject(MiddlewareToken.IFileStorage) storage: IFileStorage) {
    super(logger);

    this.#instance = Multer({
      storage: storage.instance,
    });
  }

  public async resolve(req: ExpressRequest, res: ExpressResponse, fieldName: string): Promise<ResolvedFile> {
    const handler = this.#instance.single(fieldName);

    return new Promise<ResolvedFile>((resolve, reject) => {
      handler(req, res, (error) => {
        if (error) {
          this.logger.error('Error resolve image', { error });
          return reject(error);
        }

        if (!req.file) {
          return reject(new NotFoundError('No file uploaded'));
        }

        this.logger.debug('Resolve image', { file: req.file });
        return resolve(req.file);
      });
    });
  }
}
