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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Dohvati sve korisnike
  @Get()
  findAll() {
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
  async delete(@Param('id', ParseIntPipe) id: number) {
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
