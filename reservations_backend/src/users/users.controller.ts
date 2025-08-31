import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Dohvati sve korisnike
  @Get()
  async findAll(@Request() req) {
    const isAdmin = await this.usersService.isAdmin(req.user.id);
    if (!isAdmin)
      throw new ForbiddenException('Samo admini mogu vidjeti korisnike.');
    return this.usersService.findAll();
  }

  // Dohvati jednog korisnika po ID-u
  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // Kreiraj novog korisnika
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body.name, body.email, body.password);
  }

  // Obriši korisnika po ID-u
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const isAdmin = await this.usersService.isAdmin(req.user.id);
    if (!isAdmin)
      throw new ForbiddenException('Samo admini mogu brisati korisnike.');
    return this.usersService.delete(id);
  }

  // Ažuriraj korisnika po ID-u
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}
