import type { ExpressRequest, ExpressResponse } from '~Core/Types/App.type';

import ApiControllerBase from '~Controllers/Api/ApiControllerBase';
import actionBase from '~Core/Decorators/Action';
import controller from '~Core/Decorators/Controller';

/** Image Processing API controller. */
@controller({ path: '/image' })
export default class ImageController extends ApiControllerBase {
  @actionBase.get({ path: '/:name' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    this.logger.info('Loading image by name');

    res.send('Image');
  }
}
