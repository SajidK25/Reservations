import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async reserve(@Request() req, @Body() body: CreateReservationDto) {
    return this.reservationsService.create({
      ...body,
      user_id: req.user.id,
    });
  }

  @Get()
  async getMine(@Request() req) {
    return this.reservationsService.findAllByUser(req.user.id);
  }

  @Get('all')
  async getAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID mora biti broj.');
    }

    const reservation = await this.reservationsService.findOne(parsedId);
    if (!reservation) {
      throw new NotFoundException(`Rezervacija s ID-em ${id} nije pronađena.`);
    }

    return reservation;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.reservationsService.delete(parseInt(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      startDate: string;
      endDate: string;
      user_id: number;
      request: string;
      space_id: number;
      title: string;
    },
  ) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID mora biti broj.');
    }

    return this.reservationsService.update({
      ...body,
      id: parsedId,
    });
  }
}
