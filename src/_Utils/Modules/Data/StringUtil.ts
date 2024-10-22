/** String utility. */
export default class StringUtil {
  /**
   * Resolve path.
   *
   * @param paths Paths to resolve.
   *
   * @returns Resolved path.
   */
  public static resolvePath(...paths: (string | undefined)[]): string {
    let resolvedPath = paths
      .filter((path): path is string => !!path)
      .map((path) => path?.replace(/\\/g, '/'))
      .join('/')
      .replace(/\/{2,}/g, '/');

    resolvedPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;
    resolvedPath = resolvedPath.endsWith('/') ? resolvedPath.slice(0, -1) : resolvedPath;

    return resolvedPath;
  }
}
