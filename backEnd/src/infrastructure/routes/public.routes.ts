import { Router } from 'express';
import { PublicController } from '@infrastructure/controllers/PublicController';

const router = Router();
const ctrl = new PublicController();

router.get('/:username', ctrl.getPortfolio.bind(ctrl));
router.post('/:username/contact', ctrl.sendContact.bind(ctrl));

export default router;