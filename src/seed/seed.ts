import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@base:5432/reservations',
});


async function seed() {
  try {
    console.log('Provjera i kreiranje tablica ako ne postoje...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS role (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role_id INTEGER REFERENCES role(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS space (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reservation (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        space_id INTEGER REFERENCES space(id),
        start_date TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Tablice su spremne.');
    console.log('Ubacivanje početnih podataka...');

    const roles = ['admin', 'user'];
    for (const role of roles) {
      await pool.query(
        `INSERT INTO role (name)
         SELECT $1::varchar
         WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = $1)`,
        [role],
      );
    }

    const spaceCheck = await pool.query(`SELECT * FROM space WHERE name = $1`, [
      'Main Hall',
    ]);

    if (spaceCheck.rowCount === 0) {
      await pool.query(`INSERT INTO space (name) VALUES ($1)`, ['Main Hall']);
    }

    console.log('Početni podaci ubačeni.');
  } catch (err) {
    console.error('Greška prilikom seedanja:', err);
  } finally {
    await pool.end();
  }
}

seed();
