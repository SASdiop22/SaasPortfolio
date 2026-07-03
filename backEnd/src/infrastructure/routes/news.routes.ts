import { Router } from 'express';
import { NewsController } from '@infrastructure/controllers/NewsController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateNewsDto, UpdateNewsDto } from '@infrastructure/dto/news.dto';

const router = Router();
const ctrl = new NewsController();

router.use(authMiddleware);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate(CreateNewsDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateNewsDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

export default router;