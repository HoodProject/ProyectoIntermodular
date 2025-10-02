import { Router } from 'express';
import { getReservations, postReservation } from '../controllers/reservationController.js';

export const reservationRouter = Router();

reservationRouter.get('/', async (req, res, next) => {
  try {
    await getReservations(req, res);
  } catch (error) {
    next(error);
  }
});

reservationRouter.post('/', async (req, res, next) => {
  try {
    await postReservation(req, res);
  } catch (error) {
    next(error);
  }
});
