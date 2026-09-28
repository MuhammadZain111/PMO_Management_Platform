// Wraps an async route/controller so a rejected promise is forwarded to
// Express's error handling (next(err)) instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
