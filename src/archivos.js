const fs = require("node:fs/promises");

// Función encargada de la lectura del JSON inicial
async function leerJson(ruta) {
  try {
    const contenido = await fs.readFile(ruta, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    console.error(
      `Aviso: No se pudo leer el archivo en ${ruta}. Se iniciará con datos vacíos.`,
      error.message,
    );
    return [];
  }
}

module.exports = {
  leerJson,
};
