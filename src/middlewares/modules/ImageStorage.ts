import type { StorageEngine } from 'multer';

import FileSystem from 'fs';
import Multer from 'multer';
import Path from 'path';
import { injectable } from 'tsyringe';
import { v4 as UUID } from 'uuid';

import type { DirectoryConfig, ExpressRequest } from '~core/types';
import type { IFileStorage, ResolvedFile } from '~middlewares/types';

import Configuration from '~core/modules/Configuration';
import Loggable from '~utils/Loggable';
import Logger from '~utils/Logger';

/** Image Storage. */
@injectable()
export default class ImageStorage extends Loggable implements IFileStorage {
  readonly #config: DirectoryConfig;

  readonly #instance: StorageEngine;

  private readonly DIR = 'images';

  public constructor(config: Configuration, logger: Logger) {
    super(logger);

    this.#config = config.directoryConfig;

    this.#instance = Multer.diskStorage({
      destination: this.#destination.bind(this),
      filename: this.#filename.bind(this),
    });
  }

  #destination(_req: ExpressRequest, _file: ResolvedFile, resolve: (error: Error | null, destination: string) => void): void {
    const dir = Path.resolve(this.#config.resourceDir, this.DIR);
    if (!FileSystem.existsSync(dir)) {
      FileSystem.mkdirSync(dir, { recursive: true });
    }

    resolve(null, Path.resolve(this.#config.resourceDir, this.DIR));
  }

  #filename(_req: ExpressRequest, file: ResolvedFile, resolve: (error: Error | null, filename: string) => void): void {
    const fileName = UUID() + Path.extname(file.originalname);
    resolve(null, fileName);
  }

  public get instance(): StorageEngine {
    return this.#instance;
  }
}
