CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  rol ENUM('cliente', 'operador', 'administrador') NOT NULL DEFAULT 'cliente',
  password_hash VARCHAR(255) NOT NULL,
  estado ENUM('activo', 'inactivo', 'bloqueado') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identificador VARCHAR(60) NOT NULL UNIQUE,
  ubicacion VARCHAR(120) NOT NULL,
  estado ENUM('disponible', 'ocupada', 'mantenimiento', 'reservada') NOT NULL DEFAULT 'disponible',
  especificaciones JSON NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  estacion_id INT NOT NULL,
  inicio DATETIME NOT NULL,
  fin DATETIME NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'expirada') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  CONSTRAINT fk_reserva_estacion FOREIGN KEY (estacion_id) REFERENCES estaciones (id),
  CONSTRAINT chk_reserva_intervalo CHECK (fin > inicio)
);

CREATE TABLE IF NOT EXISTS sesiones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  estacion_id INT NOT NULL,
  inicio DATETIME NOT NULL,
  fin DATETIME NULL,
  minutos_consumidos INT DEFAULT 0,
  costo_total DECIMAL(10,2) DEFAULT 0,
  estado ENUM('activa', 'finalizada', 'suspendida') NOT NULL DEFAULT 'activa',
  reserva_id INT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sesion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  CONSTRAINT fk_sesion_estacion FOREIGN KEY (estacion_id) REFERENCES estaciones (id),
  CONSTRAINT fk_sesion_reserva FOREIGN KEY (reserva_id) REFERENCES reservas (id)
);

CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  sesion_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo ENUM('efectivo', 'tarjeta', 'qr', 'online') NOT NULL,
  referencia VARCHAR(120) NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pago_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  CONSTRAINT fk_pago_sesion FOREIGN KEY (sesion_id) REFERENCES sesiones (id)
);

CREATE TABLE IF NOT EXISTS logs_seguridad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_evento VARCHAR(60) NOT NULL,
  descripcion TEXT NOT NULL,
  criticidad ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'baja',
  generado_por VARCHAR(120) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reservas_estacion_periodo ON reservas (estacion_id, inicio, fin);
CREATE INDEX idx_sesiones_estacion_estado ON sesiones (estacion_id, estado);
CREATE INDEX idx_pagos_fecha ON pagos (creado_en);
