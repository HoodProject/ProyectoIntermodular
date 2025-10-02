import { z } from 'zod';

export const createReservationSchema = z.object({
  usuarioId: z.number().int().positive(),
  estacionId: z.number().int().positive(),
  inicio: z.string().datetime({ offset: true }).or(z.string().min(1)),
  fin: z.string().datetime({ offset: true }).or(z.string().min(1))
});

