import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`⚠️  Variable de entorno ${key} no está definida. Algunas funcionalidades pueden fallar.`);
  }
}

export const appConfig = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'cibercafe'
  },
  sessionDefaults: {
    durationMinutes: Number(process.env.SESSION_DURATION_MINUTES ?? 60)
  }
};
