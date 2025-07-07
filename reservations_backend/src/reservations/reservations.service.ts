import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './dto/reservation.dto';

function mapReservationRow(row: Reservation) {
  return {
    id: row.id ?? row.reservation_id,
    userId: row.user_id,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userName: row.user_name,
    request: row.request,
  };
}

@Injectable()
export class ReservationsService {
  constructor(@Inject('PG') private readonly db: Pool) {}

  async create(createReservationDto: CreateReservationDto) {
    const { user_id, startDate, endDate, request, spaceId, title } =
      createReservationDto;
    try {
      console.log('Stvaranje rezervacije:',createReservationDto)
      const result = await this.db.query(
        `
        INSERT INTO reservations (user_id, start_date, end_date, request, space_id, title, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *;
        `,
        [user_id, startDate, endDate, request, spaceId, title],
      );
      return mapReservationRow(result.rows[0]);
    } catch (err) {
      console.error('Greška kod rezervacije:', err);
      throw new InternalServerErrorException('Neuspješna rezervacija.');
    }
  }

  async findAllByUser(userId: number) {
    try {
      const result = await this.db.query(
        `
        SELECT *
        FROM reservations r
        WHERE r.user_id = $1
        ORDER BY r.start_date ASC
        `,
        [userId],
      );
      return result.rows.map(mapReservationRow);
    } catch (err) {
      console.error('Greška kod dohvaćanja rezervacija korisnika:', err);
      throw new InternalServerErrorException(
        'Neuspješno dohvaćanje rezervacija.',
      );
    }
  }

  async findOne(id: number) {
    const result = await this.db.query(
      `SELECT * FROM reservations WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? mapReservationRow(result.rows[0]) : null;
  }

  async findAll() {
    try {
      const result = await this.db.query(
        `
        SELECT *
        FROM reservations r
        JOIN users u ON r.user_id = u.id
        JOIN spaces s ON r.space_id = s.id
        ORDER BY r.created_at DESC
        `,
      );
      return result.rows.map(mapReservationRow);
    } catch (err) {
      console.error('Greška kod dohvaćanja svih rezervacija:', err);
      throw new InternalServerErrorException(
        'Neuspješno dohvaćanje rezervacija.',
      );
    }
  }

  async delete(id: number) {
    try {
      const result = await this.db.query(
        `DELETE FROM reservations WHERE id = $1 RETURNING *`,
        [id],
      );
      if (result.rowCount === 0) {
        throw new BadRequestException(
          'Rezervacija nije pronađena ili nije vaša.',
        );
      }
      return { message: 'Rezervacija je otkazana.' };
    } catch (err) {
      console.error('Greška kod brisanja rezervacije:', err);
      throw new InternalServerErrorException('Neuspješno otkazivanje.');
    }
  }

  async update(updateReservationDto: UpdateReservationDto) {
    const { id, user_id, startDate, endDate, request, space_id, title } =
      updateReservationDto;
    try {
      const result = await this.db.query(
        `
        UPDATE reservations
        SET user_id = $1,
          start_date = $2,
          end_date = $3,
          request = $4,
          space_id = $5,
          title= $6,
          updated_at = NOW()
        WHERE id = $6
        RETURNING *;
      `,
        [user_id, startDate, endDate, request, space_id, id, title],
      );
      if (result.rowCount === 0) {
        throw new BadRequestException(
          `Rezervacija s ID-em ${id} nije pronađena.`,
        );
      }
      return mapReservationRow(result.rows[0]);
    } catch (err) {
      console.error('Greška kod ažuriranja rezervacije:', err);
      throw new InternalServerErrorException('Neuspješno ažuriranje.');
    }
  }
}
