const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");

const PORT = process.env.PORT || 3000;

// Constantes de dominio
const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

// Base de datos inicial en memoria (mínimo 4 registros)
const reservas = [
  { id: 1, estudiante: "Juan Pérez", email: "juan@example.com", sala: "Sala Norte", fecha: "2026-10-15", turno: "Mañana", personas: 2 },
  { id: 2, estudiante: "María Gómez", email: "maria@example.com", sala: "Sala Sur", fecha: "2026-10-16", turno: "Tarde", personas: 4 },
  { id: 3, estudiante: "Carlos López", email: "carlos@example.com", sala: "Sala Multimedia", fecha: "2026-10-17", turno: "Noche", personas: 1 },
  { id: 4, estudiante: "Ana Martínez", email: "ana@example.com", sala: "Sala Norte", fecha: "2026-10-18", turno: "Tarde", personas: 3 }
];

let numeroDeSolicitud = 0;

// Pipeline - Middleware Personalizado Global 1
function identificarSolicitud(req, res, next) {
  numeroDeSolicitud += 1;
  res.locals.solicitudId = `BIB-${String(numeroDeSolicitud).padStart(4, "0")}`;
  next();
}

// Pipeline - Middleware Personalizado Global 2
function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();
  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const milisegundos = Number(fin - inicio) / 1_000_000;
    console.log(
      `[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} ` +
        `${res.statusCode} ${milisegundos.toFixed(2)} ms`
    );
  });
  next();
}

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
  if (!email || !email.includes("@")) errores.push("Debe ingresar un correo electrónico válido con '@'.");
  if (!salasPermitidas.includes(sala)) errores.push("La sala seleccionada no es válida.");
  if (!fecha) errores.push("La fecha es obligatoria.");
  if (!turnosPermitidos.includes(turno)) errores.push("El turno seleccionado no es válido.");
  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push("La cantidad de personas debe ser un número entero entre 1 y 6.");
  }

  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: errores.join(" "),
      valores: { estudiante, email, sala, fecha, turno, personas },
      salasPermitidas,
      turnosPermitidos
    });
  }

  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
}

// Handler Final POST
function crearReservas(req, res) {
  const ultimoId = reservas.reduce((mayorId, r) => Math.max(mayorId, r.id), 0);
  const nuevaReserva = { id: ultimoId + 1, ...req.reservaValidada };
  reservas.push(nuevaReserva);
  res.redirect(302, "/reservas");
}

// Inicialización de Express
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.set("layout", "layouts/main");

// Pipeline de Middlewares (Orden Estricto Obligatorio)
app.use(morgan("dev"));
app.use(identificarSolicitud);
app.use(medirDuracion);
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas Aplicación Globales
app.get("/", (req, res) => {
  res.render("inicio", { titulo: "Inicio" });
});

app.get("/estado", (req, res) => {
  res.json({
    servicio: "activo",
    cantidadReservas: reservas.length,
    solicitudId: res.locals.solicitudId
  });
});

// Router de Reservas
const reservasRouter = express.Router();
reservasRouter.use(prepararAreaReservas);

reservasRouter.get("/", (req, res) => {
  res.render("reservas/lista", {
    titulo: "Listado de Reservas",
    reservas
  });
});

reservasRouter.get("/nueva", (req, res) => {
  res.render("reservas/nueva", {
    titulo: "Nueva Reserva",
    error: null,
    valores: {},
    salasPermitidas,
    turnosPermitidos
  });
});

reservasRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const reserva = reservas.find((r) => r.id === id);

  if (!reserva) {
    return res.status(404).render("no-encontrado", {
      titulo: "Reserva No Encontrada",
      mensaje: "No existe una reserva con ese identificador."
    });
  }

  res.render("reservas/detalle", {
    titulo: `Detalle de Reserva #${reserva.id}`,
    reserva
  });
});

reservasRouter.post("/", validarReservas, crearReservas);

app.use("/reservas", reservasRouter);

// Middleware Final 404
app.use((req, res) => {
  res.status(404).render("no-encontrado", {
    titulo: "Página no encontrada",
    mensaje: "La dirección solicitada no existe."
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});