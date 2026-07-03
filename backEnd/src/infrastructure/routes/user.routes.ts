import { Router } from 'express';
import { UserController, avatarUpload } from '@infrastructure/controllers/UserController';
import { authMiddleware } from '@infrastructure/middlewares/authMiddleware';
import { validate } from '@infrastructure/middlewares/validate';
import { UpdateProfileDto } from '@infrastructure/dto/user.dto';

const router = Router();
const ctrl = new UserController();

router.use(authMiddleware);

router.get('/', ctrl.getProfile.bind(ctrl));
router.put('/', validate(UpdateProfileDto), ctrl.updateProfile.bind(ctrl));
router.post('/avatar', avatarUpload.single('avatar'), ctrl.uploadAvatar.bind(ctrl));

export default router;