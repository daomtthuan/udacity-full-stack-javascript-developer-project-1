import type { Multer, StorageEngine } from 'multer';

/** Resolved File. */
export type ResolvedFile = Express.Multer.File;

/** Multer Resolver. */
export type MulterResolver = Multer;

/** File Storage. */
export interface IFileStorage {
  /** Storage instance. */
  instance: StorageEngine;
}
