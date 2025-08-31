-- DROP redoslijed zbog relacija
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS spaces;

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

-- Tablica: spaces
CREATE TABLE spaces (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
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
  request TEXT,
  space_id INTEGER REFERENCES spaces(id),
  title TEXT,
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

-- Insert some spaces
INSERT INTO spaces (name, created_at, updated_at, start_time, end_time)
VALUES 
  ('Space 1', NOW(), NOW(), '08:00:00', '22:00:00'),
  ('Space 2', NOW(), NOW(), '08:00:00', '22:00:00');



