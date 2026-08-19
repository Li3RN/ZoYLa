-- ==========================================================================
-- ZO Y LA - DATABASE SCHEMA (MySQL / MariaDB / SQLite)
-- ==========================================================================

-- 1. Tabla de Servicios
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL DEFAULT 60,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    icon VARCHAR(50) DEFAULT 'brain',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Clientes
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Notas del Cliente
CREATE TABLE IF NOT EXISTS client_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL,
    note_date DATETIME NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 4. Tabla de Citas / Reservas
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    client_id VARCHAR(50),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50),
    service_id VARCHAR(50),
    service_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- pending, confirmed, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- 5. Tabla de Usuarios (Administración)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos Iniciales por Defecto
INSERT IGNORE INTO services (id, name, description, duration, price, icon) VALUES
('serv-1', 'Terapia Individual Gestalt', 'Espacio de autodescubrimiento y presencia para procesar emociones, resolver bloqueos existenciales y reconciliarte con tu presente.', 60, 60.00, 'brain'),
('serv-2', 'Coaching Ontológico', 'Acompañamiento enfocado a la acción, redefiniendo tus metas personales y profesionales. Ideal para transiciones de vida.', 60, 70.00, 'compass'),
('serv-3', 'Sesión de Mindfulness y Relajación', 'Prácticas guiadas individuales para reducir el estrés, arraigar la mente en el cuerpo y cultivar la calma interior.', 45, 45.00, 'sparkles');

INSERT IGNORE INTO clients (id, name, email, phone) VALUES
('cli-1', 'Ana García', 'ana.garcia@gmail.com', '+34 611 222 333'),
('cli-2', 'Carlos Mendoza', 'carlos.mendoza@outlook.com', '+34 622 333 444'),
('cli-3', 'Laura Martínez', 'laura.mtz@yahoo.com', '+34 633 444 555');

INSERT IGNORE INTO client_notes (client_id, note_date, note_text) VALUES
('cli-1', '2026-07-01 10:00:00', 'Iniciamos proceso Gestalt. Presenta ansiedad por transición laboral. Trabajamos respiración y arraigo.'),
('cli-1', '2026-07-08 10:00:00', 'Segunda sesión. Exploramos la "silla vacía" para resolver conflicto pendiente con su antiguo jefe. Reporta mejor descanso.'),
('cli-2', '2026-07-05 12:00:00', 'Sesión de coaching de vida. Busca definir objetivos de cara a emprender. Identificamos creencias limitantes sobre el dinero.');

INSERT IGNORE INTO appointments (id, client_id, client_name, client_email, client_phone, service_id, service_name, appointment_date, appointment_time, price, status, notes) VALUES
('app-1', 'cli-1', 'Ana García', 'ana.garcia@gmail.com', '+34 611 222 333', 'serv-1', 'Terapia Individual Gestalt', '2026-07-15', '10:00', 60.00, 'confirmed', 'Continuación de la sesión anterior.'),
('app-2', 'cli-2', 'Carlos Mendoza', 'carlos.mendoza@outlook.com', '+34 622 333 444', 'serv-2', 'Coaching Ontológico', '2026-07-15', '12:00', 70.00, 'pending', 'Primera sesión sobre metas de emprendimiento.'),
('app-3', 'cli-3', 'Laura Martínez', 'laura.mtz@yahoo.com', '+34 633 444 555', 'serv-3', 'Sesión de Mindfulness', '2026-07-16', '16:00', 45.00, 'confirmed', '');
