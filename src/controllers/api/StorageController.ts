import type { Request, Response } from 'express';

import ApiControllerBase from '~controllers/api/ApiControllerBase';
import { controller, getAction } from '~core/decorators';

@controller({ path: '/storage' })
export default class StorageController extends ApiControllerBase {
  @getAction({ path: '/images' })
  public getImages(_req: Request, res: Response) {
    this.logger.info('Getting images');

    res.send('Images');
  }
}
