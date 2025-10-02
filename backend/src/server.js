import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { appConfig } from './config/appConfig.js';
import { reservationRouter } from './routes/reservationRoutes.js';
import { sessionRouter } from './routes/sessionRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthCheck } from './db/pool.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', async (_req, res) => {
  const dbStatus = await healthCheck();
  res.json({ ok: true, database: dbStatus ? 'up' : 'down' });
});

app.use('/api/reservas', reservationRouter);
app.use('/api/sesiones', sessionRouter);

app.use(errorHandler);

app.listen(appConfig.port, () => {
  console.log(`🚀 API de ciber-café escuchando en el puerto ${appConfig.port}`);
});
