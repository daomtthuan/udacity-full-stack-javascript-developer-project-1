import FileSystem from 'fs';
import { MulterError } from 'multer';
import Path from 'path';
import { registry } from 'tsyringe';

import type { ImageDto } from '~controllers/types';
import type { ExpressRequest, ExpressResponse } from '~core/types';
import type { ResolvedFile } from '~middlewares/types';

import ApiControllerBase from '~controllers/api/ApiControllerBase';
import { action, controller } from '~core/decorators';
import { MiddlewareToken } from '~middlewares/constants/Token';
import ImageStorage from '~middlewares/modules/ImageStorage';
import UploadFileMiddleware from '~middlewares/UploadFileMiddleware';
import Logger from '~utils/Logger';

/** Image Storage API controller. */
@registry([
  {
    token: MiddlewareToken.IFileStorage,
    useClass: ImageStorage,
  },
])
@controller({ path: '/storage' })
export default class StorageController extends ApiControllerBase {
  readonly #uploadFileMiddleware;

  public constructor(logger: Logger, UploadFileMiddleware: UploadFileMiddleware) {
    super(logger);

    this.#uploadFileMiddleware = UploadFileMiddleware;
  }

  @action.get({ path: '/images' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Loading image list');

    res.send('Image list');
  }

  @action.get({ path: '/image/:name' })
  public getImage(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Get image info');

    res.send('Image info');
  }

  @action.post({
    path: '/upload',
  })
  public uploadImage(req: ExpressRequest, res: ExpressResponse): void {
    const uploadFileHandler = this.#uploadFileMiddleware.handler('image');
    uploadFileHandler(req, res, (error) => {
      if (error) {
        this.logger.error('Error uploading image', { error });
        if (error instanceof MulterError) {
          res.status(400).send('Invalid file');
        } else {
          res.status(500).send('Internal server error');
        }

        return;
      }

      this.logger.debug('Upload image', { file: req.file });
      this.#onUploadImage(req, res);
    });
  }

  @action.delete({ path: '/image/:name' })
  public delete(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Delete image');

    res.send('Image deleted');
  }

  #onUploadImage(req: ExpressRequest, res: ExpressResponse): void {
    const imageDto = req.body as ImageDto;
    const file = req.file as ResolvedFile;

    try {
      const newPath = Path.join(file.destination, `${imageDto.name}${Path.extname(file.originalname)}`);
      FileSystem.renameSync(file.path, newPath);

      this.logger.info('Image uploaded', { newPath });
      res.send('Image uploaded');
    } catch (error) {
      this.logger.error('Error uploading image', { error });
      res.status(500).send('Internal server error');
    }
  }
}
