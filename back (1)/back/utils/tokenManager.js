import { randomUUID } from 'crypto';

const sessions = new Map();

export const generateToken = (user) => {
  const token = randomUUID();
  sessions.set(token, { 
    id: user.id, 
    name: user.name,
    nombreCompleto: user.name
  });
  return token;
};

export const validateToken = (token) => {
  return sessions.get(token);
};
