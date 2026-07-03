import { Router } from 'express';
import { EducationController } from '@infrastructure/controllers/EducationController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateEducationDto, UpdateEducationDto } from '@infrastructure/dto/education.dto';

const router = Router();
const ctrl = new EducationController();

router.use(authMiddleware);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate(CreateEducationDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateEducationDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

export default router;