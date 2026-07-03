import { Router } from 'express';
import { ProjectController } from '@infrastructure/controllers/ProjectController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateProjectDto, UpdateProjectDto } from '@infrastructure/dto/project.dto';

const router = Router();
const ctrl = new ProjectController();

router.use(authMiddleware);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate(CreateProjectDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateProjectDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

export default router;