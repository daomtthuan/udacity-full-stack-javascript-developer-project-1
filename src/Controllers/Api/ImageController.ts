import { container } from 'tsyringe';

import type { ExpressRequest, ExpressResponse } from '~Core/Types/App.type';

import ApiControllerBase from '~Controllers/Api/ApiControllerBase';
import { ApiDtoSchema } from '~Controllers/Schemas/ApiDtoSchema';
import { action, controller } from '~Core/Decorators';
import { MiddlewareToken } from '~Middlewares/Constants/MiddlewareToken';
import ImageStorage from '~Middlewares/Modules/UploadFile/ImageStorage';
import ValidatorMiddleware from '~Middlewares/Modules/Validator/ValidatorMiddleware';
import ImageService from '~Services/ImageService';
import Logger from '~Utils/Modules/Logger/Logger';

const storageContainer = container.createChildContainer();
storageContainer.register(MiddlewareToken.IFileStorage, ImageStorage);

/** Image Processing API controller. */
@controller({ path: '/image' })
export default class ImageController extends ApiControllerBase {
  readonly #imageService: ImageService;

  public constructor(logger: Logger, imageService: ImageService) {
    super(logger);

    this.#imageService = imageService;
  }

  @action.get({
    path: '/:name',
    middlewares: [
      storageContainer.resolve(ValidatorMiddleware).handler(ApiDtoSchema.ImageDto, 'params'),
      storageContainer.resolve(ValidatorMiddleware).handler(ApiDtoSchema.ImageThumbnailDto, 'query'),
    ],
  })
  public async getImages(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    try {
      const name = req.params['name'] as string;
      const width = Number(req.query['width']);
      const height = Number(req.query['height']);

      const image = this.#imageService.getImage(name);
      if (!image) {
        this.logger.debug(`${this.loggerLabel} Image not found`, { name });
        return this.notFound(res, 'Image not found');
      }

      const processImage = await this.#imageService.processImage(image, { width, height });

      this.logger.info(`${this.loggerLabel} Get image`, { processImage });
      return this.sendFile(res, processImage.path);
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error get processed image`, { error });
      return this.serverError(res, 'Can not get processed image');
    }
  }
}
