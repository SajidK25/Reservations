import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get()
  find(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.usersService.create(body.name, body.email, body.password);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID mora biti broj.');
    }
    return this.usersService.delete(parsedId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() body: { name?: string; email?: string; password?: string },
  ) {
    return this.usersService.update(id, body);
  }
}
