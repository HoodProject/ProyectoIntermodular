import mysql from 'mysql2/promise';
import { appConfig } from '../config/appConfig.js';

export const pool = mysql.createPool({
  host: appConfig.db.host,
  port: appConfig.db.port,
  user: appConfig.db.user,
  password: appConfig.db.password,
  database: appConfig.db.database,
  namedPlaceholders: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function healthCheck(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Error en verificación de base de datos', error);
    return false;
  }
}
