import dayjs from 'dayjs';
import { pool } from '../db/pool.js';
import { appConfig } from '../config/appConfig.js';

function calculateCost(minutos, tarifaPorHora) {
  const rate = tarifaPorHora ?? 1.5; // tarifa por hora por defecto en moneda local
  const hours = minutos / 60;
  return Number((hours * rate).toFixed(2));
}

export async function startSession(payload) {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const [result] = await pool.query(
    `INSERT INTO sesiones (usuario_id, estacion_id, inicio, estado, reserva_id)
     VALUES (:usuarioId, :estacionId, :inicio, 'activa', :reservaId)`
    , {
      usuarioId: payload.usuarioId,
      estacionId: payload.estacionId,
      inicio: now,
      reservaId: payload.reservaId ?? null
    }
  );

  const durationMinutes = appConfig.sessionDefaults.durationMinutes;

  return {
    id: result.insertId,
    usuarioId: payload.usuarioId,
    estacionId: payload.estacionId,
    inicio: now,
    fin: null,
    estado: 'activa',
    minutosConsumidos: 0,
    costoTotal: calculateCost(durationMinutes, payload.tarifaPorHora)
  };
}

export async function endSession(payload) {
  const cierre = dayjs();
  const [rows] = await pool.query(
    `SELECT id, usuario_id AS usuarioId, estacion_id AS estacionId, inicio, estado
     FROM sesiones
     WHERE id = :sesionId`,
    { sesionId: payload.sesionId }
  );

  const sessionRow = Array.isArray(rows) ? rows[0] : null;
  if (!sessionRow) {
    const error = new Error('Sesión no encontrada');
    error.status = 404;
    throw error;
  }

  if (sessionRow.estado !== 'activa') {
    const error = new Error('La sesión ya fue cerrada previamente');
    error.status = 409;
    throw error;
  }

  const inicio = dayjs(sessionRow.inicio);
  const minutos = payload.minutosConsumidos ?? cierre.diff(inicio, 'minute');
  const costo = calculateCost(minutos, payload.tarifaPorHora);

  await pool.query(
    `UPDATE sesiones
     SET fin = :fin,
         minutos_consumidos = :minutos,
         costo_total = :costo,
         estado = 'finalizada'
     WHERE id = :sesionId`,
    {
      fin: cierre.format('YYYY-MM-DD HH:mm:ss'),
      minutos,
      costo,
      sesionId: payload.sesionId
    }
  );

  return {
    id: sessionRow.id,
    usuarioId: sessionRow.usuarioId,
    estacionId: sessionRow.estacionId,
    inicio: inicio.format('YYYY-MM-DD HH:mm:ss'),
    fin: cierre.format('YYYY-MM-DD HH:mm:ss'),
    estado: 'finalizada',
    minutosConsumidos: minutos,
    costoTotal: costo
  };
}

export async function getActiveSessions() {
  const [rows] = await pool.query(
    `SELECT id, usuario_id AS usuarioId, estacion_id AS estacionId, inicio, fin, estado,
            minutos_consumidos AS minutosConsumidos, costo_total AS costoTotal
     FROM sesiones
     WHERE estado = 'activa'
     ORDER BY inicio ASC`
  );
  return Array.isArray(rows) ? rows : [];
}
