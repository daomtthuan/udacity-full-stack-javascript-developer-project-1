import FileSystem from 'fs';
import { MulterError } from 'multer';
import Path from 'path';
import { registry } from 'tsyringe';

import type { ImageDto } from '~Controllers/Types/Api.type';
import type { ExpressRequest, ExpressResponse } from '~Core/Types/App.type';

import ApiControllerBase from '~Controllers/Api/ApiControllerBase';
import actionBase from '~Core/Decorators/Action';
import controller from '~Core/Decorators/Controller';
import NotFoundError from '~Core/Errors/NotFoundError';
import { MiddlewareToken } from '~Middlewares/Constants/MiddlewareToken';
import ImageStorage from '~Middlewares/Modules/ImageStorage';
import UploadFileMiddleware from '~Middlewares/UploadFileMiddleware';
import Logger from '~Utils/Modules/Logger/Logger';

/** Image Storage API controller. */
@registry([
  {
    token: MiddlewareToken.IFileStorage,
    useClass: ImageStorage,
  },
])
@controller({ path: '/storage' })
export default class StorageController extends ApiControllerBase {
  readonly #uploadFileMiddleware: UploadFileMiddleware;

  public constructor(logger: Logger, UploadFileMiddleware: UploadFileMiddleware) {
    super(logger);

    this.#uploadFileMiddleware = UploadFileMiddleware;
  }

  @actionBase.get({ path: '/images' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Loading image list');

    res.send('Image list');
  }

  @actionBase.get({ path: '/image/:name' })
  public getImage(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Get image info');

    res.send('Image info');
  }

  @actionBase.post({
    path: '/upload',
  })
  public async uploadImage(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const imageDto: ImageDto = {
      name: req.body.name,
    };

    try {
      const file = await this.#uploadFileMiddleware.resolve(req, res, 'image');

      const path = Path.join(file.destination, `${imageDto.name}${Path.extname(file.originalname)}`);
      FileSystem.renameSync(file.path, path);

      this.logger.info('Image uploaded', { path });

      return this.created(res, imageDto);
    } catch (error) {
      if (error instanceof MulterError) {
        return this.badRequest(res, 'Invalid file');
      }

      if (error instanceof NotFoundError) {
        return this.serverError(res, error, 'File not found');
      }

      return this.serverError(res, error);
    }
  }

  @actionBase.delete({ path: '/image/:name' })
  public delete(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Delete image');

    res.send('Image deleted');
  }
}
