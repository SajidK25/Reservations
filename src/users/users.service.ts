import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

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

    const hashedPassword = await bcrypt.hash(password, 10);

   const result = await this.db.query(
     'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at',
     [name, email, hashedPassword, 2],
   );

    return result.rows[0];
  }

  async findByEmail(email: string) {
    const result = await this.db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.db.query('SELECT * FROM users');
    return result.rows;
  }
}
