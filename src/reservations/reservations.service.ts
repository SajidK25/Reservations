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

  async create(userId: number, appointmentId: number) {
    try {
      // Provjeri dostupnost termina
      const { rows } = await this.db.query(
        'SELECT * FROM appointments WHERE id = $1 AND available = true',
        [appointmentId],
      );

      if (rows.length === 0) {
        throw new BadRequestException('Termin nije dostupan.');
      }

      // Napravi rezervaciju
      await this.db.query(
        'UPDATE appointments SET available = false, updated_at = NOW() WHERE id = $1',
        [appointmentId],
      );

      const result = await this.db.query(
        'INSERT INTO reservations (user_id, appointment_id) VALUES ($1, $2) RETURNING *',
        [userId, appointmentId],
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
        SELECT r.*, a.time 
        FROM reservations r
        JOIN appointments a ON r.appointment_id = a.id
        WHERE r.user_id = $1
        ORDER BY a.time ASC
        `,
        [userId],
      );
      return result.rows;
    } catch (err) {
      console.error('Greška kod dohvaćanja rezervacija:', err);
      throw new InternalServerErrorException(
        'Neuspješno dohvaćanje rezervacija.',
      );
    }
  }
}
