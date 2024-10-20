import type { Request, Response } from 'express';

import Multer from 'multer';

import ApiControllerBase from '~controllers/api/ApiControllerBase';
import { action, controller } from '~core/decorators';

const upload = Multer({
  dest: 'uploads/',
});

/** Image Storage API controller. */
@controller({ path: '/storage' })
export default class StorageController extends ApiControllerBase {
  @action.get({ path: '/images' })
  public getImages(_req: Request, res: Response): void {
    this.logger.info('Loading image list');

    res.send('Image list');
  }

  @action.get({ path: '/image/:name' })
  public getImage(_req: Request, res: Response): void {
    this.logger.info('Get image info');

    res.send('Image info');
  }

  @action.post({
    path: '/upload',
    middleware: [upload.single('image')],
  })
  public uploadImage(req: Request, res: Response): void {
    console.log(req.file, req.body);

    res.send('Image uploaded');
  }

  @action.delete({ path: '/image/:name' })
  public delete(_req: Request, res: Response): void {
    this.logger.info('Delete image');

    res.send('Image deleted');
  }
}
