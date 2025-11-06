import express from 'express';
import { generateCertPDF } from '../controllers/certController.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

router.get('/:intentoId/pdf', authRequired, generateCertPDF);

export default router;
