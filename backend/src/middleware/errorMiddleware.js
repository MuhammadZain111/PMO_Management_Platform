import { env } from '../config/env.js';

// Every error in the app — thrown AppError, Prisma error, Zod error already
// converted by validationMiddleware, or an unexpected bug — ends up here.
// Response shape is always { success: false, message }, per the API spec.
export function errorMiddleware(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Prisma known error codes worth mapping to sane HTTP statuses.
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `A record with this ${err.meta?.target?.join?.(', ') || 'value'} already exists`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 'P2003') {
    statusCode = 409;
    message = 'This action would violate a related record constraint';
  }

  if (!err.isOperational && statusCode === 500) {
    console.error('[unhandled error]', err);
    if (env.isProd) message = 'Internal server error';
  }

  res.status(statusCode).json({ success: false, message });
}

export function notFoundMiddleware(req, res) {
  res.status(404).json({ success: false, message: `No route for ${req.method} ${req.originalUrl}` });
}
