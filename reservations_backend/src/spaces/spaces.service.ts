import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SpacesService {
  constructor(@Inject('PG') private readonly db: Pool) {}
  async create() {}

  async findAll() {
    const result = await this.db.query(
      `SELECT id,
              name,
              to_char(start_time, 'HH24:MI') AS open,
              to_char(end_time,   'HH24:MI') AS close
       FROM spaces
       ORDER BY id`,
    );
    return result.rows;
  }
  async delete(id: number) {
    const result = await this.db.query(
      `DELETE FROM spaces WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new BadRequestException(`Prostor s ID-em ${id} ne postoji.`);
    }
    return { message: `Prostor ${id} je obrisan.` };
  }
}
