import { Router } from 'express';
import { getActiveSessionsHandler, postEndSession, postStartSession } from '../controllers/sessionController.js';

export const sessionRouter = Router();

sessionRouter.get('/activas', async (req, res, next) => {
  try {
    await getActiveSessionsHandler(req, res);
  } catch (error) {
    next(error);
  }
});

sessionRouter.post('/iniciar', async (req, res, next) => {
  try {
    await postStartSession(req, res);
  } catch (error) {
    next(error);
  }
});

sessionRouter.post('/cerrar', async (req, res, next) => {
  try {
    await postEndSession(req, res);
  } catch (error) {
    next(error);
  }
});
