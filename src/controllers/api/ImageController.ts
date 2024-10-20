import type { ExpressRequest, ExpressResponse } from '~core/types';

import ApiControllerBase from '~controllers/api/ApiControllerBase';
import { action, controller } from '~core/decorators';

/** Image Processing API controller. */
@controller({ path: '/image' })
export default class ImageController extends ApiControllerBase {
  @action.get({ path: '/:name' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Loading image by name');

    res.send('Image');
  }
}
