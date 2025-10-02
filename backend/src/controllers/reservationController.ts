import type { Request, Response } from 'express';
import { createReservationSchema } from '../validators/reservationValidator.js';
import { createReservation, listReservationsByDate } from '../services/reservationService.js';

export async function getReservations(req: Request, res: Response): Promise<Response> {
  const { date } = req.query;
  const targetDate = typeof date === 'string' ? date : new Date().toISOString();
  const reservas = await listReservationsByDate(targetDate);
  return res.json({ data: reservas });
}

export async function postReservation(req: Request, res: Response): Promise<Response> {
  const parsed = createReservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', details: parsed.error.flatten() });
  }

  const reserva = await createReservation(parsed.data);
  return res.status(201).json({ data: reserva });
}
