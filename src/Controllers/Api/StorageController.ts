import FileSystem from 'fs';
import Path from 'path';
import { container } from 'tsyringe';

import type { ImageDto } from '~Controllers/Types/ApiDto.type';
import type { ExpressRequest, ExpressResponse } from '~Core/Types/App.type';
import type { ResolvedFile } from '~Middlewares/Types/UploadFile.type';

import ApiControllerBase from '~Controllers/Api/ApiControllerBase';
import StorageValidator from '~Controllers/Api/Validators/StorageValidator';
import { ApiDtoSchema } from '~Controllers/Schemas/ApiDtoSchema';
import { action, controller } from '~Core/Decorators';
import { MiddlewareToken } from '~Middlewares/Constants/MiddlewareToken';
import ImageStorage from '~Middlewares/Modules/UploadFile/ImageStorage';
import UploadFileMiddleware from '~Middlewares/Modules/UploadFile/UploadFileMiddleware';
import ValidatorMiddleware from '~Middlewares/Modules/Validator/ValidatorMiddleware';
import Logger from '~Utils/Modules/Logger/Logger';

const storageContainer = container.createChildContainer();
storageContainer.register(MiddlewareToken.IFileStorage, ImageStorage);

/** Image Storage API controller. */
@controller({ path: '/storage' })
export default class StorageController extends ApiControllerBase {
  readonly #validator: StorageValidator;

  public constructor(logger: Logger, validator: StorageValidator) {
    super(logger);

    this.#validator = validator;
  }

  @action.get({ path: '/images' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    res.send('Image list');
  }

  @action.get({
    path: '/image/:name',
    middlewares: [storageContainer.resolve(ValidatorMiddleware).handler(ApiDtoSchema.ImageDto, 'params')],
  })
  public getImage(req: ExpressRequest, res: ExpressResponse): void {
    const name = req.params['name'] as string;
    if (!this.#validator.isExistImage(name)) {
      this.logger.debug(`${this.loggerLabel} Image not found`, { name });
      return this.notFound(res, 'Image not found');
    }

    const imageDto: ImageDto = {
      name,
    };

    this.logger.info(`${this.loggerLabel} Get image`, { imageDto });
    return this.ok(res, imageDto);
  }

  @action.post({
    path: '/upload',
    middlewares: [
      storageContainer.resolve(UploadFileMiddleware).handler('image'),
      storageContainer.resolve(ValidatorMiddleware).handler(ApiDtoSchema.ImageDto),
    ],
  })
  public async uploadImage(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    try {
      const imageDto = req.body as ImageDto;
      if (this.#validator.isExistImage(imageDto.name)) {
        this.logger.debug(`${this.loggerLabel} Image already exists`, { imageDto });
        return this.conflict(res, 'Image already exists');
      }

      const file = req.file as ResolvedFile;
      const path = Path.join(file.destination, `${imageDto.name}${Path.extname(file.originalname)}`);
      FileSystem.renameSync(file.path, path);

      this.logger.info(`${this.loggerLabel} Image uploaded`, { path });
      return this.created(res, imageDto);
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error process uploaded image`, { error });
      return this.serverError(res, 'Can not process uploaded image');
    }
  }

  @action.delete({ path: '/image/:name' })
  public delete(_req: ExpressRequest, res: ExpressResponse): void {
    res.send('Image deleted');
  }
}
