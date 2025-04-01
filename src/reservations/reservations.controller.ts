import {
  Controller,
  Post,
  Param,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post(':appointmentId')
  async reserve(@Param('appointmentId') id: string, @Request() req) {
    const userId = req.user.id;
    return this.reservationsService.create(userId, +id);
  }

  @Get()
  async getMine(@Request() req) {
    return this.reservationsService.findAllByUser(req.user.id);
  }
}
