import type { StorageEngine } from 'multer';

import FileSystem from 'fs';
import Multer from 'multer';
import Path from 'path';
import { injectable } from 'tsyringe';
import { v4 as UUID } from 'uuid';

import type { ExpressRequest } from '~Core/Types/App.type';
import type { DirectoryConfig } from '~Core/Types/Configuration.type';
import type { IFileStorage, ResolvedFile } from '~Middlewares/Types/UploadFile.type';

import Configuration from '~Core/Modules/Configuration';
import Loggable from '~Utils/Modules/Logger/Loggable';
import Logger from '~Utils/Modules/Logger/Logger';

/** Image Storage. */
@injectable()
export default class ImageStorage extends Loggable implements IFileStorage {
  public static readonly DIR = 'images';
  public static readonly TEMP_DIR = '.temp';

  readonly #config: DirectoryConfig;

  readonly #instance: StorageEngine;

  public constructor(config: Configuration, logger: Logger) {
    super(logger);

    this.#config = config.directoryConfig;

    this.#instance = Multer.diskStorage({
      destination: this.#destination.bind(this),
      filename: this.#filename.bind(this),
    });
  }

  #destination(_req: ExpressRequest, _file: ResolvedFile, resolve: (error: Error | null, destination: string) => void): void {
    const dir = Path.resolve(this.#config.resourceDir, ImageStorage.DIR, ImageStorage.TEMP_DIR);
    if (!FileSystem.existsSync(dir)) {
      FileSystem.mkdirSync(dir, { recursive: true });
    }

    resolve(null, Path.resolve(this.#config.resourceDir, ImageStorage.DIR, ImageStorage.TEMP_DIR));
  }

  #filename(_req: ExpressRequest, file: ResolvedFile, resolve: (error: Error | null, filename: string) => void): void {
    const fileName = UUID() + Path.extname(file.originalname);
    resolve(null, fileName);
  }

  public get instance(): StorageEngine {
    return this.#instance;
  }
}
