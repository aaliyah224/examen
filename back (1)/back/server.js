import express from 'express';
import cors from 'cors';
import loginRoutes from './routes/loginRoutes.js';
import examRoutes from './routes/examRoutes.js';
import certRoutes from './routes/certRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', loginRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/cert', certRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
