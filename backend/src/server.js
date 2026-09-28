import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import prisma from './config/prisma.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true // required so the browser sends/receives the refresh-token cookie
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.status(200).json({ success: true, data: { status: 'ok' } }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/projects', projectRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const server = app.listen(env.port, () => {
  console.log(`PMO Dashboard API listening on port ${env.port} (${env.nodeEnv})`);
});

// Graceful shutdown — closes the HTTP server and the Prisma connection pool
// instead of leaving Postgres connections hanging on redeploys/restarts.
async function shutdown(signal) {
  console.log(`\n${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
