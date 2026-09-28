import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

// Usage: router.post('/users', validate(createUserSchema), createUser)
// Validates req.body (or req.query/req.params via `part`) against a Zod schema.
export function validate(schema, part = 'body') {
  return (req, res, next) => {
    try {
      req[part] = schema.parse(req[part]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return next(new AppError(message || 'Validation failed', 422));
      }
      next(err);
    }
  };
}
