CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,       -- La columna 'id' es auto-incrementable
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL,
  saldo DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE transacciones (
  id SERIAL PRIMARY KEY,
  usuario_id_emisor INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  usuario_id_receptor INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descripcion TEXT
);
