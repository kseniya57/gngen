import * as Router from 'koa-router';
import uploadsController from './uploads';
import renderController from './render';

const router = new Router();

// @ts-ignore
router.post('/upload', ...uploadsController);
// @ts-ignore
router.get('/', renderController);
// @ts-ignore
router.get('/:path', renderController);

export default router.routes();
