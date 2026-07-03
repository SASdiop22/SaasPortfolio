import { Router } from 'express';
import { ThemeController } from '@infrastructure/controllers/ThemeController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateThemeDto, UpdateThemeDto } from '@infrastructure/dto/theme.dto';

const router = Router();
const ctrl = new ThemeController();

router.use(authMiddleware);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate(CreateThemeDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateThemeDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));
router.post('/:id/active', ctrl.setActive.bind(ctrl));

export default router;