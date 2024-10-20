import Multer from 'multer';
import { inject, injectable } from 'tsyringe';

import type { IFileStorage, IUploadFileMiddleware, MulterResolver } from '~middlewares/types';

import { MiddlewareToken } from '~middlewares/constants/Token';
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

  public handler(fieldName: string) {
    return this.#instance.single(fieldName);
  }
}
