import express from 'express';
import { startQuiz, submitAnswers, estadoIntento } from '../controllers/examController.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

router.post('/start', authRequired, startQuiz);
router.post('/submit', authRequired, submitAnswers);
router.get('/status/:intentoId', authRequired, estadoIntento);

export default router;
