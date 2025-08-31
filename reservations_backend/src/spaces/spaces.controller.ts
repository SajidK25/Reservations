import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('spaces')
@UseGuards(AuthGuard('jwt'))
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  async reserve(@Request() req, @Body() body: {}) {
    return this.spacesService.create();
  }

  @Get('')
  async getAll() {
    return this.spacesService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.spacesService.delete(parseInt(id));
  }

  @Get(':id')
  async getSpaces() {
    return this.spacesService.findAll();
  }
}
