import { container } from 'tsyringe';

import type { ImageDto } from '~Controllers/Types/ApiDto.type';
import type { ExpressRequest, ExpressResponse } from '~Core/Types/App.type';
import type { ResolvedFile } from '~Middlewares/Types/UploadFile.type';

import ApiControllerBase from '~Controllers/Api/ApiControllerBase';
import { ApiDtoSchema } from '~Controllers/Schemas/ApiDtoSchema';
import { action, controller } from '~Core/Decorators';
import { MiddlewareToken } from '~Middlewares/Constants/MiddlewareToken';
import ImageStorage from '~Middlewares/Modules/UploadFile/ImageStorage';
import UploadFileMiddleware from '~Middlewares/Modules/UploadFile/UploadFileMiddleware';
import ValidatorMiddleware from '~Middlewares/Modules/Validator/ValidatorMiddleware';
import ImageService from '~Services/ImageService';
import Logger from '~Utils/Modules/Logger/Logger';

const storageContainer = container.createChildContainer();
storageContainer.register(MiddlewareToken.IFileStorage, ImageStorage);

/** Image Storage API controller. */
@controller({ path: '/storage' })
export default class StorageController extends ApiControllerBase {
  readonly #imageService: ImageService;

  public constructor(logger: Logger, imageService: ImageService) {
    super(logger);

    this.#imageService = imageService;
  }

  @action.get({ path: '/images' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    try {
      const imageDtos = this.#imageService.getImages().map<ImageDto>(({ name }) => ({ name }));

      this.logger.info(`${this.loggerLabel} Get images`, { imageDtos });
      res.send(imageDtos);
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error get images`, { error });
      return this.serverError(res, 'Can not get images');
    }
  }

  @action.get({
    path: '/image/:name',
    middlewares: [storageContainer.resolve(ValidatorMiddleware).handler(ApiDtoSchema.ImageDto, 'params')],
  })
  public getImage(req: ExpressRequest, res: ExpressResponse): void {
    try {
      const name = req.params['name'] as string;

      const image = this.#imageService.getImage(name);
      if (!image) {
        this.logger.debug(`${this.loggerLabel} Image not found`, { name });
        return this.notFound(res, 'Image not found');
      }

      const imageDto: ImageDto = {
        name: image.name,
      };

      this.logger.info(`${this.loggerLabel} Get image`, { imageDto });
      return this.ok(res, imageDto);
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error get image`, { error });
      return this.serverError(res, 'Can not get image');
    }
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
      const file = req.file as ResolvedFile;

      const existedImage = this.#imageService.getImage(imageDto.name);
      if (existedImage) {
        this.logger.debug(`${this.loggerLabel} Image already exists`, { imageDto });
        this.#imageService.removeTempUploadImage(file);

        return this.conflict(res, 'Image already exists');
      }

      const newImage = this.#imageService.saveImage(file, imageDto.name);
      const newImageDto: ImageDto = {
        name: newImage.name,
      };

      this.logger.info(`${this.loggerLabel} Image uploaded`, { image: newImage });
      return this.created(res, newImageDto);
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error process uploaded image`, { error });
      return this.serverError(res, 'Can not process uploaded image');
    }
  }

  @action.delete({
    path: '/image/:name',
    middlewares: [storageContainer.resolve(ValidatorMiddleware).handler(ApiDtoSchema.ImageDto, 'params')],
  })
  public delete(req: ExpressRequest, res: ExpressResponse): void {
    try {
      const name = req.params['name'] as string;

      const image = this.#imageService.getImage(name);
      if (!image) {
        this.logger.debug(`${this.loggerLabel} Image not found`, { name });
        return this.notFound(res, 'Image not found');
      }

      this.#imageService.removeImage(image);

      this.logger.info(`${this.loggerLabel} Image deleted`, { image });
      return this.noContent(res);
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error delete image`, { error });
      return this.serverError(res, 'Can not delete image');
    }
  }
}
