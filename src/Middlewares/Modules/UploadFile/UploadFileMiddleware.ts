import type { RequestHandler } from 'express';

import Multer, { MulterError } from 'multer';
import { inject, injectable } from 'tsyringe';

import type { IFileStorage, MulterResolver } from '~Middlewares/Types/UploadFile.type';

import Middleware from '~Core/Modules/Middleware';
import { MiddlewareToken } from '~Middlewares/Constants/MiddlewareToken';
import Logger from '~Utils/Modules/Logger/Logger';

/** UploadFile Handler. */
@injectable()
export default class UploadFileMiddleware extends Middleware {
  readonly #instance: MulterResolver;

  public constructor(logger: Logger, @inject(MiddlewareToken.IFileStorage) storage: IFileStorage) {
    super(logger);

    this.#instance = Multer({
      storage: storage.instance,
    });
  }

  public handler(fieldName: string): RequestHandler {
    const handler = this.#instance.single(fieldName);

    return (req, res, next) => {
      handler(req, res, (error) => {
        if (error) {
          if (error instanceof MulterError) {
            res.status(400).send('Invalid file');
          } else {
            this.logger.error(`${this.loggerLabel} Error resolve image`, { error });
            res.status(500).send('Internal server error');
          }

          return;
        }

        if (!req.file) {
          res.status(400).send('No file uploaded');
        } else {
          this.logger.debug(`${this.loggerLabel} Resolve image`, { file: req.file });
          next();
        }
      });
    };
  }
}
