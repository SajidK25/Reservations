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

  async create(
    userId: number,
    spaceId: number,
    startDate: string,
    endTime: string,
  ) {
    try {
      // Provjera preklapanja termina
      const overlap = await this.db.query(
        `
        SELECT 1 FROM reservation
        WHERE space_id = $1
          AND (($2, $3) OVERLAPS (start_date, end_time))
        `,
        [spaceId, startDate, endTime],
      );

      if (overlap.rows.length > 0) {
        throw new BadRequestException(
          'Termin za taj prostor je već rezerviran.',
        );
      }

      // Spremi rezervaciju
      const result = await this.db.query(
        `
        INSERT INTO reservation (user_id, space_id, start_date, end_time, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *;
        `,
        [userId, spaceId, startDate, endTime],
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
        FROM reservation r
        JOIN space s ON r.space_id = s.id
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
          r.end_time,
          r.created_at,
          u.name AS user_name,
          s.name AS space_name
        FROM reservation r
        JOIN users u ON r.user_id = u.id
        JOIN space s ON r.space_id = s.id
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
