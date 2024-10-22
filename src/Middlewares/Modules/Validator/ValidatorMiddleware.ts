import type { RequestHandler } from 'express';

import { injectable } from 'tsyringe';
import { ZodError, type ZodObject, type ZodRawShape } from 'zod';

import type { ValidationErrorDto, ValidationTarget } from '~Middlewares/Types/Validator.type';

import Middleware from '~Core/Modules/Middleware';
import Logger from '~Utils/Modules/Logger/Logger';

/** Validator Middleware. */
@injectable()
export default class ValidatorMiddleware extends Middleware {
  public constructor(logger: Logger) {
    super(logger);
  }

  public handler<S extends ZodRawShape>(schema: ZodObject<S>, target: ValidationTarget = 'body', message: string = 'Invalid Request Data'): RequestHandler {
    return (req, res, next) => {
      try {
        schema.parse(req[target]);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationErrorDto = error.errors.reduce<ValidationErrorDto>(
            (prev, { path, message }) => {
              const key = path.join('.');
              prev.cause[key] = message;

              return prev;
            },
            { message, cause: {} },
          );

          res.status(400).send(validationErrorDto);
        } else {
          this.logger.error(`${this.loggerLabel} Error execute validator`, { error });
          res.status(500).send('Internal server error');
        }
      }
    };
  }
}
