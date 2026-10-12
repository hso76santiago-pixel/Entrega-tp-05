// Router de Reservas

const express = require("express");
const { prepararAreaReservas } = require("../middleware/reservas");

function crearRouterReservas(controladorReservas) {
  const router = express.Router();

  // Middleware específico para el área de reservas
  router.use(prepararAreaReservas);

  // Rutas mapeadas a los métodos del controlador
  router.get("/", controladorReservas.listar);
  router.get("/nueva", controladorReservas.mostrarFormulario);
  router.get("/:id", controladorReservas.mostrarDetalle);
  router.post("/", controladorReservas.crear);

  return router;
}

module.exports = { crearRouterReservas };
