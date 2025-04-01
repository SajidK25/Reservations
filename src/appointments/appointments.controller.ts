import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAll() {
    return this.appointmentsService.findAll();
  }

  @Post()
  async create(@Body() body: { time: string }, @Request() req) {
    const userId = req.user.id;
    return this.appointmentsService.create(body.time, userId);
  }
}
