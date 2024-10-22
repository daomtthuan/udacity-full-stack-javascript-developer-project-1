/** Image model. */
export default class Image {
  /** Name. */
  public accessor name: string;

  /** Path. */
  public accessor path: string;

  public constructor({ name, path }: Image) {
    this.name = name;
    this.path = path;
  }
}
