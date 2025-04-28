import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ReservationsService {
  constructor(@Inject('PG') private readonly db: Pool) {}

  async create(userId: number, startDate: string, endDate: string) {
    try {
      const result = await this.db.query(
        `
        INSERT INTO reservations (user_id, start_date, end_date, created_at, updated_at)
                               VALUES ($1,         $2,       $3,      NOW(),       NOW())
        RETURNING *;
        `,
        [userId, startDate, endDate],
      );

      return result.rows[0];
    } catch (err) {
      console.error('Greška kod rezervacije:', err);
      throw new InternalServerErrorException('Neuspješna rezervacija.');
    }
  }

  async findAllByUser(userId: number) {
    try {
      const result = await this.db.query(
        `
        SELECT r.*, s.name AS space_name
        FROM reservations r
        WHERE r.user_id = $1
        ORDER BY r.start_date ASC
        `,
        [userId],
      );
      return result.rows;
    } catch (err) {
      console.error('Greška kod dohvaćanja korisničkih rezervacija:', err);
      throw new InternalServerErrorException(
        'Neuspješno dohvaćanje rezervacija.',
      );
    }
  }

  async findAll() {
    try {
      const result = await this.db.query(
        `
        SELECT 
          r.id AS reservation_id,
          r.start_date,
          r.end_date,
          r.created_at,
          u.name AS user_name
        FROM reservations r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
        `,
      );
      return result.rows;
    } catch (err) {
      console.error('Greška kod dohvaćanja svih rezervacija:', err);
      throw new InternalServerErrorException(
        'Neuspješno dohvaćanje rezervacija.',
      );
    }
  }
}
