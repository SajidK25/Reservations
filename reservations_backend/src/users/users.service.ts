import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('PG') private readonly db: Pool) {}

  async create(name: string, email: string, password: string) {
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new BadRequestException('Ime, email i lozinka su obavezni.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Email nije ispravnog formata.');
    }

    const existing = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    if (existing.rows.length > 0) {
      throw new ConflictException('Korisnik s tim emailom već postoji.');
    }

    const result = await this.db.query(
      'INSERT INTO USERS (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at',
      [name, email, password, 2],
    );

    return result.rows[0];
  }

  async findOne(id: number) {
    const result = await this.db.query('SELECT * FROM USERS WHERE id = $1', [
      id,
    ]);
    return result.rows;
  }

  async findByEmail(email: string) {
    const result = await this.db.query('SELECT * FROM USERS WHERE email = $1', [
      email,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM USERS');
    return result.rows;
  }

  async delete(id: number) {
    const result = await this.db.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new BadRequestException(`Korisnik s ID-em ${id} ne postoji.`);
    }
    return { message: `Korisnik ${id} je obrisan.` };
  }

  async update(
    id: number,
    data: { name?: string; email?: string; password?: string },
  ) {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && `${value}`.trim() !== '') {
        fields.push(`${key} = $${index++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      throw new BadRequestException('Nema podataka za ažuriranje.');
    }

    values.push(id);

    const result = await this.db.query(
      `
    UPDATE users
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${index}
    RETURNING *;
    `,
      values,
    );

    if (result.rowCount === 0) {
      throw new BadRequestException(`Korisnik s ID-em ${id} ne postoji.`);
    }

    return result.rows[0];
  }
}
