import type { FormatEnum } from 'sharp';

/** Image format. */
export type ImageFormat = keyof FormatEnum;

/** Process image options. */
export type ProcessImageOptions = {
  /** Image width. */
  readonly width: number;

  /** Image height. */
  readonly height: number;
};
