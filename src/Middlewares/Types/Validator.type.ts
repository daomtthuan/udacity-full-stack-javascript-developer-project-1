/** Validation Error Dto. */
export type ValidationErrorDto = {
  /** Error message. */
  message: string;

  /** Error cause. */
  cause: Record<string, string>;
};

/** Validation Target. */
export type ValidationTarget = 'body' | 'params' | 'query';
