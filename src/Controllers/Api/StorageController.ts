import FileSystem from 'fs';
import Path from 'path';
import { container } from 'tsyringe';

import type { ImageDto } from '~Controllers/Types/ApiDto.type';
import type { ExpressRequest, ExpressResponse } from '~Core/Types/App.type';
import type { DirectoryConfig } from '~Core/Types/Configuration.type';
import type { ResolvedFile } from '~Middlewares/Types/UploadFile.type';

import ApiControllerBase from '~Controllers/Api/ApiControllerBase';
import StorageValidator from '~Controllers/Api/Validators/StorageValidator';
import { ApiDtoSchema } from '~Controllers/Schemas/ApiDtoSchema';
import { action, controller } from '~Core/Decorators';
import Configuration from '~Core/Modules/Configuration';
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
  readonly #directoryConfig: DirectoryConfig;
  readonly #validator: StorageValidator;

  public constructor(config: Configuration, logger: Logger, validator: StorageValidator) {
    super(logger);

    this.#directoryConfig = config.directoryConfig;
    this.#validator = validator;
  }

  @action.get({ path: '/images' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    try {
      const imageResourceDir = Path.resolve(this.#directoryConfig.resourceDir, ImageStorage.DIR);
      const imageDtos = FileSystem.readdirSync(imageResourceDir).reduce<ImageDto[]>((prev, file) => {
        const filePath = Path.resolve(imageResourceDir, file);
        if (FileSystem.statSync(filePath).isFile()) {
          prev.push({
            name: Path.basename(file, Path.extname(file)),
          });
        }

        return prev;
      }, []);

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
      if (!this.#validator.isExistImage(name)) {
        this.logger.debug(`${this.loggerLabel} Image not found`, { name });
        return this.notFound(res, 'Image not found');
      }

      const imageDto: ImageDto = {
        name,
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

      if (this.#validator.isExistImage(imageDto.name)) {
        this.logger.debug(`${this.loggerLabel} Image already exists`, { imageDto });
        FileSystem.rmSync(file.path);

        return this.conflict(res, 'Image already exists');
      }

      const imagePath = Path.resolve(this.#directoryConfig.resourceDir, ImageStorage.DIR, `${imageDto.name}${Path.extname(file.originalname)}`);
      FileSystem.renameSync(file.path, imagePath);

      this.logger.info(`${this.loggerLabel} Image uploaded`, { path: imagePath });
      return this.created(res, imageDto);
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
      const imagePath = this.#validator.isExistImage(name);
      if (!imagePath) {
        this.logger.debug(`${this.loggerLabel} Image not found`, { name });
        return this.notFound(res, 'Image not found');
      }

      FileSystem.rmSync(imagePath);

      this.logger.info(`${this.loggerLabel} Image deleted`, { name, imagePath });
      return this.noContent(res);
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error delete image`, { error });
      return this.serverError(res, 'Can not delete image');
    }
  }
}
