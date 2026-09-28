// A thrown AppError carries the HTTP status it should map to. The central
// error middleware (errorMiddleware.js) is the only place that formats the
// response body, so every error — expected or not — comes out consistent.
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const Unauthorized = (message = 'Authentication required') => new AppError(message, 401);
export const Forbidden = (message = 'You do not have permission to perform this action') => new AppError(message, 403);
export const NotFound = (message = 'Resource not found') => new AppError(message, 404);
export const Conflict = (message = 'Conflict') => new AppError(message, 409);
export const ValidationError = (message = 'Validation failed') => new AppError(message, 422);
