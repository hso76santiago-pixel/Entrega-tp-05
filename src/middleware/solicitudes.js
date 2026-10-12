let numeroDeSolicitud = 0;

// Middleware 1: Función creadora que retorna el middleware
function crearIdentificadorSolicitud() {
  return function (req, res, next) {
    numeroDeSolicitud += 1;
    res.locals.solicitudId = `BIB-${String(numeroDeSolicitud).padStart(4, "0")}`;
    next();
  };
}

// Middleware 2: Medir duración
function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();
  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const milisegundos = Number(fin - inicio) / 1_000_000;
    console.log(
      `[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} - ${res.statusCode} ${milisegundos.toFixed(2)} ms`,
    );
  });
  next();
}

module.exports = {
  crearIdentificadorSolicitud,
  medirDuracion,
};
