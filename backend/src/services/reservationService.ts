import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { pool } from '../db/pool.js';
import type { CreateReservationInput } from '../validators/reservationValidator.js';

dayjs.extend(utc);

export interface Reservation {
  id: number;
  usuarioId: number;
  estacionId: number;
  inicio: string;
  fin: string;
  estado: string;
}

export async function listReservationsByDate(date: string): Promise<Reservation[]> {
  const start = dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const end = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  const [rows] = await pool.query(
    `SELECT id, usuario_id AS usuarioId, estacion_id AS estacionId, inicio, fin, estado
     FROM reservas
     WHERE inicio BETWEEN :start AND :end
     ORDER BY inicio ASC`,
    { start, end }
  );
  return rows as Reservation[];
}

export async function createReservation(payload: CreateReservationInput): Promise<Reservation> {
  const inicio = dayjs(payload.inicio).utc().format('YYYY-MM-DD HH:mm:ss');
  const fin = dayjs(payload.fin).utc().format('YYYY-MM-DD HH:mm:ss');

  if (!dayjs(fin).isAfter(dayjs(inicio))) {
    const error = new Error('El horario final debe ser posterior al inicial');
    (error as Error & { status?: number }).status = 400;
    throw error;
  }

  const [conflicts] = await pool.query(
    `SELECT id FROM reservas
     WHERE estacion_id = :estacionId
       AND estado IN ('pendiente', 'confirmada')
       AND (
         (inicio <= :inicio AND fin > :inicio) OR
         (inicio < :fin AND fin >= :fin) OR
         (:inicio <= inicio AND :fin >= fin)
       )
     LIMIT 1`,
    {
      estacionId: payload.estacionId,
      inicio,
      fin
    }
  );

  if (Array.isArray(conflicts) && conflicts.length > 0) {
    const error = new Error('La estación ya está reservada en el intervalo seleccionado');
    (error as Error & { status?: number }).status = 409;
    throw error;
  }

  const [result] = await pool.query(
    `INSERT INTO reservas (usuario_id, estacion_id, inicio, fin, estado)
     VALUES (:usuarioId, :estacionId, :inicio, :fin, 'confirmada')`,
    {
      usuarioId: payload.usuarioId,
      estacionId: payload.estacionId,
      inicio,
      fin
    }
  );

  const insertResult = result as { insertId: number };

  return {
    id: insertResult.insertId,
    usuarioId: payload.usuarioId,
    estacionId: payload.estacionId,
    inicio,
    fin,
    estado: 'confirmada'
  };
}
