import users from '../data/users.js';
import { generateToken } from '../utils/tokenManager.js';

export function login(req, res) {
  const { user, password } = req.body || {};

  if (!user || !password) {
    return res.status(400).json({
      error: "Faltan datos: 'user' y 'password'.",
      ejemplo: { user: "Gina", password: "gina123" }
    });
  }

  console.log("Datos recibidos del cliente:", req.body);

  const match = users.find(u => u.name === user && u.password === password);

  if (!match) {
    return res.status(401).json({ error: "Credenciales incorrectas." });
  }

  const token = generateToken(match);

  res.status(200).json({
    mensaje: `Bienvenido, ${match.name}`,
    token,
    user: { id: match.id, name: match.name }
  });
}

export function register(req, res) {
  const { user, email, password } = req.body || {};

  if (!user || !password) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  if (users.some(u => u.name === user)) {
    return res.status(409).json({ error: "Ese usuario ya existe." });
  }

  const newUser = {
    id: users.length + 1,
    name: user,
    email: email || '',
    password
  };

  users.push(newUser);

  const token = generateToken(newUser);

  res.status(201).json({
    mensaje: `Usuario ${user} registrado correctamente.`,
    token,
    user: { id: newUser.id, name: newUser.name }
  });
}
