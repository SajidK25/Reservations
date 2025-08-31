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
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { UsersService } from '../users/users.service';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'))
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async reserve(@Request() req, @Body() body: CreateReservationDto) {
    return this.reservationsService.create({
      ...body,
      userId: body.userId ?? req.user.id,
    } as any);
  }

  @Get()
  async getMine(@Request() req) {
    return this.reservationsService.findAllByUser(req.user.id);
  }

  @Get('all')
  async getAll(@Request() req) {
    const isAdmin = await this.usersService.isAdmin(req.user.id);
    if (!isAdmin) {
      throw new ForbiddenException('Samo admini mogu vidjeti sve rezervacije.');
    }
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
    @Body() body: UpdateReservationDto,
    @Request() req,
  ) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID mora biti broj.');
    }

    return this.reservationsService.update({
      ...body,
      id: parsedId,
      userId: body.userId ?? req.user.id,
    } as any);
  }
}
