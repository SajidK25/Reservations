import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SpacesService {
  constructor(@Inject('PG') private readonly db: Pool) {}
  async create() {}
  async delete(id: number) {
    const result = await this.db.query(
      `DELETE FROM sapces WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new BadRequestException(`Prostor s ID-em ${id} ne postoji.`);
    }
    return { message: `Prostor ${id} je obrisan.` };
  }
}
