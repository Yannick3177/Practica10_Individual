const pool = require('../config/db');

// Función auxiliar para validar datos
function validarProducto(datos, esActualizacion = false) {
  const errores = [];
  
  if (!esActualizacion || datos.nombre !== undefined) {
    if (!datos.nombre || datos.nombre.trim() === '') errores.push('El nombre es obligatorio');
  }
  
  if (!esActualizacion || datos.precio !== undefined) {
    if (datos.precio === undefined || Number(datos.precio) <= 0) errores.push('El precio debe ser mayor a 0');
  }
  
  if (!esActualizacion || datos.stock !== undefined) {
    if (datos.stock === undefined || Number(datos.stock) < 0) errores.push('El stock no puede ser negativo');
  }
  
  return errores;
}

// 1. LISTAR (GET)
exports.listar = async (req, res) => {
  try {
    // Usamos execute() para prevenir inyección SQL
    const [filas] = await pool.execute(
      'SELECT * FROM productos WHERE activo = 1 ORDER BY id DESC'
    );
    res.status(200).json(filas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// 2. OBTENER POR ID (GET /:id)
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const [filas] = await pool.execute(
      'SELECT * FROM productos WHERE id = ? AND activo = 1',
      [id]
    );
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(filas[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// 3. CREAR (POST)
exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    
    // Validar
    const errores = validarProducto(req.body);
    if (errores.length > 0) return res.status(400).json({ errores });

    const [resultado] = await pool.execute(
      'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || null, precio, stock]
    );

    res.status(201).json({ 
      mensaje: 'Producto creado', 
      id: resultado.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// 4. ACTUALIZAR (PUT)
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    // 1. Validar datos (esActualizacion = true)
    const errores = validarProducto(req.body, true);
    if (errores.length > 0) return res.status(400).json({ errores });

    // 2. Ejecutar la actualización en la base de datos
    const [resultado] = await pool.execute(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ? AND activo = 1',
      [nombre, descripcion || null, precio, stock, id]
    );

    // 3. Si affectedRows es 0, el ID no existía o estaba inactivo
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
    }

    res.status(200).json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// 5. ELIMINAR LÓGICO (DELETE)
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Eliminación lógica: solo cambiamos el estado 'activo' a 0
    const [resultado] = await pool.execute(
      'UPDATE productos SET activo = 0 WHERE id = ? AND activo = 1',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado o ya eliminado' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado lógicamente (activo = 0)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};