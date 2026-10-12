# TP 06: Aplicación Modular de Reserva de Salas

Proyecto backend desarrollado en Node.js y Express aplicando una arquitectura modular, inyección de dependencias, lectura segura de archivos JSON y buenas prácticas de desarrollo.

## 📁 Estructura del Proyecto

- `datos/`: Contiene el archivo de persistencia `reservas.json`.
- `public/`: Archivos estáticos (CSS, imágenes, cliente JS).
- `views/`: Plantillas de renderizado HTML.
- `src/`:
  - `archivos.js`: Módulo seguro de lectura de JSON.
  - `configuracion.js`: Interpretación de variables de entorno.
  - `index.js`: Punto de entrada del proyecto.
  - `app.js`: Configuración del pipeline de Express.
  - `rutas/`: Definición de endpoints HTTP.
  - `controladores/`: Lógica de solicitud y respuesta HTTP.
  - `servicios/`: Operaciones de datos en memoria y persistencia.
  - `middleware/`: Validaciones e identificación de solicitudes.

## 🚀 Instalación y Ejecución

1. Clonar el repositorio e instalar dependencias:
   
   npm install