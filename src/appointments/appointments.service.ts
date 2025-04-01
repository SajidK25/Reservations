import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AppointmentsService {
  constructor(@Inject('PG') private readonly db: Pool) {}

  async findAll() {
    try {
      const result = await this.db.query(
        'SELECT * FROM appointments WHERE available = true ORDER BY time ASC',
      );
      return result.rows;
    } catch (err) {
      console.error('Greška kod dohvaćanja termina:', err);
      throw new InternalServerErrorException('Neuspješno dohvaćanje termina.');
    }
  }

  async create(time: string, ownerId: number) {
    try {
      const result = await this.db.query(
        'INSERT INTO appointments (time, owner_id) VALUES ($1, $2) RETURNING *',
        [time, ownerId],
      );
      return result.rows[0];
    } catch (err) {
      console.error('Greška kod dodavanja termina:', err);
      throw new InternalServerErrorException('Neuspješno dodavanje termina.');
    }
  }
}
