import type { ExpressRequest, ExpressResponse } from '~Core/Types/App.type';

import ApiControllerBase from '~Controllers/Api/ApiControllerBase';
import { action, controller } from '~Core/Decorators';

/** Image Processing API controller. */
@controller({ path: '/image' })
export default class ImageController extends ApiControllerBase {
  @action.get({ path: '/:name' })
  public getImages(_req: ExpressRequest, res: ExpressResponse): void {
    res.send('Image');
  }
}
