export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500;
  const payload = {
    message: err.message ?? 'Error inesperado',
    details: err.details ?? null
  };
  if (status >= 500) {
    console.error(err);
  }
  return res.status(status).json(payload);
}
