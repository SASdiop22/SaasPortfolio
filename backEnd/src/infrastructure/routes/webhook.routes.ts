import { Router } from 'express';
import { WebhookController } from '@infrastructure/controllers/WebhookController';

const router = Router();
const controller = new WebhookController();

router.post('/clerk', (req, res) => controller.handleClerk(req, res));

export default router;