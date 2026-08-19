import http.server
import socketserver
import json
import sqlite3
import os
import re
from urllib.parse import urlparse, parse_qs

PORT = 3000
DB_FILE = os.path.join(os.path.dirname(__file__), "zoyla.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create Services table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS services (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            duration INTEGER NOT NULL DEFAULT 60,
            price REAL NOT NULL DEFAULT 0.0,
            icon TEXT DEFAULT 'brain'
        )
    ''')

    # Create Clients table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT
        )
    ''')

    # Create Client Notes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS client_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT NOT NULL,
            date TEXT NOT NULL,
            text TEXT NOT NULL,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
    ''')

    # Create Appointments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            client_id TEXT,
            client_name TEXT NOT NULL,
            client_email TEXT NOT NULL,
            client_phone TEXT,
            service_id TEXT,
            service_name TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            price REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'confirmed',
            notes TEXT
        )
    ''')

    # Populate Initial Services if empty
    cursor.execute('SELECT COUNT(*) FROM services')
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO services (id, name, description, duration, price, icon)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', [
            ("serv-1", "Terapia Individual Gestalt", "Espacio de autodescubrimiento y presencia para procesar emociones, resolver bloqueos existenciales y reconciliarte con tu presente.", 60, 60.0, "brain"),
            ("serv-2", "Coaching Ontológico", "Acompañamiento enfocado a la acción, redefiniendo tus metas personales y profesionales. Ideal para transiciones de vida.", 60, 70.0, "compass"),
            ("serv-3", "Sesión de Mindfulness y Relajación", "Prácticas guiadas individuales para reducir el estrés, arraigar la mente en el cuerpo y cultivar la calma interior.", 45, 45.0, "sparkles")
        ])

    # Populate Initial Clients if empty
    cursor.execute('SELECT COUNT(*) FROM clients')
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO clients (id, name, email, phone)
            VALUES (?, ?, ?, ?)
        ''', [
            ("cli-1", "Ana García", "ana.garcia@gmail.com", "+34 611 222 333"),
            ("cli-2", "Carlos Mendoza", "carlos.mendoza@outlook.com", "+34 622 333 444"),
            ("cli-3", "Laura Martínez", "laura.mtz@yahoo.com", "+34 633 444 555")
        ])

        cursor.executemany('''
            INSERT INTO client_notes (client_id, date, text)
            VALUES (?, ?, ?)
        ''', [
            ("cli-1", "2026-07-01T10:00:00Z", "Iniciamos proceso Gestalt. Presenta ansiedad por transición laboral. Trabajamos respiración y arraigo."),
            ("cli-1", "2026-07-08T10:00:00Z", "Segunda sesión. Exploramos la 'silla vacía' para resolver conflicto pendiente con su antiguo jefe. Reporta mejor descanso."),
            ("cli-2", "2026-07-05T12:00:00Z", "Sesión de coaching de vida. Busca definir objetivos de cara a emprender. Identificamos creencias limitantes sobre el dinero.")
        ])

    # Populate Initial Appointments if empty
    cursor.execute('SELECT COUNT(*) FROM appointments')
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO appointments (id, client_id, client_name, client_email, client_phone, service_id, service_name, date, time, price, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', [
            ("app-1", "cli-1", "Ana García", "ana.garcia@gmail.com", "+34 611 222 333", "serv-1", "Terapia Individual Gestalt", "2026-07-15", "10:00", 60.0, "confirmed", "Continuación de la sesión anterior."),
            ("app-2", "cli-2", "Carlos Mendoza", "carlos.mendoza@outlook.com", "+34 622 333 444", "serv-2", "Coaching Ontológico", "2026-07-15", "12:00", 70.0, "pending", "Primera sesión sobre metas de emprendimiento."),
            ("app-3", "cli-3", "Laura Martínez", "laura.mtz@yahoo.com", "+34 633 444 555", "serv-3", "Sesión de Mindfulness", "2026-07-16", "16:00", 45.0, "confirmed", "")
        ])

    conn.commit()
    conn.close()

class ZoYLaRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def get_db(self):
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def read_json(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        return json.loads(body.decode('utf-8'))

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith('/api/'):
            conn = self.get_db()
            cursor = conn.cursor()

            if path == '/api/services':
                cursor.execute('SELECT * FROM services')
                services = [dict(row) for row in cursor.fetchall()]
                conn.close()
                return self.send_json(services)

            elif path == '/api/clients':
                cursor.execute('SELECT * FROM clients')
                clients = [dict(row) for row in cursor.fetchall()]
                for c in clients:
                    cursor.execute('SELECT date, text FROM client_notes WHERE client_id = ? ORDER BY id ASC', (c['id'],))
                    c['notes'] = [dict(row) for row in cursor.fetchall()]
                conn.close()
                return self.send_json(clients)

            elif path == '/api/appointments':
                cursor.execute('SELECT id, client_id as clientId, client_name as clientName, client_email as clientEmail, client_phone as clientPhone, service_id as serviceId, service_name as serviceName, date, time, price, status, notes FROM appointments')
                appointments = [dict(row) for row in cursor.fetchall()]
                conn.close()
                return self.send_json(appointments)

            conn.close()
            return self.send_json({"error": "Endpoint not found"}, status=404)

        return super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if path.startswith('/api/'):
            data = self.read_json()
            conn = self.get_db()
            cursor = conn.cursor()

            if path == '/api/services':
                cursor.execute('''
                    INSERT INTO services (id, name, description, duration, price, icon)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (data.get('id'), data.get('name'), data.get('description'), data.get('duration', 60), data.get('price', 0), data.get('icon', 'brain')))
                conn.commit()
                conn.close()
                return self.send_json(data, status=201)

            elif path == '/api/clients':
                cursor.execute('''
                    INSERT INTO clients (id, name, email, phone)
                    VALUES (?, ?, ?, ?)
                ''', (data.get('id'), data.get('name'), data.get('email'), data.get('phone')))
                conn.commit()
                conn.close()
                return self.send_json(data, status=201)

            elif path.startswith('/api/clients/') and path.endswith('/notes'):
                client_id = path.split('/')[3]
                cursor.execute('''
                    INSERT INTO client_notes (client_id, date, text)
                    VALUES (?, ?, ?)
                ''', (client_id, data.get('date'), data.get('text')))
                conn.commit()
                conn.close()
                return self.send_json(data, status=201)

            elif path == '/api/appointments':
                cursor.execute('''
                    INSERT INTO appointments (id, client_id, client_name, client_email, client_phone, service_id, service_name, date, time, price, status, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    data.get('id'), data.get('clientId'), data.get('clientName'), data.get('clientEmail'),
                    data.get('clientPhone'), data.get('serviceId'), data.get('serviceName'),
                    data.get('date'), data.get('time'), data.get('price'), data.get('status', 'confirmed'), data.get('notes', '')
                ))
                conn.commit()
                conn.close()
                return self.send_json(data, status=201)

            conn.close()
            return self.send_json({"error": "Endpoint not found"}, status=404)

    def do_PUT(self):
        path = urlparse(self.path).path
        if path.startswith('/api/'):
            data = self.read_json()
            conn = self.get_db()
            cursor = conn.cursor()

            if path.startswith('/api/services/'):
                service_id = path.split('/')[-1]
                cursor.execute('''
                    UPDATE services SET name=?, description=?, duration=?, price=?, icon=? WHERE id=?
                ''', (data.get('name'), data.get('description'), data.get('duration'), data.get('price'), data.get('icon'), service_id))
                conn.commit()
                conn.close()
                return self.send_json(data)

            elif path.startswith('/api/clients/'):
                client_id = path.split('/')[-1]
                cursor.execute('''
                    UPDATE clients SET name=?, email=?, phone=? WHERE id=?
                ''', (data.get('name'), data.get('email'), data.get('phone'), client_id))
                conn.commit()
                conn.close()
                return self.send_json(data)

            elif path.startswith('/api/appointments/'):
                app_id = path.split('/')[-1]
                cursor.execute('''
                    UPDATE appointments SET status=?, notes=?, date=?, time=? WHERE id=?
                ''', (data.get('status'), data.get('notes', ''), data.get('date'), data.get('time'), app_id))
                conn.commit()
                conn.close()
                return self.send_json(data)

            conn.close()
            return self.send_json({"error": "Endpoint not found"}, status=404)

    def do_DELETE(self):
        path = urlparse(self.path).path
        if path.startswith('/api/'):
            conn = self.get_db()
            cursor = conn.cursor()

            if path.startswith('/api/services/'):
                service_id = path.split('/')[-1]
                cursor.execute('DELETE FROM services WHERE id=?', (service_id,))
                conn.commit()
                conn.close()
                return self.send_json({"success": True})

            elif path.startswith('/api/clients/'):
                client_id = path.split('/')[-1]
                cursor.execute('DELETE FROM clients WHERE id=?', (client_id,))
                conn.commit()
                conn.close()
                return self.send_json({"success": True})

            elif path.startswith('/api/appointments/'):
                app_id = path.split('/')[-1]
                cursor.execute('DELETE FROM appointments WHERE id=?', (app_id,))
                conn.commit()
                conn.close()
                return self.send_json({"success": True})

            conn.close()
            return self.send_json({"error": "Endpoint not found"}, status=404)

if __name__ == '__main__':
    init_db()
    print(f"Servidor ZoYLa con Base de Datos corriendo en http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), ZoYLaRequestHandler) as httpd:
        httpd.serve_forever()
