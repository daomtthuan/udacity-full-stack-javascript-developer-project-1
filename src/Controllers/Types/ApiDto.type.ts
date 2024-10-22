import type Zod from 'zod';

import type { ApiDtoSchema } from '~Controllers/Schemas/ApiDtoSchema';

/** Image DTO. */
export type ImageDto = Zod.infer<typeof ApiDtoSchema.ImageDto>;
