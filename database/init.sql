-- ============================================
-- Base de datos ProyectoIs
-- PostgreSQL
-- ============================================

DROP TABLE IF EXISTS vales_has_materiales CASCADE;
DROP TABLE IF EXISTS vales_prestamos CASCADE;
DROP TABLE IF EXISTS inscripciones CASCADE;
DROP TABLE IF EXISTS crear_asesoria CASCADE;
DROP TABLE IF EXISTS materiales CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS carreras CASCADE;
DROP TABLE IF EXISTS estado CASCADE;

-- ============================
-- ROLES
-- ============================
CREATE TABLE roles (
    id_rol VARCHAR(10) PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

INSERT INTO roles (id_rol, descripcion) VALUES
('1', 'Administrador'),
('2', 'Docente'),
('3', 'Estudiante');

-- ============================
-- CARRERAS
-- ============================
CREATE TABLE carreras (
    id_carreras VARCHAR(10) PRIMARY KEY,
    descripcion VARCHAR(150) NOT NULL
);

INSERT INTO carreras (id_carreras, descripcion) VALUES
('1', 'Ingeniería en Sistemas Computacionales'),
('2', 'Ingeniería Industrial'),
('3', 'Administración'),
('4', 'Contador Público'),
('5', 'Arquitectura');

-- ============================
-- USUARIOS
-- ============================
CREATE TABLE usuarios (
    id_usuario VARCHAR(30) PRIMARY KEY,
    carreras_id_carreras VARCHAR(10),
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    semestre INTEGER,
    contrasena VARCHAR(255) NOT NULL,
    roles_id_rol VARCHAR(10) NOT NULL,
    FOREIGN KEY (carreras_id_carreras) REFERENCES carreras(id_carreras),
    FOREIGN KEY (roles_id_rol) REFERENCES roles(id_rol)
);

-- ============================
-- ASESORÍAS
-- ============================
CREATE TABLE crear_asesoria (
    id_crear_asesoria VARCHAR(30) PRIMARY KEY,
    usuarios_id_usuario VARCHAR(30),
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha DATE,
    horario VARCHAR(50),
    cupo INTEGER DEFAULT 0,
    cuposocupados INTEGER DEFAULT 0,
    FOREIGN KEY (usuarios_id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE inscripciones (
    id_inscripcion SERIAL PRIMARY KEY,
    id_usuario VARCHAR(30) NOT NULL,
    id_crear_asesoria VARCHAR(30) NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_crear_asesoria) REFERENCES crear_asesoria(id_crear_asesoria) ON DELETE CASCADE,
    UNIQUE (id_usuario, id_crear_asesoria)
);

-- ============================
-- CATEGORÍAS
-- ============================
CREATE TABLE categoria (
    id_categoria VARCHAR(10) PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

INSERT INTO categoria (id_categoria, descripcion) VALUES
('1', 'Electrónica'),
('2', 'Herramientas'),
('3', 'Laboratorio'),
('4', 'Cómputo'),
('5', 'Material didáctico');

-- ============================
-- MATERIALES
-- ============================
CREATE TABLE materiales (
    id_materiales VARCHAR(30) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria_id_categoria VARCHAR(10) NOT NULL,
    cantidad_disponible INTEGER DEFAULT 0,
    cantidad_daniados INTEGER DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'Disponible',
    FOREIGN KEY (categoria_id_categoria) REFERENCES categoria(id_categoria)
);

INSERT INTO materiales (
    id_materiales, 
    nombre, 
    categoria_id_categoria, 
    cantidad_disponible, 
    cantidad_daniados,
    estado
) VALUES
('MAT001', 'Laptop', '4', 10, 0, 'Disponible'),
('MAT002', 'Proyector', '4', 5, 1, 'Disponible'),
('MAT003', 'Multímetro', '1', 8, 0, 'Disponible'),
('MAT004', 'Pinzas', '2', 15, 2, 'Disponible'),
('MAT005', 'Microscopio', '3', 4, 0, 'Disponible');

-- ============================
-- ESTADOS DE VALE
-- ============================
CREATE TABLE estado (
    id_estado VARCHAR(10) PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

INSERT INTO estado (id_estado, descripcion) VALUES
('E01', 'Pendiente'),
('E02', 'Aceptado'),
('E03', 'Rechazado'),
('E04', 'Devuelto'),
('E05', 'Finalizado');

-- ============================
-- VALES DE PRÉSTAMO
-- ============================
CREATE TABLE vales_prestamos (
    id_vales VARCHAR(30) PRIMARY KEY,
    usuarios_id_usuario VARCHAR(30) NOT NULL,
    estado_id_estado VARCHAR(10) NOT NULL,
    hora_entrega TIME,
    hora_devolucion TIMESTAMP,
    motivo VARCHAR(255),
    docente VARCHAR(150),
    FOREIGN KEY (usuarios_id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (estado_id_estado) REFERENCES estado(id_estado)
);

CREATE TABLE vales_has_materiales (
    id SERIAL PRIMARY KEY,
    vales_prestamos_id_vales VARCHAR(30) NOT NULL,
    materiales_id_materiales VARCHAR(30) NOT NULL,
    cantidad NUMERIC DEFAULT 1,
    FOREIGN KEY (vales_prestamos_id_vales) REFERENCES vales_prestamos(id_vales) ON DELETE CASCADE,
    FOREIGN KEY (materiales_id_materiales) REFERENCES materiales(id_materiales)
);