CREATE DATABASE IF NOT EXISTS db_lab10
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_lab10;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Teclado mecánico', 'Switch azul', 120.50, 10),
('Mouse inalámbrico', 'Conexión USB-C', 45.90, 25),
('Monitor 24 pulgadas', 'Full HD', 650.00, 5);