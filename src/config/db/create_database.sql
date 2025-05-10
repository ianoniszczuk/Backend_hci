CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,      
  cbu VARCHAR(22) NOT NULL UNIQUE,
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

CREATE TABLE tarjeta (
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    numero VARCHAR(16) NOT NULL PRIMARY KEY,
    nombre_titular VARCHAR(100) NOT NULL,
    fecha_vencimiento VARCHAR(7) NOT NULL,
    tipo_tarjeta VARCHAR (50),
    documento_titular VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);