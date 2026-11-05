const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productosRoutes = require('./routes/productosRoutes');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde Postman/navegador
app.use(express.json()); // Permite recibir JSON en el body

// Servir archivos estáticos (la página web)
app.use(express.static('public'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Rutas de la API
app.use('/api/productos', productosRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para errores internos (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;