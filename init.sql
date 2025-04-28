-- DROP redoslijed zbog relacija
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Tablica: roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tablica: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tablica: reservations
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status TEXT DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ubacivanje default rola
INSERT INTO roles (name) VALUES ('admin'), ('user');

-- Insert some users
INSERT INTO users (name, email, password, role_id)
VALUES
  ('John Doe', 'john@example.com', 'password123', 2),
  ('Jane Smith', 'jane@example.com', 'password456', 2),
  ('Admin User', 'admin@example.com', 'adminpass', 1);

-- Insert some reservations
INSERT INTO reservations (user_id, status, start_date, end_date)
VALUES
  (1, 'active', '2025-05-01T10:00:00', '2025-05-01T11:00:00'),
  (2, 'active', '2025-05-02T14:00:00', '2025-05-02T15:30:00'),
  (1, 'cancelled', '2025-05-03T09:00:00', '2025-05-03T10:00:00');

