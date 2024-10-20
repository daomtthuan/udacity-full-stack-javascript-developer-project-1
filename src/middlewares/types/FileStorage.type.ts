import type { StorageEngine } from 'multer';

/** File Storage. */
export interface IFileStorage {
  /** Storage instance. */
  instance: StorageEngine;
}
