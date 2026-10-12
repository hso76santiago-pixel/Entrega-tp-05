const path = require("node:path");
const { leerJson } = require("./archivos");
const { leerConfiguracion } = require("./configuracion");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearApp } = require("./app");
const rutaDatos = path.join(__dirname, "..", "datos", "reservas.json");

// Función para leer el JSON de forma segura

async function main() {
  // 1. Cargamos la configuración (puerto y formato de registro)
  const { puerto, formatoRegistro } = leerConfiguracion();

  // 2. Cargamos las reservas iniciales desde el archivo JSON (o array vacío si falla)
  const reservasIniciales = await leerJson(rutaDatos);

  // 3. Creamos el servicio inyectándole los datos
  const servicioReservas = crearServicioReservas(reservasIniciales);

  // 4. Creamos la app inyectándole el servicio y el formato de registro
  const app = crearApp({ servicioReservas, formatoRegistro });

  // 5. Iniciamos el servidor usando la variable 'puerto' validada
  app.listen(puerto, () => {
    console.log(`Aplicación disponible en http://localhost:${puerto}`);
  });
}

main().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error);
  process.exitCode = 1;
});
