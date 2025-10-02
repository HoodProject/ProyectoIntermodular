import { z } from 'zod';

export const startSessionSchema = z.object({
  usuarioId: z.number().int().positive(),
  estacionId: z.number().int().positive(),
  reservaId: z.number().int().positive().optional(),
  tarifaPorHora: z.number().positive().optional()
});

export const endSessionSchema = z.object({
  sesionId: z.number().int().positive(),
  minutosConsumidos: z.number().int().positive().optional(),
  tarifaPorHora: z.number().positive().optional()
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type EndSessionInput = z.infer<typeof endSessionSchema>;
