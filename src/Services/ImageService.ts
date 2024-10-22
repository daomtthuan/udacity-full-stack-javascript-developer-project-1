import FileSystem from 'fs';
import Path from 'path';
import Sharp from 'sharp';
import { injectable } from 'tsyringe';

import type { DirectoryConfig } from '~Core/Types/Configuration.type';
import type { ResolvedFile } from '~Middlewares/Types/UploadFile.type';
import type Image from '~Models/Image';
import type { ProcessImageOptions } from '~Services/Types/ImageService.type';

import Configuration from '~Core/Modules/Configuration';
import ImageStorage from '~Middlewares/Modules/UploadFile/ImageStorage';
import ImageServiceError from '~Services/Errors/ImageServiceError';
import Loggable from '~Utils/Modules/Logger/Loggable';
import Logger from '~Utils/Modules/Logger/Logger';

/** Image service. */
@injectable()
export default class ImageService extends Loggable {
  public static readonly CACHE_DIR = '.cache';

  readonly #directoryConfig: DirectoryConfig;

  public constructor(config: Configuration, logger: Logger) {
    super(logger);

    this.#directoryConfig = config.directoryConfig;
  }

  /**
   * Get all images from storage.
   *
   * @returns Images.
   */
  public getImages(): Image[] {
    try {
      const images = FileSystem.readdirSync(this.#imageResourceDir).reduce<Image[]>((prev, file) => {
        const filePath = Path.resolve(this.#imageResourceDir, file);
        if (FileSystem.statSync(filePath).isFile()) {
          prev.push({
            name: Path.basename(file, Path.extname(file)),
            path: filePath,
          });
        }

        return prev;
      }, []);

      this.logger.debug(`${this.loggerLabel} Get images`, { images });
      return images;
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error get images`, { error });
      throw new ImageServiceError('Can not get images', error);
    }
  }

  /**
   * Get image by name.
   *
   * @param name Image name.
   *
   * @returns Image.
   */
  public getImage(name: string): Image | null {
    try {
      const fileName = FileSystem.readdirSync(this.#imageResourceDir).find((file) => {
        const imageName = Path.basename(file, Path.extname(file));
        return imageName === name;
      });

      if (!fileName) {
        return null;
      }

      const filePath = Path.resolve(this.#imageResourceDir, fileName);
      const image: Image = {
        name,
        path: filePath,
      };

      this.logger.debug(`${this.loggerLabel} Get image`, { image });
      return image;
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error get image`, { error });
      throw new ImageServiceError('Can not get image', error);
    }
  }

  /**
   * Remove temp upload image.
   *
   * @param file Upload file.
   */
  public removeTempUploadImage(file: ResolvedFile): void {
    try {
      FileSystem.rmSync(file.path);
      this.logger.debug(`${this.loggerLabel} Remove temp upload image`, { file });
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error remove temp upload image`, { error });
      throw new ImageServiceError('Can not remove temp upload image', error);
    }
  }

  /**
   * Save image to storage.
   *
   * @param file Upload file.
   * @param name Image name.
   *
   * @returns Image.
   */
  public saveImage(file: ResolvedFile, name: string): Image {
    try {
      const imagePath = Path.resolve(this.#directoryConfig.resourceDir, ImageStorage.DIR, `${name}${Path.extname(file.originalname)}`);
      FileSystem.renameSync(file.path, imagePath);

      const image: Image = {
        name,
        path: imagePath,
      };

      this.logger.debug(`${this.loggerLabel} Save image`, { image });
      return image;
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error save image`, { error });
      throw new ImageServiceError('Can not save image', error);
    }
  }

  /**
   * Remove image from storage.
   *
   * @param image Image.
   */
  public removeImage(image: Image): void {
    try {
      FileSystem.rmSync(image.path);
      this.logger.debug(`${this.loggerLabel} Remove image`, { image });
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error remove image`, { error });
      throw new ImageServiceError('Can not remove image', error);
    }
  }

  /**
   * Process image.
   *
   * @param image Image.
   * @param options Process image options.
   *
   * @returns Processed image.
   */
  public async processImage(image: Image, options: ProcessImageOptions): Promise<Image> {
    try {
      const cacheDir = Path.resolve(this.#imageResourceDir, ImageService.CACHE_DIR);
      if (!FileSystem.existsSync(cacheDir)) {
        FileSystem.mkdirSync(cacheDir, { recursive: true });
      }

      const name = `${image.name}-${options.width}x${options.height}`;
      const filePath = Path.resolve(cacheDir, `${name}${Path.extname(image.path)}`);
      const processedImage: Image = {
        name: image.name,
        path: filePath,
      };

      if (FileSystem.existsSync(filePath)) {
        this.logger.debug(`${this.loggerLabel} Processed image already exists`, { processedImage });
        return processedImage;
      }

      await Sharp(image.path).resize(options.width, options.height).toFile(filePath);

      this.logger.debug(`${this.loggerLabel} Process image`, { processedImage });
      return processedImage;
    } catch (error) {
      this.logger.error(`${this.loggerLabel} Error process image`, { error });
      throw new ImageServiceError('Can not process image', error);
    }
  }

  get #imageResourceDir(): string {
    return Path.resolve(this.#directoryConfig.resourceDir, ImageStorage.DIR);
  }
}
