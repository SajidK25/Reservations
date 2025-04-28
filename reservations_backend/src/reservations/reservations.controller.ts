import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReservationDto } from './dto/create-reservation.dto';


@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async reserve(@Request() req, @Body() body: CreateReservationDto) {
    return this.reservationsService.create(
      req.user.id,
      body.startDate,
      body.endDate,
    );
  }

  @Get()
  async getMine(@Request() req) {
    return this.reservationsService.findAllByUser(req.user.id);
  }

  @Get('all')
  async getAll() {
    return this.reservationsService.findAll();
  }
}
