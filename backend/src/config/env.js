import 'dotenv/config';

const required = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'PMO_ADMIN_EMAIL',
  'PMO_ADMIN_PASSWORD'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}. Copy .env.example to .env and fill it in.`);
  }
}

export const env = {
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7),
  pmoAdminEmail: process.env.PMO_ADMIN_EMAIL,
  pmoAdminPassword: process.env.PMO_ADMIN_PASSWORD,
  pmoAdminName: process.env.PMO_ADMIN_NAME || 'PMO Administrator',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production'
};
