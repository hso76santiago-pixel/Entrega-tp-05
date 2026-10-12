const { salasPermitidas, turnosPermitidos } = require("../servicios/reservas");

// Middleware de Router (Área)
function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

// Middleware de Validación POST

function validarReservas(req, res, next) {
  const estudiante = String(req.body.estudiante ?? "").trim();
  const email = String(req.body.email ?? "").trim();
  const sala = String(req.body.sala ?? "").trim();
  const fecha = String(req.body.fecha ?? "").trim();
  const turno = String(req.body.turno ?? "").trim();
  const personas = Number(req.body.personas ?? 0);

  const errores = [];

  if (!estudiante) errores.push("El nombre del estudiante es obligatorio.");
  if (!email || !email.includes("@"))
    errores.push("Debe ingresar un correo electrónico válido con '@'.");
  if (!salasPermitidas.includes(sala))
    errores.push("La sala seleccionada no es válida.");
  if (!fecha) errores.push("La fecha es obligatoria.");
  if (!turnosPermitidos.includes(turno))
    errores.push("El turno seleccionado no es válido.");
  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: errores.join(" "),
      valores: { estudiante, email, sala, fecha, turno, personas },
      salasPermitidas,
      turnosPermitidos,
    });
  }

  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
}
module.exports = { prepararAreaReservas, validarReservas };
