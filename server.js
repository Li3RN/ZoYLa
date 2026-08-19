const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// Configuración de MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zoyla_db'
};

let pool;

async function initMySQL() {
    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await connection.end();

        pool = mysql.createPool(dbConfig);
        console.log(`Conectado exitosamente a la base de datos MySQL (${dbConfig.database})`);

        // Crear tablas si no existen
        await pool.query(`
            CREATE TABLE IF NOT EXISTS services (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                duration INT NOT NULL DEFAULT 60,
                price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                icon VARCHAR(50) DEFAULT 'brain'
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50)
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS client_notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id VARCHAR(50) NOT NULL,
                date VARCHAR(100) NOT NULL,
                text TEXT NOT NULL,
                FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id VARCHAR(50) PRIMARY KEY,
                client_id VARCHAR(50),
                client_name VARCHAR(255) NOT NULL,
                client_email VARCHAR(255) NOT NULL,
                client_phone VARCHAR(50),
                service_id VARCHAR(50),
                service_name VARCHAR(255) NOT NULL,
                date VARCHAR(50) NOT NULL,
                time VARCHAR(20) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
                notes TEXT
            );
        `);

    } catch (error) {
        console.error("Error al conectar con MySQL:", error.message);
    }
}

// ----------------------------------------------------
// RUTAS API REST
// ----------------------------------------------------

// Servicios
app.get('/api/services', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM services');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/services', async (req, res) => {
    const { id, name, description, duration, price, icon } = req.body;
    try {
        await pool.query(
            'INSERT INTO services (id, name, description, duration, price, icon) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, description, duration, price, icon]
        );
        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/services/:id', async (req, res) => {
    const { name, description, duration, price, icon } = req.body;
    try {
        await pool.query(
            'UPDATE services SET name=?, description=?, duration=?, price=?, icon=? WHERE id=?',
            [name, description, duration, price, icon, req.params.id]
        );
        res.json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM services WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clientes
app.get('/api/clients', async (req, res) => {
    try {
        const [clients] = await pool.query('SELECT * FROM clients');
        for (let cli of clients) {
            const [notes] = await pool.query('SELECT date, text FROM client_notes WHERE client_id = ? ORDER BY id ASC', [cli.id]);
            cli.notes = notes;
        }
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/clients', async (req, res) => {
    const { id, name, email, phone } = req.body;
    try {
        await pool.query(
            'INSERT INTO clients (id, name, email, phone) VALUES (?, ?, ?, ?)',
            [id, name, email, phone]
        );
        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/clients/:id/notes', async (req, res) => {
    const { date, text } = req.body;
    try {
        await pool.query(
            'INSERT INTO client_notes (client_id, date, text) VALUES (?, ?, ?)',
            [req.params.id, date, text]
        );
        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Citas
app.get('/api/appointments', async (req, res) => {
    try {
        const [apps] = await pool.query(`
            SELECT id, client_id as clientId, client_name as clientName, client_email as clientEmail, client_phone as clientPhone, service_id as serviceId, service_name as serviceName, date, time, price, status, notes FROM appointments
        `);
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    const { id, clientId, clientName, clientEmail, clientPhone, serviceId, serviceName, date, time, price, status, notes } = req.body;
    try {
        await pool.query(
            'INSERT INTO appointments (id, client_id, client_name, client_email, client_phone, service_id, service_name, date, time, price, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, clientId, clientName, clientEmail, clientPhone, serviceId, serviceName, date, time, price, status || 'confirmed', notes || '']
        );
        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    const { status, notes, date, time } = req.body;
    try {
        await pool.query(
            'UPDATE appointments SET status=?, notes=?, date=?, time=? WHERE id=?',
            [status, notes || '', date, time, req.params.id]
        );
        res.json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM appointments WHERE id=?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

initMySQL().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor Express listo en http://localhost:${PORT}`);
    });
});
