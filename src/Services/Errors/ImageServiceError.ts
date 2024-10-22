/** ImageService Error. */
export default class ImageServiceError extends Error {
  public constructor(message: string, cause?: unknown) {
    super(message);

    this.name = 'ImageServiceError';
    this.cause = cause;
  }
}
