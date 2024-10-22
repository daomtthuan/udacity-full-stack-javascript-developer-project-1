import Zod from 'zod';

/** Api DTO schema. */
export class ApiDtoSchema {
  /** Image DTO. */
  public static readonly ImageDto = Zod.object({
    name: Zod.string().min(1),
  });

  /** Image thumbnail DTO. */
  public static readonly ImageThumbnailDto = Zod.object({
    width: Zod.coerce.number().int().positive(),
    height: Zod.coerce.number().int().positive(),
  });
}
