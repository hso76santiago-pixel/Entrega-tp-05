function crearControladorReservas(servicioReservas) {
  function listar(req, res) {
    res.render("reservas/lista", {
      titulo: "Listado de Reservas",
      reservas: servicioReservas.obtenerTodas(),
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: null,
      valores: {},
      salasPermitidas: servicioReservas.salasPermitidas,
      turnosPermitidos: servicioReservas.turnosPermitidos,
    });
  }

  function mostrarDetalle(req, res) {
    const id = Number(req.params.id);
    const reserva = servicioReservas.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva No Encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }

    res.render("reservas/detalle", {
      titulo: `Detalle de Reserva #${reserva.id}`,
      reserva,
    });
  }

  function crear(req, res) {
    servicioReservas.crear(req.body);
    res.redirect(302, "/reservas");
  }

  function listarApi(req, res) {
    res.json(servicioReservas.listar());
  }

  return {
    listar,
    mostrarFormulario,
    mostrarDetalle,
    crear,
    listarApi,
  };
}

module.exports = { crearControladorReservas };
