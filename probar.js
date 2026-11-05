const pool = require('./src/config/db');

(async () => {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM productos');
    console.log('¡Conexión OK! Productos en la BD:', rows[0].total);
    process.exit(0);
  } catch (error) {
    console.error('Error de conexión:', error.message);
    process.exit(1);
  }
})();