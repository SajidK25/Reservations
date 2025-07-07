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
    return [
      { id: 1, name: 'O-28' },
      { id: 2, name: '103' },
      { id: 3, name: '104' },
      { id: 4, name: 'S-32' },
    ];
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.spacesService.delete(parseInt(id));
  }

  @Get(':id')
  async getSpaces() {
    return [
      { id: 1, name: 'O-28' },
      { id: 2, name: '103' },
      { id: 3, name: '104' },
      { id: 4, name: 'S-32' },
    ];
  }
}
