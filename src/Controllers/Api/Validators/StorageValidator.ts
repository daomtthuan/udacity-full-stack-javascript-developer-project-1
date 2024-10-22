import FileSystem from 'fs';
import Path from 'path';
import { injectable } from 'tsyringe';

import type { DirectoryConfig } from '~Core/Types/Configuration.type';

import Configuration from '~Core/Modules/Configuration';
import ImageStorage from '~Middlewares/Modules/UploadFile/ImageStorage';

/** Storage Validator. */
@injectable()
export default class StorageValidator {
  readonly #config: DirectoryConfig;

  public constructor(config: Configuration) {
    this.#config = config.directoryConfig;
  }

  /**
   * Check if image exists.
   *
   * @param name Image name.
   *
   * @returns Image path. False if image not exists.
   */
  public isExistImage(name: string): false | string {
    const imageResourceDir = Path.resolve(this.#config.resourceDir, ImageStorage.DIR);
    const result = FileSystem.readdirSync(imageResourceDir).find((file) => {
      const imageName = Path.basename(file, Path.extname(file));
      return imageName === name;
    });

    return result ? Path.resolve(imageResourceDir, result) : false;
  }
}
