import express from 'express';
import { login, register } from '../controllers/loginController.js';
import { authRequired } from '../middleware/authRequired.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authRequired, (req, res) => {
  res.json({
    message: 'Acceso autorizado al perfil protegido',
    user: req.user
  });
});

export default router;
