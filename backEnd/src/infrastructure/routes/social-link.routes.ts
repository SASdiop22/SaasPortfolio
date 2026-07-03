import { Router } from 'express';
import { SocialLinkController } from '@infrastructure/controllers/SocialLinkController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { CreateSocialLinkDto, UpdateSocialLinkDto } from '@infrastructure/dto/social-link.dto';

const router = Router();
const ctrl = new SocialLinkController();

router.use(authMiddleware);

router.get('/', ctrl.getAll.bind(ctrl));
router.get('/:id', ctrl.getOne.bind(ctrl));
router.post('/', validate(CreateSocialLinkDto), ctrl.create.bind(ctrl));
router.put('/:id', validate(UpdateSocialLinkDto), ctrl.update.bind(ctrl));
router.delete('/:id', ctrl.delete.bind(ctrl));

export default router;