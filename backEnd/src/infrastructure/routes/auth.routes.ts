import { Router } from 'express';
import { AuthController } from '@infrastructure/controllers/AuthController';
import { validate } from '@infrastructure/middlewares/validate';
import { RegisterDto, LoginDto } from '@infrastructure/dto/auth.dto';

const router = Router();
const ctrl = new AuthController();

router.post('/register', validate(RegisterDto), ctrl.register.bind(ctrl));
router.post('/login', validate(LoginDto), ctrl.login.bind(ctrl));
router.post('/logout', ctrl.logout.bind(ctrl));

export default router;