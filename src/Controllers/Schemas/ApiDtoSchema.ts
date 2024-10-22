import Zod from 'zod';

/** Api DTO schema. */
export class ApiDtoSchema {
  /** Image DTO. */
  public static readonly ImageDto = Zod.object({
    name: Zod.string().min(1),
  });
}
