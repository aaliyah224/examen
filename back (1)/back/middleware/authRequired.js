import { validateToken } from '../utils/tokenManager.js';

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  const userData = validateToken(token);
  
  if (!userData) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.user = userData;
  next();
}
