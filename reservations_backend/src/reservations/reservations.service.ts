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
    title: row.title,
    spaceId: row.space_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userName: row.user_name,
    request: row.request,
  };
}

@Injectable()
export class ReservationsService {
  constructor(@Inject('PG') private readonly db: Pool) {}

  private async getSpaceHours(
    spaceId: number,
  ): Promise<{ open: string; close: string }> {
    // Try to read columns if they exist; fallback to defaults
    try {
      const result = await this.db.query(
        `SELECT open_time::text AS open, close_time::text AS close FROM spaces WHERE id = $1`,
        [spaceId],
      );
      if (result.rowCount && result.rows[0]) {
        const open = result.rows[0].open || '08:00:00';
        const close = result.rows[0].close || '20:00:00';
        return { open, close };
      }
    } catch (_) {
      // ignore if columns don't exist
    }
    return { open: '08:00:00', close: '20:00:00' };
  }

  private async assertWithinHoursAndNoOverlap(
    spaceId: number,
    startIso: string,
    endIso: string,
    excludeId?: number,
  ) {
    if (!spaceId) throw new BadRequestException('Nedostaje prostor.');
    if (!startIso || !endIso)
      throw new BadRequestException('Nedostaju vremena.');

    // Ensure start < end
    const start = new Date(startIso);
    const end = new Date(endIso);
    if (
      !(start instanceof Date) ||
      isNaN(start.getTime()) ||
      !(end instanceof Date) ||
      isNaN(end.getTime())
    ) {
      throw new BadRequestException('Vremenski format nije ispravan.');
    }
    if (end <= start) {
      throw new BadRequestException(
        'Vrijeme završetka mora biti nakon početka.',
      );
    }

    // Working hours check (time-of-day)
    const { open, close } = await this.getSpaceHours(spaceId);
    const startTime = startIso.substring(11, 19); // HH:MM:SS
    const endTime = endIso.substring(11, 19);
    // simple string compare works for HH:MM:SS
    if (startTime < open || endTime > close) {
      throw new BadRequestException(
        `Rezervacija mora biti između ${open} i ${close}.`,
      );
    }

    // Overlap check: NOT (newEnd <= existingStart OR newStart >= existingEnd)
    const params: any[] = [spaceId, startIso, endIso];
    let overlapSql = `
      SELECT 1
      FROM reservations r
      WHERE r.space_id = $1
        AND NOT ($3 <= r.start_date OR $2 >= r.end_date)
    `;
    if (excludeId) {
      overlapSql += ' AND r.id <> $4';
      params.push(excludeId);
    }

    const overlap = await this.db.query(overlapSql, params);
    if ((overlap.rowCount ?? 0) > 0) {
      throw new BadRequestException(
        'Postoji rezervacija u odabranom terminu za taj prostor.',
      );
    }
  }

  async create(createReservationDto: CreateReservationDto) {
    const { userId, startDate, endDate, request, spaceId, title } =
      createReservationDto as unknown as {
        userId: number;
        startDate: string;
        endDate: string;
        request: string;
        spaceId: number;
        title: string;
      };
    try {
      console.log('Stvaranje rezervacije:', createReservationDto);
      await this.assertWithinHoursAndNoOverlap(spaceId, startDate, endDate);
      const result = await this.db.query(
        `
        INSERT INTO reservations (user_id, start_date, end_date, request, space_id, title, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *;
        `,
        [userId, startDate, endDate, request, spaceId, title],
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
    const { id, userId, startDate, endDate, request, spaceId, title } =
      updateReservationDto as unknown as {
        id: number;
        userId: number;
        startDate: string;
        endDate: string;
        request: string;
        spaceId: number;
        title: string;
      };
    try {
      await this.assertWithinHoursAndNoOverlap(spaceId, startDate, endDate, id);
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
        WHERE id = $7
        RETURNING *;
      `,
        [userId, startDate, endDate, request, spaceId, title, id],
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
