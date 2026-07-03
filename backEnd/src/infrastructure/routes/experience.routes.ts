import { Router } from 'express';
import { ExperienceController } from '@infrastructure/controllers/ExperienceController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateExperienceDto, UpdateExperienceDto } from '@infrastructure/dto/experience.dto';

const router = Router();
const ctrl = new ExperienceController();

router.use(authMiddleware);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate(CreateExperienceDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateExperienceDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

export default router;