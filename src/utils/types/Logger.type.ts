/** Logger configuration. */
export type LoggerConfig = {
  /** Log directory. */
  readonly dir: string;
};

/** Logger. */
export interface ILogger {
  /**
   * Log an error message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  error(message: string, ...meta: unknown[]): void;

  /**
   * Log a warning message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  warn(message: string, ...meta: unknown[]): void;

  /**
   * Log a info message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  info(message: string, ...meta: unknown[]): void;

  /**
   * Log a debug message.
   *
   * @param message Message.
   * @param meta Additional data.
   */
  debug(message: string, ...meta: unknown[]): void;
}
