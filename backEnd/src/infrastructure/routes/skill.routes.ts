import { Router } from 'express';
import { SkillController } from '@infrastructure/controllers/SkillController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateSkillDto, UpdateSkillDto } from '@infrastructure/dto/skill.dto';

const router = Router();
const ctrl = new SkillController();

router.use(authMiddleware);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate(CreateSkillDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateSkillDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

export default router;