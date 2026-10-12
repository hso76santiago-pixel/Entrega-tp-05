// Constantes de dominio
const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function crearServicioReservas(datosIniciales) {
  let reservas = [...datosIniciales];
  const idInstitucional = "BIB-2026";

  return {
    obtenerTodas: () => reservas,
    obtenerPorId: (id) => reservas.find((r) => r.id === id),
    obtenerCantidad: () => reservas.length,
    obtenerIdInstitucional: () => idInstitucional,
    crear: (nuevaReserva) => {
      const ultimoId = reservas.reduce(
        (mayorId, r) => Math.max(mayorId, r.id),
        0,
      );
      const reservaConId = { id: ultimoId + 1, ...nuevaReserva };
      reservas.push(reservaConId);
      return reservaConId;
    },
    salasPermitidas,
    turnosPermitidos,
  };
}

module.exports = { crearServicioReservas, salasPermitidas, turnosPermitidos };
