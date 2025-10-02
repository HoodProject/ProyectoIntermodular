import { endSessionSchema, startSessionSchema } from '../validators/sessionValidator.js';
import { endSession, getActiveSessions, startSession } from '../services/sessionService.js';

export async function getActiveSessionsHandler(_req, res) {
  const sessions = await getActiveSessions();
  return res.json({ data: sessions });
}

export async function postStartSession(req, res) {
  const parsed = startSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', details: parsed.error.flatten() });
  }
  const session = await startSession(parsed.data);
  return res.status(201).json({ data: session });
}

export async function postEndSession(req, res) {
  const parsed = endSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', details: parsed.error.flatten() });
  }
  const session = await endSession(parsed.data);
  return res.status(200).json({ data: session });
}
